import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useNotificationsQuery } from '../../../hooks/queries/useNotificationsQuery';
import { useObjectifsQuery } from '../../../hooks/queries/useObjectifsQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import { AnimalScopeItem, AnimalSelectorItem, AnimalSelectorMore, BottomBar, EmptyState, ErrorState, FloatingActionButton, GlobalCreateMenu, ObjectiveCard, RootScreen, SectionHeader, Skeleton, TopBar, resolveAsyncState, type GlobalCreateTarget } from '../../../shared/components/ui';
import type { Material } from '../../../theme/materials';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getAnimalPresence, sortAnimalsForWorkspace } from '../../animals/animalWorkspaceUtils';
import { formatObjectivePeriod, getInitials, getLinkedAnimals, getObjectiveProgress } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { StatisticDetailScreen, StatisticsOverview, type StatisticDetailType, type StatisticsPeriod } from '../../statistics';

type TrackingTab = 'objectives' | 'statistics';
export interface TrackingScreenProps {
  material?: Material;
  canAccessStatistics: boolean;
  onStatisticsLocked: () => void;
  onSelectTab: (tab: MainTabId) => void;
  onCreate: (target: GlobalCreateTarget) => void;
  onCreateObjective: () => void;
  onOpenObjective: (id: number) => void;
  onObjectiveActions: (id: number) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
}

export function TrackingScreen({ material = 'solid', canAccessStatistics, onStatisticsLocked, onSelectTab, onCreate, onCreateObjective, onOpenObjective, onObjectiveActions, onNotifications = () => undefined, onAccount = () => undefined }: TrackingScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const animalsQuery = useAnimalsQuery(); const objectivesQuery = useObjectifsQuery(); const notificationsQuery = useNotificationsQuery();
  const [selectedAnimalId, setSelectedAnimalId] = useState<number>(); const [activeTab, setActiveTab] = useState<TrackingTab>('objectives'); const [objectiveList, setObjectiveList] = useState<'active' | 'all'>('active'); const [statisticsPeriod, setStatisticsPeriod] = useState<StatisticsPeriod>('month'); const [selectedStatistic, setSelectedStatistic] = useState<StatisticDetailType>(); const [historyExpanded, setHistoryExpanded] = useState(false); const [createOpen, setCreateOpen] = useState(false);
  const animals = sortAnimalsForWorkspace(animalsQuery.data ?? []); const objectives = objectivesQuery.data ?? [];
  const presentAnimals = animals.filter((animal) => getAnimalPresence(animal) === 'present'); const historicalAnimals = animals.filter((animal) => getAnimalPresence(animal) === 'history');
  const selectedAnimalIds = useMemo(() => selectedAnimalId == null ? animals.map((animal) => animal.id) : [selectedAnimalId], [animals, selectedAnimalId]);
  const visibleObjectives = useMemo(() => selectedAnimalId == null ? objectives : objectives.filter((objective) => objective.animaux.includes(selectedAnimalId)), [objectives, selectedAnimalId]);
  const objectiveState = resolveAsyncState({ loading: objectivesQuery.isLoading || animalsQuery.isLoading, error: objectivesQuery.isError || animalsQuery.isError, hasData: objectives.length > 0 });
  const notifications = Array.isArray(notificationsQuery.data) ? notificationsQuery.data : [];
  const selectTrackingTab = (tab: TrackingTab) => { if (tab === 'statistics' && !canAccessStatistics) { onStatisticsLocked(); return; } setSelectedStatistic(undefined); setActiveTab(tab); };
  const refresh = () => void Promise.all([objectivesQuery.refetch(), animalsQuery.refetch(), notificationsQuery.refetch()]);
  const selectCreate = (target: GlobalCreateTarget) => { setCreateOpen(false); onCreate(target); };

  if (selectedStatistic) return <StatisticDetailScreen type={selectedStatistic} animalIds={selectedAnimalIds} period={statisticsPeriod} material={material} onPeriodChange={setStatisticsPeriod} onBack={() => setSelectedStatistic(undefined)} />;

  return <><RootScreen
    header={<TopBar title="Suivi" material={material} onNotifications={onNotifications} unreadNotifications={notifications.filter((item) => !item.is_read).length} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />}
    bottomBar={<BottomBar items={tabs} activeId="tracking" onSelect={onSelectTab} material={material} testID="main-tabs" />}
    floatingAction={activeTab === 'objectives' ? <FloatingActionButton accessibilityLabel="Créer" testID="tracking-create" onPress={() => setCreateOpen(true)} material={material} /> : undefined}
    padded={false}
    testID="tracking-screen"
  >
    <AnimalFilter animals={presentAnimals} historicalAnimals={historicalAnimals} selectedAnimalId={selectedAnimalId} historyExpanded={historyExpanded} onSelect={setSelectedAnimalId} onToggleHistory={() => setHistoryExpanded((value) => !value)} />
    <TrackingTabs activeTab={activeTab} canAccessStatistics={canAccessStatistics} colors={colors} onSelect={selectTrackingTab} />
    {activeTab === 'statistics'
      ? <StatisticsOverview animalIds={selectedAnimalIds} period={statisticsPeriod} material={material} onPeriodChange={setStatisticsPeriod} onOpenDetail={setSelectedStatistic} />
      : <ObjectivesContent state={objectiveState} objectives={visibleObjectives} list={objectiveList} onListChange={setObjectiveList} animals={animals} selectedAnimalId={selectedAnimalId} onRetry={refresh} onOpen={onOpenObjective} onActions={onObjectiveActions} />}
  </RootScreen><GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={selectCreate} material={material} /></>;
}

