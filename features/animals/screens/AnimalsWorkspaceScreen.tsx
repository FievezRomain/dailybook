import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { getEventDocumentUrl } from "../../../services/api/EventService";
import {
  useAnimalBodyPicturesQuery,
  useAnimalHistoryQuery,
  useAnimalMutations,
  useAnimalsQuery,
} from "../../../hooks/queries/useAnimalsQuery";
import { uploadFile } from "../../../services/aws/FileStorageService";
import {
  useEventMutations,
  useEventsQuery,
} from "../../../hooks/queries/useEventsQuery";
import { useNotificationsQuery } from "../../../hooks/queries/useNotificationsQuery";
import { useAuthStore } from "../../../stores/useAuthStore";
import type { Animal } from "../../../models/Animal";
import {
  ActionMenu,
  Avatar,
  AnimalSelectorItem,
  AnimalSelectorMore,
  Banner,
  BottomBar,
  Button,
  Card,
  Dialog,
  EmptyState,
  ErrorState,
  EventCard,
  FileItem,
  FloatingActionButton,
  GlobalCreateMenu,
  Icon,
  MediaUpload,
  MediaViewer,
  MetricCard,
  PremiumGate,
  RootScreen,
  Skeleton,
  TopBar,
  resolveAsyncState,
  type GlobalCreateTarget,
} from "../../../shared/components/ui";
import type { Material } from "../../../theme/materials";
import { componentTokens } from "../../../theme/componentTokens";
import { radii, spacing, typography } from "../../../theme/scales";
import { useAppTheme } from "../../../theme/useAppTheme";
import {
  getEventDate,
  getInitials,
  toEventCardType,
} from "../../home/homeUtils";
import { tabs, type MainTabId } from "../../home/mainTabs";
import {
  formatAnimalDate,
  compactAnimalDetails,
  getAnimalMedicalDocuments,
  getAnimalMedicalEvents,
  getAnimalPresence,
  hasAnimalBodyPictureForMonth,
  isSharedAnimal,
  normalizeAnimalPictures,
  resolveAnimalSelection,
  sortAnimalsForWorkspace,
  type AnimalPicture,
} from "../animalWorkspaceUtils";
import { AnimalMeasurementSheet } from "../components/AnimalMeasurementSheet";
import { AnimalMeasurementHistorySheet } from "../components/AnimalMeasurementHistorySheet";
import { getMeasurementSummary } from "../animalMeasurementUtils";

type WorkspaceTab = "infos" | "health" | "body";
type AnimalAction = "edit" | "departure" | "death" | "delete";

export interface AnimalsWorkspaceScreenProps {
  material?: Material;
  onSelectTab: (tab: MainTabId) => void;
  onNotifications?: () => void;
  onAccount?: () => void;
  onCreate: (target: GlobalCreateTarget) => void;
  onAnimalAction?: (action: AnimalAction, animalId: number) => void;
  onAddHealth?: (animalId: number) => void;
  onAddBodyPicture?: (animalId: number) => void;
  onAddGalleryPicture?: (animalId: number) => void;
  onOpenEvent?: (eventId: number) => void;
  canAccessVisualTracking?: boolean;
  onVisualTrackingLocked?: () => void;
  preferredAnimalId?: number;
  feedback?: string;
  onDismissFeedback?: () => void;
}

const workspaceTabs: readonly { id: WorkspaceTab; label: string }[] = [
  { id: "infos", label: "Informations" },
  { id: "health", label: "Santé" },
  { id: "body", label: "Physique" },
];

