import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import { useAnimalsQuery } from '../../hooks/queries/useAnimalsQuery';
import { useEventMutations, useEventsQuery } from '../../hooks/queries/useEventsQuery';
import { useNotificationsQuery } from '../../hooks/queries/useNotificationsQuery';
import { useObjectifsQuery } from '../../hooks/queries/useObjectifsQuery';
import { useAuthStore } from '../../stores/useAuthStore';
import { Banner, BottomBar, EmptyState, EventCard, FloatingActionButton, GlobalCreateMenu, ObjectiveCard, RootScreen, SectionEmptyMessage, Skeleton, TopBar, type GlobalCreateTarget } from '../../shared/components/ui';
import type { Material } from '../../theme/materials';
import { spacing, typography } from '../../theme/scales';
import { useAppTheme } from '../../theme/useAppTheme';
import type { Notification } from '../../models/Notification';
import { formatEventOverdueLabel, formatHomeDate, formatObjectivePeriod, getDailyTaskProgress, getEventDate, getEventOverdueDays, getFirstName, getInitials, getLinkedAnimals, getObjectiveProgress, isEventCompleted, isHomeHeaderScrolled, splitHomeEvents, toEventCardType } from './homeUtils';
import type { Animal } from '../../models/Animal';
import type { Objectif } from '../../models/Objectif';

import { tabs, type MainTabId } from './mainTabs';

export interface HomeScreenProps { material?: Material; onSelectTab?: (tab: MainTabId) => void; onNotifications?: () => void; onAccount?: () => void; onEvent?: (id: number) => void; onObjective?: (id: number) => void; onCreate?: (target: GlobalCreateTarget) => void }

export function HomeScreen({ material = 'solid', onSelectTab = () => undefined, onNotifications = () => undefined, onAccount = () => undefined, onEvent = () => undefined, onObjective = () => undefined, onCreate = () => undefined }: HomeScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const eventsQuery = useEventsQuery(); const objectivesQuery = useObjectifsQuery(); const animalsQuery = useAnimalsQuery(); const notificationsQuery = useNotificationsQuery();
  const [createOpen, setCreateOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const loading = eventsQuery.isLoading || objectivesQuery.isLoading || animalsQuery.isLoading;
  const hasError = eventsQuery.isError || objectivesQuery.isError || animalsQuery.isError;
  const refreshing = eventsQuery.isRefetching || objectivesQuery.isRefetching || animalsQuery.isRefetching;
  const events = useMemo(() => splitHomeEvents(eventsQuery.data ?? []), [eventsQuery.data]);
  const animals = animalsQuery.data ?? []; const objectives = objectivesQuery.data ?? [];
  const notifications: Notification[] = Array.isArray(notificationsQuery.data) ? notificationsQuery.data : [];
  const unread = notifications.filter((notification) => !notification.is_read).length;
  const refresh = () => void Promise.all([eventsQuery.refetch(), objectivesQuery.refetch(), animalsQuery.refetch(), notificationsQuery.refetch()]);
  const selectCreate = (target: GlobalCreateTarget) => { setCreateOpen(false); onCreate(target); };
  const firstName = getFirstName(user?.prenom);
  const header = <TopBar title="VASCO" material={material} scrolled={scrolled} onNotifications={onNotifications} unreadNotifications={unread} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />;
  const bottomBar = <BottomBar items={tabs} activeId="home" onSelect={onSelectTab} material={material} testID="main-tabs" />;
  return <><RootScreen header={header} bottomBar={bottomBar} floatingAction={<FloatingActionButton accessibilityLabel="Créer" onPress={() => setCreateOpen(true)} material={material} />} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />} onScrollOffsetChange={(offsetY) => setScrolled((current) => { const next = isHomeHeaderScrolled(offsetY); return current === next ? current : next; })} contentContainerStyle={{ gap: spacing.md }} testID="home-overview">
    <View style={{ gap: spacing.xs }}><Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl, lineHeight: 28 }}>Bonjour {firstName}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{loading ? 'Mise à jour de votre journée…' : animals.length === 0 ? 'Votre nouvel espace est prêt' : formatHomeDate()}</Text></View>
    {loading ? <View style={{ gap: spacing.md }}><Skeleton type="card" density="comfortable" /><Skeleton type="profile" density="comfortable" /><Skeleton type="card" density="comfortable" /></View> : animals.length === 0 && !hasError ? <><EmptyState title="Commencez avec votre premier animal" message="Ajoutez un animal pour personnaliser les rappels, événements et objectifs." actionLabel="Ajouter" onAction={() => selectCreate('animal')} /><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20, paddingHorizontal: spacing.md }}>Vous pourrez ensuite créer un événement en moins d’une minute.</Text></> : <HomeContent events={events} objectives={objectives} animals={animals} hasError={hasError} onRetry={refresh} onEvent={onEvent} onObjective={onObjective} onCreate={selectCreate} onSelectTab={onSelectTab} />}
  </RootScreen><GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={selectCreate} material={material} /></>;
}

