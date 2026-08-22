import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { getCachedImageSource } from '../../../utils/mediaCache';

export interface AvatarProps {
  initials: string;
  imageUrl?: string | null;
  fallbackImageUrl?: string | null;
  accessibilityLabel: string;
  size?: number;
  decorative?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

const normalizeInitials = (value: string) => value.trim().slice(0, 2).toLocaleUpperCase();

export function Avatar({ initials, imageUrl, fallbackImageUrl, accessibilityLabel, size = 32, decorative = false, backgroundColor, borderColor }: AvatarProps) {
  const { colors } = useAppTheme();
  const [failedUrls, setFailedUrls] = useState<string[]>([]);
  useEffect(() => setFailedUrls([]), [imageUrl, fallbackImageUrl]);
  const resolvedImageUrl = [imageUrl, fallbackImageUrl].find((url): url is string => Boolean(url && !failedUrls.includes(url)));
  return (
    <View
      accessible={!decorative}
      accessibilityRole={decorative ? undefined : 'image'}
      accessibilityLabel={decorative ? undefined : accessibilityLabel}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: borderColor ?? colors.border,
        backgroundColor: backgroundColor ?? colors.primaryLight,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {resolvedImageUrl ? (
        <Image source={getCachedImageSource(resolvedImageUrl)} style={{ width: size, height: size }} contentFit="cover" cachePolicy="memory-disk" accessibilityElementsHidden onError={() => setFailedUrls((urls) => urls.includes(resolvedImageUrl) ? urls : [...urls, resolvedImageUrl])} />
      ) : (
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: size === 32 ? 12 : Math.max(12, size * 0.375) }}>
          {normalizeInitials(initials)}
        </Text>
      )}
    </View>
  );
}
