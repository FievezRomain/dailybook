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

export type RessourceType = 'event' | 'animal' | 'user' | 'note' | 'wish' | 'contact';

export interface PresignedUpload {
  url: string;
  s3Path: string;
}

export interface PresignedDownload {
  url: string;
}

interface UploadUrlBody {
  filename: string;
  ressourceType: RessourceType;
  ressourceId?: number | string;
  contentType: string;
}

export const FileService = {
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
  async uploadToS3(uploadUrl: string, fileUri: string, contentType: string): Promise<void> {
    const fileResponse = await fetch(fileUri);
    const blob = await fileResponse.blob();
    const putResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': contentType },
      body: blob,
    });
    if (!putResponse.ok) {
      throw new Error(`S3 upload failed: ${putResponse.status} ${putResponse.statusText}`);
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
  ): Promise<string> {
    const { url, s3Path } = await FileService.getUploadUrl({
      filename,
      ressourceType,
      ressourceId,
      contentType,
    });
    await FileService.uploadToS3(url, fileUri, contentType);
    return s3Path;
  },

  /**
   * Récupère une URL présignée de téléchargement.
   */
  async getDownloadUrl(
    filename: string,
    ressourceType: RessourceType,
    ressourceId: number | string,
  ): Promise<string> {
    const response = await httpClient.get<PresignedDownload>(
      `/files/${encodeURIComponent(filename)}`,
      { params: { ressourceType, ressourceId } },
    );
    return response.data.url;
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
  },
};
