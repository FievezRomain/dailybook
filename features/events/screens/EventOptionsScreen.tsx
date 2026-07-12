import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useEventMutations } from '../../../hooks/queries/useEventsQuery';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import type { AppStackScreenProps } from '../../../navigation/types';
import type { CreateEventPayload } from '../types';
import Button from '../../../shared/components/ui/AppButton';

export default function EventOptionsScreen({ route, navigation }: AppStackScreenProps<'EventWizardOptions'>) {
  const { colors, fonts } = useAppTheme();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [sharing, setSharing] = useState(false);
  const formData = route.params?.formData ?? {};
  const reset = useEventWizardStore((s) => s.reset);
  const { create } = useEventMutations();

  const onSubmit = () => {
    const payload: CreateEventPayload = {
      nom: String(formData.nom ?? ''),
      dateevent: String(formData.dateevent ?? new Date().toISOString().split('T')[0]),
      animaux: (formData.animaux as number[]) ?? [],
      eventtype: String(formData.eventType ?? 'autre'),
      ...(notifEnabled && { notif: 'true', optionnotif: '30' }),
      ...(formData.lieu ? { lieu: String(formData.lieu) } : {}),
      ...(formData.commentaire ? { commentaire: String(formData.commentaire) } : {}),
      ...(formData.traitement ? { traitement: String(formData.traitement) } : {}),
      ...(formData.specialiste ? { specialiste: String(formData.specialiste) } : {}),
      ...(formData.discipline ? { discipline: String(formData.discipline) } : {}),
      ...(formData.epreuve ? { epreuve: String(formData.epreuve) } : {}),
      ...(formData.placement ? { placement: String(formData.placement) } : {}),
      ...(formData.depense != null ? { depense: Number(formData.depense) } : {}),
    };

    create.mutate(payload, {
      onSuccess: () => {
        reset();
        Toast.show({ type: 'success', text1: 'Événement créé !', position: 'top' });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
        navigation.navigate('Tab', { screen: 'Calendrier' });
      },
      onError: () => {
        Toast.show({ type: 'error', text1: 'Erreur lors de la création', position: 'top' });
      },
    });
  };

  const OptionRow = ({ label, value, onToggle }: { label: string; value: boolean; onToggle: (v: boolean) => void }) => (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.background, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 10 }}>
      <Text style={{ fontSize: 15, fontFamily: fonts.bodyMedium.fontFamily, color: colors.textPrimary }}>{label}</Text>
      <Switch value={value} onValueChange={onToggle} thumbColor={value ? colors.primary : colors.surfaceVariant} trackColor={{ false: colors.surfaceVariant, true: colors.primary + '80' }} />
    </View>
  );

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily }}>Options</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120 }}>
        <OptionRow
          label="Activer un rappel notification"
          value={notifEnabled}
          onToggle={(v) => { setNotifEnabled(v); Haptics.selectionAsync().catch(() => undefined); }}
        />
        <OptionRow
          label="Partager avec un groupe"
          value={sharing}
          onToggle={(v) => { setSharing(v); Haptics.selectionAsync().catch(() => undefined); }}
        />
      </ScrollView>
      <View style={{ position: 'absolute', bottom: 32, left: 20, right: 20 }}>
        <Button onPress={onSubmit} isUppercase={false} disabled={create.isPending}>Enregistrer l'événement</Button>
      </View>
    </LinearGradient>
  );
}
