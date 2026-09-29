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

export type RessourceType = 'event' | 'animal' | 'body' | 'user' | 'note' | 'wish' | 'contact';

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
      : { uri: fileUri, contentType, sizeBytes: sizeBytes ?? (await (await fetch(fileUri)).blob()).size };
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
