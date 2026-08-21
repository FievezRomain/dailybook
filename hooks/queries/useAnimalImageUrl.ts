import { useState, useEffect } from 'react';
import { FileService } from '../../services/api/FileService';

/**
 * Fetches a signed URL for an animal image from S3.
 * Extracted from AnimalImageCarousel CarouselImageItem component.
 */
export function useAnimalImageUrl(filename: string | undefined, animalId: string | number | undefined) {
  const [imageUrl, setImageUrl] = useState<string | null>(() => filename && animalId !== undefined ? FileService.getCachedDownloadUrl(filename, 'animal', animalId) ?? null : null);

  useEffect(() => {
    if (!filename || animalId === undefined) { setImageUrl(null); return; }
    setImageUrl(FileService.getCachedDownloadUrl(filename, 'animal', animalId) ?? null);
    FileService.getDownloadUrl(filename, 'animal', animalId)
      .then((url) => setImageUrl(url))
      .catch((err: unknown) => {
        if (__DEV__) console.warn('[useAnimalImageUrl] getFileUrl failed', err);
      });
  }, [filename, animalId]);

  return imageUrl;
}
