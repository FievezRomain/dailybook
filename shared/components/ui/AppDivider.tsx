import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import { borderHairline } from '../../../theme/tokens';

interface AppDividerProps {
  style?: ViewStyle;
  inset?: number;
  indent?: number;
}

/**
 * A thin hairline divider using the current theme border color.
 * Drop-in replacement for react-native-paper's Divider.
 */
export default function AppDivider({ style, inset = 0, indent = 0 }: AppDividerProps) {
  const { colors } = useAppTheme();
  return (
    <View
      style={[
        styles.divider,
        { borderBottomColor: colors.border, marginLeft: inset, marginRight: indent },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  divider: {
    borderBottomWidth: borderHairline,
    width: '100%',
  },
});
