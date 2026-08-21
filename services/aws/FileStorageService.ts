import LoggerService from '../logs/LoggerService';
import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { FileService, type RessourceType } from '../api/FileService';

/**
 * Upload un fichier directement vers S3 via une URL présignée obtenue du back-end.
 * Les credentials AWS ne sont jamais exposés côté client.
 *
 * @returns Le s3Path du fichier uploadé, ou undefined en cas d'erreur
 */
export async function uploadFile(
  fileUri: string,
  fileName: string,
  contentType: string,
  ressourceType: string,
  ressourceId: string,
  sizeBytes?: number,
): Promise<string | undefined> {
  try {
    return await FileService.upload(
      fileUri,
      fileName,
      contentType,
      ressourceType as RessourceType,
      ressourceId,
      sizeBytes,
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    LoggerService.log(`Erreur pendant le téléchargement d'un fichier : ${message}`);
    return undefined;
  }
}

/**
 * Récupère une URL présignée de téléchargement pour un fichier stocké en S3.
 */
export async function getFileUrl(
  filename: string,
  ressourceType: string,
  ressourceId: string,
): Promise<string> {
  return FileService.getDownloadUrl(filename, ressourceType as RessourceType, ressourceId);
}

/**
 * Supprime un fichier via le back-end.
 */
export async function deleteFile(
  filename: string,
  ressourceType: string,
  ressourceId: string,
): Promise<void> {
  await FileService.deleteFile(filename, ressourceType as RessourceType, ressourceId);
}

/**
 * Télécharge un document localement (avec cache) puis l'ouvre via le partage natif.
 */
export async function openDocumentWithCache(url: string, filename: string): Promise<void> {
  try {
    const LOCAL_DIRECTORY = FileSystem.documentDirectory + 'vascoandco/documents/';

    const dirInfo = await FileSystem.getInfoAsync(LOCAL_DIRECTORY);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(LOCAL_DIRECTORY, { intermediates: true });
    }

    const fileUri = `${LOCAL_DIRECTORY}${filename}`;
    const fileInfo = await FileSystem.getInfoAsync(fileUri);

    if (!fileInfo.exists) {
      await FileSystem.downloadAsync(url, fileUri);
    }

    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(fileUri);
    } else {
      alert("Impossible d'ouvrir ce document sur cet appareil.");
    }
  } catch (error: unknown) {
    const message = (error as Error).message;
    if (message.includes('ENOSPC')) {
      alert("Votre espace de stockage est insuffisant pour télécharger ce fichier.");
    } else {
      alert("Une erreur est survenue lors du téléchargement.");
    }
    LoggerService.log(`Erreur d'ouverture du document : ${message}`);
  }
}

// ─── Backward-compatible class adapter ──────────────────────────────────────
const _fss_upload = uploadFile;
const _fss_delete = deleteFile;
const _fss_open = openDocumentWithCache;

class FileStorageService {
  getFileUrl(fileName: string, _userId: string): string {
    return fileName;
  }

  async uploadFile(
    fileUri: string,
    fileName: string,
    contentType: string,
    userId: string,
    directory?: string,
  ): Promise<string | undefined> {
    return _fss_upload(fileUri, fileName, contentType, directory ?? 'uploads', userId);
  }

  async deleteFile(fileName: string, userId: string): Promise<void> {
    return _fss_delete(fileName, 'uploads', userId);
  }

  async openDocumentWithCache(url: string, filename: string): Promise<void> {
    return _fss_open(url, filename);
  }

  static async uploadImage(imageUri: string, path: string): Promise<string | undefined> {
    const parts = path.split('/');
    const ressourceType = parts[0] ?? 'uploads';
    const ressourceId = parts.slice(1).join('/') || 'default';
    return _fss_upload(imageUri, 'image.jpg', 'image/jpeg', ressourceType, ressourceId);
  }
}

export default FileStorageService;
