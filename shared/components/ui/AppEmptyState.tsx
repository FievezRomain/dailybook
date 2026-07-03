import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppButton from './AppButton';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { MaterialCommunityIconsName } from '../../../types/icons';

interface AppEmptyStateProps {
  icon?: MaterialCommunityIconsName;
  title: string;
  description?: string;
  ctaLabel?: string;
  onCta?: () => void;
  style?: ViewStyle;
}

export default function AppEmptyState({
  icon = 'inbox-outline',
  title,
  description,
  ctaLabel,
  onCta,
  style,
}: AppEmptyStateProps) {
  const { colors, fonts, tokens } = useAppTheme();

  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: tokens.spacing.xxl,
          paddingHorizontal: tokens.spacing.xl,
          gap: tokens.spacing.md,
        },
        style,
      ]}
    >
      <MaterialCommunityIcons name={icon} size={52} color={colors.border} />
      <Text
        style={{
          fontFamily: fonts.medium.fontFamily,
          fontSize: tokens.fontSizes.lg,
          color: colors.textPrimary,
          textAlign: 'center',
        }}
      >
        {title}
      </Text>
      {description ? (
        <Text
          style={{
            fontFamily: fonts.default.fontFamily,
            fontSize: tokens.fontSizes.md,
            color: colors.textSecondary,
            textAlign: 'center',
            lineHeight: tokens.lineHeights.relaxed,
          }}
        >
          {description}
        </Text>
      ) : null}
      {ctaLabel && onCta ? (
        <AppButton label={ctaLabel} onPress={onCta} variant="primary" style={{ marginTop: tokens.spacing.sm }} />
      ) : null}
    </View>
  );
}
