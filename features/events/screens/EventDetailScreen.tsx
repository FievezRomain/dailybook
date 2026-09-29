import { useState, type ReactNode } from 'react';
import { Share, Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useEventMutations, useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { ActionSheet, Avatar, Banner, Card, DetailScreen, Dialog, EmptyState, Icon, IconButton, Skeleton, TopBar, type OverlayActionItem } from '../../../shared/components/ui';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getEventDate, getLinkedAnimals, isEventCompleted, toEventCardType } from '../../home/homeUtils';
import { eventToDuplicateWizardForm, eventToWizardForm, formatEventShareMessage } from '../eventCreationUtils';
import { getEventDetailRows } from '../eventDetailUtils';
import type { EventUpdateScope } from '../types';
import { EventQuickEditSheet } from '../components/EventQuickEditSheet';
import { eventTypePresentation, resolveEventVisual } from '../../../shared/components/ui/content/domainCardUtils';
import { getEventQuickFieldKeys } from '../eventDetailsConfig';

type EventAction = 'edit' | 'duplicate' | 'share' | 'delete';
type EventDeleteScope = 'occurrence' | 'following' | 'series';
type EventFeedback = { tone: 'success' | 'error'; title: string; message: string };
const editScopes: readonly OverlayActionItem<EventUpdateScope>[] = [
  { id: 'occurrence', label: 'Cette occurrence', description: 'Modifier uniquement cet événement', icon: 'edit' },
  { id: 'following', label: 'Cette occurrence et les suivantes', description: 'Appliquer les changements à partir de cette date', icon: 'calendar' },
  { id: 'series', label: 'Toute la série', description: 'Modifier les informations communes et la planification', icon: 'duplicate' },
];
const deleteScopes: readonly OverlayActionItem<EventDeleteScope>[] = [
  { id: 'occurrence', label: 'Cette occurrence', description: 'Conserver les autres occurrences', icon: 'delete', tone: 'destructive' },
  { id: 'following', label: 'Cette occurrence et les suivantes', description: 'Conserver uniquement les occurrences précédentes', icon: 'delete', tone: 'destructive' },
  { id: 'series', label: 'Toute la série', description: 'Supprimer toutes les occurrences', icon: 'delete', tone: 'destructive' },
];
const actions: readonly OverlayActionItem<EventAction>[] = [{ id: 'edit', label: 'Modifier', description: 'Mettre à jour toutes les informations', icon: 'edit' }, { id: 'duplicate', label: 'Dupliquer', description: 'Créer une copie modifiable', icon: 'duplicate' }, { id: 'share', label: 'Partager', description: 'Envoyer avec les applications du téléphone', icon: 'share' }, { id: 'delete', label: 'Supprimer', description: 'Une confirmation sera demandée', icon: 'delete', tone: 'destructive' }];

export interface EventDetailScreenProps { eventId: number; onBack: () => void; onDeleted: () => void; initialFeedback?: string; onEdit?: (id: number) => void; onDuplicate?: (id: number) => void; onShare?: (id: number) => void }

