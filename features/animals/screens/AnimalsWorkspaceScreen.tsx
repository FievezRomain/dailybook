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
import { openDocumentWithCache, shareMedicalRecord, uploadFile } from "../../../services/aws/FileStorageService";
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
  MediaViewer,
  MetricCard,
  PremiumGate,
  RootScreen,
  Skeleton,
  TabBar,
  TopBar,
  resolveAsyncState,
  type GlobalCreateTarget,
  FormSheet,
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
  getVisualTrackingMonths,
  isSharedAnimal,
  normalizeAnimalPictures,
  resolveAnimalSelection,
  sortAnimalsForWorkspace,
  type AnimalPicture,
} from "../animalWorkspaceUtils";
import { AnimalMeasurementSheet } from "../components/AnimalMeasurementSheet";
import { getMeasurementSummary } from "../animalMeasurementUtils";
import { getCachedImageSource } from "../../../shared/utils/mediaCache";

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
  onOpenEvent?: (eventId: number) => void;
  canAccessVisualTracking?: boolean;
  onVisualTrackingLocked?: () => void;
  canAccessMedicalDocuments?: boolean;
  onMedicalDocumentsLocked?: () => void;
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
  onOpenEvent,
  canAccessVisualTracking = false,
  onVisualTrackingLocked = () => undefined,
  canAccessMedicalDocuments = false,
  onMedicalDocumentsLocked = () => undefined,
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
  const [measurementType, setMeasurementType] = useState<"poids" | "taille">();
  const [medicalDocument, setMedicalDocument] = useState<{
    name: string;
    uri: string;
    type: "image" | "document";
  }>();
  const [medicalDocumentError, setMedicalDocumentError] = useState<string>();
  const [sharingMedicalRecord, setSharingMedicalRecord] = useState(false);
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
    canAccessVisualTracking,
  );
  const bodyPictures = normalizeAnimalPictures(picturesQuery.data);
  const trackingMonths = useMemo(() => getVisualTrackingMonths(), []);
  const [pictureMonth, setPictureMonth] = useState<string>();
  const [pictureAction, setPictureAction] = useState<"delete" | "replace">();
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
  const addPicture = async (date = new Date().toISOString().slice(0, 10)) => {
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
      body: { idanimal: selected.id, filename: uploaded, date_enregistrement: date },
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
            <View accessibilityRole="radiogroup" accessibilityLabel="Choisir un animal">
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
            <TabBar
              items={workspaceTabs}
              activeId={workspaceTab}
              onSelect={setWorkspaceTab}
              fullWidthIndicator
              style={{ paddingHorizontal: spacing.md }}
            />
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
                  canAccessDocuments={canAccessMedicalDocuments}
                  onDocumentsLocked={onMedicalDocumentsLocked}
                  sharingRecord={sharingMedicalRecord}
                  onShareRecord={canManageSelected ? async () => {
                    setSharingMedicalRecord(true);
                    setMedicalDocumentError(undefined);
                    try {
                      await shareMedicalRecord(String(selected.id), `dossier-medical-${selected.nom}.pdf`);
                    } catch {
                      setMedicalDocumentError("Impossible de préparer le dossier médical. Vérifiez votre connexion puis réessayez.");
                    } finally {
                      setSharingMedicalRecord(false);
                    }
                  } : undefined}
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
                  pictures={bodyPictures}
                  picturesLoading={picturesQuery.isLoading}
                  picturesError={picturesQuery.isError}
                  onRetryPictures={() => void picturesQuery.refetch()}
                  onVisualTrackingLocked={onVisualTrackingLocked}
                  onAddPicture={() => setPictureMonth(trackingMonths[0].key)}
                  onOpenPicture={setSelectedPicture}
                  onAddMeasure={() => setMeasurementType("poids")}
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
            if (action === "event" && documentAction) {
              onOpenEvent?.(documentAction.eventId);
              setDocumentAction(undefined);
            }
            if (action === "share" && documentAction) {
              setMedicalDocumentError(undefined);
              void getEventDocumentUrl(String(documentAction.eventId), documentAction.name)
                .then((uri) => openDocumentWithCache(uri, documentAction.name))
                .then(() => setDocumentAction(undefined))
                .catch(() => setMedicalDocumentError("Impossible de partager ce document. Vérifiez votre connexion puis réessayez."));
            }
            if (action === "delete") setDeleteDocumentOpen(true);
          }}
          items={[
            { id: "open", label: "Ouvrir", icon: "file" },
            { id: "event", label: "Voir l’événement", icon: "calendar" },
            { id: "share", label: "Partager", icon: "share" },
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
      />
      {selected && pictureMonth ? (
        <FormSheet
          title="Photo de suivi"
          onBack={() => setPictureMonth(undefined)}
          onClose={() => setPictureMonth(undefined)}
          footer={(() => {
            const existing = bodyPictures.find((picture) => picture.recordedAt?.slice(0, 7) === pictureMonth);
            const month = trackingMonths.find((item) => item.key === pictureMonth);
            if (existing) return <View style={{ gap: spacing.sm, paddingHorizontal: spacing.md }}><Button label="Remplacer la photo" fullWidth size="large" onPress={() => setPictureAction("replace")} /><Button label="Supprimer la photo" variant="destructive" fullWidth size="large" onPress={() => setPictureAction("delete")} /></View>;
            return <View style={{ paddingHorizontal: spacing.md }}><Button label="Choisir une photo" fullWidth size="large" onPress={() => { setPictureMonth(undefined); void addPicture(month?.date); }} /></View>;
          })()}
          testID="animal-visual-tracking-sheet"
        >
          <BodyText>Choisissez un mois parmi les 12 derniers mois.</BodyText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: spacing.sm }}>
            {trackingMonths.map((month) => {
              const occupied = bodyPictures.some((picture) => picture.recordedAt?.slice(0, 7) === month.key);
              const selectedMonth = pictureMonth === month.key;
              return <Pressable key={month.key} accessibilityRole="radio" accessibilityState={{ selected: selectedMonth }} accessibilityLabel={`${month.label}${occupied ? ", photo ajoutée" : ""}`} onPress={() => setPictureMonth(month.key)} style={{ width: "31%", minHeight: 72, padding: spacing.sm, justifyContent: "center", borderWidth: selectedMonth ? 2 : 1, borderColor: selectedMonth ? colors.primary : colors.border, borderRadius: radii.lg, backgroundColor: occupied ? colors.surfaceVariant : colors.surface }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, textAlign: "center", textTransform: "capitalize" }}>{month.label}</Text>{occupied ? <Text style={{ color: colors.primary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs, textAlign: "center" }}>Photo ajoutée</Text> : null}</Pressable>;
            })}
          </View>
        </FormSheet>
      ) : null}
      <Dialog open={Boolean(pictureAction)} type="destructive" title={pictureAction === "replace" ? "Remplacer la photo ?" : "Supprimer cette photo ?"} description={pictureAction === "replace" ? "La photo actuelle sera supprimée avant d’en choisir une nouvelle." : "Cette photo de suivi sera supprimée définitivement."} confirmLabel={pictureAction === "replace" ? "Supprimer et remplacer" : "Supprimer"} loading={mutations.deleteBodyPicture.isPending} onClose={() => setPictureAction(undefined)} onConfirm={async () => { if (!selected || !pictureMonth) return; const existing = bodyPictures.find((picture) => picture.recordedAt?.slice(0, 7) === pictureMonth); const month = trackingMonths.find((item) => item.key === pictureMonth); if (!existing) return; await mutations.deleteBodyPicture.mutateAsync({ animalId: String(selected.id), pictureId: existing.id }); const replace = pictureAction === "replace"; setPictureAction(undefined); setPictureMonth(undefined); if (replace) await addPicture(month?.date); }} testID="animal-visual-picture-action-dialog" />
      {selected && canManageSelected && measurementType ? (
        <AnimalMeasurementSheet
          animal={selected}
          initialType={measurementType}
          onClose={() => setMeasurementType(undefined)}
          onSaved={() => setMeasurementType(undefined)}
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
          size={componentTokens.content.animalProfileAvatarSize}
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
  canAccessDocuments,
  onDocumentsLocked,
  sharingRecord,
  onShareRecord,
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
  canAccessDocuments: boolean;
  onDocumentsLocked: () => void;
  sharingRecord: boolean;
  onShareRecord?: () => void;
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
      <SectionHeading onActions={onActions}>Dossier médical</SectionHeading>
      {canAccessDocuments && onShareRecord ? <Button label="Partager le dossier médical" icon="share" variant="secondary" fullWidth loading={sharingRecord} disabled={sharingRecord} onPress={onShareRecord} /> : null}
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
      {!canAccessDocuments ? (
        <PremiumGate
          title="Documents médicaux Premium"
          message="Centralisez et consultez les documents médicaux de votre animal avec l’abonnement Premium."
          onComparePlans={onDocumentsLocked}
          testID="medical-documents-premium-gate"
        />
      ) : (
        <>
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
              metadata={`${document.eventName} · ${formatAnimalDate(document.eventDate) ?? document.eventType}`}
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
        </>
      )}
    </View>
  );
}

