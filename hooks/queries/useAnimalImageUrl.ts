import { useState, useEffect } from 'react';
import { getFileUrl } from '../../services/aws/FileStorageService';

/**
 * Fetches a signed URL for an animal image from S3.
 * Extracted from AnimalImageCarousel CarouselImageItem component.
 */
export function useAnimalImageUrl(filename: string | undefined, animalId: string | number | undefined) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!filename) return;
    getFileUrl(String(filename), 'animal', String(animalId ?? ''))
      .then((url) => setImageUrl(url))
      .catch((err: unknown) => {
        if (__DEV__) console.warn('[useAnimalImageUrl] getFileUrl failed', err);
      });
  }, [filename, animalId]);

  return imageUrl;
}
