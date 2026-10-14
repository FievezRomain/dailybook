/**
 * FileService — Upload, download et suppression de fichiers via le backend.
 *
 * Contrat backend :
 *   POST   /files/upload-url     body { filename, ressourceType, ressourceId?, contentType }
 *                                returns { url, s3Path }
 *   GET    /files/{filename}     query ?ressourceType=&ressourceId=
 *                                returns { url }
 *   DELETE /files/{filename}     query ?ressourceType=&ressourceId=
 *                                returns { message }
 *
 * Aucun credential S3 n'est exposé côté client : le backend signe les URLs.
 */

import httpClient from './httpClient';
import * as FileSystem from 'expo-file-system/legacy';
import { prepareImageUpload, type ImageUploadKind } from '../../shared/utils/prepareImageUpload';

const DOWNLOAD_URL_TTL_MS = 4 * 60 * 1000;
type CachedDownloadUrl = { url?: string; promise?: Promise<string>; expiresAt: number };
const downloadUrlCache = new Map<string, CachedDownloadUrl>();

function downloadCacheKey(filename: string, ressourceType: RessourceType, ressourceId: number | string) {
  return `${ressourceType}:${ressourceId}:${filename}`;
}

function invalidateDownloadUrl(filename: string, ressourceType: RessourceType, ressourceId?: number | string) {
  if (ressourceId !== undefined) downloadUrlCache.delete(downloadCacheKey(filename, ressourceType, ressourceId));
}

async function getLocalFileSize(fileUri: string): Promise<number> {
  const info = await FileSystem.getInfoAsync(fileUri);
  if (!info.exists || typeof info.size !== 'number') throw new Error('Impossible de déterminer la taille du fichier local.');
  return info.size;
}

export type RessourceType = 'event' | 'animal' | 'body' | 'user' | 'note' | 'wish' | 'contact';
export type BatchDownloadRessourceType = Extract<RessourceType, 'animal' | 'body' | 'event' | 'wish' | 'user'>;

export interface FileDownloadRequest {
  filename: string;
  ressourceType: BatchDownloadRessourceType;
  ressourceId: number | string;
}

interface BatchDownloadResponse {
  fileName: string;
  ressourceType: BatchDownloadRessourceType;
  ressourceId: number;
  url: unknown | null;
}

export function fileDownloadKey(item: FileDownloadRequest): string {
  return downloadCacheKey(item.filename, item.ressourceType, item.ressourceId);
}

export interface PresignedUpload {
  url: string;
  fields: Record<string, string>;
  filename: string;
  s3Path: string;
  expiresIn: number;
}

export interface PresignedDownload {
  url: string;
}

interface UploadUrlBody {
  filename: string;
  ressourceType: RessourceType;
  ressourceId?: number | string;
  contentType: string;
  sizeBytes: number;
}

