import { useMemo, useState } from "react";
import { Pressable, RefreshControl, ScrollView, Text, View } from "react-native";
import { useAnimalsQuery } from "../../../hooks/queries/useAnimalsQuery";
import { useNotificationsQuery } from "../../../hooks/queries/useNotificationsQuery";
import { useObjectifsQuery } from "../../../hooks/queries/useObjectifsQuery";
import { useAuthStore } from "../../../stores/useAuthStore";
import {
  AnimalScopeItem,
  AnimalSelectorItem,
  AnimalSelectorMore,
  BottomBar,
  EmptyState,
  ErrorState,
  FloatingActionButton,
  GlobalCreateMenu,
  ObjectiveCard,
  PremiumGate,
  RootScreen,
  SectionHeader,
  Skeleton,
  TabBar,
  TopBar,
  resolveAsyncState,
  type GlobalCreateTarget,
} from "../../../shared/components/ui";
import type { Material } from "../../../theme/materials";
import { spacing, typography } from "../../../theme/scales";
import { useAppTheme } from "../../../theme/useAppTheme";
import {
  getAnimalPresence,
  isSharedAnimal,
  sortAnimalsForWorkspace,
} from "../../animals/animalWorkspaceUtils";
import {
  formatObjectivePeriod,
  getInitials,
  getLinkedAnimals,
  getObjectiveProgress,
} from "../../home/homeUtils";
import { tabs, type MainTabId } from "../../home/mainTabs";
import {
  StatisticDetailScreen,
  StatisticsOverview,
  type StatisticDetailType,
  type StatisticsPeriod,
} from "../../statistics";
import {
  formatStatisticsPeriodLabel,
  isCurrentStatisticsPeriod,
  shiftStatisticsPeriodAnchor,
} from "../../statistics/statisticsUtils";

type TrackingTab = "objectives" | "statistics";
export interface TrackingScreenProps {
  material?: Material;
  canAccessStatistics: boolean;
  onCompareStatisticsPlans: () => void;
  onSelectTab: (tab: MainTabId) => void;
  onCreate: (target: GlobalCreateTarget) => void;
  onCreateObjective: () => void;
  onOpenObjective: (id: number) => void;
  onOpenEvent: (id: number) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
}

