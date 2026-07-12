import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { Entypo } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useAnimalWizardStore } from '../../../stores/useAnimalWizardStore';
import { useAnimalMutations } from '../../../hooks/queries/useAnimalsQuery';
import type { CreateAnimalPayload } from '../types';
import type { AppStackScreenProps } from '../../../navigation/types';
import AppInput from '../../../shared/components/ui/AppInput';
import Button from '../../../shared/components/ui/AppButton';

const STEPS = [
  { title: "Comment s'appelle-t-il ?", fields: ['nom', 'espece'] as const },
  { title: 'Naissance et origines', fields: ['race', 'datenaissance'] as const },
  { title: 'Morphologie', fields: ['sexe', 'couleur'] as const },
  { title: 'Mesures', fields: ['poids', 'taille'] as const },
];

const REQUIRED_FIELDS = new Set(['nom', 'espece']);

const FIELD_CONFIG: Record<string, { label: string; placeholder: string; keyboardType?: 'default' | 'decimal-pad' }> = {
  nom: { label: 'Nom', placeholder: 'Le nom de votre cheval' },
  espece: { label: 'Espece', placeholder: 'Cheval, Poney, Ane...' },
  race: { label: 'Race', placeholder: 'Ex: Selle Francais' },
  datenaissance: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA' },
  sexe: { label: 'Sexe', placeholder: 'Entier, Hongre, Jument...' },
  couleur: { label: 'Robe', placeholder: 'Isabelle, Alezan, Bai...' },
  poids: { label: 'Poids (kg)', placeholder: 'Ex: 500', keyboardType: 'decimal-pad' },
  taille: { label: 'Taille (cm)', placeholder: 'Ex: 164', keyboardType: 'decimal-pad' },
};

export default function AnimalAddWizardScreen({ navigation }: AppStackScreenProps<'AnimalAddWizard'>) {
  const { colors, fonts, tokens } = useAppTheme();
  const { step, formData, nextStep, prevStep, setField, reset } = useAnimalWizardStore();
  const { create } = useAnimalMutations();
  const [loading, setLoading] = useState(false);
  const progress = useSharedValue(step / (STEPS.length - 1));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const currentStep = STEPS[step];
  const missingRequiredField = currentStep.fields.find((field) => REQUIRED_FIELDS.has(field) && !String(formData[field] ?? '').trim());

  const goNext = () => {
    if (missingRequiredField) {
      Toast.show({ type: 'error', position: 'top', text1: 'Ce champ est obligatoire' });
      return;
    }
    Haptics.selectionAsync().catch(() => undefined);
    if (step < STEPS.length - 1) {
      nextStep();
      progress.value = withTiming((step + 1) / (STEPS.length - 1), { duration: 300 });
    } else {
      handleSubmit();
    }
  };

  const goBack = () => {
    if (step === 0) {
      navigation.goBack();
    } else {
      prevStep();
      progress.value = withTiming((step - 1) / (STEPS.length - 1), { duration: 300 });
    }
  };

  const handleSubmit = async () => {
    if (!formData.nom || !formData.espece) {
      Toast.show({ type: 'error', position: 'top', text1: 'Nom et espece sont obligatoires' });
      return;
    }
    const payload: CreateAnimalPayload = {
      nom: formData.nom,
      espece: formData.espece,
      race: formData.race,
      datenaissance: formData.datenaissance,
      sexe: formData.sexe,
      couleur: formData.couleur,
      poids: formData.poids ? Number(String(formData.poids).replace(',', '.')) : undefined,
      taille: formData.taille ? Number(String(formData.taille).replace(',', '.')) : undefined,
    };

    setLoading(true);
    create.mutate(payload, {
      onSuccess: () => {
        setLoading(false);
        reset();
        Toast.show({ type: 'success', position: 'top', text1: `${formData.nom} a ete ajoute` });
        navigation.goBack();
      },
      onError: (err: Error) => {
        setLoading(false);
        Toast.show({ type: 'error', position: 'top', text1: err.message });
      },
    });
  };

  const styles = {
    container: { flex: 1 },
    header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12 },
    progressTrack: { height: 3, backgroundColor: colors.surfaceVariant, borderRadius: 2, marginTop: 16 },
    progressFill: { height: 3, backgroundColor: colors.primary, borderRadius: 2 },
    stepLabel: { fontSize: 12, color: colors.secondary, fontFamily: fonts.default.fontFamily, marginTop: 6 },
    backBtn: { padding: 4 },
    title: { fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily, marginTop: 32, marginHorizontal: 20 },
    form: { marginHorizontal: 20, marginTop: 24, gap: tokens.spacing.md },
    footer: { padding: 20, paddingBottom: 40 },
  } as const;

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn} accessibilityLabel="Revenir">
            <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <Text style={styles.stepLabel}>Etape {step + 1} sur {STEPS.length}</Text>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.title}>{currentStep.title}</Text>

          <View style={styles.form}>
            {currentStep.fields.map((field) => {
              const config = FIELD_CONFIG[field];
              return (
                <AppInput
                  key={field}
                  label={config.label}
                  required={REQUIRED_FIELDS.has(field)}
                  placeholder={config.placeholder}
                  value={String(formData[field] ?? '')}
                  onChangeText={(value) => setField(field, value)}
                  keyboardType={config.keyboardType ?? 'default'}
                  returnKeyType="next"
                />
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button type="primary" size="l" isLong isUppercase={false} onPress={goNext} disabled={loading}>
            {step < STEPS.length - 1 ? 'Continuer' : loading ? 'Enregistrement...' : "Creer l'animal"}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
