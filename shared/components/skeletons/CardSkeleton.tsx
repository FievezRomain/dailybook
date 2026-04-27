import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming, withSequence } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme/useAppTheme';

interface SkeletonBoxProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function SkeletonBox({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonBoxProps) {
  const { colors } = useAppTheme();
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(withTiming(0.4, { duration: 700 }), withTiming(1, { duration: 700 })),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width: width as any, height, borderRadius, backgroundColor: colors.onSurface }, animStyle, style]}
    />
  );
}

// --- Card Skeletons ---

export function AnimalCardSkeleton() {
  const { colors } = useAppTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1, shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
      <SkeletonBox width={80} height={80} borderRadius={40} style={{ marginBottom: 12, alignSelf: 'center' }} />
      <SkeletonBox width="60%" height={14} borderRadius={7} style={{ alignSelf: 'center', marginBottom: 6 }} />
      <SkeletonBox width="40%" height={10} borderRadius={5} style={{ alignSelf: 'center' }} />
    </View>
  );
}

export function EventCardSkeleton() {
  const { colors } = useAppTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1, shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
        <SkeletonBox width={40} height={40} borderRadius={20} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <SkeletonBox width="70%" height={13} borderRadius={6} style={{ marginBottom: 6 }} />
          <SkeletonBox width="40%" height={10} borderRadius={5} />
        </View>
      </View>
      <SkeletonBox width="90%" height={10} borderRadius={5} />
    </View>
  );
}

export function WishCardSkeleton() {
  const { colors } = useAppTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
      <SkeletonBox width="75%" height={14} borderRadius={7} style={{ marginBottom: 8 }} />
      <SkeletonBox width="50%" height={10} borderRadius={5} />
    </View>
  );
}

export function ContactCardSkeleton() {
  const { colors } = useAppTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 }}>
      <SkeletonBox width={44} height={44} borderRadius={22} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <SkeletonBox width="60%" height={13} borderRadius={6} style={{ marginBottom: 6 }} />
        <SkeletonBox width="40%" height={10} borderRadius={5} />
      </View>
    </View>
  );
}

export function NoteCardSkeleton() {
  const { colors } = useAppTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
      <SkeletonBox width="65%" height={14} borderRadius={7} style={{ marginBottom: 8 }} />
      <SkeletonBox width="90%" height={10} borderRadius={5} style={{ marginBottom: 4 }} />
      <SkeletonBox width="70%" height={10} borderRadius={5} />
    </View>
  );
}

export function NotificationCardSkeleton() {
  const { colors } = useAppTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 8, flexDirection: 'row', alignItems: 'center', elevation: 1 }}>
      <SkeletonBox width={36} height={36} borderRadius={18} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <SkeletonBox width="55%" height={12} borderRadius={6} style={{ marginBottom: 6 }} />
        <SkeletonBox width="80%" height={10} borderRadius={5} />
      </View>
    </View>
  );
}

export function GroupCardSkeleton() {
  const { colors } = useAppTheme();
  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 10, elevation: 1 }}>
      <SkeletonBox width="50%" height={14} borderRadius={7} style={{ marginBottom: 8 }} />
      <SkeletonBox width="30%" height={10} borderRadius={5} />
    </View>
  );
}

/** Generic list skeleton — renders n card skeletons of the given variant */
export function ListSkeleton({ count = 4, variant = 'event' }: { count?: number; variant?: 'animal' | 'event' | 'wish' | 'contact' | 'note' | 'notification' | 'group' }) {
  const map = { animal: AnimalCardSkeleton, event: EventCardSkeleton, wish: WishCardSkeleton, contact: ContactCardSkeleton, note: NoteCardSkeleton, notification: NotificationCardSkeleton, group: GroupCardSkeleton };
  const Comp = map[variant];
  return (
    <>
      {Array.from({ length: count }).map((_, i) => <Comp key={i} />)}
    </>
  );
}
