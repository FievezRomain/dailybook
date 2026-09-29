export type FileItemType = 'image' | 'pdf' | 'other';
export type FileItemState = 'uploaded' | 'uploading' | 'error';

export function clampUploadProgress(progress: number) { return Math.min(1, Math.max(0, progress)); }
export function getFileStateLabel(state: FileItemState, metadata: string, progress: number) {
  if (state === 'error') return 'Échec · Réessayer';
  if (state === 'uploading') return `Téléversement · ${Math.round(clampUploadProgress(progress) * 100)} %`;
  return metadata;
}
