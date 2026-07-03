import React from 'react';
import { Text, ViewStyle } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';

type BadgeVariant = 'primary' | 'success' | 'error' | 'warning' | 'neutral';

interface AppBadgeProps {
  label: string;
  variant?: BadgeVariant;
  style?: ViewStyle;
}

export default function AppBadge({ label, variant = 'primary', style }: AppBadgeProps) {
  const { colors, fonts, tokens } = useAppTheme();

  const bgMap: Record<BadgeVariant, string> = {
    primary: colors.primaryLight,
    success: colors.success,
    error: colors.error,
    warning: colors.warning,
    neutral: colors.surfaceDim,
  };

  const textColorMap: Record<BadgeVariant, string> = {
    primary: colors.primaryDark,
    success: colors.primaryDark,
    error: colors.textOnPrimary,
    warning: colors.primaryDark,
    neutral: colors.textSecondary,
  };

  return (
    <Text
      style={[
        {
          backgroundColor: bgMap[variant],
          color: textColorMap[variant],
          fontFamily: fonts.medium.fontFamily,
          fontSize: tokens.fontSizes.xs,
          paddingHorizontal: tokens.spacing.sm,
          paddingVertical: 3,
          borderRadius: tokens.radii.pill,
          overflow: 'hidden',
          alignSelf: 'flex-start',
        },
        style,
      ]}
    >
      {label}
    </Text>
  );
}
