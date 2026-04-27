import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import type { Animal } from '../../../models/Animal';
import Button from '../../../shared/components/inputs/Button';

export default function EventAnimalsScreen({ route, navigation }: AppStackScreenProps<'EventWizardAnimals'>) {
  const { colors, fonts } = useAppTheme();
  const { data: animals = [] } = useAnimalsQuery();
  const [selected, setSelected] = useState<number[]>([]);
  const formData = route.params?.formData ?? {};

  const toggle = async (id: number) => {
    await Haptics.selectionAsync().catch(() => undefined);
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const onContinue = () => {
    navigation.navigate('EventWizardOptions', { formData: { ...formData, animaux: selected } });
  };

  const renderItem = ({ item }: { item: Animal }) => {
    const isSelected = selected.includes(item.id);
    return (
      <TouchableOpacity
        style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, borderRadius: 14, padding: 14, marginBottom: 10, borderWidth: 2, borderColor: isSelected ? colors.primary : 'transparent', elevation: 1, shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}
        onPress={() => toggle(item.id)}
        activeOpacity={0.7}
      >
        <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.onSurface, marginRight: 14, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' }}>
          <Ionicons name="paw" size={22} color={colors.secondary} />
        </View>
        <Text style={{ flex: 1, fontSize: 16, fontFamily: fonts.bodyMedium.fontFamily, color: colors.default_dark }}>{item.nom}</Text>
        {isSelected && <Ionicons name="checkmark-circle" size={24} color={colors.primary} />}
      </TouchableOpacity>
    );
  };

  const label = selected.length === 0
    ? 'Sélectionner au moins un animal'
    : `Continuer avec ${selected.length} cheval${selected.length > 1 ? 'aux' : ''}`;

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Entypo name="chevron-left" size={24} color={colors.default_dark} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: colors.default_dark, fontFamily: fonts.bodyLarge.fontFamily }}>Quel(s) cheval(aux) ?</Text>
      </View>
      <FlatList
        data={animals}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Ionicons name="paw-outline" size={48} color={colors.secondary} />
            <Text style={{ marginTop: 12, fontSize: 16, color: colors.secondary, fontFamily: fonts.bodyMedium.fontFamily }}>Aucun cheval enregistré</Text>
          </View>
        }
      />
      <View style={{ position: 'absolute', bottom: 32, left: 20, right: 20 }}>
        <Button onPress={onContinue} isUppercase={false} disabled={selected.length === 0}>{label}</Button>
      </View>
    </LinearGradient>
  );
}