export function AnimalsWorkspaceScreen({
  material = "solid",
  onSelectTab,
  onNotifications = () => undefined,
  onAccount = () => undefined,
  onCreate,
  onAnimalAction,
  onAddHealth,
  onAddBodyPicture,
  onAddGalleryPicture,
  onOpenEvent,
  canAccessVisualTracking = false,
  onVisualTrackingLocked = () => undefined,
  preferredAnimalId,
  feedback,
  onDismissFeedback,
}: AnimalsWorkspaceScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const animalsQuery = useAnimalsQuery();
  const mutations = useAnimalMutations();
  const notificationsQuery = useNotificationsQuery();
  const eventsQuery = useEventsQuery();
  const eventMutations = useEventMutations();
  const animals = useMemo(
    () => sortAnimalsForWorkspace(animalsQuery.data ?? []),
    [animalsQuery.data],
  );
  const [selectedId, setSelectedId] = useState<number | undefined>(
    preferredAnimalId,
  );
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>("infos");
  const [createOpen, setCreateOpen] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<AnimalPicture>();
  const [deletePictureOpen, setDeletePictureOpen] = useState(false);
  const [measurementType, setMeasurementType] = useState<"poids" | "taille">();
  const [measurementHistoryType, setMeasurementHistoryType] = useState<
    "poids" | "taille"
  >();
  const [medicalDocument, setMedicalDocument] = useState<{
    name: string;
    uri: string;
    type: "image" | "document";
  }>();
  const [medicalDocumentError, setMedicalDocumentError] = useState<string>();
  const [documentAction, setDocumentAction] = useState<{
    eventId: number;
    name: string;
  }>();
  const [documentActionsOpen, setDocumentActionsOpen] = useState(false);
  const [deleteDocumentOpen, setDeleteDocumentOpen] = useState(false);
  const appliedPreferredAnimalId = useRef<number | undefined>(undefined);
  const selected =
    animals.find((animal) => animal.id === selectedId) ?? animals[0];
  const canManageSelected = selected ? !isSharedAnimal(selected) : false;
  const picturesQuery = useAnimalBodyPicturesQuery(
    selected ? String(selected.id) : "",
  );
  const bodyPictures = normalizeAnimalPictures(picturesQuery.data);
  const hasCurrentMonthPicture = hasAnimalBodyPictureForMonth(bodyPictures);
  const present = animals.filter(
    (animal) => getAnimalPresence(animal) === "present",
  );
  const history = animals.filter(
    (animal) => getAnimalPresence(animal) === "history",
  );
  const notifications = Array.isArray(notificationsQuery.data)
    ? notificationsQuery.data
    : [];
  const unread = notifications.filter(
    (notification) => !notification.is_read,
  ).length;
  const animalsState = resolveAsyncState({
    loading: animalsQuery.isLoading,
    error: animalsQuery.isError,
    hasData: animals.length > 0,
  });

  useEffect(() => {
    const resolved = resolveAnimalSelection(animals, selectedId);
    if (resolved !== selectedId) setSelectedId(resolved);
  }, [animals, selectedId]);

  useEffect(() => {
    if (
      preferredAnimalId != null &&
      appliedPreferredAnimalId.current !== preferredAnimalId &&
      animals.some((animal) => animal.id === preferredAnimalId)
    ) {
      appliedPreferredAnimalId.current = preferredAnimalId;
      setSelectedId(preferredAnimalId);
    }
  }, [animals, preferredAnimalId]);

  useEffect(() => {
    if (documentAction) setDocumentActionsOpen(true);
  }, [documentAction]);

  const refresh = () =>
    void Promise.all([
      animalsQuery.refetch(),
      notificationsQuery.refetch(),
      eventsQuery.refetch(),
      selected ? picturesQuery.refetch() : Promise.resolve(),
    ]);
  const addPicture = async () => {
    if (!selected || mutations.addBodyPicture.isPending) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (result.canceled) return;
    const asset = result.assets[0];
    const filename = asset.fileName || `animal-${Date.now()}.jpg`;
    const uploaded = await uploadFile(
      asset.uri,
      filename,
      asset.mimeType || "image/jpeg",
      "body",
      String(selected.id),
    );
    if (!uploaded) return;
    await mutations.addBodyPicture.mutateAsync({
      animalId: String(selected.id),
      body: { idanimal: selected.id, filename: uploaded },
    });
  };
  const selector = (items: typeof animals) =>
    items.map((animal) => (
      <AnimalSelectorItem
        key={animal.id}
        name={animal.nom}
        imageUrl={animal.imageUrl}
        selected={selected?.id === animal.id}
        selectionRole="radio"
        sharedFromGroup={isSharedAnimal(animal)}
        onPress={() => setSelectedId(animal.id)}
        testID={`workspace-animal-${animal.id}`}
      />
    ));
  const header = (
    <TopBar
      title="Animaux"
      material={material}
      onNotifications={onNotifications}
      unreadNotifications={unread}
      onAccount={onAccount}
      avatarInitials={getInitials(user?.prenom)}
    />
  );
  const bottomBar = (
    <BottomBar
      items={tabs}
      activeId="animals"
      onSelect={onSelectTab}
      material={material}
      testID="main-tabs"
    />
  );

  const selectCreate = (target: GlobalCreateTarget) => {
    setCreateOpen(false);
    onCreate(target);
  };
  return (
    <>
      <RootScreen
        header={header}
        bottomBar={bottomBar}
        padded={false}
        floatingAction={
          <FloatingActionButton
            accessibilityLabel="Créer"
            testID="animals-create"
            onPress={() => setCreateOpen(true)}
            material={material}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={animalsQuery.isRefetching}
            onRefresh={refresh}
          />
        }
        testID="animals-workspace"
      >
        {feedback ? (
          <View
            style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm }}
          >
            <Banner
              tone="success"
              title="Animal enregistré"
              message={feedback}
              onDismiss={onDismissFeedback}
              testID="animal-save-success"
            />
          </View>
        ) : null}
        {animalsState === "loading" ? (
          <View style={{ padding: spacing.md, gap: spacing.md }}>
            <Skeleton type="profile" density="comfortable" />
            <Skeleton type="card" density="comfortable" />
          </View>
        ) : animalsState === "error" ? (
          <View style={{ flex: 1, padding: spacing.md }}>
            <ErrorState
              message="Impossible de charger vos animaux."
              onRetry={refresh}
            />
          </View>
        ) : animalsState === "empty" ? (
          <View style={{ flex: 1, padding: spacing.md }}>
            <EmptyState
              title="Aucun animal pour le moment"
              message="Ajoutez votre premier animal pour commencer son carnet Vasco."
              actionLabel="Ajouter un animal"
              onAction={() => selectCreate("animal")}
            />
          </View>
        ) : (
          <>
            {animalsQuery.isError ? (
              <View
                style={{
                  paddingHorizontal: spacing.md,
                  paddingTop: spacing.sm,
                }}
              >
                <Banner
                  tone="error"
                  title="Mise à jour impossible"
                  message="Les dernières données disponibles restent affichées."
                  blocking
                  onDismiss={undefined}
                />
              </View>
            ) : null}
            <View
              accessibilityRole="radiogroup"
              accessibilityLabel="Choisir un animal"
              style={{ paddingTop: spacing.xl }}
            >
              <ScrollView
                horizontal
                directionalLockEnabled
                alwaysBounceVertical={false}
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{
                  minWidth: "100%",
                  paddingHorizontal: spacing.sm,
                  gap: 4,
                }}
              >
                <View style={{ flexDirection: "row" }}>
                  {selector(present)}
                  {history.length ? (
                    <AnimalSelectorMore
                      expanded={historyExpanded}
                      onPress={() => setHistoryExpanded((value) => !value)}
                      testID="workspace-animal-more"
                    />
                  ) : null}
                  {historyExpanded ? selector(history) : null}
                </View>
              </ScrollView>
            </View>
            <View
              accessibilityRole="tablist"
              style={{
                height: 48,
                flexDirection: "row",
                paddingHorizontal: spacing.md,
              }}
            >
              {workspaceTabs.map((item) => {
                const active = workspaceTab === item.id;
                return (
                  <Pressable
                    key={item.id}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: active }}
                    onPress={() => setWorkspaceTab(item.id)}
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      borderBottomWidth: active ? 2 : 0,
                      borderBottomColor: colors.textPrimary,
                    }}
                  >
                    <Text
                      style={{
                        color: active
                          ? colors.textPrimary
                          : colors.textSecondary,
                        fontFamily: active
                          ? typography.fonts.semiBold
                          : typography.fonts.medium,
                        fontSize: active
                          ? typography.sizes.md
                          : typography.sizes.control,
                      }}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <View style={{ padding: spacing.md }}>
              {workspaceTab === "infos" ? (
                <AnimalInfos
                  animal={selected}
                  onActions={
                    canManageSelected ? () => setActionsOpen(true) : undefined
                  }
                />
              ) : workspaceTab === "health" ? (
                <AnimalHealth
                  animal={selected}
                  events={eventsQuery.data ?? []}
                  loading={eventsQuery.isLoading}
                  error={eventsQuery.isError}
                  onRetry={() => void eventsQuery.refetch()}
                  onActions={
                    canManageSelected ? () => setActionsOpen(true) : undefined
                  }
                  onOpenEvent={onOpenEvent}
                  documentError={medicalDocumentError}
                  onOpenDocument={async (eventId, name) => {
                    setMedicalDocumentError(undefined);
                    try {
                      const uri = await getEventDocumentUrl(
                        String(eventId),
                        name,
                      );
                      setMedicalDocument({
                        name,
                        uri,
                        type: name.toLowerCase().endsWith(".pdf")
                          ? "document"
                          : "image",
                      });
                    } catch {
                      setMedicalDocumentError(
                        "Impossible d’ouvrir ce document. Vérifiez votre connexion puis réessayez.",
                      );
                    }
                  }}
                  onDocumentMore={
                    canManageSelected
                      ? (eventId, name) => setDocumentAction({ eventId, name })
                      : undefined
                  }
                />
              ) : (
                <AnimalBody
                  animal={selected}
                  canManage={canManageSelected}
                  canAccessVisualTracking={canAccessVisualTracking}
                  hasCurrentMonthPicture={hasCurrentMonthPicture}
                  onVisualTrackingLocked={onVisualTrackingLocked}
                  onAddPicture={() =>
                    onAddBodyPicture
                      ? onAddBodyPicture(selected.id)
                      : void addPicture()
                  }
                  onAddMeasure={() => setMeasurementType("poids")}
                  onOpenMeasure={setMeasurementHistoryType}
                  onActions={
                    canManageSelected ? () => setActionsOpen(true) : undefined
                  }
                />
              )}
            </View>
          </>
        )}
        <GlobalCreateMenu
          open={createOpen}
          onClose={() => setCreateOpen(false)}
          onSelect={selectCreate}
          material={material}
        />
        <ActionMenu
          open={documentActionsOpen && !deleteDocumentOpen}
          title={documentAction?.name ?? "Document médical"}
          onClose={() => setDocumentActionsOpen(false)}
          onSelect={(action) => {
            if (action === "open" && documentAction) {
              void getEventDocumentUrl(
                String(documentAction.eventId),
                documentAction.name,
              )
                .then((uri) => {
                  setMedicalDocument({
                    name: documentAction.name,
                    uri,
                    type: documentAction.name.toLowerCase().endsWith(".pdf")
                      ? "document"
                      : "image",
                  });
                  setDocumentAction(undefined);
                })
                .catch(() =>
                  setMedicalDocumentError(
                    "Impossible d’ouvrir ce document. Vérifiez votre connexion puis réessayez.",
                  ),
                );
            }
            if (action === "delete") setDeleteDocumentOpen(true);
          }}
          items={[
            { id: "open", label: "Ouvrir", icon: "file" },
            {
              id: "delete",
              label: "Supprimer",
              icon: "delete",
              tone: "destructive",
            },
          ]}
          testID="medical-document-actions"
        />
        <Dialog
          open={deleteDocumentOpen}
          type="destructive"
          title="Supprimer ce document médical ?"
          description={`${documentAction?.name ?? "Ce document"} sera supprimé définitivement de l’événement associé.`}
          confirmLabel="Supprimer"
          loading={eventMutations.deleteDocument.isPending}
          onClose={() => {
            setDeleteDocumentOpen(false);
            setDocumentAction(undefined);
          }}
          onConfirm={async () => {
            if (!documentAction) return;
            setMedicalDocumentError(undefined);
            try {
              await eventMutations.deleteDocument.mutateAsync({
                eventId: String(documentAction.eventId),
                filename: documentAction.name,
              });
              setDocumentAction(undefined);
            } catch {
              setMedicalDocumentError(
                "Le document n’a pas pu être supprimé. Réessayez.",
              );
              throw new Error("delete-medical-document");
            }
          }}
          onError={() => undefined}
          testID="medical-document-delete-dialog"
        />
        <MediaViewer
          open={Boolean(medicalDocument)}
          uri={medicalDocument?.uri ?? ""}
          title={medicalDocument?.name ?? "Document médical"}
          type={medicalDocument?.type}
          onClose={() => setMedicalDocument(undefined)}
        />
      </RootScreen>
      {selected && canManageSelected ? (
        <ActionMenu
          open={actionsOpen}
          title={selected.nom}
          onClose={() => setActionsOpen(false)}
          onSelect={(action) => {
            setActionsOpen(false);
            onAnimalAction?.(action, selected.id);
          }}
          items={[
            { id: "edit", label: "Modifier", icon: "edit" },
            { id: "departure", label: "Signaler un départ", icon: "warning" },
            { id: "death", label: "Signaler un décès", icon: "warning" },
            {
              id: "delete",
              label: "Supprimer",
              icon: "delete",
              tone: "destructive",
            },
          ]}
        />
      ) : null}
      <MediaViewer
        open={Boolean(selectedPicture)}
        uri={selectedPicture?.uri ?? ""}
        title={selected ? `Photo de ${selected.nom}` : "Photo"}
        onClose={() => setSelectedPicture(undefined)}
        onDeleteRequest={
          canManageSelected ? () => setDeletePictureOpen(true) : undefined
        }
      />
      <Dialog
        open={deletePictureOpen}
        type="destructive"
        title="Supprimer cette photo ?"
        description="Cette photo de suivi sera supprimée définitivement."
        confirmLabel="Supprimer"
        loading={mutations.deleteBodyPicture.isPending}
        onClose={() => setDeletePictureOpen(false)}
        onConfirm={async () => {
          if (!selected || !selectedPicture) return;
          await mutations.deleteBodyPicture.mutateAsync({
            animalId: String(selected.id),
            pictureId: selectedPicture.id,
          });
          setSelectedPicture(undefined);
        }}
      />
      {selected && canManageSelected && measurementType ? (
        <AnimalMeasurementSheet
          animal={selected}
          initialType={measurementType}
          onClose={() => setMeasurementType(undefined)}
          onSaved={() => setMeasurementType(undefined)}
        />
      ) : null}
      {selected && measurementHistoryType ? (
        <AnimalMeasurementHistorySheet
          animal={selected}
          type={measurementHistoryType}
          readOnly={!canManageSelected}
          onClose={() => setMeasurementHistoryType(undefined)}
        />
      ) : null}
    </>
  );
}

