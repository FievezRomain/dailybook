import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useObjectifMutations } from '../../../hooks/queries/useObjectifsQuery';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import type { SubTaskPayload } from '../types';
import AppInput from '../../../shared/components/ui/AppInput';
import Button from '../../../shared/components/ui/AppButton';

const TOTAL_STEPS = 2;

export default function ObjectifAddScreen({ navigation }: AppStackScreenProps<'ObjectifAdd'>) {
  const { colors, fonts, tokens } = useAppTheme();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]);
  const [datedebut, setDatedebut] = useState('');
  const [datefin, setDatefin] = useState('');
  const [temporalite, setTemporalite] = useState('');
  const [etapes, setEtapes] = useState<string[]>(['']);
  const { data: animals = [] } = useAnimalsQuery();
  const { create } = useObjectifMutations();
  const progressWidth = useSharedValue(50);

  const progressAnim = useAnimatedStyle(() => ({ width: `${progressWidth.value}%` }));

  const goToStep = async (next: number) => {
    progressWidth.value = withTiming(((next + 1) / TOTAL_STEPS) * 100, { duration: 300 });
    setStep(next);
    await Haptics.selectionAsync().catch(() => undefined);
  };

  const toggleAnimal = async (id: number) => {
    await Haptics.selectionAsync().catch(() => undefined);
    setSelectedAnimals((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  const addEtape = () => setEtapes((prev) => [...prev, '']);
  const removeEtape = (index: number) => setEtapes((prev) => prev.filter((_, idx) => idx !== index));
  const updateEtape = (index: number, value: string) => setEtapes((prev) => prev.map((etape, idx) => (idx === index ? value : etape)));

  const onSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    const sousetapes: SubTaskPayload[] = etapes
      .filter((etape) => etape.trim() !== '')
      .map((etape, order) => ({ etape, state: 'todo', order }));

    create.mutate(
      {
        title,
        datedebut: datedebut || today,
        datefin: datefin || today,
        animaux: selectedAnimals,
        temporalityobjectif: temporalite || undefined,
        sousetapes,
      },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Objectif cree', position: 'top' });
          navigation.goBack();
        },
        onError: () => Toast.show({ type: 'error', text1: "Erreur lors de la creation de l'objectif", position: 'top' }),
      },
    );
  };

  const styles = {
    inputGroup: { gap: tokens.spacing.md },
    animalRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderColor: colors.surfaceVariant },
    animalName: { flex: 1, fontFamily: fonts.default.fontFamily, color: colors.textPrimary, fontSize: 15 },
    addStepButton: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  } as const;

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => (step > 0 ? goToStep(step - 1) : navigation.goBack())} style={{ marginRight: 12 }} accessibilityLabel="Revenir">
          <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily }}>
          {step === 0 ? 'Nouvel objectif' : 'Details et etapes'}
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: colors.surfaceVariant, borderRadius: 3, marginHorizontal: 20, marginBottom: 24, overflow: 'hidden' }}>
        <Animated.View style={[{ height: '100%', backgroundColor: colors.primary, borderRadius: 3 }, progressAnim]} />
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        {step === 0 && (
          <View style={styles.inputGroup}>
            <AppInput
              label="Titre de l'objectif"
              required
              placeholder="Ex: Ameliorer le galop de Naya"
              value={title}
              onChangeText={setTitle}
            />
            <Text style={{ fontSize: 13, color: colors.secondary, fontFamily: fonts.bodyMedium.fontFamily }}>Chevaux concernes</Text>
            {animals.map((animal) => (
              <TouchableOpacity key={animal.id} style={styles.animalRow} onPress={() => toggleAnimal(animal.id)}>
                <Text style={styles.animalName}>{animal.nom}</Text>
                {selectedAnimals.includes(animal.id) && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
              </TouchableOpacity>
            ))}
            <View style={{ marginTop: 24 }}>
              <Button onPress={() => goToStep(1)} isUppercase={false} disabled={!title.trim() || selectedAnimals.length === 0}>
                Definir les details
              </Button>
            </View>
          </View>
        )}
        {step === 1 && (
          <View style={styles.inputGroup}>
            <AppInput label="Date de debut" placeholder={new Date().toISOString().split('T')[0]} value={datedebut} onChangeText={setDatedebut} />
            <AppInput label="Date de fin" placeholder={new Date().toISOString().split('T')[0]} value={datefin} onChangeText={setDatefin} />
            <AppInput label="Temporalite" placeholder="Ex: Hebdomadaire, avant la saison..." value={temporalite} onChangeText={setTemporalite} />
            <Text style={{ fontSize: 13, color: colors.secondary, fontFamily: fonts.bodyMedium.fontFamily }}>Sous-etapes</Text>
            {etapes.map((etape, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: tokens.spacing.sm }}>
                <AppInput
                  containerStyle={{ flex: 1 }}
                  placeholder={`Etape ${index + 1}`}
                  value={etape}
                  onChangeText={(value) => updateEtape(index, value)}
                />
                {etapes.length > 1 && (
                  <TouchableOpacity onPress={() => removeEtape(index)} style={{ padding: 8 }} accessibilityLabel="Retirer l'etape">
                    <Ionicons name="close-circle" size={20} color={colors.secondary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={addEtape} style={styles.addStepButton}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={{ marginLeft: 6, color: colors.primary, fontFamily: fonts.bodyMedium.fontFamily, fontSize: 14 }}>Ajouter une etape</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 24 }}>
              <Button onPress={onSubmit} isUppercase={false} disabled={create.isPending}>
                {create.isPending ? 'Creation...' : "Creer l'objectif"}
              </Button>
            </View>
          </View>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
