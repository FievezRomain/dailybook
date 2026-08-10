import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { AnimalHistoryToggle, Avatar, Button, Checkbox, EmptyState, ErrorState, FormSheet, LinearProgress, ListItem, Skeleton } from '../../../shared/components/ui';
import { getAnimalPresence, sortAnimalsForWorkspace } from '../../animals/animalWorkspaceUtils';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getAnimalSelectionCta, getAnimalSelectionSubtitle, toggleEventAnimal } from '../eventAnimalsUtils';

export interface EventCreateAnimalsScreenProps { onBack: () => void; onContinue: () => void; onClose?: () => void; onCreateAnimal?: () => void }

export function EventCreateAnimalsScreen({ onBack, onContinue, onClose = onBack, onCreateAnimal = () => undefined }: EventCreateAnimalsScreenProps) {
  const { colors } = useAppTheme();
  const animalsQuery = useAnimalsQuery();
  const storedSelectedIds = useEventWizardStore((state) => state.formData.animaux);
  const selectedIds = storedSelectedIds ?? EMPTY_SELECTED_IDS;
  const setField = useEventWizardStore((state) => state.setField);
  const [showError, setShowError] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const animals = sortAnimalsForWorkspace(animalsQuery.data ?? []);
  const presentAnimals = animals.filter((animal) => getAnimalPresence(animal) === 'present');
  const historicalAnimals = animals.filter((animal) => getAnimalPresence(animal) === 'history');
  const visibleAnimals = historyExpanded ? [...presentAnimals, ...historicalAnimals] : presentAnimals;
  useEffect(() => { if (historicalAnimals.some((animal) => selectedIds.includes(animal.id))) setHistoryExpanded(true); }, [historicalAnimals, selectedIds]);
  const change = (id: number) => { setField('animaux', toggleEventAnimal(selectedIds, id)); setShowError(false); };
  const next = () => { if (!selectedIds.length) { setShowError(true); return; } onContinue(); };
  const footer = <View style={{ gap: spacing.sm, paddingHorizontal: spacing.md }}>{showError ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ color: colors.error, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 18, textAlign: 'center' }}>Sélectionnez au moins un animal.</Text> : null}<Button testID="event-animals-continue" label={getAnimalSelectionCta(selectedIds.length)} onPress={next} size="large" fullWidth /></View>;

  return <FormSheet title="Animaux associés" onBack={onBack} onClose={onClose} dirty footer={footer} testID="event-create-animals"><LinearProgress current={3} total={4} label="Étape 3 sur 4" /><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20, marginTop: spacing.lg }}>Sélectionnez un ou plusieurs animaux</Text>{animalsQuery.isLoading ? <><Skeleton type="profile" density="compact" /><Skeleton type="profile" density="compact" /><Skeleton type="profile" density="compact" /></> : animalsQuery.isError ? <ErrorState title="Animaux indisponibles" message="Impossible de charger vos animaux pour le moment." onRetry={() => void animalsQuery.refetch()} /> : animals.length === 0 ? <EmptyState title="Aucun animal" message="Ajoutez d’abord un animal pour pouvoir créer cet événement." actionLabel="Ajouter un animal" onAction={onCreateAnimal} /> : <View accessibilityRole="list" style={{ gap: 10 }}>{visibleAnimals.map((animal) => { const selected = selectedIds.includes(animal.id); return <View key={animal.id} style={{ flexDirection: 'row', alignItems: 'center' }}><Checkbox value={selected} accessibilityLabel={`${selected ? 'Désélectionner' : 'Sélectionner'} ${animal.nom}`} onValueChange={() => change(animal.id)} /><View style={{ flex: 1 }}><ListItem testID={`event-animal-${animal.id}`} title={animal.nom} subtitle={getAnimalSelectionSubtitle(animal)} leading={<Avatar initials={animal.nom} imageUrl={animal.image} accessibilityLabel={`Photo de ${animal.nom}`} size={40} decorative />} accessibilityLabel={`${animal.nom}, ${getAnimalSelectionSubtitle(animal)}, ${selected ? 'sélectionné' : 'non sélectionné'}`} accessibilityHint="Active ou désactive cet animal" onPress={() => change(animal.id)} /></View></View>; })}{historicalAnimals.length ? <AnimalHistoryToggle expanded={historyExpanded} onPress={() => setHistoryExpanded((value) => !value)} testID="event-animals-history-toggle" /> : null}</View>}</FormSheet>;
}

const EMPTY_SELECTED_IDS: readonly number[] = [];
