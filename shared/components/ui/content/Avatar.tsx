import { Image } from 'expo-image';
import { Text, View } from 'react-native';
import { typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface AvatarProps {
  initials: string;
  imageUrl?: string | null;
  accessibilityLabel: string;
  size?: number;
  decorative?: boolean;
  backgroundColor?: string;
  borderColor?: string;
}

const normalizeInitials = (value: string) => value.trim().slice(0, 2).toLocaleUpperCase();

export function Avatar({ initials, imageUrl, accessibilityLabel, size = 32, decorative = false, backgroundColor, borderColor }: AvatarProps) {
  const { colors } = useAppTheme();
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
      {imageUrl ? (
        <Image source={{ uri: imageUrl }} style={{ width: size, height: size }} contentFit="cover" accessibilityElementsHidden />
      ) : (
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: size === 32 ? 12 : Math.max(12, size * 0.375) }}>
          {normalizeInitials(initials)}
        </Text>
      )}
    </View>
  );
}
