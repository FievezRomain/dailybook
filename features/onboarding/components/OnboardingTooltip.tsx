import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { OnboardingStepConfig } from '../types';

interface Props {
  step: OnboardingStepConfig;
  onNext: () => void;
  onSkip: () => void;
  isLast: boolean;
}

export default function OnboardingTooltip({ step, onNext, onSkip, isLast }: Props) {
  const { colors, fonts } = useAppTheme();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, { stiffness: 150, damping: 20 });
    opacity.value = withSpring(1, { stiffness: 150, damping: 20 });
  }, [step.id]);

  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }], opacity: opacity.value }));

  return (
    <Animated.View style={[{
      backgroundColor: colors.background,
      borderRadius: 18,
      padding: 22,
      marginHorizontal: 24,
      elevation: 8,
      shadowOpacity: 0.15,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 4 },
    }, animStyle]}>
      <Text style={{ fontSize: 18, fontFamily: fonts.bodyLarge.fontFamily, color: colors.textPrimary, marginBottom: 8 }}>{step.title}</Text>
      <Text style={{ fontSize: 14, fontFamily: fonts.default?.fontFamily, color: colors.secondary_roux, lineHeight: 20 }}>{step.description}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        <TouchableOpacity onPress={onSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={{ fontSize: 14, color: colors.secondary_roux, fontFamily: fonts.default?.fontFamily }}>Passer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={onNext}
          style={{ backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 8 }}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#fff', fontFamily: fonts.bodyMedium.fontFamily, fontSize: 14 }}>
            {isLast ? 'Commencer' : 'Suivant'}
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}
