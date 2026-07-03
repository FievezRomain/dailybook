import React from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AppButton from './AppButton';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppErrorStateProps {
  message?: string;
  onRetry?: () => void;
  style?: ViewStyle;
}

export default function AppErrorState({
  message = 'Impossible de rejoindre le serveur. On réessaie ?',
  onRetry,
  style,
}: AppErrorStateProps) {
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
      <MaterialCommunityIcons name="wifi-off" size={48} color={colors.error} />
      <Text
        style={{
          fontFamily: fonts.default.fontFamily,
          fontSize: tokens.fontSizes.md,
          color: colors.textSecondary,
          textAlign: 'center',
          lineHeight: tokens.lineHeights.relaxed,
        }}
      >
        {message}
      </Text>
      {onRetry ? (
        <AppButton label="Réessayer" onPress={onRetry} variant="secondary" />
      ) : null}
    </View>
  );
}
