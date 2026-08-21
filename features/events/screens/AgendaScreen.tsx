import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { useAnimalsQuery } from "../../../hooks/queries/useAnimalsQuery";
import {
  useAgendaHighlightsQuery,
  useEventsQuery,
} from "../../../hooks/queries/useEventsQuery";
import { useNotificationsQuery } from "../../../hooks/queries/useNotificationsQuery";
import type { Notification } from "../../../models/Notification";
import type { Animal } from "../../../models/Animal";
import { useAuthStore } from "../../../stores/useAuthStore";
import { useCalendarUIStore } from "../../../stores/useCalendarUIStore";
import {
  Banner,
  AnimalSelectorItem,
  AnimalSelectorMore,
  Button,
  BottomBar,
  Card,
  EmptyState,
  EventCard,
  FloatingActionButton,
  GlobalCreateMenu,
  IconButton,
  InlineCalendar,
  RootScreen,
  SearchField,
  SelectionModal,
  Skeleton,
  TopBar,
  type GlobalCreateTarget,
} from "../../../shared/components/ui";
import { spacing, typography } from "../../../theme/scales";
import type { Material } from "../../../theme/materials";
import { useAppTheme } from "../../../theme/useAppTheme";
import {
  getEventDate,
  getInitials,
  getLinkedAnimals,
  toEventCardType,
} from "../../home/homeUtils";
import { tabs, type MainTabId } from "../../home/mainTabs";
import {
  agendaEventTypeOptions,
  buildAgendaMarks,
  dateKey,
  filterAgendaEvents,
  formatAgendaDay,
  formatAgendaEmptyMessage,
  groupAgendaHighlights,
} from "../agendaUtils";
import { getAnimalPresence, isSharedAnimal, sortAnimalsForWorkspace } from "../../animals/animalWorkspaceUtils";

export interface AgendaScreenProps {
  material?: Material;
  onSelectTab: (tab: MainTabId) => void;
  onOpenDay: (date: string) => void;
  onOpenEvent: (id: number) => void;
  onCreate: (target: GlobalCreateTarget, selectedDate?: string) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
}