export const FileService = {
  getCachedDownloadUrl(
    filename: string,
    ressourceType: RessourceType,
    ressourceId: number | string,
  ): string | undefined {
    const cached = downloadUrlCache.get(downloadCacheKey(filename, ressourceType, ressourceId));
    return cached && cached.expiresAt > Date.now() ? cached.url : undefined;
  },

  /**
   * Résout jusqu’à 100 URLs signées par requête backend et alimente le cache partagé.
   * Une entrée absente ou `url: null` reste simplement indisponible pour laisser l’UI
   * afficher son fallback sans déclencher une rafale d’appels individuels.
   */
  async getDownloadUrls(items: readonly FileDownloadRequest[]): Promise<Map<string, string>> {
    const unique = new Map(items.map((item) => [fileDownloadKey(item), item]));
    const resolved = new Map<string, string>();
    const waiting: Array<{ key: string; promise: Promise<string> }> = [];
    const missing: FileDownloadRequest[] = [];

    unique.forEach((item, key) => {
      const cached = downloadUrlCache.get(key);
      if (cached && cached.expiresAt > Date.now()) {
        if (cached.url) resolved.set(key, cached.url);
        else if (cached.promise) waiting.push({ key, promise: cached.promise });
      } else {
        missing.push(item);
      }
    });

    for (let index = 0; index < missing.length; index += 100) {
      const chunk = missing.slice(index, index + 100);
      const batchPromise = httpClient.post<BatchDownloadResponse[]>('/files/download-urls', {
        items: chunk.map((item) => ({
          fileName: item.filename,
          ressourceType: item.ressourceType,
          ressourceId: Number(item.ressourceId),
        })),
      }).then((response) => {
        const urls = new Map<string, string>();
        const rows = Array.isArray(response.data) ? response.data : [];
        rows.forEach((row) => {
          if (typeof row.url !== 'string' || !row.url) return;
          const key = fileDownloadKey({
            filename: row.fileName,
            ressourceType: row.ressourceType,
            ressourceId: row.ressourceId,
          });
          urls.set(key, row.url);
          downloadUrlCache.set(key, { url: row.url, expiresAt: Date.now() + DOWNLOAD_URL_TTL_MS });
        });
        return urls;
      });

      chunk.forEach((item) => {
        const key = fileDownloadKey(item);
        const promise = batchPromise.then((urls) => {
          const url = urls.get(key);
          if (!url) throw new Error(`URL de téléchargement indisponible pour ${item.filename}.`);
          return url;
        });
        downloadUrlCache.set(key, { promise, expiresAt: Date.now() + DOWNLOAD_URL_TTL_MS });
        waiting.push({ key, promise });
        void promise.catch(() => {
          const cached = downloadUrlCache.get(key);
          if (cached?.promise === promise) downloadUrlCache.delete(key);
        });
      });
    }

    const settled = await Promise.allSettled(waiting.map(({ promise }) => promise));
    settled.forEach((result, index) => {
      if (result.status === 'fulfilled') resolved.set(waiting[index].key, result.value);
    });
    return resolved;
  },

  /**
   * Demande au backend une URL présignée pour uploader directement vers S3.
   */
  async getUploadUrl(body: UploadUrlBody): Promise<PresignedUpload> {
    const response = await httpClient.post<PresignedUpload>('/files/upload-url', body);
    return response.data;
  },

  /**
   * Upload binaire direct vers S3 via l'URL présignée.
   */
  async uploadToS3(upload: PresignedUpload, fileUri: string, contentType: string): Promise<void> {
    const result = await FileSystem.uploadAsync(upload.url, fileUri, {
      httpMethod: 'POST',
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: 'file',
      mimeType: contentType,
      parameters: upload.fields,
    });
    if (result.status < 200 || result.status >= 300) {
      throw new Error(`S3 upload failed: ${result.status}`);
    }
  },

  /**
   * Helper : enchaîne getUploadUrl + uploadToS3 et retourne le s3Path.
   */
  async upload(
    fileUri: string,
    filename: string,
    contentType: string,
    ressourceType: RessourceType,
    ressourceId?: number | string,
    sizeBytes?: number,
  ): Promise<string> {
    const imageKinds: Partial<Record<RessourceType, ImageUploadKind>> = {
      user: 'profile', animal: 'animal', body: 'body', wish: 'wish',
    };
    const imageKind = imageKinds[ressourceType];
    const prepared = imageKind
      ? await prepareImageUpload({ uri: fileUri }, imageKind)
      : { uri: fileUri, contentType, sizeBytes: sizeBytes ?? await getLocalFileSize(fileUri) };
    const upload = await FileService.getUploadUrl({
      filename,
      ressourceType,
      ressourceId,
      contentType: prepared.contentType,
      sizeBytes: prepared.sizeBytes,
    });
    await FileService.uploadToS3(upload, prepared.uri, prepared.contentType);
    await httpClient.post('/files/upload-complete', {
      filename: upload.filename,
      ressourceType,
      ressourceId,
      contentType: prepared.contentType,
    });
    invalidateDownloadUrl(upload.filename, ressourceType, ressourceId);
    return upload.filename;
  },

  /**
   * Récupère une URL présignée de téléchargement.
   */
  async getDownloadUrl(
    filename: string,
    ressourceType: RessourceType,
    ressourceId: number | string,
  ): Promise<string> {
    if (ressourceType === 'animal' || ressourceType === 'body' || ressourceType === 'event' || ressourceType === 'wish' || ressourceType === 'user') {
      const item = { filename, ressourceType, ressourceId } satisfies FileDownloadRequest;
      const urls = await FileService.getDownloadUrls([item]);
      const url = urls.get(fileDownloadKey(item));
      if (!url) throw new Error(`URL de téléchargement indisponible pour ${filename}.`);
      return url;
    }
    const key = downloadCacheKey(filename, ressourceType, ressourceId);
    const cached = downloadUrlCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      if (cached.url) return cached.url;
      if (cached.promise) return cached.promise;
    }
    const promise = httpClient.get<PresignedDownload>(
      `/files/${encodeURIComponent(filename)}`,
      { params: { ressourceType, ressourceId } },
    ).then((response) => {
      downloadUrlCache.set(key, { url: response.data.url, expiresAt: Date.now() + DOWNLOAD_URL_TTL_MS });
      return response.data.url;
    }).catch((error: unknown) => {
      downloadUrlCache.delete(key);
      throw error;
    });
    downloadUrlCache.set(key, { promise, expiresAt: Date.now() + DOWNLOAD_URL_TTL_MS });
    return promise;
  },

  /**
   * Supprime un fichier côté backend (S3 + métadonnées).
   */
  async deleteFile(
    filename: string,
    ressourceType: RessourceType,
    ressourceId: number | string,
  ): Promise<void> {
    await httpClient.delete(`/files/${encodeURIComponent(filename)}`, {
      params: { ressourceType, ressourceId },
    });
    invalidateDownloadUrl(filename, ressourceType, ressourceId);
  },
};
