import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { CalendarPicker, DateTimeField, FormSheet, LinearProgress, PeriodSelector, Select, SelectionModal, StarRatingField, Switch, TextArea, TextField, TimePicker } from '../../../shared/components/ui';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { canContinueEventDetails, getEventDetailsConfig, type EventDetailFieldConfig } from '../eventDetailsConfig';
import { getRecurrenceLabel, isPastEventDate, recurrenceOptions } from '../eventCreationUtils';
import { EXPENSE_CATEGORY_LIST } from '../constants';
import { EventDocumentsField } from '../components/EventDocumentsField';

const expenseCategoryOptions = EXPENSE_CATEGORY_LIST.map(({ id, title }) => ({ id, label: title }));
const eventStateOptions = [{ value: 'pending', label: 'À faire' }, { value: 'completed', label: 'Terminé' }] as const;

export interface EventCreateDetailsScreenProps { onBack: () => void; onContinue: () => void; onClose?: () => void; onComparePlans?: () => void }

function formatDate(date?: string) {
  if (!date) return undefined;
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${date}T12:00:00`));
}

function formatTime(value?: unknown) {
  return typeof value === 'string' && value ? value : undefined;
}

export function EventCreateDetailsScreen({ onBack, onContinue, onClose = onBack, onComparePlans = () => undefined }: EventCreateDetailsScreenProps) {
  const { colors } = useAppTheme();
  const formData = useEventWizardStore((state) => state.formData);
  const setField = useEventWizardStore((state) => state.setField);
  const [calendarField, setCalendarField] = useState<string>();
  const [timeField, setTimeField] = useState<string>();
  const [time, setTime] = useState({ hour: 9, minute: 0 });
  const [showErrors, setShowErrors] = useState(false);
  const [recurrenceOpen, setRecurrenceOpen] = useState(false);
  const [expenseCategoryOpen, setExpenseCategoryOpen] = useState(false);
  const config = getEventDetailsConfig(formData.eventType);
  const editScope = formData.updateScope as 'occurrence' | 'following' | 'series' | undefined;
  const recurrentType = formData.eventType === 'soins' || formData.eventType === 'balade';
  const recurrence = formData.frequencevalue ?? 'none';
  const recurrenceEnd = formData.eventType === 'soins' ? formData.datefinsoins : formData.datefinbalade;
  useEffect(() => {
    if (!formData.state && formData.dateevent) setField('state', isPastEventDate(formData.dateevent) ? 'completed' : 'pending');
  }, [formData.dateevent, formData.state, setField]);
  const valid = canContinueEventDetails(formData.eventType, formData.nom, formData.dateevent)
    && (recurrence === 'none' || Boolean(recurrenceEnd && formData.dateevent && recurrenceEnd >= formData.dateevent));
  const next = () => { if (!valid) { setShowErrors(true); return; } onContinue(); };
  const openTime = (key: string) => {
    const [hour = 9, minute = 0] = String(formData[key] ?? '09:00').split(':').map(Number);
    setTime({ hour: Number.isFinite(hour) ? hour : 9, minute: Number.isFinite(minute) ? minute : 0 });
    setTimeField(key);
  };
  const renderField = (field: EventDetailFieldConfig) => {
    if (field.kind === 'date') return <DateTimeField key={field.key} kind="date" label={field.label} placeholder={field.placeholder} value={formatDate(formData[field.key] as string | undefined)} helperText="Facultatif" onClear={() => setField(field.key, undefined)} onPress={() => setCalendarField(field.key)} />;
    if (field.kind === 'time') return <DateTimeField key={field.key} kind="time" label={field.label} placeholder={field.placeholder} value={formatTime(formData[field.key])} helperText="Facultatif" onPress={() => openTime(field.key)} />;
    if (field.kind === 'expense-category') {
      const selectedCategory = EXPENSE_CATEGORY_LIST.find(({ id }) => id === formData[field.key]);
      const currentValue = String(formData[field.key] ?? '') || undefined;
      return <Select key={field.key} label={field.label} placeholder={field.placeholder} value={selectedCategory?.title ?? currentValue} helperText="Facultatif" onPress={() => setExpenseCategoryOpen(true)} />;
    }
    if (field.kind === 'rating') return <StarRatingField key={field.key} label={field.label} value={typeof formData[field.key] === 'number' ? formData[field.key] as number : undefined} onChange={(value) => setField(field.key, value)} testID={`event-${field.key}-rating`} />;
    return <TextField key={field.key} label={field.label} placeholder={field.placeholder} value={String(formData[field.key] ?? '')} keyboardType={field.keyboardType} helperText="Facultatif" onChangeText={(value) => setField(field.key, field.keyboardType === 'decimal-pad' ? value.replace(',', '.') : value)} />;
  };
  const visibleFields = config.fields.filter((field) => {
    if (!editScope) return true;
    if (editScope === 'occurrence') return ['lieu', 'traitement', 'note', 'depense'].includes(field.key);
    if (editScope === 'following') return ['lieu', 'traitement', 'datefinsoins', 'datefinbalade', 'heurefinbalade'].includes(field.key);
    return ['datefinsoins', 'datefinbalade', 'specialiste', 'discipline', 'epreuve', 'dossart', 'placement', 'categoriedepense'].includes(field.key);
  });

  return <>
    <FormSheet title={config.title} onBack={onBack} onClose={onClose} dirty={Object.keys(formData).length > 0} footerLabel={editScope === 'occurrence' || editScope === 'following' ? 'Continuer' : 'Choisir les animaux'} onFooterPress={next} testID="event-create-details">
      <LinearProgress current={editScope ? 1 : 2} total={editScope === 'series' ? 3 : editScope ? 2 : 4} label={editScope === 'series' ? 'Étape 1 sur 3' : editScope ? 'Étape 1 sur 2' : 'Étape 2 sur 4'} />
      <View style={{ gap: spacing.xs }}>
        <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>État</Text>
        <PeriodSelector options={eventStateOptions} value={formData.state === 'completed' ? 'completed' : 'pending'} onChange={(state) => setField('state', state)} accessibilityLabel="État de l’événement" testID="event-state-selector" />
      </View>
      {editScope === 'occurrence' || editScope === 'following' ? null : <TextField autoFocus label={config.nameLabel} placeholder={config.namePlaceholder} value={formData.nom ?? ''} required={config.nameRequired} helperText={config.nameRequired ? 'Obligatoire' : 'Facultatif'} errorMessage={showErrors && config.nameRequired && !formData.nom?.trim() ? 'Renseignez un intitulé.' : undefined} onChangeText={(value) => setField('nom', value)} containerStyle={{ marginTop: spacing.lg }} />}
      {editScope === 'series' ? null : <DateTimeField kind="date" label="Date" placeholder="Choisir une date" value={formatDate(formData.dateevent)} required helperText="Obligatoire" errorMessage={showErrors && !formData.dateevent ? 'Choisissez une date.' : undefined} onPress={() => setCalendarField('dateevent')} />}
      {editScope === 'series' ? null : <DateTimeField kind="time" label="Heure" placeholder="Choisir une heure" value={formatTime(formData.heuredebutevent)} helperText="Facultatif" onPress={() => openTime('heuredebutevent')} />}
      {visibleFields.map(renderField)}
      {recurrentType && editScope !== 'occurrence' ? <Select label="Répétition" placeholder="Choisir une fréquence" value={getRecurrenceLabel(recurrence)} helperText={recurrence === 'none' ? 'Facultatif' : 'Jusqu’à la date de fin'} errorMessage={showErrors && recurrence !== 'none' && !recurrenceEnd ? 'Choisissez une date de fin.' : showErrors && recurrence !== 'none' && recurrenceEnd && formData.dateevent && recurrenceEnd < formData.dateevent ? 'La date de fin doit suivre la date de début.' : undefined} onPress={() => setRecurrenceOpen(true)} /> : null}
      {editScope && editScope !== 'occurrence' ? null : <TextArea label="Description" placeholder="Ajoutez les informations utiles…" value={formData.commentaire ?? ''} helperText={`${formData.commentaire?.length ?? 0}/500`} maxLength={500} onChangeText={(value) => setField('commentaire', value)} />}
      {formData.eventType === 'soins' || formData.eventType === 'rdv' ? <>
        <View style={{ minHeight: 48, flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: typography.lineHeights.normal }}>Afficher dans le dossier médical</Text>
          <Switch value={formData.todisplay ?? true} onValueChange={(value) => setField('todisplay', value)} accessibilityLabel="Afficher dans le dossier médical" testID="event-health-history-switch" />
        </View>
        <EventDocumentsField onComparePlans={onComparePlans} />
      </> : null}
    </FormSheet>
    <CalendarPicker open={Boolean(calendarField)} current={calendarField ? formData[calendarField] as string | undefined : undefined} selectedStart={calendarField ? formData[calendarField] as string | undefined : undefined} onSelectDay={(date) => { if (calendarField) { setField(calendarField, date); if (calendarField === 'dateevent') setField('state', isPastEventDate(date) ? 'completed' : 'pending'); } }} onConfirm={() => setCalendarField(undefined)} onClose={() => setCalendarField(undefined)} />
    <TimePicker open={Boolean(timeField)} hour={time.hour} minute={time.minute} onChange={setTime} onConfirm={() => { if (timeField) setField(timeField, `${String(time.hour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')}`); setTimeField(undefined); }} onClose={() => setTimeField(undefined)} />
    <SelectionModal open={recurrenceOpen} title="Répéter l’événement" options={[...recurrenceOptions]} selectedIds={[recurrence]} onChange={(ids) => setField('frequencevalue', ids[0] ?? 'none')} onConfirm={() => setRecurrenceOpen(false)} onClose={() => setRecurrenceOpen(false)} />
    <SelectionModal open={expenseCategoryOpen} title="Type de dépense" options={expenseCategoryOptions} selectedIds={formData.categoriedepense ? [String(formData.categoriedepense)] : []} onChange={(ids) => setField('categoriedepense', ids[0])} onConfirm={() => setExpenseCategoryOpen(false)} onClose={() => setExpenseCategoryOpen(false)} />
  </>;
}
