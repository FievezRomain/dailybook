import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { MaterialCommunityIconsName } from '../../../types/icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppIconProps {
  name: MaterialCommunityIconsName;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

/**
 * Drop-in replacement for react-native-paper's Icon.
 * Uses MaterialCommunityIcons directly.
 */
export default function AppIcon({ name, size = 24, color, style }: AppIconProps) {
  const { colors } = useAppTheme();
  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name={name} size={size} color={color ?? colors.textPrimary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
