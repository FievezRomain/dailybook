import React from 'react';
import { StyleSheet, TouchableOpacity, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppCardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: ViewStyle;
  elevated?: boolean;
  padded?: boolean;
}

export default function AppCard({ children, onPress, style, elevated = false, padded = true }: AppCardProps) {
  const { colors, tokens } = useAppTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const onPressIn = () => { scale.value = withSpring(0.98, { stiffness: 300, damping: 20 }); };
  const onPressOut = () => { scale.value = withSpring(1, { stiffness: 300, damping: 20 }); };

  const cardStyle: ViewStyle = {
    backgroundColor: colors.surface,
    borderRadius: tokens.radii.lg,
    borderWidth: tokens.borderHairline,
    borderColor: colors.border,
    padding: padded ? tokens.spacing.md : 0,
    overflow: 'hidden',
    ...(elevated ? tokens.shadows.md : {}),
  };

  if (!onPress) {
    return (
      <View style={[cardStyle, style]}>
        {children}
      </View>
    );
  }

  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[cardStyle, style]}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
