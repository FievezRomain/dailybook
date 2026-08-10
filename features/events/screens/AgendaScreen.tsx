import { useMemo, useState } from 'react';
import { Pressable, RefreshControl, Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { useNotificationsQuery } from '../../../hooks/queries/useNotificationsQuery';
import type { Notification } from '../../../models/Notification';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Banner, BottomBar, EmptyState, EventCard, FloatingActionButton, GlobalCreateMenu, InlineCalendar, RootScreen, Skeleton, TopBar, type GlobalCreateTarget } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import type { Material } from '../../../theme/materials';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getEventDate, getInitials, getLinkedAnimals, toEventCardType } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { buildAgendaMarks, dateKey, eventsForDate, formatAgendaDay, formatAgendaEmptyMessage, formatAgendaMonth } from '../agendaUtils';

export interface AgendaScreenProps { material?: Material; onSelectTab: (tab: MainTabId) => void; onOpenDay: (date: string) => void; onOpenEvent: (id: number) => void; onCreate: (target: GlobalCreateTarget) => void; onNotifications?: () => void; onAccount?: () => void }

export function AgendaScreen({ material = 'solid', onSelectTab, onOpenDay, onOpenEvent, onCreate, onNotifications = () => undefined, onAccount = () => undefined }: AgendaScreenProps) {
  const { colors } = useAppTheme(); const user = useAuthStore((state) => state.user); const eventsQuery = useEventsQuery(); const animalsQuery = useAnimalsQuery(); const notificationsQuery = useNotificationsQuery();
  const [selectedDate, setSelectedDate] = useState(() => dateKey(new Date())); const [visibleMonth, setVisibleMonth] = useState(selectedDate); const [createOpen, setCreateOpen] = useState(false);
  const events = eventsQuery.data ?? []; const animals = animalsQuery.data ?? []; const dayEvents = useMemo(() => eventsForDate(events, selectedDate), [events, selectedDate]); const marks = useMemo(() => buildAgendaMarks(events, colors), [colors, events]);
  const notifications: Notification[] = Array.isArray(notificationsQuery.data) ? notificationsQuery.data : [];
  const unread = notifications.filter((item) => !item.is_read).length; const refreshing = eventsQuery.isRefetching || animalsQuery.isRefetching; const refresh = () => void Promise.all([eventsQuery.refetch(), animalsQuery.refetch()]);
  const selectCreate = (target: GlobalCreateTarget) => { setCreateOpen(false); onCreate(target); };
  return <><RootScreen header={<TopBar title="Agenda" material={material} onNotifications={onNotifications} unreadNotifications={unread} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />} bottomBar={<BottomBar items={tabs} activeId="agenda" onSelect={onSelectTab} material={material} />} floatingAction={<FloatingActionButton accessibilityLabel="Créer" onPress={() => setCreateOpen(true)} material={material} />} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} />} contentContainerStyle={{ gap: spacing.md, paddingBottom: spacing.xxl }} testID="events-agenda">
    <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text accessibilityRole="header" style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl, lineHeight: 28 }}>{formatAgendaMonth(visibleMonth)}</Text><Pressable accessibilityRole="button" accessibilityLabel="Revenir à aujourd’hui" onPress={() => { const today = dateKey(new Date()); setSelectedDate(today); setVisibleMonth(today); }} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control }}>Aujourd’hui</Text></Pressable></View>
    <InlineCalendar current={visibleMonth} selectedDate={selectedDate} markedDates={marks} onSelectDate={setSelectedDate} onMonthChange={setVisibleMonth} />
    <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{formatAgendaDay(selectedDate)}</Text>
    {eventsQuery.isLoading || animalsQuery.isLoading ? <Skeleton type="card" density="comfortable" /> : eventsQuery.isError ? <><Banner tone="error" title="Agenda indisponible" message="Vérifiez votre connexion puis réessayez." blocking /><EmptyState type="offline" onAction={() => void eventsQuery.refetch()} /></> : dayEvents.length === 0 ? <EmptyState title="Aucun événement ce jour" message={formatAgendaEmptyMessage(selectedDate)} actionLabel="Ajouter" onAction={() => selectCreate('event')} style={{ minHeight: 260 }} /> : <>{dayEvents.slice(0, 1).map((event) => <EventCard key={event.id} type={toEventCardType(event.eventtype)} time={getEventDate(event).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} title={event.nom || event.eventtype} description={event.commentaire} animals={getLinkedAnimals(event.animaux, animals)} onPress={() => onOpenEvent(event.id)} />)}{dayEvents.length > 1 ? <Pressable accessibilityRole="button" accessibilityLabel={`Voir les ${dayEvents.length} événements du jour`} onPress={() => onOpenDay(selectedDate)} style={{ minHeight: 44, justifyContent: 'center' }}><Text style={{ color: colors.primary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control }}>{dayEvents.length - 1} autre{dayEvents.length > 2 ? 's' : ''} événement{dayEvents.length > 2 ? 's' : ''} · Voir tout</Text></Pressable> : null}</>}
  </RootScreen><GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={selectCreate} material={material} /></>;
}
