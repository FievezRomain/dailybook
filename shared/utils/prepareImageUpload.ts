import * as FileSystem from 'expo-file-system/legacy';
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'react-native';

export type ImageUploadKind = 'profile' | 'animal' | 'body' | 'wish';

const POLICIES: Record<ImageUploadKind, { maxDimension: number; maxBytes: number }> = {
  profile: { maxDimension: 1200, maxBytes: 500 * 1024 },
  animal: { maxDimension: 1200, maxBytes: 500 * 1024 },
  body: { maxDimension: 1600, maxBytes: 1024 * 1024 },
  wish: { maxDimension: 1600, maxBytes: 750 * 1024 },
};

export interface PreparedImageUpload {
  uri: string;
  contentType: 'image/jpeg';
  sizeBytes: number;
}

export async function prepareImageUpload(
  source: { uri: string; width?: number; height?: number },
  kind: ImageUploadKind,
): Promise<PreparedImageUpload> {
  const policy = POLICIES[kind];
  const dimensions = source.width && source.height
    ? { width: source.width, height: source.height }
    : await new Promise<{ width: number; height: number }>((resolve, reject) => {
        Image.getSize(source.uri, (width, height) => resolve({ width, height }), reject);
      });
  const longest = Math.max(dimensions.width, dimensions.height);
  const resize = longest > policy.maxDimension
    ? dimensions.width >= dimensions.height
      ? { width: policy.maxDimension }
      : { height: policy.maxDimension }
    : undefined;

  for (const quality of [0.82, 0.7, 0.58, 0.46]) {
    const result = await ImageManipulator.manipulateAsync(
      source.uri,
      resize ? [{ resize }] : [],
      { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
    );
    const info = await FileSystem.getInfoAsync(result.uri);
    const sizeBytes = info.exists && 'size' in info ? info.size : 0;
    if (sizeBytes > 0 && sizeBytes <= policy.maxBytes) {
      return { uri: result.uri, contentType: 'image/jpeg', sizeBytes };
    }
    await FileSystem.deleteAsync(result.uri, { idempotent: true }).catch(() => undefined);
  }
  throw new Error("L’image reste trop volumineuse après optimisation.");
}
