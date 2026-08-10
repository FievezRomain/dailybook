import { Image, type ImageStyle, type StyleProp } from 'react-native';

export type BrandLoaderSize = 'compact' | 'regular' | 'full';

const dimensions: Record<BrandLoaderSize, number> = {
  compact: 20,
  regular: 48,
  full: 96,
};

export interface BrandLoaderProps {
  size?: BrandLoaderSize;
  accessibilityLabel?: string;
  style?: StyleProp<ImageStyle>;
}

export function BrandLoader({ size = 'regular', accessibilityLabel = 'Chargement', style }: BrandLoaderProps) {
  const dimension = dimensions[size];
  return (
    <Image
      source={require('../../../../assets/loader.gif')}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel}
      style={[{ width: dimension, height: dimension }, style]}
      resizeMode="contain"
    />
  );
}
