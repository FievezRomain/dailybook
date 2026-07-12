import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import type { AppStackScreenProps } from '../../../navigation/types';
import AppInput from '../../../shared/components/ui/AppInput';
import Button from '../../../shared/components/ui/AppButton';

type FieldConfig = {
  key: string;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  multiline?: boolean;
};

const REQUIRED_FIELDS = new Set(['nom', 'dateevent']);

const FIELDS_BY_TYPE: Record<string, FieldConfig[]> = {
  soins: [
    { key: 'nom', label: 'Intitule des soins', placeholder: 'Ex: Vaccination annuelle' },
    { key: 'dateevent', label: 'Date', placeholder: '2026-07-12' },
    { key: 'traitement', label: 'Traitement administre', placeholder: 'Ex: Primevac' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes supplementaires...', multiline: true },
  ],
  rdv: [
    { key: 'nom', label: 'Intitule du rendez-vous', placeholder: 'Ex: Visite veterinaire' },
    { key: 'dateevent', label: 'Date', placeholder: '2026-07-12' },
    { key: 'specialiste', label: 'Specialiste', placeholder: 'Ex: Dr Martin, veterinaire' },
    { key: 'lieu', label: 'Lieu', placeholder: 'Ex: Cabinet veterinaire' },
  ],
  balade: [
    { key: 'nom', label: 'Nom de la balade', placeholder: 'Ex: Tour de la foret' },
    { key: 'dateevent', label: 'Date', placeholder: '2026-07-12' },
    { key: 'lieu', label: 'Lieu de depart', placeholder: 'Ex: Ecurie du Moulin' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes...', multiline: true },
  ],
  entrainement: [
    { key: 'nom', label: 'Intitule', placeholder: 'Ex: Seance de dressage' },
    { key: 'dateevent', label: 'Date', placeholder: '2026-07-12' },
    { key: 'discipline', label: 'Discipline', placeholder: 'Ex: Dressage, CSO...' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes...', multiline: true },
  ],
  concours: [
    { key: 'nom', label: 'Nom du concours', placeholder: 'Ex: Championnat regional' },
    { key: 'dateevent', label: 'Date', placeholder: '2026-07-12' },
    { key: 'epreuve', label: 'Epreuve', placeholder: 'Ex: CSO 80cm' },
    { key: 'placement', label: 'Classement', placeholder: 'Ex: 3e / 20' },
  ],
  depense: [
    { key: 'nom', label: 'Intitule de la depense', placeholder: 'Ex: Ferrure' },
    { key: 'dateevent', label: 'Date', placeholder: '2026-07-12' },
    { key: 'depense', label: 'Montant', placeholder: '0.00', keyboardType: 'decimal-pad' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes...', multiline: true },
  ],
  autre: [
    { key: 'nom', label: 'Intitule', placeholder: 'Ex: Pesee mensuelle' },
    { key: 'dateevent', label: 'Date', placeholder: '2026-07-12' },
    { key: 'lieu', label: 'Lieu', placeholder: 'Ex: Ecurie' },
    { key: 'commentaire', label: 'Commentaire', placeholder: 'Notes...', multiline: true },
  ],
};

export default function EventFormScreen({ route, navigation }: AppStackScreenProps<'EventWizardForm'>) {
  const { colors, fonts, tokens } = useAppTheme();
  const eventType = route.params?.eventType ?? useEventWizardStore.getState().formData.eventType ?? 'autre';
  const { setFormData, formData } = useEventWizardStore();
  const fields = FIELDS_BY_TYPE[eventType] ?? FIELDS_BY_TYPE.autre;

  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    fields.forEach((field) => {
      init[field.key] = String(formData[field.key] ?? '');
    });
    if (route.params?.prefilled) {
      const prefilled = route.params.prefilled as Record<string, unknown>;
      Object.keys(prefilled).forEach((key) => {
        if (prefilled[key] != null) init[key] = String(prefilled[key]);
      });
    }
    return init;
  });

  const allRequiredFilled = fields
    .filter((field) => REQUIRED_FIELDS.has(field.key))
    .every((field) => (values[field.key] ?? '').trim() !== '');

  const onContinue = () => {
    const updated: Record<string, unknown> = {};
    fields.forEach((field) => {
      const value = values[field.key];
      if (value && value.trim() !== '') {
        updated[field.key] = field.keyboardType === 'decimal-pad' || field.keyboardType === 'numeric'
          ? Number(value.replace(',', '.'))
          : value;
      }
    });
    setFormData({ eventType, ...updated });
    navigation.navigate('EventWizardAnimals', { formData: { eventType, ...formData, ...updated } });
  };

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }} accessibilityLabel="Revenir">
          <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily }}>Details de l'evenement</Text>
      </View>
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 48 }}>
        {fields.map((field) => (
          <AppInput
            key={field.key}
            testID={`input-event-${field.key}`}
            label={field.label}
            required={REQUIRED_FIELDS.has(field.key)}
            placeholder={field.placeholder}
            value={values[field.key] ?? ''}
            onChangeText={(value) => setValues((prev) => ({ ...prev, [field.key]: value }))}
            keyboardType={field.keyboardType ?? 'default'}
            multiline={field.multiline}
            containerStyle={{ marginTop: tokens.spacing.md }}
            style={field.multiline ? { minHeight: 84, textAlignVertical: 'top' } : undefined}
          />
        ))}
        <View style={{ marginTop: 32 }}>
          <Button onPress={onContinue} isUppercase={false} disabled={!allRequiredFilled}>
            Choisir les animaux
          </Button>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
