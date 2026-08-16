import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import type { Animal } from '../../../models/Animal';
import type { Objectif } from '../../../models/Objectif';
import { useObjectifMutations } from '../../../hooks/queries/useObjectifsQuery';
import { useObjectiveWizardStore } from '../../../stores/useObjectiveWizardStore';
import { AnimalHistoryToggle, AnimalSelectorItem, Banner, CalendarPicker, ControlledField, ControlledTextField, DateTimeField, FormSheet, LinearProgress, TextArea } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { parseApiError } from '../../../utils/errorParser';
import { getAnimalPresence, sortAnimalsForWorkspace } from '../../animals/animalWorkspaceUtils';
import { buildObjectivePayload, buildObjectiveUpdatePayload, objectiveDetailsSchema, objectiveToWizardForm, objectiveWizardFingerprint, stepsFromText } from '../objectiveFormUtils';

type ObjectiveDetails = z.infer<typeof objectiveDetailsSchema>;
type CalendarField = 'datedebut' | 'datefin';

export interface ObjectiveFormSheetScreenProps {
  mode: 'create' | 'edit';
  objective?: Objectif;
  animals: readonly Animal[];
  onClose: () => void;
  onSaved: (objectiveId?: number) => void;
}

export function ObjectiveFormSheetScreen({ mode, objective, animals, onClose, onSaved }: ObjectiveFormSheetScreenProps) {
  const { colors } = useAppTheme();
  const mutations = useObjectifMutations();
  const initializedKey = useRef<string | undefined>(undefined);
  const step = useObjectiveWizardStore((state) => state.step);
  const form = useObjectiveWizardStore((state) => state.formData);
  const setStep = useObjectiveWizardStore((state) => state.setStep);
  const setField = useObjectiveWizardStore((state) => state.setField);
  const replaceFormData = useObjectiveWizardStore((state) => state.replaceFormData);
  const [baseline, setBaseline] = useState('');
  const [calendarField, setCalendarField] = useState<CalendarField>();
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [saveError, setSaveError] = useState<string>();
  const detailsForm = useForm<ObjectiveDetails>({
    resolver: zodResolver(objectiveDetailsSchema),
    defaultValues: { title: '', datedebut: '', datefin: '' },
  });

  useEffect(() => {
    const key = `${mode}:${objective?.id ?? 'new'}`;
    if (initializedKey.current === key) return;
    initializedKey.current = key;
    const initial = mode === 'edit' && objective
      ? objectiveToWizardForm(objective)
      : { title: '', datedebut: '', datefin: '', animaux: [], sousetapes: [] };
    replaceFormData(initial);
    detailsForm.reset({ title: initial.title, datedebut: initial.datedebut, datefin: initial.datefin });
    setBaseline(objectiveWizardFingerprint(initial));
  }, [detailsForm, mode, objective, replaceFormData]);

  useEffect(() => detailsForm.watch((values) => {
    if (typeof values.title === 'string') setField('title', values.title);
    if (typeof values.datedebut === 'string') setField('datedebut', values.datedebut);
    if (typeof values.datefin === 'string') setField('datefin', values.datefin);
  }).unsubscribe, [detailsForm, setField]);

  const sortedAnimals = sortAnimalsForWorkspace(animals);
  const presentAnimals = sortedAnimals.filter((animal) => getAnimalPresence(animal) === 'present');
  const historicalAnimals = sortedAnimals.filter((animal) => getAnimalPresence(animal) === 'history');
  const selectedHistoricalAnimal = historicalAnimals.some((animal) => form.animaux.includes(animal.id));
  const visibleHistoricalAnimals = historyExpanded ? historicalAnimals : [];
  const dirty = baseline !== '' && objectiveWizardFingerprint(form) !== baseline;
  const pending = mutations.create.isPending || mutations.update.isPending;
  const stepText = form.sousetapes.map((item) => item.label).join('\n');

  useEffect(() => {
    if (selectedHistoricalAnimal) setHistoryExpanded(true);
  }, [selectedHistoricalAnimal]);

  const continueWizard = async () => {
    setSaveError(undefined);
    if (step === 0) {
      if (!(await detailsForm.trigger())) return;
      setStep(1);
      return;
    }
    if (step === 1) {
      setStep(2);
      return;
    }
    try {
      const saved = mode === 'edit' && objective
        ? await mutations.update.mutateAsync({ id: String(objective.id), body: buildObjectiveUpdatePayload(form, objective.id) })
        : await mutations.create.mutateAsync(buildObjectivePayload(form));
      onSaved(saved?.id ?? objective?.id);
    } catch (error) {
      setSaveError(parseApiError(error).message);
    }
  };

  const toggleAnimal = (animalId: number) => setField('animaux', form.animaux.includes(animalId)
    ? form.animaux.filter((id) => id !== animalId)
    : [...form.animaux, animalId]);
  const selectDate = (value: string) => {
    if (!calendarField) return;
    detailsForm.setValue(calendarField, value, { shouldDirty: true, shouldValidate: true });
  };
  const footerLabel = step === 2 ? (mode === 'edit' ? 'Enregistrer les modifications' : 'Créer l’objectif') : 'Continuer';

  return <><FormSheet title={mode === 'edit' ? 'Modifier l’objectif' : 'Nouvel objectif'} onBack={() => step > 0 ? setStep(step - 1) : onClose()} onClose={onClose} dirty={dirty} confirmBackWhenDirty={step === 0} footerLabel={footerLabel} onFooterPress={() => void continueWizard()} footerDisabled={pending} footerLoading={pending} testID="objective-form-sheet">
    <LinearProgress current={step + 1} total={3} label={`Étape ${step + 1} sur 3`} />
    <View style={{ gap: spacing.xs, marginTop: spacing.md }}>
      <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: typography.lineHeights.loose }}>{step === 0 ? 'Définir le cap' : step === 1 ? 'Animaux & étapes' : 'Vérification'}</Text>
      {step < 2 ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>{step === 0 ? 'Un objectif simple et mesurable fonctionne mieux.' : 'Associez le cap puis découpez-le en petites étapes.'}</Text> : null}
    </View>
    {step === 0 ? <>
      <ControlledTextField control={detailsForm.control} name="title" label="Titre" placeholder="Ex. Marcher 20 km" required helperText="Obligatoire" />
      <ControlledField control={detailsForm.control} name="datedebut">{({ value, errorMessage }) => <DateField label="Date de début" value={value} errorMessage={errorMessage} onPress={() => setCalendarField('datedebut')} />}</ControlledField>
      <ControlledField control={detailsForm.control} name="datefin">{({ value, errorMessage }) => <DateField label="Date de fin" value={value} errorMessage={errorMessage} onPress={() => setCalendarField('datefin')} />}</ControlledField>
    </> : null}
    {step === 1 ? <>
      {sortedAnimals.length ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: spacing.sm }}><View style={{ flexDirection: 'row' }}>{presentAnimals.map((animal) => <AnimalSelectorItem key={animal.id} name={animal.nom} imageUrl={animal.image} selected={form.animaux.includes(animal.id)} onPress={() => toggleAnimal(animal.id)} testID={`objective-animal-${animal.id}`} />)}{visibleHistoricalAnimals.map((animal) => <AnimalSelectorItem key={animal.id} name={animal.nom} imageUrl={animal.image} selected={form.animaux.includes(animal.id)} onPress={() => toggleAnimal(animal.id)} testID={`objective-animal-${animal.id}`} />)}</View></ScrollView> : <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium }}>Aucun animal disponible. Vous pourrez en associer un plus tard.</Text>}
      {historicalAnimals.length ? <AnimalHistoryToggle expanded={historyExpanded} onPress={() => setHistoryExpanded((value) => !value)} testID="objective-animal-history" /> : null}
      <TextArea label="Étapes" placeholder="Une étape par ligne…" value={stepText} helperText={`${form.sousetapes.length} étape${form.sousetapes.length > 1 ? 's' : ''}`} onChangeText={(value) => setField('sousetapes', stepsFromText(value, form.sousetapes))} />
    </> : null}
    {step === 2 ? <ObjectiveSummary form={form} animals={sortedAnimals} onEdit={() => setStep(0)} /> : null}
    {step === 2 ? <View style={{ padding: spacing.md, borderRadius: radii.lg, backgroundColor: colors.backgroundPaper }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: typography.lineHeights.tight }}>Vasco suivra automatiquement la progression à partir des événements et mesures liés.</Text></View> : null}
    {saveError ? <Banner tone="error" title="Enregistrement impossible" message={saveError} blocking testID="objective-save-error" /> : null}
  </FormSheet><CalendarPicker open={Boolean(calendarField)} current={calendarField ? form[calendarField] : undefined} selectedStart={calendarField ? form[calendarField] : undefined} onSelectDay={selectDate} onConfirm={() => setCalendarField(undefined)} onClose={() => setCalendarField(undefined)} /></>;
}

