import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { Entypo } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useAnimalWizardStore } from '../../../stores/useAnimalWizardStore';
import { useAnimalMutations } from '../../../hooks/queries/useAnimalsQuery';
import Button from '../../../shared/components/inputs/Button';
import type { AppStackScreenProps } from '../../../navigation/types';

const STEPS = [
  { title: 'Comment s\'appelle-t-il ?', fields: ['nom', 'espece'] as const },
  { title: 'Sa naissance & ses origines', fields: ['race', 'datenaissance'] as const },
  { title: 'Sa morphologie', fields: ['sexe', 'couleur'] as const },
  { title: 'Presque terminé !', fields: ['poids', 'taille'] as const },
];

const FIELD_CONFIG: Record<string, { label: string; placeholder: string; keyboardType?: 'default' | 'decimal-pad' }> = {
  nom: { label: 'Nom *', placeholder: 'Le nom de votre cheval ?' },
  espece: { label: 'Espèce *', placeholder: 'Cheval, Poney, Âne…' },
  race: { label: 'Race', placeholder: 'Ex : Selle Français' },
  datenaissance: { label: 'Date de naissance', placeholder: 'JJ/MM/AAAA' },
  sexe: { label: 'Sexe', placeholder: 'Entier, Hongre, Jument…' },
  couleur: { label: 'Robe', placeholder: 'Isabelle, Alezan, Bai…' },
  poids: { label: 'Poids (kg)', placeholder: 'Ex : 500', keyboardType: 'decimal-pad' },
  taille: { label: 'Taille (cm)', placeholder: 'Ex : 164', keyboardType: 'decimal-pad' },
};

export default function AnimalAddWizardScreen({ navigation }: AppStackScreenProps<'AnimalAddWizard'>) {
  const { colors, fonts } = useAppTheme();
  const { step, formData, nextStep, prevStep, setField, reset } = useAnimalWizardStore();
  const { create } = useAnimalMutations();
  const [loading, setLoading] = useState(false);
  const progress = useSharedValue(step / (STEPS.length - 1));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const goNext = () => {
    const current = STEPS[step];
    const requiredField = current.fields[0];
    if ((requiredField === 'nom' || (requiredField as string) === 'espece') && !formData[requiredField as keyof typeof formData]) {
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
      Toast.show({ type: 'error', position: 'top', text1: 'Nom et espèce sont obligatoires' });
      return;
    }
    setLoading(true);
    create.mutate(
      {
        nom: formData.nom!,
        espece: formData.espece!,
        race: formData.race,
        datenaissance: formData.datenaissance,
        sexe: formData.sexe,
        couleur: formData.couleur,
        poids: formData.poids ? Number(formData.poids) : undefined,
        taille: formData.taille ? Number(formData.taille) : undefined,
      } as any,
      {
        onSuccess: () => {
          setLoading(false);
          reset();
          Toast.show({ type: 'success', position: 'top', text1: `${formData.nom} a été ajouté 🐴` });
          navigation.goBack();
        },
        onError: (err: any) => {
          setLoading(false);
          Toast.show({ type: 'error', position: 'top', text1: err.message });
        },
      },
    );
  };

  const currentStep = STEPS[step];

  const styles = StyleSheet.create({
    container: { flex: 1 },
    header: { paddingTop: 56, paddingHorizontal: 20, paddingBottom: 12 },
    progressTrack: { height: 3, backgroundColor: colors.quaternary, borderRadius: 2, marginTop: 16 },
    progressFill: { height: 3, backgroundColor: colors.accent, borderRadius: 2 },
    stepLabel: { fontSize: 12, color: colors.secondary, fontFamily: fonts.default.fontFamily, marginTop: 6 },
    backBtn: { padding: 4 },
    title: { fontSize: 22, color: colors.default_dark, fontFamily: fonts.bodyLarge.fontFamily, marginTop: 32, marginHorizontal: 20 },
    form: { marginHorizontal: 20, marginTop: 24 },
    label: { fontSize: 13, color: colors.secondary, fontFamily: fonts.default.fontFamily, marginBottom: 4, marginTop: 16 },
    input: { backgroundColor: colors.quaternary, borderRadius: 8, padding: 14, color: colors.default_dark, fontFamily: fonts.default.fontFamily, fontSize: 16 },
    footer: { padding: 20, paddingBottom: 40 },
  });

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={goBack} style={styles.backBtn}>
            <Entypo name="chevron-left" size={24} color={colors.default_dark} />
          </TouchableOpacity>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, progressStyle]} />
          </View>
          <Text style={styles.stepLabel}>Étape {step + 1} sur {STEPS.length}</Text>
        </View>

        <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1 }}>
          <Text style={styles.title}>{currentStep.title}</Text>

          <View style={styles.form}>
            {currentStep.fields.map((field) => {
              const cfg = FIELD_CONFIG[field];
              return (
                <View key={field}>
                  <Text style={styles.label}>{cfg.label}</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={cfg.placeholder}
                    placeholderTextColor={colors.secondary}
                    value={String(formData[field] ?? '')}
                    onChangeText={(v) => setField(field, v)}
                    keyboardType={cfg.keyboardType ?? 'default'}
                    returnKeyType="next"
                  />
                </View>
              );
            })}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button
            type="primary"
            size="l"
            isLong
            isUppercase={false}
            onPress={goNext}
            disabled={loading}
          >
            {step < STEPS.length - 1 ? 'Continuer' : loading ? 'Enregistrement…' : 'Créer mon animal'}
          </Button>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}