const sectionLabel = {
  flexShrink: 0,
  fontFamily: typography.fonts.semiBold,
  fontSize: typography.sizes.xs,
} as const;

function AnimalInfos({
  animal,
  onActions,
}: {
  animal: Animal;
  onActions?: () => void;
}) {
  const { colors } = useAppTheme();
  const birth = formatAnimalDate(animal.datenaissance);
  const arrival = formatAnimalDate(animal.datearrivee);
  const departure = formatAnimalDate(animal.datedepart);
  const death = formatAnimalDate(animal.datedeces);
  const sections = [
    {
      title: "Profil",
      rows: [
        ["Espèce", animal.espece],
        ...(animal.race ? [["Race", animal.race]] : []),
        ...(animal.sexe ? [["Sexe", animal.sexe]] : []),
        ...(animal.couleur ? [["Couleur", animal.couleur]] : []),
      ],
    },
    {
      title: "Dates",
      rows: [
        ...(birth ? [["Naissance", birth]] : []),
        ...(arrival ? [["Arrivée", arrival]] : []),
        ...(departure ? [["Départ", departure]] : []),
        ...(death ? [["Décès", death]] : []),
      ],
    },
    {
      title: "Identité et origines",
      rows: [
        ...(animal.numeroidentification
          ? [["Identification", animal.numeroidentification]]
          : []),
        ...(animal.nompere ? [["Père", animal.nompere]] : []),
        ...(animal.nommere ? [["Mère", animal.nommere]] : []),
      ],
    },
    {
      title: "À savoir",
      rows: animal.informations
        ? [["Informations complémentaires", animal.informations]]
        : [],
    },
  ].filter((section) => section.rows.length > 0);
  return (
    <View style={{ gap: spacing.lg }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: spacing.md }}>
        <Avatar
          initials={animal.nom}
          imageUrl={animal.imageUrl}
          accessibilityLabel={`Photo de ${animal.nom}`}
          size={componentTokens.content.animalSelector.ringSize}
          backgroundColor={colors.surfaceVariant}
          borderColor={colors.primaryLight}
        />
        <View style={{ flex: 1, gap: spacing.xs }}>
          <Text
            style={{
              color: colors.textPrimary,
              fontFamily: typography.fonts.semiBold,
              fontSize: typography.sizes.xl,
              lineHeight: 28,
            }}
          >
            {animal.nom}
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: typography.fonts.regular,
              fontSize: typography.sizes.control,
              lineHeight: 20,
            }}
          >
            {compactAnimalDetails(animal)}
          </Text>
        </View>
        {onActions ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Actions pour ${animal.nom}`}
            onPress={onActions}
            style={({ pressed }) => ({
              width: 44,
              height: 44,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <Icon name="moreHorizontal" size="lg" color={colors.primaryDark} />
          </Pressable>
        ) : null}
      </View>
      {sections.map((section) => (
        <Card key={section.title} accessibilityLabel={section.title} style={{ gap: spacing.md }}>
          <Text
            style={{
              color: colors.primaryDark,
              fontFamily: typography.fonts.semiBold,
              fontSize: typography.sizes.md,
              lineHeight: 22,
            }}
          >
            {section.title}
          </Text>
          {section.rows.map(([label, value], index) => (
            <View
              key={label}
              style={{
                flexDirection: label === "Informations complémentaires" ? "column" : "row",
                alignItems: "flex-start",
                gap: spacing.md,
                paddingTop: index ? spacing.sm : 0,
                borderTopWidth: index ? 1 : 0,
                borderTopColor: colors.border,
              }}
            >
              <Text style={{ width: label === "Informations complémentaires" ? undefined : 112, color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control, lineHeight: 20 }}>{label}</Text>
              <Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{value}</Text>
            </View>
          ))}
        </Card>
      ))}
    </View>
  );
}

function SectionHeading({
  children,
  onActions,
}: {
  children: string;
  onActions?: () => void;
}) {
  const { colors } = useAppTheme();
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <Text
        style={{
          flex: 1,
          color: colors.textPrimary,
          fontFamily: typography.fonts.semiBold,
          fontSize: typography.sizes.lg,
          lineHeight: 24,
        }}
      >
        {children}
      </Text>
      {onActions ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Actions de l’animal"
          onPress={onActions}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            opacity: pressed ? 0.6 : 1,
          })}
        >
          <Icon name="moreHorizontal" size="lg" color={colors.primaryDark} />
        </Pressable>
      ) : null}
    </View>
  );
}

function AnimalHealth({
  animal,
  events,
  loading,
  error,
  onRetry,
  onActions,
  onOpenEvent,
  onOpenDocument,
  onDocumentMore,
  documentError,
}: {
  animal: Animal;
  events: readonly import("../../../models/Event").Event[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onActions?: () => void;
  onOpenEvent?: (eventId: number) => void;
  onOpenDocument: (eventId: number, name: string) => void;
  onDocumentMore?: (eventId: number, name: string) => void;
  documentError?: string;
}) {
  const medicalEvents = getAnimalMedicalEvents(events, animal.id);
  const history = [...medicalEvents].sort(
    (a, b) => getEventDate(b).getTime() - getEventDate(a).getTime(),
  );
  const documents = getAnimalMedicalDocuments(events, animal.id);
  if (error && !events.length)
    return (
      <View style={{ gap: spacing.md }}>
        <SectionHeading onActions={onActions}>Santé</SectionHeading>
        <ErrorState
          title="Santé indisponible"
          message="Impossible de charger les soins, rendez-vous et documents médicaux."
          onRetry={onRetry}
        />
      </View>
    );
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeading onActions={onActions}>Historique médical</SectionHeading>
      {error ? (
        <Banner
          tone="error"
          title="Mise à jour impossible"
          message="Les dernières données médicales restent affichées."
          blocking
          onDismiss={undefined}
        />
      ) : null}
      {loading ? (
        <Skeleton type="card" density="comfortable" />
      ) : history.length ? (
        history.map((event) => {
          const eventDate = getEventDate(event);
          return (
            <EventCard
              key={event.id}
              type={toEventCardType(event.eventtype)}
              date={new Intl.DateTimeFormat("fr-FR", {
                day: "numeric",
                month: "short",
              }).format(eventDate)}
              time={event.heuredebutevent}
              title={event.nom || event.eventtype}
              description={event.commentaire}
              onPress={onOpenEvent ? () => onOpenEvent(event.id) : undefined}
            />
          );
        })
      ) : (
        <EmptyState
          icon="medical"
          title="Aucun soin enregistré"
          message={`Les soins et rendez-vous médicaux de ${animal.nom} apparaîtront ici.`}
        />
      )}
      <SectionHeading>Documents médicaux</SectionHeading>
      {documentError ? (
        <Banner
          tone="error"
          title="Action impossible"
          message={documentError}
          blocking
          onDismiss={undefined}
        />
      ) : null}
      {loading ? (
        <Skeleton type="card" density="comfortable" />
      ) : documents.length ? (
        documents.map((document) => (
            <FileItem
              key={`${document.eventId}-${document.name}`}
              name={document.name}
              type={
                document.name.toLowerCase().endsWith(".pdf") ? "pdf" : "image"
              }
              metadata="Document médical"
              previewUrl={document.url}
              onOpen={() => onOpenDocument(document.eventId, document.name)}
              onMore={
                onDocumentMore
                  ? () => onDocumentMore(document.eventId, document.name)
                  : undefined
              }
            />
          ))
      ) : (
        <EmptyState
          icon="file"
          title="Aucun document médical"
          message="Les documents ajoutés aux soins et rendez-vous médicaux apparaîtront ici."
        />
      )}
    </View>
  );
}

function AnimalBody({
  animal,
  canManage,
  canAccessVisualTracking,
  hasCurrentMonthPicture,
  onVisualTrackingLocked,
  onAddPicture,
  onAddMeasure,
  onOpenMeasure,
  onActions,
}: {
  animal: Animal;
  canManage: boolean;
  canAccessVisualTracking: boolean;
  hasCurrentMonthPicture: boolean;
  onVisualTrackingLocked: () => void;
  onAddPicture: () => void;
  onAddMeasure: () => void;
  onOpenMeasure: (type: "poids" | "taille") => void;
  onActions?: () => void;
}) {
  const food = [
    animal.food,
    animal.quantity != null
      ? `${animal.quantity} ${animal.unity ?? ""}`.trim()
      : undefined,
  ]
    .filter(Boolean)
    .join(" · ");
  const weightHistory = useAnimalHistoryQuery(String(animal.id), "poids");
  const heightHistory = useAnimalHistoryQuery(String(animal.id), "taille");
  const weight = getMeasurementSummary(weightHistory.data ?? [], "kg");
  const height = getMeasurementSummary(heightHistory.data ?? [], "cm");
  return (
    <View style={{ gap: spacing.lg }}>
      <SectionHeading onActions={onActions}>Dernières mesures</SectionHeading>
      <View style={{ flexDirection: "row", gap: spacing.md }}>
        <View style={{ flex: 1 }}>
          <MetricCard
            label="Poids"
            value={weight.value}
            trend={weight.trend}
            trendLabel={weight.trendLabel}
            onPress={() => onOpenMeasure("poids")}
          />
        </View>
        <View style={{ flex: 1 }}>
          <MetricCard
            label="Taille"
            value={height.value}
            trend={height.trend}
            trendLabel={height.trendLabel}
            onPress={() => onOpenMeasure("taille")}
          />
        </View>
      </View>
      {canManage ? (
        <Button
          label="Ajouter une mesure"
          icon="add"
          variant="secondary"
          size="large"
          fullWidth
          onPress={onAddMeasure}
        />
      ) : null}
      <SectionHeading>Alimentation</SectionHeading>
      <BodyText>{food || "Non renseignée"}</BodyText>
      <SectionHeading>Suivi visuel</SectionHeading>
      {!canManage ? (
        <EmptyState
          icon="group"
          title="Suivi partagé en lecture seule"
          message="Seul le propriétaire peut ajouter des photos."
        />
      ) : canAccessVisualTracking ? (
        <MediaUpload
          state={hasCurrentMonthPicture ? "success" : "empty"}
          onPress={hasCurrentMonthPicture ? undefined : onAddPicture}
          success={{
            title: "Photo du mois enregistrée",
            description: "Vous pourrez en ajouter une nouvelle le mois prochain.",
          }}
          empty={{
            title: "Ajouter la photo du mois",
            description: "Une photo maximum par animal et par mois.",
          }}
        />
      ) : (
        <PremiumGate
          title="Suivi visuel Premium"
          message="Ajoutez et comparez les photos d’évolution de votre animal avec l’abonnement Premium."
          onComparePlans={onVisualTrackingLocked}
          testID="visual-tracking-premium-gate"
        />
      )}
    </View>
  );
}

function AnimalGallery({
  animal,
  pictures,
  loading,
  error,
  onRetry,
  onAdd,
  onOpen,
  onActions,
}: {
  animal: Animal;
  pictures: AnimalPicture[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  onAdd: () => void;
  onOpen: (picture: AnimalPicture) => void;
  onActions: () => void;
}) {
  const { colors } = useAppTheme();
  const state = resolveAsyncState({
    loading,
    error,
    hasData: pictures.length > 0,
  });
  return (
    <View style={{ gap: spacing.md }}>
      <SectionHeading onActions={onActions}>Galerie</SectionHeading>
      {error && state === "success" ? (
        <Banner
          tone="error"
          title="Mise à jour impossible"
          message="Les photos déjà chargées restent disponibles."
          blocking
          onDismiss={undefined}
        />
      ) : null}
      {state === "loading" ? (
        <>
          <Skeleton type="card" density="comfortable" />
          <Skeleton type="card" density="comfortable" />
        </>
      ) : state === "error" ? (
        <ErrorState
          message="Impossible de charger la galerie."
          onRetry={onRetry}
        />
      ) : state === "success" ? (
        <View
          style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}
        >
          {pictures.map((picture) => (
            <Pressable
              key={picture.id}
              accessibilityRole="button"
              accessibilityLabel={`Ouvrir une photo de ${animal.nom}`}
              onPress={() => onOpen(picture)}
              style={{ width: "48%", aspectRatio: 1 }}
            >
              <Image
                source={{ uri: picture.uri }}
                contentFit="cover"
                accessibilityLabel={`Souvenir de ${animal.nom}`}
                style={{
                  flex: 1,
                  borderRadius: radii.lg,
                  backgroundColor: colors.surfaceVariant,
                }}
              />
            </Pressable>
          ))}
        </View>
      ) : (
        <EmptyState
          title={`Aucun souvenir pour ${animal.nom}`}
          message="Ajoutez des photos pour suivre son évolution et conserver vos meilleurs moments."
          actionLabel="Ajouter"
          onAction={onAdd}
        />
      )}
    </View>
  );
}
function BodyText({ children }: { children: string }) {
  const { colors } = useAppTheme();
  return (
    <Text
      style={{
        color: colors.textPrimary,
        fontFamily: typography.fonts.regular,
        fontSize: typography.sizes.md,
        lineHeight: 22,
      }}
    >
      {children}
    </Text>
  );
}
