import { getCachedImageSource, getRemoteMediaCacheKey } from '../../../shared/utils/mediaCache';

describe('mediaCache', () => {
  it('retire la signature temporaire sans confondre deux objets', () => {
    const first = 'https://bucket.s3.eu-west-3.amazonaws.com/user/photo.jpg?X-Amz-Signature=one';
    const renewed = 'https://bucket.s3.eu-west-3.amazonaws.com/user/photo.jpg?X-Amz-Signature=two';
    const other = 'https://bucket.s3.eu-west-3.amazonaws.com/user/other.jpg?X-Amz-Signature=one';

    expect(getRemoteMediaCacheKey(first)).toBe(getRemoteMediaCacheKey(renewed));
    expect(getRemoteMediaCacheKey(first)).not.toBe(getRemoteMediaCacheKey(other));
    expect(getCachedImageSource(first)).toEqual({
      uri: first,
      cacheKey: 'https://bucket.s3.eu-west-3.amazonaws.com/user/photo.jpg',
    });
  });
});
