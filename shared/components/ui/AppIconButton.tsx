import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MaterialCommunityIconsName } from '../../../types/icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppIconButtonProps {
  icon: string;
  size?: number;
  color?: string;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
}

/**
 * Drop-in replacement for react-native-paper's IconButton.
 * Uses MaterialCommunityIcons + theme tokens, no Paper dependency.
 */
export default function AppIconButton({
  icon,
  size = 24,
  color,
  onPress,
  disabled = false,
  accessibilityLabel,
  style,
}: AppIconButtonProps) {
  const { colors } = useAppTheme();
  const iconColor = color ?? colors.textPrimary;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}
      style={[styles.button, { opacity: disabled ? 0.4 : 1 }, style]}
    >
      <MaterialCommunityIcons name={icon as MaterialCommunityIconsName} size={size} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