export function EventDetailScreen({ eventId, onBack, onDeleted, initialFeedback, onEdit = () => undefined, onDuplicate = () => undefined, onShare = () => undefined }: EventDetailScreenProps) {
  const { colors } = useAppTheme();
  const eventsQuery = useEventsQuery(); const animalsQuery = useAnimalsQuery(); const mutations = useEventMutations();
  const setFormData = useEventWizardStore((state) => state.setFormData); const resetWizard = useEventWizardStore((state) => state.reset);
  const event = (eventsQuery.data ?? []).find((item) => item.id === eventId);
  const [actionsOpen, setActionsOpen] = useState(false); const [deleteOpen, setDeleteOpen] = useState(false); const [scopeOpen, setScopeOpen] = useState(false); const [deleteScopeOpen, setDeleteScopeOpen] = useState(false); const [deleteScope, setDeleteScope] = useState<EventDeleteScope>('occurrence');
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [feedback, setFeedback] = useState<EventFeedback | undefined>(initialFeedback ? { tone: 'success', title: 'Événement mis à jour', message: initialFeedback } : undefined); const [shareError, setShareError] = useState(false);
  if (eventsQuery.isLoading || animalsQuery.isLoading) return <DetailScreen header={<TopBar title="Événement" context="detail" onBack={onBack} />}><Skeleton type="card" density="comfortable" /></DetailScreen>;
  if (!event) return <DetailScreen header={<TopBar title="Événement" context="detail" onBack={onBack} />}><EmptyState title="Événement introuvable" message="Il a peut-être été supprimé ou déplacé." actionLabel="Retour" onAction={onBack} /></DetailScreen>;

  const animals = getLinkedAnimals(event.animaux, animalsQuery.data ?? []); const date = getEventDate(event); const animalNames = animals.map((animal) => animal.name).join(' et ') || 'Aucun animal';
  const selectAction = (action: EventAction) => {
    if (action === 'delete') {
      if (event.idparent || event.frequencevalue) setDeleteScopeOpen(true);
      else { setDeleteScope('occurrence'); setDeleteOpen(true); }
    }
    else if (action === 'edit') { resetWizard(); setFormData(eventToWizardForm(event)); if (event.idparent || event.frequencevalue) setScopeOpen(true); else onEdit(event.id); }
    else if (action === 'duplicate') { resetWizard(); setFormData(eventToDuplicateWizardForm(event)); onDuplicate(event.id); }
    else { setShareError(false); void Share.share({ title: event.nom || 'Événement Vasco', message: formatEventShareMessage(event, animals.map((animal) => animal.name)) }).then(() => onShare(event.id)).catch(() => setShareError(true)); }
  };
  const completed = isEventCompleted(event);
  const remove = async () => { await mutations.remove.mutateAsync({ id: String(event.id), scope: deleteScope }); onDeleted(); };
  const cardDate = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(date);
  const cardTime = event.heuredebutevent ? date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined;
  const informationRows = getEventDetailRows(event, animals.map((animal) => animal.name));
  const secondaryRows = informationRows.filter((row) => !['Type', 'État', 'Date et heure', 'Animaux', 'Note', 'Classement', 'Dépense', 'Description'].includes(row.label));
  const eventVisual = resolveEventVisual(colors, toEventCardType(event.eventtype));
  const eventTypeLabel = eventTypePresentation[toEventCardType(event.eventtype)].label;
  const source = event as typeof event & Record<string, unknown>;
  const editableKeys = new Set(getEventQuickFieldKeys(event.eventtype));
  const quickItems = [
    ...(editableKeys.has('note') ? [{ label: 'Note', value: typeof source.note === 'number' ? formatQuickRating(source.note) : 'Non renseignée' }] : []),
    ...(editableKeys.has('placement') ? [{ label: 'Classement', value: String(source.placement ?? 'Non renseigné') }] : []),
    ...(editableKeys.has('depense') ? [{ label: 'Dépense', value: event.depense == null ? 'Non renseignée' : new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(event.depense) }] : []),
    { label: 'État', value: completed ? 'Terminé' : 'À faire' },
  ];
  const quickSave = async (body: import('../types').PatchEventPayload) => {
    try {
      await mutations.patch.mutateAsync({ id: String(event.id), body });
      setQuickEditOpen(false);
      setFeedback({ tone: 'success', title: 'Événement mis à jour', message: 'La modification rapide a été enregistrée.' });
    } catch {
      setFeedback({ tone: 'error', title: 'Mise à jour impossible', message: 'La modification n’a pas pu être enregistrée. Réessayez.' });
      throw new Error('event-quick-edit-failed');
    }
  };

  return <>
    <DetailScreen header={<TopBar title={event.nom || 'Événement'} context="detail" onBack={onBack} trailing={<IconButton icon="moreHorizontal" accessibilityLabel="Actions sur l’événement" onPress={() => setActionsOpen(true)} variant="ghost" />} />} contentContainerStyle={{ gap: spacing.md, paddingTop: spacing.md, paddingBottom: spacing.lg }} testID="event-detail">
      <Card style={{ gap: spacing.md, borderColor: eventVisual.color }} accessibilityLabel={`${eventTypeLabel}, ${event.nom}, ${cardDate}${cardTime ? `, ${cardTime}` : ''}, ${animalNames}`}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.md }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceVariant }}><Icon name={eventVisual.icon} size="lg" color={eventVisual.color} /></View>
          <View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: eventVisual.color, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{eventTypeLabel} · {completed ? 'Terminé' : 'À faire'}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{new Intl.DateTimeFormat('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).format(date)}{cardTime ? ` · ${cardTime}` : ''}</Text></View>
        </View>
        {animals.length ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md }}>{animals.map((animal) => <View key={animal.id} style={{ minWidth: 96, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><Avatar initials={animal.name} imageUrl={animal.imageUrl} size={48} accessibilityLabel={animal.name} /><Text numberOfLines={1} style={{ maxWidth: 112, color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md }}>{animal.name}</Text></View>)}</View> : null}
      </Card>
      {feedback ? <Banner tone={feedback.tone} title={feedback.title} message={feedback.message} onDismiss={() => setFeedback(undefined)} /> : null}
      {shareError ? <Banner tone="error" title="Partage impossible" message="Le menu de partage n’a pas pu être ouvert. Réessayez." onDismiss={() => setShareError(false)} /> : null}
      <SectionTitle action={<IconButton icon="edit" accessibilityLabel="Modifier le suivi" onPress={() => setQuickEditOpen(true)} variant="ghost" />}>Suivi rapide</SectionTitle>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {quickItems.map((item, index) => <QuickInfoCard key={item.label} label={item.label} value={item.value} fullWidth={quickItems.length % 2 === 1 && index === quickItems.length - 1} />)}
        <QuickInfoCard label="Compte rendu" value={event.commentaire || 'Non renseigné'} fullWidth />
      </View>
      {secondaryRows.length ? <><SectionTitle>Informations</SectionTitle><Card style={{ flexDirection: 'row', flexWrap: 'wrap', columnGap: spacing.md, rowGap: spacing.md }}>{secondaryRows.map((row) => <Information key={row.label} label={row.label} value={row.value} />)}</Card></> : null}
    </DetailScreen>
    <ActionSheet open={actionsOpen} title="Actions sur l’événement" subtitle={`${event.nom || event.eventtype} · ${animalNames}`} items={actions} onSelect={selectAction} onClose={() => setActionsOpen(false)} />
    <ActionSheet open={scopeOpen} title="Que souhaitez-vous modifier ?" subtitle="Les informations de suivi déjà saisies seront préservées." items={editScopes} onSelect={(scope) => { setFormData({ updateScope: scope }); onEdit(event.id); }} onClose={() => setScopeOpen(false)} />
    <ActionSheet open={deleteScopeOpen} title="Que souhaitez-vous supprimer ?" subtitle="Choisissez la portée avant de confirmer la suppression." items={deleteScopes} onSelect={(scope) => { setDeleteScope(scope); setDeleteScopeOpen(false); setDeleteOpen(true); }} onClose={() => setDeleteScopeOpen(false)} />
    <Dialog open={deleteOpen} type="destructive" title="Confirmer la suppression ?" description={deleteScope === 'series' ? 'Toute la série sera supprimée. Cette action est irréversible.' : deleteScope === 'following' ? 'Cette occurrence et toutes les suivantes seront supprimées. Cette action est irréversible.' : 'Seule cette occurrence sera supprimée. Cette action est irréversible.'} confirmLabel="Supprimer" onConfirm={remove} onClose={() => setDeleteOpen(false)} loading={mutations.remove.isPending} onError={() => setFeedback({ tone: 'error', title: 'Suppression impossible', message: 'La suppression a échoué. Réessayez.' })} />
    {quickEditOpen ? <EventQuickEditSheet event={event} onClose={() => setQuickEditOpen(false)} onSave={quickSave} /> : null}
  </>;
}

function SectionTitle({ children, action }: { children: string; action?: ReactNode }) { const { colors } = useAppTheme(); return <View style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center' }}><Text accessibilityRole="header" style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{children}</Text>{action}</View>; }
function formatQuickRating(value: number) { const rating = Math.max(1, Math.min(5, Math.round(value))); return `${'★'.repeat(rating)}${'☆'.repeat(5 - rating)}`; }
function QuickInfoCard({ label, value, fullWidth = false }: { label: string; value: string; fullWidth?: boolean }) { const { colors } = useAppTheme(); return <View style={{ width: fullWidth ? '100%' : '48%', flexGrow: fullWidth ? 0 : 1 }}><Card accessibilityLabel={`${label}, ${value}`} style={{ width: '100%', minHeight: fullWidth ? 72 : 88, justifyContent: 'space-between', gap: spacing.xs }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm }}>{label}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{value}</Text></Card></View>; }
function Information({ label, value }: { label: string; value: string }) { const { colors } = useAppTheme(); return <View style={{ flexBasis: '45%', flexGrow: 1, gap: spacing.xs }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.sm, lineHeight: 18 }}>{label}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{value}</Text></View>; }