export function AgendaScreen({
  material = "solid",
  onSelectTab,
  onOpenEvent,
  onCreate,
  onNotifications = () => undefined,
  onAccount = () => undefined,
}: AgendaScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const eventsQuery = useEventsQuery();
  const animalsQuery = useAnimalsQuery();
  const notificationsQuery = useNotificationsQuery();
  const storedDate = useCalendarUIStore((state) => state.selectedDate);
  const setStoredDate = useCalendarUIStore((state) => state.setDate);
  const selectedDate = storedDate ?? dateKey(new Date());
  const [visibleMonth, setVisibleMonth] = useState(selectedDate);
  const highlightsQuery = useAgendaHighlightsQuery(
    Number(visibleMonth.slice(0, 4)),
  );
  const [createOpen, setCreateOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [draftTypes, setDraftTypes] = useState<string[]>([]);
  const [selectedAnimalIds, setSelectedAnimalIds] = useState<number[]>([]);
  const [draftAnimalIds, setDraftAnimalIds] = useState<number[]>([]);
  const [animalHistoryExpanded, setAnimalHistoryExpanded] = useState(false);
  const events = eventsQuery.data ?? [];
  const animals = animalsQuery.data ?? [];
  const searchActive = query.trim().length > 0;
  const displayedEvents = useMemo(
    () => filterAgendaEvents(events, selectedDate, query, selectedTypes, selectedAnimalIds),
    [events, query, selectedAnimalIds, selectedDate, selectedTypes],
  );
  const marks = useMemo(
    () => buildAgendaMarks(events, colors),
    [colors, events],
  );
  const highlightsByDate = useMemo(
    () => groupAgendaHighlights(highlightsQuery.data ?? []),
    [highlightsQuery.data],
  );
  const selectedHighlights = highlightsByDate[selectedDate] ?? [];
  const notifications: Notification[] = Array.isArray(notificationsQuery.data)
    ? notificationsQuery.data
    : [];
  const unread = notifications.filter((item) => !item.is_read).length;
  const refreshing =
    eventsQuery.isRefetching ||
    animalsQuery.isRefetching ||
    highlightsQuery.isRefetching;
  const refresh = () =>
    void Promise.all([
      eventsQuery.refetch(),
      animalsQuery.refetch(),
      highlightsQuery.refetch(),
    ]);
  const selectCreate = (target: GlobalCreateTarget) => {
    setCreateOpen(false);
    onCreate(target, target === "event" ? selectedDate : undefined);
  };

  return (
    <>
      <RootScreen
        header={
          <TopBar
            title="Agenda"
            material={material}
            onNotifications={onNotifications}
            unreadNotifications={unread}
            onAccount={onAccount}
            avatarInitials={getInitials(user?.prenom)}
          />
        }
        bottomBar={
          <BottomBar
            items={tabs}
            activeId="agenda"
            onSelect={onSelectTab}
            material={material}
          />
        }
        floatingAction={
          <FloatingActionButton
            accessibilityLabel="Créer"
            onPress={() => setCreateOpen(true)}
            material={material}
          />
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={refresh} />
        }
        contentContainerStyle={{ gap: spacing.md }}
        testID="events-agenda"
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: spacing.sm,
          }}
        >
          <View style={{ flex: 1 }}>
            <SearchField
              value={query}
              onChangeText={setQuery}
              onClear={() => setQuery("")}
              label="Rechercher un événement"
              placeholder="Rechercher un événement"
              noResults={searchActive && displayedEvents.length === 0}
            />
          </View>
          <IconButton
            icon="filter"
            accessibilityLabel={
              selectedTypes.length || selectedAnimalIds.length
                ? `Filtrer les événements, ${selectedTypes.length + selectedAnimalIds.length} filtre actif`
                : "Filtrer les événements"
            }
            variant={selectedTypes.length || selectedAnimalIds.length ? "primary" : "secondary"}
            onPress={() => {
              setDraftTypes(selectedTypes);
              setDraftAnimalIds(selectedAnimalIds);
              setFiltersOpen(true);
            }}
          />
        </View>
        <InlineCalendar
          current={visibleMonth}
          selectedDate={selectedDate}
          markedDates={marks}
          highlights={Object.fromEntries(
            Object.entries(highlightsByDate).map(([date, items]) => [
              date,
              items.map(({ title }) => title),
            ]),
          )}
          onSelectDate={(date) => {
            setSelectedTypes([]);
            setSelectedAnimalIds([]);
            setStoredDate(date);
          }}
          onMonthChange={setVisibleMonth}
        />
        <Text
          style={{
            color: colors.textPrimary,
            fontFamily: typography.fonts.semiBold,
            fontSize: typography.sizes.lg,
            lineHeight: 24,
          }}
        >
          {searchActive
            ? "Résultats de la recherche"
            : selectedTypes.length || selectedAnimalIds.length
              ? "Résultats des filtres"
            : formatAgendaDay(selectedDate)}
        </Text>
        {selectedHighlights.length ? (
          <Card
            accessibilityLabel="Événements marquants du jour"
            style={{ gap: spacing.sm }}
          >
            <Text
              style={{
                color: colors.textPrimary,
                fontFamily: typography.fonts.semiBold,
                fontSize: typography.sizes.md,
              }}
            >
              Événements marquants
            </Text>
            {selectedHighlights.map((highlight) => (
              <View
                key={highlight.id}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: spacing.sm,
                }}
              >
                <View
                  accessibilityElementsHidden
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: colors.error,
                  }}
                />
                <Text
                  style={{
                    flex: 1,
                    color: colors.textPrimary,
                    fontFamily: typography.fonts.regular,
                    fontSize: typography.sizes.control,
                    lineHeight: 20,
                  }}
                >
                  {highlight.title}
                </Text>
              </View>
            ))}
          </Card>
        ) : null}
        {eventsQuery.isLoading || animalsQuery.isLoading ? (
          <Skeleton type="card" density="comfortable" />
        ) : eventsQuery.isError ? (
          <>
            <Banner
              tone="error"
              title="Agenda indisponible"
              message="Vérifiez votre connexion puis réessayez."
              blocking
            />
            <EmptyState
              type="offline"
              onAction={() => void eventsQuery.refetch()}
            />
          </>
        ) : displayedEvents.length === 0 ? (
          <EmptyState
            icon="event"
            title={
              searchActive || selectedTypes.length || selectedAnimalIds.length
                ? "Aucun événement trouvé"
                : "Aucun événement ce jour"
            }
            message={
              searchActive || selectedTypes.length || selectedAnimalIds.length
                ? "Modifiez votre recherche ou réinitialisez les filtres."
                : formatAgendaEmptyMessage(selectedDate)
            }
            style={{ minHeight: 260 }}
          />
        ) : (
          displayedEvents.map((event) => {
            const eventDate = getEventDate(event);
            return (
              <EventCard
                key={event.id}
                type={toEventCardType(event.eventtype)}
                date={new Intl.DateTimeFormat("fr-FR", {
                  day: "numeric",
                  month: "short",
                }).format(eventDate)}
                time={
                  event.heuredebutevent
                    ? eventDate.toLocaleTimeString("fr-FR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : undefined
                }
                title={event.nom || event.eventtype}
                description={event.commentaire}
                animals={getLinkedAnimals(event.animaux, animals)}
                onPress={() => onOpenEvent(event.id)}
              />
            );
          })
        )}
      </RootScreen>
      <GlobalCreateMenu
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSelect={selectCreate}
        material={material}
      />
      <SelectionModal
        open={filtersOpen}
        title="Filtrer les événements"
        options={agendaEventTypeOptions.filter(({ id }) => id !== "__all")}
        selectedIds={draftTypes}
        mode="multi"
        onChange={setDraftTypes}
        searchable={false}
        allowEmptySelection
        header={<View style={{ gap: spacing.sm }}><View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.control }}>Animaux</Text><Button label="Réinitialiser" variant="ghost" size="small" onPress={() => { setDraftAnimalIds([]); setDraftTypes([]); }} /></View><AgendaAnimalSelector animals={animals} selectedIds={draftAnimalIds} historyExpanded={animalHistoryExpanded} onToggleHistory={() => setAnimalHistoryExpanded((value) => !value)} onToggle={(animalId) => setDraftAnimalIds((current) => current.includes(animalId) ? current.filter((id) => id !== animalId) : [...current, animalId])} /><View style={{ height: 1, backgroundColor: colors.border }} /><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.control }}>Types d’événement</Text></View>}
        confirmLabel={draftTypes.length || draftAnimalIds.length ? "Appliquer les filtres" : "Réinitialiser"}
        onConfirm={() => {
          setSelectedTypes(draftTypes);
          setSelectedAnimalIds(draftAnimalIds);
          setFiltersOpen(false);
        }}
        onClose={() => setFiltersOpen(false)}
        testID="agenda-filters"
      />
    </>
  );
}

