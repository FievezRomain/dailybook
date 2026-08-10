import { useState } from 'react';
import { Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useEventMutations } from '../../../hooks/queries/useEventsQuery';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Banner, Button, FormSheet, LinearProgress, Select, SelectionModal, Switch } from '../../../shared/components/ui';
import { AppErrorCode } from '../../../types/AppErrorCode';
import { parseApiError } from '../../../utils/errorParser';
import { buildEventCreationPayload, buildEventUpdatePayload, formatEventCreationSummary, getReminderLabel, getSelectedAnimalNames, reminderOptions } from '../eventCreationUtils';

export interface EventCreateOptionsScreenProps {
  onBack: () => void;
  onCreated: (eventId?: number) => void;
  onPremiumGroups: () => void;
  eventId?: number;
  onClose?: () => void;
}

function OptionRow({ title, description, value, onChange }: { title: string; description: string; value: boolean; onChange: (value: boolean) => void }) {
  const { colors } = useAppTheme();
  return <View style={{ minHeight: 92, flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.backgroundPaper }}><View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{title}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{description}</Text></View><Switch value={value} onValueChange={onChange} accessibilityLabel={title} /></View>;
}

export function EventCreateOptionsScreen({ onBack, onCreated, onPremiumGroups, eventId, onClose = onBack }: EventCreateOptionsScreenProps) {
  const { colors } = useAppTheme();
  const form = useEventWizardStore((state) => state.formData);
  const setField = useEventWizardStore((state) => state.setField);
  const animals = useAnimalsQuery().data ?? [];
  const mutations = useEventMutations();
  const [reminderOpen, setReminderOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const reminderEnabled = Boolean(form.notif);
  const selectedReminder = form.optionnotif ?? '30m';
  const names = getSelectedAnimalNames(form.animaux ?? [], animals);
  const editing = eventId !== undefined;

  const save = async () => {
    setErrorMessage(undefined);
    try {
      if (eventId !== undefined) {
        const updated = await mutations.update.mutateAsync({ id: String(eventId), body: buildEventUpdatePayload(form, eventId) });
        onCreated(updated?.id ?? eventId);
      } else {
        const created = await mutations.create.mutateAsync(buildEventCreationPayload(form));
        onCreated(created?.id);
      }
    } catch (error) {
      const parsed = parseApiError(error);
      setErrorMessage(parsed.isNetworkError || parsed.code === AppErrorCode.NOT_FOUND
        ? 'Vérifiez votre connexion puis réessayez. Vos informations sont conservées.'
        : 'Un problème est survenu de notre côté. Réessayez dans quelques instants. Vos informations sont conservées.');
    }
  };

  return <>
    <FormSheet
      title="Rappels et partage"
      onBack={onBack}
      onClose={onClose}
      dirty
      footer={<View style={{ paddingHorizontal: spacing.md }}><Button label={editing ? 'Enregistrer les modifications' : 'Enregistrer l’événement'} onPress={() => void save()} loading={editing ? mutations.update.isPending : mutations.create.isPending} size="large" fullWidth /></View>}
      testID={editing ? 'event-edit-options' : 'event-create-options'}
    >
      <LinearProgress current={4} total={4} label="Étape 4 sur 4" />
      {errorMessage ? <Banner tone="error" title="Enregistrement impossible" message={errorMessage} blocking /> : null}
      <View style={{ marginTop: spacing.lg }}><OptionRow title="Rappel" description="Recevoir une notification avant l’événement" value={reminderEnabled} onChange={(value) => { setField('notif', value ? 'JourJ' : undefined); if (value && !form.optionnotif) setField('optionnotif', '30m'); }} /></View>
      {reminderEnabled ? <Select label="Quand ?" placeholder="Choisir un délai" value={getReminderLabel(selectedReminder)} helperText="Modifiable à tout moment" onPress={() => setReminderOpen(true)} /> : null}
      <OptionRow title="Partager avec un groupe" description="Les membres pourront consulter l’événement · Premium" value={false} onChange={(value) => { if (value) onPremiumGroups(); }} />
      <View accessibilityRole="summary" accessibilityLabel="Résumé de l’événement" style={{ minHeight: 154, gap: spacing.sm, padding: spacing.md, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.backgroundPaper }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>Résumé</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{formatEventCreationSummary(form)}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{names.join(' et ')}{reminderEnabled ? ` · Rappel ${getReminderLabel(selectedReminder).toLocaleLowerCase('fr-FR')}` : ' · Sans rappel'}</Text></View>
    </FormSheet>
    <SelectionModal open={reminderOpen} title="Quand recevoir le rappel ?" options={reminderOptions} selectedIds={[selectedReminder]} onChange={(ids) => setField('optionnotif', ids[0])} onConfirm={() => setReminderOpen(false)} onClose={() => setReminderOpen(false)} />
  </>;
}