function DateField({ label, value, errorMessage, onPress }: { label: string; value: string; errorMessage?: string; onPress: () => void }) {
  const displayValue = /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value.slice(8, 10)} / ${value.slice(5, 7)} / ${value.slice(0, 4)}` : undefined;
  return <ControlledDateField label={label} value={displayValue} errorMessage={errorMessage} onPress={onPress} />;
}

function ControlledDateField({ label, value, errorMessage, onPress }: { label: string; value?: string; errorMessage?: string; onPress: () => void }) {
  return <DateTimeField kind="date" label={label} placeholder="JJ / MM / AAAA" value={value} required helperText="Obligatoire" errorMessage={errorMessage} onPress={onPress} />;
}

function ObjectiveSummary({ form, animals, onEdit }: { form: ReturnType<typeof useObjectiveWizardStore.getState>['formData']; animals: readonly Animal[]; onEdit: () => void }) {
  const { colors } = useAppTheme();
  const animalNames = animals.filter((animal) => form.animaux.includes(animal.id)).map((animal) => animal.nom).join(', ') || 'Aucun';
  const rows = [['Objectif', form.title], ['Période', `${formatDate(form.datedebut)} au ${formatDate(form.datefin)}`], ['Animaux', animalNames], ['Étapes', `${form.sousetapes.length} étape${form.sousetapes.length > 1 ? 's' : ''}`]];
  return <View style={{ gap: spacing.lg, padding: spacing.md, borderWidth: 1, borderColor: colors.border, borderRadius: radii.lg, backgroundColor: colors.surface }}>{rows.map(([label, value]) => <View key={label} style={{ flexDirection: 'row', gap: spacing.md }}><Text style={{ width: 88, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{label}</Text><Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>{value}</Text></View>)}<Text accessibilityRole="button" onPress={onEdit} style={{ alignSelf: 'flex-end', color: colors.primaryDark, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.sm }}>Modifier</Text></View>;
}

const formatDate = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value.slice(8, 10)}/${value.slice(5, 7)}/${value.slice(0, 4)}` : value;