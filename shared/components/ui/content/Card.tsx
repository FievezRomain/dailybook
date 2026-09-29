import { BlurView } from 'expo-blur';
import { Pressable, View, type AccessibilityRole, type StyleProp, type ViewStyle } from 'react-native';
import type { Material } from '../../../../theme/materials';
import { materialTokens } from '../../../../theme/materials';
import { palette } from '../../../../theme/primitives';
import { radii, spacing } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { useResolvedMaterial } from '../../../../theme/useResolvedMaterial';

export interface CardProps {
  children: React.ReactNode;
  material?: Material;
  onPress?: () => void;
  accessibilityLabel?: string;
  accessibilityRole?: AccessibilityRole;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Card({
  children,
  material = 'solid',
  onPress,
  accessibilityLabel,
  accessibilityRole = 'summary',
  style,
  testID,
}: CardProps) {
  const { colors, isDark } = useAppTheme();
  const resolvedMaterial = useResolvedMaterial(material);

  const content = (pressed: boolean) => {
    const containerStyle: ViewStyle = {
      padding: spacing.md,
      gap: spacing.sm,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: resolvedMaterial === 'glass' ? colors.glassBorder : colors.border,
      backgroundColor: resolvedMaterial === 'glass' ? colors.glassBackground : colors.surface,
      opacity: pressed ? 0.84 : 1,
      overflow: 'hidden',
      shadowColor: palette.black,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: resolvedMaterial === 'solid' ? 0.08 : 0,
      shadowRadius: 2,
      elevation: resolvedMaterial === 'solid' ? 1 : 0,
    };

    if (resolvedMaterial === 'glass') {
      return (
        <BlurView
          intensity={materialTokens.blur.glass}
          tint={isDark ? 'dark' : 'light'}
          style={[containerStyle, style]}
          accessible={Boolean(accessibilityLabel)}
          accessibilityRole={accessibilityLabel ? accessibilityRole : undefined}
          accessibilityLabel={accessibilityLabel}
        >
          {children}
        </BlurView>
      );
    }
    return <View accessible={Boolean(accessibilityLabel)} accessibilityRole={accessibilityLabel ? accessibilityRole : undefined} accessibilityLabel={accessibilityLabel} style={[containerStyle, style]}>{children}</View>;
  };

  if (!onPress) return content(false);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      testID={testID}
    >
      {({ pressed }) => content(pressed)}
    </Pressable>
  );
}
