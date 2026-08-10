import { useState } from 'react';
import type { Animal } from '../../../models/Animal';
import { useAnimalMutations } from '../../../hooks/queries/useAnimalsQuery';
import { CalendarPicker, DateTimeField, FormSheet, Select, SelectionModal, TextField } from '../../../shared/components/ui';
import { parseApiError } from '../../../utils/errorParser';
import type { AnimalHistoryItem, AnimalHistoryRecord } from '../types';

type MeasurementType = Extract<AnimalHistoryItem, 'poids' | 'taille'>;
export interface AnimalMeasurementSheetProps { animal: Animal; initialType?: MeasurementType; record?: AnimalHistoryRecord; onClose: () => void; onSaved: () => void }

const labels: Record<MeasurementType, string> = { poids: 'Poids', taille: 'Taille' };
const units: Record<MeasurementType, string> = { poids: 'kg', taille: 'cm' };

export function AnimalMeasurementSheet({ animal, initialType = 'poids', record, onClose, onSaved }: AnimalMeasurementSheetProps) {
  const mutations = useAnimalMutations();
  const [type, setType] = useState<MeasurementType>(initialType);
  const [date, setDate] = useState(record?.datemodification ?? new Date().toISOString().slice(0, 10));
  const [value, setValue] = useState(record ? String(record.value) : '');
  const [typeOpen, setTypeOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [localError, setLocalError] = useState<string>();
  const numericValue = Number(value.replace(',', '.'));
  const valid = Boolean(date && value.trim() && Number.isFinite(numericValue) && numericValue > 0);
  const dirty = value.trim() !== (record ? String(record.value) : '') || date !== (record?.datemodification ?? new Date().toISOString().slice(0, 10)) || type !== initialType;
  const save = async () => {
    if (!valid) { setShowErrors(true); return; }
    setLocalError(undefined);
    try {
      const body = { idAnimal: animal.id, item: type, value: numericValue, unity: units[type], datemodification: date };
      if (record) await mutations.updateHistory.mutateAsync({ animalId: String(animal.id), historyId: String(record.id), body });
      else await mutations.createHistory.mutateAsync({ animalId: String(animal.id), body });
      onSaved();
    } catch (error) { setLocalError(parseApiError(error).message); }
  };
  const pending = mutations.createHistory.isPending || mutations.updateHistory.isPending;
  return <><FormSheet title={record ? "Modifier la mesure" : "Ajouter une mesure"} onBack={onClose} onClose={onClose} dirty={dirty} confirmBackWhenDirty footerLabel="Enregistrer la mesure" onFooterPress={() => void save()} footerLoading={pending} testID="animal-measurement-sheet">
    <Select label="Type de mesure" placeholder="Choisir" value={labels[type]} required helperText="Obligatoire" disabled={Boolean(record)} onPress={() => setTypeOpen(true)} />
    <DateTimeField kind="date" label="Date" placeholder="JJ / MM / AAAA" value={new Intl.DateTimeFormat('fr-FR').format(new Date(`${date}T12:00:00`))} required helperText="Obligatoire" onPress={() => setCalendarOpen(true)} />
    <TextField label="Valeur" placeholder={type === 'poids' ? 'Ex. 12,8' : 'Ex. 48'} value={value} required helperText="Obligatoire" keyboardType="decimal-pad" errorMessage={showErrors && !valid ? 'Saisissez une valeur positive.' : localError} onChangeText={setValue} />
    <Select label="Unité" placeholder="Unité" value={units[type]} required helperText="Déduite du type de mesure" disabled onPress={() => undefined} />
  </FormSheet><SelectionModal open={typeOpen} title="Type de mesure" options={[{ id: 'poids', label: 'Poids' }, { id: 'taille', label: 'Taille' }]} selectedIds={[type]} onChange={(ids) => setType(ids[0] as MeasurementType)} onConfirm={() => setTypeOpen(false)} onClose={() => setTypeOpen(false)} /><CalendarPicker open={calendarOpen} current={date} selectedStart={date} onSelectDay={setDate} onConfirm={() => setCalendarOpen(false)} onClose={() => setCalendarOpen(false)} /></>;
}
