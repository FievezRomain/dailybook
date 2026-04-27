import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useObjectifMutations } from '../../../hooks/queries/useObjectifsQuery';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import type { SubTaskPayload } from '../types';
import Button from '../../../shared/components/inputs/Button';

const TOTAL_STEPS = 2;

export default function ObjectifAddScreen({ navigation }: AppStackScreenProps<'ObjectifAdd'>) {
  const { colors, fonts } = useAppTheme();
  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [selectedAnimals, setSelectedAnimals] = useState<number[]>([]);
  const [datedebut, setDatedebut] = useState('');
  const [datefin, setDatefin] = useState('');
  const [temporalite, setTemporalite] = useState('');
  const [etapes, setEtapes] = useState<string[]>(['']);
  const { data: animals = [] } = useAnimalsQuery();
  const { create } = useObjectifMutations();
  const progressWidth = useSharedValue(0);

  const progressAnim = useAnimatedStyle(() => ({ width: `${progressWidth.value}%` as any }));

  const goToStep = async (next: number) => {
    progressWidth.value = withTiming(((next + 1) / TOTAL_STEPS) * 100, { duration: 300 });
    setStep(next);
    await Haptics.selectionAsync().catch(() => undefined);
  };

  const toggleAnimal = async (id: number) => {
    await Haptics.selectionAsync().catch(() => undefined);
    setSelectedAnimals((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const addEtape = () => setEtapes((prev) => [...prev, '']);
  const removeEtape = (i: number) => setEtapes((prev) => prev.filter((_, idx) => idx !== i));
  const updateEtape = (i: number, val: string) => setEtapes((prev) => prev.map((e, idx) => idx === i ? val : e));

  const onSubmit = () => {
    const sousetapes: SubTaskPayload[] = etapes
      .filter((e) => e.trim() !== '')
      .map((e, i) => ({ etape: e, state: 'todo', order: i }));

    create.mutate(
      { title, datedebut: datedebut || new Date().toISOString().split('T')[0], datefin: datefin || new Date().toISOString().split('T')[0], animaux: selectedAnimals, temporalityobjectif: temporalite || undefined, sousetapes },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Objectif créé !', position: 'top' });
          navigation.goBack();
        },
        onError: () => Toast.show({ type: 'error', text1: 'Erreur lors de la création', position: 'top' }),
      },
    );
  };

  const inputStyle = { backgroundColor: colors.background, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: colors.default_dark, fontFamily: fonts.default?.fontFamily, borderWidth: 1, borderColor: colors.onSurface };
  const labelStyle = { fontSize: 13, color: colors.secondary, fontFamily: fonts.bodyMedium.fontFamily, marginBottom: 4, marginTop: 14 };

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => step > 0 ? goToStep(step - 1) : navigation.goBack()} style={{ marginRight: 12 }}>
          <Entypo name="chevron-left" size={24} color={colors.default_dark} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: colors.default_dark, fontFamily: fonts.bodyLarge.fontFamily }}>
          {step === 0 ? 'Nouvel objectif' : 'Détails & étapes'}
        </Text>
      </View>
      <View style={{ height: 6, backgroundColor: colors.onSurface, borderRadius: 3, marginHorizontal: 20, marginBottom: 24, overflow: 'hidden' }}>
        <Animated.View style={[{ height: '100%', backgroundColor: colors.primary, borderRadius: 3 }, progressAnim]} />
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        {step === 0 && (
          <>
            <Text style={labelStyle}>Titre de l'objectif *</Text>
            <TextInput style={inputStyle} placeholder="Ex: Améliorer le galop de Naya" placeholderTextColor={colors.secondary} value={title} onChangeText={setTitle} />
            <Text style={[labelStyle, { marginTop: 20 }]}>Quel(s) cheval(aux) ?</Text>
            {animals.map((a) => (
              <TouchableOpacity key={a.id} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: colors.onSurface }} onPress={() => toggleAnimal(a.id)}>
                <Text style={{ flex: 1, fontFamily: fonts.default?.fontFamily, color: colors.default_dark, fontSize: 15 }}>{a.nom}</Text>
                {selectedAnimals.includes(a.id) && <Ionicons name="checkmark-circle" size={22} color={colors.primary} />}
              </TouchableOpacity>
            ))}
            <View style={{ marginTop: 32 }}>
              <Button onPress={() => goToStep(1)} isUppercase={false} disabled={!title.trim() || selectedAnimals.length === 0}>Suivant</Button>
            </View>
          </>
        )}
        {step === 1 && (
          <>
            <Text style={labelStyle}>Date de début (YYYY-MM-DD)</Text>
            <TextInput style={inputStyle} placeholder={new Date().toISOString().split('T')[0]} placeholderTextColor={colors.secondary} value={datedebut} onChangeText={setDatedebut} />
            <Text style={labelStyle}>Date de fin (YYYY-MM-DD)</Text>
            <TextInput style={inputStyle} placeholder={new Date().toISOString().split('T')[0]} placeholderTextColor={colors.secondary} value={datefin} onChangeText={setDatefin} />
            <Text style={labelStyle}>Temporalité (optionnel)</Text>
            <TextInput style={inputStyle} placeholder="Ex: Hebdomadaire, avant la saison..." placeholderTextColor={colors.secondary} value={temporalite} onChangeText={setTemporalite} />
            <Text style={[labelStyle, { marginTop: 20 }]}>Sous-étapes</Text>
            {etapes.map((e, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <TextInput style={[inputStyle, { flex: 1 }]} placeholder={`Étape ${i + 1}`} placeholderTextColor={colors.secondary} value={e} onChangeText={(v) => updateEtape(i, v)} />
                {etapes.length > 1 && (
                  <TouchableOpacity onPress={() => removeEtape(i)} style={{ padding: 8, marginLeft: 6 }}>
                    <Ionicons name="close-circle" size={20} color={colors.secondary} />
                  </TouchableOpacity>
                )}
              </View>
            ))}
            <TouchableOpacity onPress={addEtape} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
              <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
              <Text style={{ marginLeft: 6, color: colors.primary, fontFamily: fonts.bodyMedium.fontFamily, fontSize: 14 }}>Ajouter une étape</Text>
            </TouchableOpacity>
            <View style={{ marginTop: 32 }}>
              <Button onPress={onSubmit} isUppercase={false} disabled={create.isPending}>Créer l'objectif</Button>
            </View>
          </>
        )}
      </ScrollView>
    </LinearGradient>
  );
}
