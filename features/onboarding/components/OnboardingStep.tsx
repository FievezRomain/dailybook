import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { OnboardingStepConfig } from '../types';

interface Props {
  steps: OnboardingStepConfig[];
  currentIndex: number;
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingStep({ steps, currentIndex, onNext, onSkip }: Props) {
  const { fonts, tokens } = useAppTheme();
  const step = steps[currentIndex];
  const isLast = currentIndex === steps.length - 1;

  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = 0.85;
    opacity.value = 0;
    scale.value = withSpring(1, { stiffness: 150, damping: 20 });
    opacity.value = withSpring(1, { stiffness: 150, damping: 20 });
  }, [step.id, scale, opacity]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (!step) return null;

  return (
    <LinearGradient
      colors={[tokens.chartBackground as string, tokens.chartBackgroundTo as string]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safe}>
        <View style={styles.topBar}>
          {!isLast && (
            <TouchableOpacity onPress={onSkip} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={{ fontFamily: fonts.default.fontFamily, fontSize: 14, color: tokens.textSecondary }}>
                Passer
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <Animated.View style={[styles.center, animStyle]}>
          <MaterialCommunityIcons name={step.icon as any} size={90} color={tokens.primaryLight} />
          <Text style={{ fontSize: 26, fontFamily: fonts.bodyLarge.fontFamily, color: tokens.textOnPrimary, textAlign: 'center', marginTop: 28, marginBottom: 12 }}>
            {step.title}
          </Text>
          <Text style={{ fontSize: 16, fontFamily: fonts.default.fontFamily, color: tokens.textSecondary, textAlign: 'center', lineHeight: 24 }}>
            {step.description}
          </Text>
        </Animated.View>

        <View style={styles.bottom}>
          <View style={styles.dots}>
            {steps.map((_, i) => (
              <View
                key={i}
                style={{
                  width: i === currentIndex ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  backgroundColor: i === currentIndex ? tokens.primary : tokens.surfaceDim,
                }}
              />
            ))}
          </View>
          <TouchableOpacity
            style={{ backgroundColor: tokens.primary, borderRadius: 14, paddingVertical: 16, alignItems: 'center' }}
            onPress={onNext}
            activeOpacity={0.8}
          >
            <Text style={{ fontSize: 16, fontFamily: fonts.bodyMedium.fontFamily, color: tokens.textOnPrimary }}>
              {isLast ? 'Commencer' : 'Suivant →'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = {
  gradient: { flex: 1 },
  safe: { flex: 1 },
  topBar: { flexDirection: 'row', justifyContent: 'flex-end', paddingHorizontal: 24, paddingTop: 8 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  bottom: { paddingHorizontal: 24, paddingBottom: 40 },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 24 },
} as const;

