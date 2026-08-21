/**
 * Interface de stockage de fichiers — vendor-independent.
 * L'implémentation concrète (S3StorageService) implémente ce contrat.
 * Permet de substituer le provider sans modifier les composants appelants.
 */
export interface IFileStorageService {
  /**
   * Upload un fichier et retourne son URL publique.
   * @returns URL du fichier uploadé, ou undefined en cas d'échec silencieux
   */
  uploadFile(
    fileUri: string,
    fileName: string,
    contentType: string,
    ressourceType: string,
    ressourceId: string,
    sizeBytes?: number,
  ): Promise<string | undefined>;

  /**
   * Retourne une URL de téléchargement (présignée ou publique) pour un fichier.
   */
  getFileUrl(
    filename: string,
    ressourceType: string,
    ressourceId: string,
  ): Promise<string>;

  /**
   * Supprime un fichier.
   */
  deleteFile(filename: string, ressourceType: string, ressourceId: string): Promise<void>;

  /**
   * Télécharge un fichier localement et le partage (mobile uniquement).
   */
  downloadAndShare?(filename: string, displayName: string): Promise<void>;
}
