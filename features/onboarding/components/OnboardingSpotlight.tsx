import React, { useState } from 'react';
import { Modal } from 'react-native';
import OnboardingStep from './OnboardingStep';
import type { OnboardingStepConfig } from '../types';

const STEPS: OnboardingStepConfig[] = [
  {
    id: 'welcome',
    icon: 'horse',
    title: 'Bienvenue sur MyDailyBook 🐴',
    description: 'Votre journal équestre personnel. Suivez la vie de vos chevaux au quotidien.',
  },
  {
    id: 'animals',
    icon: 'paw',
    title: 'Ajoutez vos chevaux',
    description: 'Créez la fiche de chaque cheval : santé, photos, carnet de soins — tout au même endroit.',
  },
  {
    id: 'events',
    icon: 'calendar-heart',
    title: 'Planifiez vos événements',
    description: 'Balades, concours, rendez-vous vétérinaires... Gardez un historique complet.',
  },
  {
    id: 'ai',
    icon: 'robot',
    title: 'IA à votre service 🤖',
    description: "Dictez vos événements et notes en langage naturel, l'IA les structure pour vous.",
  },
];

interface Props {
  visible: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

export default function OnboardingSpotlight({ visible, onComplete, onSkip }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const onNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      onComplete();
    }
  };

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent>
      <OnboardingStep steps={STEPS} currentIndex={currentIndex} onNext={onNext} onSkip={onSkip} />
    </Modal>
  );
}
