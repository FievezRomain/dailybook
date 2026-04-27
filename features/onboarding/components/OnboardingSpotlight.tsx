import React, { useState } from 'react';
import { View, Modal, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { useAppTheme } from '../../../theme/useAppTheme';
import OnboardingStep from './OnboardingStep';
import { useOnboarding } from '../hooks/useOnboarding';
import type { OnboardingStepConfig } from '../types';

const STEPS: OnboardingStepConfig[] = [
  {
    id: 'welcome',
    title: 'Bienvenue sur MyDailyBook 🐴',
    description: 'Votre journal équestre personnel. Suivez la vie de vos chevaux au quotidien.',
  },
  {
    id: 'animals',
    title: 'Ajoutez vos chevaux',
    description: 'Créez la fiche de chaque cheval : santé, photos, carnet de soins — tout au même endroit.',
  },
  {
    id: 'events',
    title: 'Planifiez vos événements',
    description: 'Balades, concours, rendez-vous vétérinaires... Gardez un historique complet.',
  },
  {
    id: 'ai',
    title: 'IA à votre service 🤖',
    description: 'Dictez vos événements et notes en langage naturel, l\'IA les structure pour vous.',
  },
];

interface Props {
  visible: boolean;
}

export default function OnboardingSpotlight({ visible }: Props) {
  const { colors } = useAppTheme();
  const { complete, skip } = useOnboarding();
  const [currentIndex, setCurrentIndex] = useState(0);

  const onNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      complete();
    }
  };

  const onSkip = () => skip();

  if (!visible) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" statusBarTranslucent>
      <BlurView intensity={40} tint="dark" style={StyleSheet.absoluteFill}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <OnboardingStep steps={STEPS} currentIndex={currentIndex} onNext={onNext} onSkip={onSkip} />
        </View>
      </BlurView>
    </Modal>
  );
}