function AnimalBody({
  animal,
  canManage,
  canAccessVisualTracking,
  pictures,
  picturesLoading,
  picturesError,
  onRetryPictures,
  onVisualTrackingLocked,
  onAddPicture,
  onOpenPicture,
  onAddMeasure,
  onActions,
}: {
  animal: Animal;
  canManage: boolean;
  canAccessVisualTracking: boolean;
  pictures: AnimalPicture[];
  picturesLoading: boolean;
  picturesError: boolean;
  onRetryPictures: () => void;
  onVisualTrackingLocked: () => void;
  onAddPicture: () => void;
  onOpenPicture: (picture: AnimalPicture) => void;
  onAddMeasure: () => void;
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
          />
        </View>
        <View style={{ flex: 1 }}>
          <MetricCard
            label="Taille"
            value={height.value}
            trend={height.trend}
            trendLabel={height.trendLabel}
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
      {!canAccessVisualTracking ? (
        <PremiumGate
          title="Suivi visuel Premium"
          message="Ajoutez et comparez les photos d’évolution de votre animal avec l’abonnement Premium."
          onComparePlans={onVisualTrackingLocked}
          testID="visual-tracking-premium-gate"
        />
      ) : !canManage ? (
        <VisualTrackingCarousel animal={animal} pictures={pictures} loading={picturesLoading} error={picturesError} onRetry={onRetryPictures} onOpen={onOpenPicture} />
      ) : (
        <VisualTrackingCarousel animal={animal} pictures={pictures} loading={picturesLoading} error={picturesError} onRetry={onRetryPictures} onAdd={onAddPicture} onOpen={onOpenPicture} />
      )}
    </View>
  );
}

