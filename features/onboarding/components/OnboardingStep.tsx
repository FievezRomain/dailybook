import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import OnboardingTooltip from './OnboardingTooltip';
import type { OnboardingStepConfig } from '../types';

interface Props {
  steps: OnboardingStepConfig[];
  currentIndex: number;
  onNext: () => void;
  onSkip: () => void;
}

export default function OnboardingStep({ steps, currentIndex, onNext, onSkip }: Props) {
  const { colors } = useAppTheme();
  const step = steps[currentIndex];

  if (!step) return null;

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <OnboardingTooltip step={step} onNext={onNext} onSkip={onSkip} isLast={currentIndex === steps.length - 1} />
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, gap: 6 }}>
        {steps.map((_, i) => (
          <View
            key={i}
            style={{ width: i === currentIndex ? 18 : 6, height: 6, borderRadius: 3, backgroundColor: i === currentIndex ? colors.primary : colors.onSurface }}
          />
        ))}
      </View>
    </View>
  );
}
