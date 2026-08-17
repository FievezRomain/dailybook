import { View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { spacing } from '../../../theme/scales';
import { Banner, Button, DetailScreen, EventCard, TopBar } from '../../../shared/components/ui';
import { toEventCardType } from '../../home/homeUtils';
import { getSelectedAnimalNames } from '../eventCreationUtils';

export interface EventCreateSuccessScreenProps { onAgenda: () => void; onCreateAnother: () => void }

export function EventCreateSuccessScreen({ onAgenda, onCreateAnother }: EventCreateSuccessScreenProps) {
  const form = useEventWizardStore((state) => state.formData); const animals = useAnimalsQuery().data ?? []; const selectedAnimals = animals.filter((animal) => (form.animaux ?? []).includes(animal.id)).map((animal) => ({ id: String(animal.id), name: animal.nom, imageUrl: animal.imageUrl })); const reminder = Boolean(form.notif);
  return <DetailScreen header={<TopBar title="Événement créé" context="detail" onBack={onAgenda} />} contentContainerStyle={{ gap: spacing.lg, paddingTop: 28 }} testID="event-create-success"><Banner tone="success" title="Événement enregistré" message={`${reminder ? 'Le rappel est actif et ' : ''}${getSelectedAnimalNames(form.animaux ?? [], animals).length > 1 ? 'les animaux sont bien associés' : 'l’animal est bien associé'}.`} blocking /><EventCard type={toEventCardType(form.eventType ?? 'autre')} time={form.heuredebutevent ?? '--:--'} title={form.nom?.trim() || 'Événement'} description={form.commentaire} animals={selectedAnimals} /><View style={{ gap: spacing.md, marginTop: spacing.xxl }}><Button label="Voir dans l’agenda" onPress={onAgenda} size="large" fullWidth /><Button label="Créer un autre événement" onPress={onCreateAnother} variant="secondary" fullWidth /></View></DetailScreen>;
}
