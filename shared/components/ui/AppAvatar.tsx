import React from 'react';
import { Image, Text, View, ViewStyle } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppAvatarProps {
  uri?: string | null;
  name?: string;
  size?: number;
  style?: ViewStyle;
}

export default function AppAvatar({ uri, name, size = 40, style }: AppAvatarProps) {
  const { colors, fonts, tokens } = useAppTheme();

  const initial = name ? name[0]?.toUpperCase() : '?';
  const borderRadius = size / 2;
  const fontSize = size * 0.4;

  if (uri) {
    return (
      <View
        style={[
          { width: size, height: size, borderRadius, overflow: 'hidden', borderWidth: tokens.borderHairline, borderColor: colors.border },
          style,
        ]}
      >
        <Image source={{ uri }} style={{ width: size, height: size }} />
      </View>
    );
  }

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius,
          backgroundColor: colors.primaryLight,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
    >
      <Text style={{ fontSize, color: colors.primaryDark, fontFamily: fonts.bold.fontFamily }}>
        {initial}
      </Text>
    </View>
  );
}
