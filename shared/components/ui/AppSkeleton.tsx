import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, cancelAnimation } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppSkeletonProps {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export default function AppSkeleton({ width, height, borderRadius, style }: AppSkeletonProps) {
  const { colors, tokens } = useAppTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      false,
    );
    return () => { cancelAnimation(opacity); };
  }, [opacity]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- reanimated + Tamagui style type conflict
      style={[
        {
          width,
          height,
          borderRadius: borderRadius ?? tokens.radii.sm,
          backgroundColor: colors.surfaceDim,
        } as any,
        animStyle,
        style,
      ] as any}
    />
  );
}

/** Preset skeleton rows for list items */
export function AppSkeletonCard() {
  const { tokens } = useAppTheme();
  return (
    <View style={{ gap: tokens.spacing.sm, padding: tokens.spacing.md }}>
      <AppSkeleton width="60%" height={16} />
      <AppSkeleton width="90%" height={12} />
      <AppSkeleton width="40%" height={12} />
    </View>
  );
}
