import { useState } from 'react';
import { Share, Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useEventMutations, useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { ActionSheet, Banner, Button, DetailScreen, Dialog, EmptyState, EventCard, IconButton, Skeleton, TopBar, type OverlayActionItem } from '../../../shared/components/ui';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getEventDate, getLinkedAnimals, toEventCardType } from '../../home/homeUtils';
import { eventToDuplicateWizardForm, eventToWizardForm, formatEventShareMessage } from '../eventCreationUtils';

type EventAction = 'edit' | 'duplicate' | 'share' | 'delete';
const actions: readonly OverlayActionItem<EventAction>[] = [{ id: 'edit', label: 'Modifier', description: 'Mettre à jour toutes les informations', icon: 'edit' }, { id: 'duplicate', label: 'Dupliquer', description: 'Créer une copie modifiable', icon: 'duplicate' }, { id: 'share', label: 'Partager', description: 'Envoyer avec les applications du téléphone', icon: 'share' }, { id: 'delete', label: 'Supprimer', description: 'Une confirmation sera demandée', icon: 'delete', tone: 'destructive' }];

export interface EventDetailScreenProps { eventId: number; onBack: () => void; onDeleted: () => void; initialFeedback?: string; onEdit?: (id: number) => void; onDuplicate?: (id: number) => void; onShare?: (id: number) => void }

export function EventDetailScreen({ eventId, onBack, onDeleted, initialFeedback, onEdit = () => undefined, onDuplicate = () => undefined, onShare = () => undefined }: EventDetailScreenProps) {
  const { colors } = useAppTheme();
  const eventsQuery = useEventsQuery(); const animalsQuery = useAnimalsQuery(); const mutations = useEventMutations();
  const setFormData = useEventWizardStore((state) => state.setFormData); const resetWizard = useEventWizardStore((state) => state.reset);
  const event = (eventsQuery.data ?? []).find((item) => item.id === eventId);
  const [actionsOpen, setActionsOpen] = useState(false); const [deleteOpen, setDeleteOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | undefined>(initialFeedback); const [shareError, setShareError] = useState(false);
  if (eventsQuery.isLoading || animalsQuery.isLoading) return <DetailScreen header={<TopBar title="Événement" context="detail" onBack={onBack} />}><Skeleton type="card" density="comfortable" /></DetailScreen>;
  if (!event) return <DetailScreen header={<TopBar title="Événement" context="detail" onBack={onBack} />}><EmptyState title="Événement introuvable" message="Il a peut-être été supprimé ou déplacé." actionLabel="Retour" onAction={onBack} /></DetailScreen>;

  const animals = getLinkedAnimals(event.animaux, animalsQuery.data ?? []); const date = getEventDate(event); const animalNames = animals.map((animal) => animal.name).join(' et ') || 'Aucun animal';
  const selectAction = (action: EventAction) => {
    if (action === 'delete') setDeleteOpen(true);
    else if (action === 'edit') { resetWizard(); setFormData(eventToWizardForm(event)); onEdit(event.id); }
    else if (action === 'duplicate') { resetWizard(); setFormData(eventToDuplicateWizardForm(event)); onDuplicate(event.id); }
    else { setShareError(false); void Share.share({ title: event.nom || 'Événement Vasco', message: formatEventShareMessage(event, animals.map((animal) => animal.name)) }).then(() => onShare(event.id)).catch(() => setShareError(true)); }
  };
  const complete = async () => { await mutations.patch.mutateAsync({ id: String(event.id), body: { state: 'completed' } }); setFeedback('Événement marqué comme terminé.'); };
  const remove = async () => { await mutations.remove.mutateAsync(String(event.id)); onDeleted(); };

  return <><DetailScreen header={<TopBar title={event.nom || 'Événement'} context="detail" onBack={onBack} />} footer={<Button label={event.state === 'completed' ? 'Événement terminé' : 'Marquer comme terminé'} onPress={() => void complete()} size="large" fullWidth loading={mutations.patch.isPending} disabled={event.state === 'completed'} />} contentContainerStyle={{ gap: spacing.lg, paddingTop: 28 }} testID="event-detail"><View style={{ alignItems: 'flex-end', marginBottom: -12 }}><IconButton icon="moreHorizontal" accessibilityLabel="Actions sur l’événement" onPress={() => setActionsOpen(true)} variant="ghost" /></View><EventCard type={toEventCardType(event.eventtype)} time={date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} title={event.nom || event.eventtype} description={event.commentaire} animals={animals} />{feedback ? <Banner tone="success" title="Événement mis à jour" message={feedback} onDismiss={() => setFeedback(undefined)} /> : null}{shareError ? <Banner tone="error" title="Partage impossible" message="Le menu de partage n’a pas pu être ouvert. Réessayez." onDismiss={() => setShareError(false)} /> : null}<Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>Informations</Text><Information label="Date et heure" value={`${new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date)} · ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`} /><Information label="Animaux" value={animalNames} />{event.eventtype === 'soins' && event.traitement ? <Information label="Traitement" value={event.traitement} /> : null}{event.lieu ? <Information label="Lieu" value={event.lieu} /> : null}{event.notif ? <Information label="Rappel" value={event.optionnotif ?? event.notif} /> : null}{event.commentaire ? <Information label="Notes" value={event.commentaire} /> : null}</DetailScreen><ActionSheet open={actionsOpen} title="Actions sur l’événement" subtitle={`${event.nom || event.eventtype} · ${animalNames}`} items={actions} onSelect={selectAction} onClose={() => setActionsOpen(false)} /><Dialog open={deleteOpen} type="destructive" title="Supprimer cet événement ?" description="Cette action supprimera l’événement pour tous les animaux liés. Elle est irréversible." confirmLabel="Supprimer" onConfirm={remove} onClose={() => setDeleteOpen(false)} loading={mutations.remove.isPending} onError={() => setFeedback('La suppression a échoué. Réessayez.')} /></>;
}

function Information({ label, value }: { label: string; value: string }) { const { colors } = useAppTheme(); return <View style={{ gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control, lineHeight: 20 }}>{label}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{value}</Text></View>; }