function AgendaAnimalSelector({ animals, selectedIds, historyExpanded, onToggleHistory, onToggle }: { animals: readonly Animal[]; selectedIds: readonly number[]; historyExpanded: boolean; onToggleHistory: () => void; onToggle: (animalId: number) => void }) {
  const sorted = sortAnimalsForWorkspace(animals);
  const present = sorted.filter((animal) => getAnimalPresence(animal) === 'present');
  const historical = sorted.filter((animal) => getAnimalPresence(animal) === 'history');
  const renderAnimal = (animal: Animal) => {
    const selected = selectedIds.includes(animal.id);
    return <AnimalSelectorItem key={animal.id} name={animal.nom} imageUrl={animal.imageUrl} selected={selected} selectionOrder={selected ? selectedIds.indexOf(animal.id) + 1 : undefined} sharedFromGroup={isSharedAnimal(animal)} onPress={() => onToggle(animal.id)} />;
  };
  return <ScrollView horizontal directionalLockEnabled alwaysBounceVertical={false} nestedScrollEnabled showsHorizontalScrollIndicator={false} style={{ minHeight: 116, flexGrow: 0 }} contentContainerStyle={{ minWidth: '100%', paddingTop: spacing.sm, alignItems: 'flex-start' }}><View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>{present.map(renderAnimal)}{historical.length ? <AnimalSelectorMore expanded={historyExpanded} onPress={onToggleHistory} testID="agenda-animal-more" /> : null}{historyExpanded ? historical.map(renderAnimal) : null}</View></ScrollView>;
}
