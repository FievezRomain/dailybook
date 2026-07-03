import React from 'react';
import { Text, TouchableOpacity, ViewStyle } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';

type ChipVariant = 'filled' | 'outlined';

interface AppChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  variant?: ChipVariant;
  style?: ViewStyle;
}

export default function AppChip({ label, selected = false, onPress, variant = 'outlined', style }: AppChipProps) {
  const { colors, fonts, tokens } = useAppTheme();

  const isFilled = variant === 'filled' || selected;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[
        {
          backgroundColor: isFilled ? colors.primary : 'transparent',
          borderRadius: tokens.radii.pill,
          borderWidth: tokens.borderHairline * 2,
          borderColor: isFilled ? colors.primary : colors.border,
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.xs + 2,
          alignSelf: 'flex-start' as const,
        },
        style,
      ]}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <Text
        style={{
          fontFamily: fonts.medium.fontFamily,
          fontSize: tokens.fontSizes.sm,
          color: isFilled ? colors.textOnPrimary : colors.textPrimary,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
