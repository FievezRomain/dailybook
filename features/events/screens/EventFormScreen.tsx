import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import type { AppStackScreenProps } from '../../../navigation/types';
import Button from '../../../shared/components/ui/AppButton';

type FieldConfig = {
  key: string;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
};

const FIELDS_BY_TYPE: Record<string, FieldConfig[]> = {
  soins: [
    { key: 'nom', label: 'Intitulé des soins', placeholder: 'Ex: Vaccination annuelle' },
    { key: 'dateevent', label: 'Date (YYYY-MM-DD)', placeholder: '2025-01-01' },
    { key: 'traitement', label: 'Traitement administré', placeholder: 'Ex: Primevac' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes supplémentaires...', multiline: true },
  ],
  rdv: [
    { key: 'nom', label: 'Intitulé du rendez-vous', placeholder: 'Ex: Visite vétérinaire' },
    { key: 'dateevent', label: 'Date (YYYY-MM-DD)', placeholder: '2025-01-01' },
    { key: 'specialiste', label: 'Spécialiste', placeholder: 'Ex: Dr. Martin - vétérinaire' },
    { key: 'lieu', label: 'Lieu', placeholder: 'Ex: Cabinet vétérinaire' },
  ],
  balade: [
    { key: 'nom', label: 'Nom de la balade', placeholder: 'Ex: Tour de la forêt' },
    { key: 'dateevent', label: 'Date (YYYY-MM-DD)', placeholder: '2025-01-01' },
    { key: 'lieu', label: 'Lieu de départ', placeholder: 'Ex: Écurie du Moulin' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes...', multiline: true },
  ],
  entrainement: [
    { key: 'nom', label: 'Intitulé', placeholder: 'Ex: Séance de dressage' },
    { key: 'dateevent', label: 'Date (YYYY-MM-DD)', placeholder: '2025-01-01' },
    { key: 'discipline', label: 'Discipline', placeholder: 'Ex: Dressage, CSO...' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes...', multiline: true },
  ],
  concours: [
    { key: 'nom', label: 'Nom du concours', placeholder: 'Ex: Championnat régional' },
    { key: 'dateevent', label: 'Date (YYYY-MM-DD)', placeholder: '2025-01-01' },
    { key: 'epreuve', label: 'Épreuve', placeholder: 'Ex: CSO 80cm' },
    { key: 'placement', label: 'Classement', placeholder: 'Ex: 3ème / 20' },
  ],
  depense: [
    { key: 'nom', label: 'Intitulé de la dépense', placeholder: 'Ex: Ferrure' },
    { key: 'dateevent', label: 'Date (YYYY-MM-DD)', placeholder: '2025-01-01' },
    { key: 'depense', label: 'Montant (€)', placeholder: '0.00', keyboardType: 'decimal-pad' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes...', multiline: true },
  ],
  autre: [
    { key: 'nom', label: 'Intitulé', placeholder: 'Ex: Pesée mensuelle' },
    { key: 'dateevent', label: 'Date (YYYY-MM-DD)', placeholder: '2025-01-01' },
    { key: 'lieu', label: 'Lieu', placeholder: 'Ex: Écurie' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes...', multiline: true },
  ],
};

export default function EventFormScreen({ route, navigation }: AppStackScreenProps<'EventWizardForm'>) {
  const { colors, fonts } = useAppTheme();
  const eventType = route.params?.eventType ?? useEventWizardStore.getState().formData.eventType ?? 'autre';
  const { setFormData, formData } = useEventWizardStore();
  const fields = FIELDS_BY_TYPE[eventType] ?? FIELDS_BY_TYPE.autre;

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((f) => { init[f.key] = String(formData[f.key] ?? ''); });
    if (route.params?.prefilled) {
      try {
        const pre = route.params.prefilled as Record<string, unknown>;
        Object.keys(pre).forEach((k) => { if (pre[k] != null) init[k] = String(pre[k]); });
      } catch {}
    }
    return init;
  });

  const allFilled = fields.filter((f) => f.key === 'nom' || f.key === 'dateevent').every((f) => (values[f.key] ?? '').trim() !== '');

  const onContinue = () => {
    const updated: Record<string, unknown> = {};
    fields.forEach((f) => {
      const v = values[f.key];
      if (v && v.trim() !== '') updated[f.key] = f.keyboardType === 'decimal-pad' || f.keyboardType === 'numeric' ? Number(v) : v;
    });
    setFormData({ eventType, ...updated });
    navigation.navigate('EventWizardAnimals', { formData: { eventType, ...formData, ...updated } });
  };

  const s = {
    label: { fontSize: 13, color: colors.secondary, fontFamily: fonts.bodyMedium.fontFamily, marginBottom: 4, marginTop: 14 },
    input: { backgroundColor: colors.background, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, fontFamily: fonts.default?.fontFamily, color: colors.textPrimary, borderWidth: 1, borderColor: colors.surfaceVariant },
  } as const;

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily }}>Détails de l'événement</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}>
        {fields.map((field) => (
          <View key={field.key}>
            <Text style={s.label}>{field.label}</Text>
            <TextInput
              style={[s.input, field.multiline && { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder={field.placeholder}
              placeholderTextColor={colors.secondary}
              value={values[field.key] ?? ''}
              onChangeText={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
              keyboardType={field.keyboardType ?? 'default'}
              multiline={field.multiline}
            />
          </View>
        ))}
        <View style={{ marginTop: 32 }}>
          <Button onPress={onContinue} isUppercase={false} disabled={!allFilled}>Continuer</Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
