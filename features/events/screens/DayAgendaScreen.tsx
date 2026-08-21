import { RefreshControl, Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { BottomBar, EmptyState, EventCard, RootScreen, Skeleton, TopBar } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getEventDate, getLinkedAnimals, toEventCardType } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { eventsForDate, formatAgendaDay } from '../agendaUtils';

export interface DayAgendaScreenProps { date: string; onBack: () => void; onOpenEvent: (id: number) => void; onSelectTab: (tab: MainTabId) => void }

export function DayAgendaScreen({ date, onBack, onOpenEvent, onSelectTab }: DayAgendaScreenProps) {
  const { colors } = useAppTheme();
  const eventsQuery = useEventsQuery();
  const animalsQuery = useAnimalsQuery();
  const events = eventsForDate(eventsQuery.data ?? [], date);
  const animals = animalsQuery.data ?? [];
  const refreshing = eventsQuery.isRefetching || animalsQuery.isRefetching;
  const refresh = () => void Promise.all([eventsQuery.refetch(), animalsQuery.refetch()]);
  return <RootScreen header={<TopBar title={formatAgendaDay(date, false)} context="detail" onBack={onBack} />} bottomBar={<BottomBar items={tabs} activeId="agenda" onSelect={onSelectTab} />} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />} contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxl }} testID="events-day-agenda">
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{events.length} événement{events.length > 1 ? 's' : ''}</Text>
    {eventsQuery.isLoading || animalsQuery.isLoading ? <><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /></> : events.length === 0 ? <EmptyState title="Aucun événement ce jour" message="Revenez à l’agenda pour sélectionner une autre date." actionLabel="Retour à l’agenda" onAction={onBack} /> : <View style={{ gap: 12 }}>{events.map((event) => { const eventDate = getEventDate(event); return <EventCard key={event.id} type={toEventCardType(event.eventtype)} date={new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'short' }).format(eventDate)} time={event.heuredebutevent ? eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : undefined} title={event.nom || event.eventtype} description={event.commentaire} animals={getLinkedAnimals(event.animaux, animals)} onPress={() => onOpenEvent(event.id)} />; })}</View>}
  </RootScreen>;
}
