import type { IFileStorageService } from './IFileStorageService';
import {
  uploadFile as awsUploadFile,
  getFileUrl as awsGetFileUrl,
  deleteFile as awsDeleteFile,
  openDocumentWithCache,
} from '../aws/FileStorageService';

/**
 * Implémentation S3 de IFileStorageService.
 * Délègue aux fonctions existantes de `services/aws/FileStorageService`.
 * Peut être remplacée par une autre implémentation sans modifier les appelants.
 */
export class S3FileStorageService implements IFileStorageService {
  async uploadFile(
    fileUri: string,
    fileName: string,
    contentType: string,
    ressourceType: string,
    ressourceId: string,
    sizeBytes?: number,
  ): Promise<string | undefined> {
    return awsUploadFile(fileUri, fileName, contentType, ressourceType, ressourceId, sizeBytes);
  }

  async getFileUrl(
    filename: string,
    ressourceType: string,
    ressourceId: string,
  ): Promise<string> {
    return awsGetFileUrl(filename, ressourceType, ressourceId);
  }

  async deleteFile(filename: string, ressourceType: string, ressourceId: string): Promise<void> {
    return awsDeleteFile(filename, ressourceType, ressourceId);
  }

  async downloadAndShare(filename: string, displayName: string): Promise<void> {
    return openDocumentWithCache(filename, displayName);
  }
}

export const fileStorageService: IFileStorageService = new S3FileStorageService();
