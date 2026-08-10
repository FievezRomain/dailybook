import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export type SkeletonType = 'list' | 'card' | 'profile';
export type SkeletonDensity = 'compact' | 'comfortable';
export interface SkeletonProps { type?: SkeletonType; density?: SkeletonDensity; testID?: string }

export function Skeleton({ type = 'list', density = 'compact', testID }: SkeletonProps) {
  const { colors } = useAppTheme();
  const reduceMotion = useReducedMotion();
  const opacity = useRef(new Animated.Value(0.45)).current;
  const comfortable = density === 'comfortable';
  const visual = type === 'card' ? { width: 120, height: comfortable ? 96 : 64, radius: radii.md } : { width: comfortable ? (type === 'profile' ? 80 : 64) : (type === 'profile' ? 56 : 48), height: comfortable ? (type === 'profile' ? 80 : 64) : (type === 'profile' ? 56 : 48), radius: radii.full };

  useEffect(() => {
    if (reduceMotion) { opacity.setValue(0.45); return; }
    const loop = Animated.loop(Animated.sequence([Animated.timing(opacity, { toValue: 1, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true }), Animated.timing(opacity, { toValue: 0.45, duration: 1000, easing: Easing.inOut(Easing.ease), useNativeDriver: true })]));
    loop.start(); return () => loop.stop();
  }, [opacity, reduceMotion]);

  return <View accessible accessibilityRole="progressbar" accessibilityLabel="Chargement du contenu" accessibilityState={{ busy: true }} testID={testID} style={{ width: '100%', maxWidth: componentTokens.feedback.width, height: componentTokens.feedback.skeletonHeight[density], flexDirection: 'row', alignItems: 'flex-start', gap: spacing.md, padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.surface }}><Animated.View style={{ width: visual.width, height: visual.height, borderRadius: visual.radius, backgroundColor: colors.surfaceDim, opacity }} /><View style={{ flex: 1, gap: 12, paddingTop: spacing.sm }}><Animated.View style={{ width: type === 'list' ? '92%' : '100%', height: type === 'list' ? 14 : 16, borderRadius: radii.sm, backgroundColor: colors.surfaceDim, opacity }} /><Animated.View style={{ width: '68%', height: 10, borderRadius: radii.sm, backgroundColor: colors.surfaceDim, opacity }} />{type === 'card' ? <Animated.View style={{ width: '54%', height: 10, borderRadius: radii.sm, backgroundColor: colors.surfaceDim, opacity }} /> : null}</View></View>;
}