function AnimalFilter({ animals, historicalAnimals, selectedAnimalId, historyExpanded, onSelect, onToggleHistory }: { animals: ReturnType<typeof sortAnimalsForWorkspace>; historicalAnimals: ReturnType<typeof sortAnimalsForWorkspace>; selectedAnimalId?: number; historyExpanded: boolean; onSelect: (id?: number) => void; onToggleHistory: () => void }) {
  return <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: '100%', paddingHorizontal: spacing.sm, paddingTop: spacing.sm, alignItems: 'flex-start' }}><AnimalScopeItem selected={selectedAnimalId == null} onPress={() => onSelect(undefined)} testID="tracking-animal-all" /><View style={{ flexDirection: 'row' }}>{animals.map((animal) => <AnimalSelectorItem key={animal.id} name={animal.nom} imageUrl={animal.image} selected={selectedAnimalId === animal.id} selectionRole="radio" onPress={() => onSelect(animal.id)} testID={`tracking-animal-${animal.id}`} />)}{historicalAnimals.length ? <AnimalSelectorMore expanded={historyExpanded} onPress={onToggleHistory} testID="tracking-animal-more" /> : null}{historyExpanded ? historicalAnimals.map((animal) => <AnimalSelectorItem key={animal.id} name={animal.nom} imageUrl={animal.image} selected={selectedAnimalId === animal.id} selectionRole="radio" onPress={() => onSelect(animal.id)} testID={`tracking-animal-${animal.id}`} />) : null}</View></ScrollView>;
}

function TrackingTabs({ activeTab, canAccessStatistics, colors, onSelect }: { activeTab: TrackingTab; canAccessStatistics: boolean; colors: ReturnType<typeof useAppTheme>['colors']; onSelect: (tab: TrackingTab) => void }) {
  return <View accessibilityRole="tablist" style={{ height: 48, flexDirection: 'row', paddingHorizontal: spacing.md }}>{([{ id: 'objectives', label: 'Objectifs' }, { id: 'statistics', label: 'Statistiques' }] as const).map((item) => { const active = activeTab === item.id; return <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={() => onSelect(item.id)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: active ? 2 : 1, borderBottomColor: active ? colors.primaryDark : colors.border }}><Text style={{ color: active ? colors.primaryDark : colors.textSecondary, fontFamily: active ? typography.fonts.semiBold : typography.fonts.medium, fontSize: typography.sizes.md }}>{item.label}</Text></Pressable>; })}</View>;
}

function ObjectivesContent({ state, objectives, list, onListChange, animals, selectedAnimalId, onRetry, onOpen, onActions }: { state: ReturnType<typeof resolveAsyncState>; objectives: ReturnType<typeof useObjectifsQuery>['data']; list: 'active' | 'all'; onListChange: (value: 'active' | 'all') => void; animals: ReturnType<typeof sortAnimalsForWorkspace>; selectedAnimalId?: number; onRetry: () => void; onOpen: (id: number) => void; onActions: (id: number) => void }) {
  const items = list === 'all' ? (objectives ?? []) : (objectives ?? []).filter((objective) => getObjectiveProgress(objective) < 1);
  return <View style={{ padding: spacing.md, gap: spacing.md }}>
    <SectionHeader label={list === 'active' ? 'En cours' : 'Tous'} count={items.length} actionLabel={list === 'active' ? 'Voir tous' : 'Voir moins'} onAction={() => onListChange(list === 'active' ? 'all' : 'active')} />
    {state === 'loading' ? <><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /></> : state === 'error' ? <ErrorState message="Impossible de charger les objectifs." onRetry={onRetry} /> : items.length === 0 ? <EmptyState title={selectedAnimalId == null ? `Aucun objectif${list === 'active' ? ' en cours' : ''}` : `Aucun objectif${list === 'active' ? ' en cours' : ''} pour cet animal`} message="Le FAB permet de créer un nouvel objectif." /> : items.map((objective) => { const progress = getObjectiveProgress(objective); const completed = progress >= 1; const overdue = !completed && new Date(objective.datefin).getTime() < Date.now(); return <ObjectiveCard key={objective.id} title={objective.title} status={completed ? 'completed' : overdue ? 'overdue' : 'active'} statusLabel={completed ? 'Objectif atteint' : `${objective.sousetapes.filter((step) => ['done', 'completed', 'termine', 'terminé', 'true'].includes(String(step.state).toLowerCase())).length} / ${objective.sousetapes.length} étapes`} progress={progress} endLabel={formatObjectivePeriod(objective.datedebut, objective.datefin)} animals={getLinkedAnimals(objective.animaux, animals)} onPress={() => onOpen(objective.id)} onMore={() => onActions(objective.id)} testID={`tracking-objective-${objective.id}`} />; })}
  </View>;
}
