import { useState } from 'react';
import { CalendarPicker, DateTimeField, FormSheet, LinearProgress, TextArea, TextField } from '../../../shared/components/ui';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { spacing } from '../../../theme/scales';
import { canContinueEventDetails, getEventDetailsConfig } from '../eventDetailsConfig';

export interface EventCreateDetailsScreenProps { onBack: () => void; onContinue: () => void; onClose?: () => void }

function formatDate(date?: string) {
  if (!date) return undefined;
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

export function EventCreateDetailsScreen({ onBack, onContinue, onClose = onBack }: EventCreateDetailsScreenProps) {
  const formData = useEventWizardStore((state) => state.formData);
  const setField = useEventWizardStore((state) => state.setField);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const config = getEventDetailsConfig(formData.eventType);
  const valid = canContinueEventDetails(formData.eventType, formData.nom, formData.dateevent);
  const next = () => { if (!valid) { setShowErrors(true); return; } onContinue(); };

  return <>
    <FormSheet title={config.title} onBack={onBack} onClose={onClose} dirty={Object.keys(formData).length > 0} footerLabel="Choisir les animaux" onFooterPress={next} testID="event-create-details">
      <LinearProgress current={2} total={4} label="Étape 2 sur 4" />
      <TextField autoFocus label={config.nameLabel} placeholder={config.namePlaceholder} value={formData.nom ?? ''} required={config.nameRequired} helperText={config.nameRequired ? 'Obligatoire' : 'Facultatif'} errorMessage={showErrors && config.nameRequired && !formData.nom?.trim() ? 'Renseignez un intitulé.' : undefined} onChangeText={(value) => setField('nom', value)} containerStyle={{ marginTop: spacing.lg }} />
      <DateTimeField kind="date" label="Date" placeholder="Choisir une date" value={formatDate(formData.dateevent)} required helperText="Obligatoire" errorMessage={showErrors && !formData.dateevent ? 'Choisissez une date.' : undefined} onPress={() => setCalendarOpen(true)} />
      {config.fields.map((field) => <TextField key={field.key} label={field.label} placeholder={field.placeholder} value={String(formData[field.key] ?? '')} keyboardType={field.keyboardType} helperText="Facultatif" onChangeText={(value) => setField(field.key, field.keyboardType === 'decimal-pad' ? value.replace(',', '.') : value)} />)}
      <TextArea label="Description" placeholder="Ajoutez les informations utiles…" value={formData.commentaire ?? ''} helperText={`${formData.commentaire?.length ?? 0}/500`} maxLength={500} onChangeText={(value) => setField('commentaire', value)} />
    </FormSheet>
    <CalendarPicker open={calendarOpen} current={formData.dateevent} selectedStart={formData.dateevent} onSelectDay={(date) => setField('dateevent', date)} onConfirm={() => setCalendarOpen(false)} onClose={() => setCalendarOpen(false)} />
  </>;
}
