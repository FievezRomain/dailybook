import type { ImageSource } from 'expo-image';

/** Stable across renewed signed URLs while remaining unique to the remote object. */
export function getRemoteMediaCacheKey(uri: string): string {
  try {
    const url = new URL(uri);
    return `${url.origin}${url.pathname}`;
  } catch {
    return uri.split(/[?#]/, 1)[0];
  }
}

export function getCachedImageSource(uri: string): ImageSource {
  return { uri, cacheKey: getRemoteMediaCacheKey(uri) };
}