function VisualTrackingCarousel({ animal, pictures, loading, error, onRetry, onAdd, onOpen }: { animal: Animal; pictures: AnimalPicture[]; loading: boolean; error: boolean; onRetry: () => void; onAdd?: () => void; onOpen: (picture: AnimalPicture) => void }) {
  const { colors } = useAppTheme();
  const [carouselWidth, setCarouselWidth] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const ordered = [...pictures].sort((a, b) => (b.recordedAt ?? "").localeCompare(a.recordedAt ?? ""));

  useEffect(() => setActiveIndex((index) => Math.min(index, Math.max(ordered.length - 1, 0))), [ordered.length]);

  return <View style={{ gap: spacing.md }}>
    {error && pictures.length ? <Banner tone="error" title="Mise à jour impossible" message="Les photos déjà chargées restent disponibles." blocking onDismiss={undefined} /> : null}
    {loading ? <Skeleton type="card" density="comfortable" /> : error && !pictures.length ? <ErrorState message="Impossible de charger le suivi visuel." onRetry={onRetry} /> : ordered.length ? <View onLayout={(event) => setCarouselWidth(event.nativeEvent.layout.width)} style={{ width: "100%", gap: spacing.sm }}>{carouselWidth ? <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} decelerationRate="fast" onMomentumScrollEnd={(event) => setActiveIndex(Math.round(event.nativeEvent.contentOffset.x / carouselWidth))} accessibilityLabel="Photos d’évolution physique, de la plus récente à la plus ancienne">{ordered.map((picture) => <Pressable key={picture.id} accessibilityRole="button" accessibilityLabel={`Ouvrir la photo de ${formatPictureMonth(picture.recordedAt)}`} onPress={() => onOpen(picture)} style={{ width: carouselWidth, gap: spacing.sm }}><Image source={getCachedImageSource(picture.uri)} cachePolicy="memory-disk" contentFit="cover" style={{ width: "100%", aspectRatio: 4 / 3, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }} accessibilityLabel={`Évolution de ${animal.nom}, ${formatPictureMonth(picture.recordedAt)}`} /><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, textAlign: "center", textTransform: "capitalize" }}>{formatPictureMonth(picture.recordedAt)}</Text></Pressable>)}</ScrollView> : null}<View accessibilityRole="text" accessibilityLabel={`Photo ${activeIndex + 1} sur ${ordered.length}`} style={{ flexDirection: "row", justifyContent: "center", gap: spacing.xs }}>{ordered.map((picture, index) => <View key={picture.id} style={{ width: 8, height: 8, borderRadius: radii.full, backgroundColor: index === activeIndex ? colors.primary : colors.border }} />)}</View></View> : <EmptyState title={`Aucune photo pour ${animal.nom}`} message="Ajoutez une photo pour suivre son évolution physique." />}
    {onAdd ? <Button label="Gérer les photos" icon="add" variant="secondary" size="large" fullWidth onPress={onAdd} /> : null}
  </View>;
}

function formatPictureMonth(value?: string) {
  if (!value) return "Date inconnue";
  return new Intl.DateTimeFormat("fr-FR", { month: "long", year: "numeric" }).format(new Date(`${value.slice(0, 10)}T12:00:00`));
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