export function TrackingScreen({
  material = "solid",
  canAccessStatistics,
  onCompareStatisticsPlans,
  onSelectTab,
  onCreate,
  onCreateObjective,
  onOpenObjective,
  onOpenEvent,
  onNotifications = () => undefined,
  onAccount = () => undefined,
}: TrackingScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const animalsQuery = useAnimalsQuery();
  const objectivesQuery = useObjectifsQuery();
  const notificationsQuery = useNotificationsQuery();
  const [selectedAnimalId, setSelectedAnimalId] = useState<number>();
  const [statisticsAnimalSelection, setStatisticsAnimalSelection] = useState<
    "all" | number[]
  >("all");
  const [activeTab, setActiveTab] = useState<TrackingTab>("objectives");
  const [objectiveList, setObjectiveList] = useState<"active" | "all">(
    "active",
  );
  const [statisticsPeriod, setStatisticsPeriod] =
    useState<StatisticsPeriod>("month");
  const [statisticsAnchor, setStatisticsAnchor] = useState(() => new Date());
  const [selectedStatistic, setSelectedStatistic] =
    useState<StatisticDetailType>();
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const animals = sortAnimalsForWorkspace(animalsQuery.data ?? []);
  const objectives = objectivesQuery.data ?? [];
  const presentAnimals = animals.filter(
    (animal) => getAnimalPresence(animal) === "present",
  );
  const historicalAnimals = animals.filter(
    (animal) => getAnimalPresence(animal) === "history",
  );
  const selectedAnimalIds = useMemo(
    () =>
      statisticsAnimalSelection === "all"
        ? animals.map((animal) => animal.id)
        : statisticsAnimalSelection,
    [animals, statisticsAnimalSelection],
  );
  const hasSharedStatisticsAnimal = useMemo(
    () =>
      animals.some(
        (animal) =>
          selectedAnimalIds.includes(animal.id) && isSharedAnimal(animal),
      ),
    [animals, selectedAnimalIds],
  );
  const visibleObjectives = useMemo(
    () =>
      selectedAnimalId == null
        ? objectives
        : objectives.filter((objective) =>
            objective.animaux.includes(selectedAnimalId),
          ),
    [objectives, selectedAnimalId],
  );
  const objectiveState = resolveAsyncState({
    loading: objectivesQuery.isLoading || animalsQuery.isLoading,
    error: objectivesQuery.isError || animalsQuery.isError,
    hasData: objectives.length > 0,
  });
  const notifications = Array.isArray(notificationsQuery.data)
    ? notificationsQuery.data
    : [];
  const selectTrackingTab = (tab: TrackingTab) => {
    setSelectedStatistic(undefined);
    setActiveTab(tab);
  };
  const refresh = () =>
    void Promise.all([
      objectivesQuery.refetch(),
      animalsQuery.refetch(),
      notificationsQuery.refetch(),
    ]);
  const refreshing =
    objectivesQuery.isRefetching ||
    animalsQuery.isRefetching ||
    notificationsQuery.isRefetching;
  const selectCreate = (target: GlobalCreateTarget) => {
    setCreateOpen(false);
    onCreate(target);
  };
  const toggleStatisticAnimal = (animalId: number) =>
    setStatisticsAnimalSelection((current) =>
      current === "all"
        ? [animalId]
        : current.includes(animalId)
          ? current.filter((id) => id !== animalId)
          : [...current, animalId],
    );
  const changeStatisticsPeriod = (period: StatisticsPeriod) => {
    setStatisticsPeriod(period);
    setStatisticsAnchor(new Date());
  };
  const moveStatisticsPeriod = (direction: -1 | 1) =>
    setStatisticsAnchor((current) =>
      shiftStatisticsPeriodAnchor(statisticsPeriod, current, direction),
    );
  const statisticsRangeLabel = formatStatisticsPeriodLabel(
    statisticsPeriod,
    statisticsAnchor,
  );
  const statisticsNextDisabled = isCurrentStatisticsPeriod(
    statisticsPeriod,
    statisticsAnchor,
  );

  if (selectedStatistic)
    return (
      <StatisticDetailScreen
        type={selectedStatistic}
        animalIds={selectedAnimalIds}
        hasSharedAnimal={hasSharedStatisticsAnimal}
        animalSelector={
          <AnimalFilter
            mode="multiple"
            animals={presentAnimals}
            historicalAnimals={historicalAnimals}
            selectedAnimalIds={
              statisticsAnimalSelection === "all"
                ? []
                : statisticsAnimalSelection
            }
            allSelected={statisticsAnimalSelection === "all"}
            historyExpanded={historyExpanded}
            onToggle={toggleStatisticAnimal}
            onSelectAll={() => setStatisticsAnimalSelection("all")}
            onToggleHistory={() => setHistoryExpanded((value) => !value)}
          />
        }
        period={statisticsPeriod}
        periodAnchor={statisticsAnchor}
        periodLabel={statisticsRangeLabel}
        periodNextDisabled={statisticsNextDisabled}
        material={material}
        onPeriodChange={changeStatisticsPeriod}
        onPreviousPeriod={() => moveStatisticsPeriod(-1)}
        onNextPeriod={() => moveStatisticsPeriod(1)}
        onOpenEvent={onOpenEvent}
        onBack={() => setSelectedStatistic(undefined)}
      />
    );

  return (
    <>
      <RootScreen
        header={
          <TopBar
            title="Suivi"
            material={material}
            onNotifications={onNotifications}
            unreadNotifications={
              notifications.filter((item) => !item.is_read).length
            }
            onAccount={onAccount}
            avatarInitials={getInitials(user?.prenom)}
          />
        }
        bottomBar={
          <BottomBar
            items={tabs}
            activeId="tracking"
            onSelect={onSelectTab}
            material={material}
            testID="main-tabs"
          />
        }
        floatingAction={
          <FloatingActionButton
            accessibilityLabel="Créer"
            testID="tracking-create"
            onPress={() => setCreateOpen(true)}
            material={material}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        padded={false}
        testID="tracking-screen"
      >
        {activeTab === "statistics" && canAccessStatistics ? (
          <AnimalFilter
            mode="multiple"
            animals={presentAnimals}
            historicalAnimals={historicalAnimals}
            selectedAnimalIds={
              statisticsAnimalSelection === "all"
                ? []
                : statisticsAnimalSelection
            }
            allSelected={statisticsAnimalSelection === "all"}
            historyExpanded={historyExpanded}
            onToggle={toggleStatisticAnimal}
            onSelectAll={() => setStatisticsAnimalSelection("all")}
            onToggleHistory={() => setHistoryExpanded((value) => !value)}
          />
        ) : (
          <AnimalFilter
            animals={presentAnimals}
            historicalAnimals={historicalAnimals}
            selectedAnimalId={selectedAnimalId}
            historyExpanded={historyExpanded}
            onSelect={setSelectedAnimalId}
            onToggleHistory={() => setHistoryExpanded((value) => !value)}
          />
        )}
        <TrackingTabs
          activeTab={activeTab}
          onSelect={selectTrackingTab}
        />
        {activeTab === "statistics" && !canAccessStatistics ? (
          <View style={{ padding: spacing.md }}>
            <PremiumGate
              title="Statistiques Premium"
              message="Analysez les mesures, activités et dépenses de vos animaux avec l’abonnement Premium."
              onComparePlans={onCompareStatisticsPlans}
              testID="statistics-premium-gate"
            />
          </View>
        ) : activeTab === "statistics" ? (
          <StatisticsOverview
            animalIds={selectedAnimalIds}
            hasSharedAnimal={hasSharedStatisticsAnimal}
            period={statisticsPeriod}
            periodAnchor={statisticsAnchor}
            periodLabel={statisticsRangeLabel}
            periodNextDisabled={statisticsNextDisabled}
            material={material}
            onPeriodChange={changeStatisticsPeriod}
            onPreviousPeriod={() => moveStatisticsPeriod(-1)}
            onNextPeriod={() => moveStatisticsPeriod(1)}
            onOpenDetail={setSelectedStatistic}
          />
        ) : (
          <ObjectivesContent
            state={objectiveState}
            objectives={visibleObjectives}
            list={objectiveList}
            onListChange={setObjectiveList}
            animals={animals}
            selectedAnimalId={selectedAnimalId}
            onRetry={refresh}
            onOpen={onOpenObjective}
          />
        )}
      </RootScreen>
      <GlobalCreateMenu
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSelect={selectCreate}
        material={material}
      />
    </>
  );
}

type AnimalFilterProps = {
  animals: ReturnType<typeof sortAnimalsForWorkspace>;
  historicalAnimals: ReturnType<typeof sortAnimalsForWorkspace>;
  historyExpanded: boolean;
  onToggleHistory: () => void;
} & (
  | {
      mode?: "single";
      selectedAnimalId?: number;
      onSelect: (id?: number) => void;
    }
  | {
      mode: "multiple";
      selectedAnimalIds: readonly number[];
      allSelected: boolean;
      onToggle: (id: number) => void;
      onSelectAll: () => void;
    }
);

function AnimalFilter(props: AnimalFilterProps) {
  const multiple = props.mode === "multiple";
  const selectedIds = multiple ? props.selectedAnimalIds : [];
  const renderAnimal = (
    animal: ReturnType<typeof sortAnimalsForWorkspace>[number],
  ) => {
    const selected = multiple
      ? selectedIds.includes(animal.id)
      : props.selectedAnimalId === animal.id;
    const selectionOrder =
      multiple && selected ? selectedIds.indexOf(animal.id) + 1 : undefined;
    return (
      <AnimalSelectorItem
        key={animal.id}
        name={animal.nom}
        imageUrl={animal.imageUrl}
        selected={selected}
        selectionRole={multiple ? "checkbox" : "radio"}
        selectionOrder={selectionOrder}
        sharedFromGroup={isSharedAnimal(animal)}
        onPress={() =>
          multiple ? props.onToggle(animal.id) : props.onSelect(animal.id)
        }
        testID={`tracking-animal-${animal.id}`}
      />
    );
  };
  return (
    <ScrollView
      horizontal
      directionalLockEnabled
      alwaysBounceVertical={false}
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      style={{ flexGrow: 0 }}
      contentContainerStyle={{
        minWidth: "100%",
        paddingHorizontal: spacing.sm,
        paddingTop: spacing.xl,
        paddingBottom: spacing.md,
        alignItems: "flex-start",
      }}
    >
      <AnimalScopeItem
        selected={multiple ? props.allSelected : props.selectedAnimalId == null}
        onPress={() =>
          multiple ? props.onSelectAll() : props.onSelect(undefined)
        }
        testID="tracking-animal-all"
      />
      <View style={{ flexDirection: "row", alignItems: "flex-start" }}>
        {props.animals.map(renderAnimal)}
        {props.historicalAnimals.length ? (
          <AnimalSelectorMore
            expanded={props.historyExpanded}
            onPress={props.onToggleHistory}
            testID="tracking-animal-more"
          />
        ) : null}
        {props.historyExpanded
          ? props.historicalAnimals.map(renderAnimal)
          : null}
      </View>
    </ScrollView>
  );
}

function TrackingTabs({
  activeTab,
  onSelect,
}: {
  activeTab: TrackingTab;
  onSelect: (tab: TrackingTab) => void;
}) {
  return <TabBar items={[{ id: "objectives", label: "Objectifs" }, { id: "statistics", label: "Statistiques" }]} activeId={activeTab} onSelect={onSelect} fullWidthIndicator style={{ paddingHorizontal: spacing.md }} />;
}

function ObjectivesContent({
  state,
  objectives,
  list,
  onListChange,
  animals,
  selectedAnimalId,
  onRetry,
  onOpen,
}: {
  state: ReturnType<typeof resolveAsyncState>;
  objectives: ReturnType<typeof useObjectifsQuery>["data"];
  list: "active" | "all";
  onListChange: (value: "active" | "all") => void;
  animals: ReturnType<typeof sortAnimalsForWorkspace>;
  selectedAnimalId?: number;
  onRetry: () => void;
  onOpen: (id: number) => void;
}) {
  const items =
    list === "all"
      ? (objectives ?? [])
      : (objectives ?? []).filter(
          (objective) => getObjectiveProgress(objective) < 1,
        );
  return (
    <View style={{ padding: spacing.md, gap: spacing.md }}>
      <SectionHeader
        label={list === "active" ? "En cours" : "Tous"}
        count={items.length}
        actionLabel={list === "active" ? "Voir tous" : "Voir moins"}
        onAction={() => onListChange(list === "active" ? "all" : "active")}
      />
      {state === "loading" ? (
        <>
          <Skeleton type="card" density="comfortable" />
          <Skeleton type="card" density="comfortable" />
        </>
      ) : state === "error" ? (
        <ErrorState
          message="Impossible de charger les objectifs."
          onRetry={onRetry}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon="goal"
          title={
            selectedAnimalId == null
              ? `Aucun objectif${list === "active" ? " en cours" : ""}`
              : `Aucun objectif${list === "active" ? " en cours" : ""} pour cet animal`
          }
          message="Le bouton + permet de créer un nouvel objectif."
        />
      ) : (
        items.map((objective) => {
          const progress = getObjectiveProgress(objective);
          const completed = progress >= 1;
          const overdue =
            !completed && new Date(objective.datefin).getTime() < Date.now();
          return (
            <ObjectiveCard
              key={objective.id}
              title={objective.title}
              status={completed ? "completed" : overdue ? "overdue" : "active"}
              statusLabel={
                completed
                  ? "Objectif atteint"
                  : `${objective.sousetapes.filter((step) => ["done", "completed", "termine", "terminé", "true"].includes(String(step.state).toLowerCase())).length} / ${objective.sousetapes.length} étapes`
              }
              progress={progress}
              endLabel={formatObjectivePeriod(
                objective.datedebut,
                objective.datefin,
              )}
              animals={getLinkedAnimals(objective.animaux, animals)}
              onPress={() => onOpen(objective.id)}
              testID={`tracking-objective-${objective.id}`}
            />
          );
        })
      )}
    </View>
  );
}