function HomeContent({ events, objectives, animals, hasError, onRetry, onEvent, onObjective, onSelectTab }: { events: ReturnType<typeof splitHomeEvents>; objectives: readonly Objectif[]; animals: readonly Animal[]; hasError: boolean; onRetry: () => void; onEvent: (id: number) => void; onObjective: (id: number) => void; onCreate: (target: GlobalCreateTarget) => void; onSelectTab: (tab: MainTabId) => void }) {
  const { colors } = useAppTheme();
  const mutations = useEventMutations();
  const [completionError, setCompletionError] = useState(false);
  const daily = getDailyTaskProgress(events.today);
  const activeObjectives = objectives.filter((objective) => getObjectiveProgress(objective) < 1);
  const setEventCompleted = async (event: (typeof events.today)[number], completed: boolean) => {
    setCompletionError(false);
    try { await mutations.patch.mutateAsync({ id: String(event.id), body: { state: completed ? 'completed' : 'pending' } }); }
    catch { setCompletionError(true); }
  };
  const eventCard = (event: (typeof events.today)[number], date: string, allowCompletion = false) => { const overdueDays = getEventOverdueDays(event); return <EventCard key={event.id} type={toEventCardType(event.eventtype)} date={date} time={event.heuredebutevent} title={event.nom || event.eventtype} description={event.commentaire} animals={getLinkedAnimals(event.animaux, animals)} status={overdueDays ? 'overdue' : undefined} statusLabel={overdueDays ? formatEventOverdueLabel(overdueDays) : undefined} completed={allowCompletion ? isEventCompleted(event) : undefined} completionPending={mutations.patch.isPending && mutations.patch.variables?.id === String(event.id)} onCompletedChange={allowCompletion ? (completed) => void setEventCompleted(event, completed) : undefined} onPress={() => onEvent(event.id)} testID={`home-event-${event.id}`} />; };
  return <View style={{ gap: spacing.md }}>
    {hasError ? <Banner tone="error" title="Mise à jour impossible" message="Vérifiez votre connexion. Les dernières données disponibles restent affichées." onDismiss={undefined} blocking /> : null}
    {completionError ? <Banner tone="error" title="Mise à jour impossible" message="L’état de la tâche n’a pas pu être enregistré. Réessayez." onDismiss={() => setCompletionError(false)} /> : null}
    <Section title="Aujourd’hui" action="Voir tout" onAction={() => onSelectTab('agenda')}>
      {daily.total ? <DailyTasksProgress done={daily.done} total={daily.total} progress={daily.progress} /> : null}
      {events.today.length ? events.today.map((event) => eventCard(event, getEventDate(event).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }), true)) : <SectionEmptyMessage title="Rien de prévu aujourd’hui" message="Profitez de la journée avec vos animaux." />}
    </Section>
    <Section title="Prochains jours" action="Voir tout" onAction={() => onSelectTab('agenda')}>{events.upcoming.length ? events.upcoming.map((event) => eventCard(event, getEventDate(event).toLocaleDateString('fr-FR', { weekday: 'short' }))) : <SectionEmptyMessage title="Aucun événement à venir" message="Les prochains événements apparaîtront ici." />}</Section>
    <Section title="Objectifs en cours" action="Voir tout" onAction={() => onSelectTab('tracking')}>{activeObjectives.length ? activeObjectives.map((objective) => { const progress = getObjectiveProgress(objective); return <ObjectiveCard key={objective.id} title={objective.title} status="active" statusLabel={`${Math.round(progress * objective.sousetapes.length)} sur ${objective.sousetapes.length} réalisées`} progress={progress} endLabel={formatObjectivePeriod(objective.datedebut, objective.datefin)} animals={getLinkedAnimals(objective.animaux, animals)} onPress={() => onObjective(objective.id)} />; }) : <SectionEmptyMessage title="Aucun objectif en cours" message="Créez un objectif lorsque vous êtes prêt." />}</Section>
    {hasError && !events.today.length && !events.upcoming.length && !objectives.length ? <EmptyState type="offline" onAction={onRetry} /> : null}
  </View>;
}

function DailyTasksProgress({ done, total, progress }: { done: number; total: number; progress: number }) { const { colors } = useAppTheme(); return <View accessibilityRole="progressbar" accessibilityValue={{ min: 0, max: total, now: done, text: `${done} sur ${total} terminées` }} style={{ gap: spacing.sm }}><View style={{ height: 8, borderRadius: 4, backgroundColor: colors.surfaceDim, overflow: 'hidden' }}><View style={{ width: `${Math.round(progress * 100)}%`, height: 8, borderRadius: 4, backgroundColor: colors.primary }} /></View><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{done} tâche{done > 1 ? 's' : ''} sur {total} réalisée{done > 1 ? 's' : ''}</Text></View>; }

function Section({ title, action, onAction, children }: { title: string; action?: string; onAction?: () => void; children: React.ReactNode }) { const { colors } = useAppTheme(); return <View style={{ gap: spacing.sm }}><View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{title}</Text>{action && onAction ? <Pressable accessibilityRole="button" accessibilityLabel={action} onPress={onAction} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control }}>{action}</Text></Pressable> : null}</View>{children}</View>; }
