import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { getEventDocumentUrl } from '../../../services/api/EventService';
import { useAnimalBodyPicturesQuery, useAnimalHistoryQuery, useAnimalMutations, useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { uploadFile } from '../../../services/aws/FileStorageService';
import { useEventMutations, useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { useNotificationsQuery } from '../../../hooks/queries/useNotificationsQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { Animal } from '../../../models/Animal';
import { ActionMenu, AnimalSelectorItem, AnimalSelectorMore, Banner, BottomBar, Button, Dialog, EmptyState, ErrorState, EventCard, FileItem, FloatingActionButton, GlobalCreateMenu, Icon, MediaUpload, MediaViewer, MetricCard, PremiumGate, RootScreen, Skeleton, TopBar, resolveAsyncState, type GlobalCreateTarget } from '../../../shared/components/ui';
import type { Material } from '../../../theme/materials';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getEventDate, getInitials, toEventCardType } from '../../home/homeUtils';
import { tabs, type MainTabId } from '../../home/mainTabs';
import { compactAnimalDetails, formatAnimalDate, getAnimalMedicalDocuments, getAnimalMedicalEvents, getAnimalPresence, normalizeAnimalPictures, resolveAnimalSelection, sortAnimalsForWorkspace, type AnimalPicture } from '../animalWorkspaceUtils';
import { AnimalMeasurementSheet } from '../components/AnimalMeasurementSheet';
import { AnimalMeasurementHistorySheet } from '../components/AnimalMeasurementHistorySheet';
import { getMeasurementSummary } from '../animalMeasurementUtils';

type WorkspaceTab = 'infos' | 'health' | 'body';
type AnimalAction = 'edit' | 'departure' | 'death' | 'delete';

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
  { id: 'infos', label: 'Informations' }, { id: 'health', label: 'Santé' }, { id: 'body', label: 'Physique' },
];

export function AnimalsWorkspaceScreen({ material = 'solid', onSelectTab, onNotifications = () => undefined, onAccount = () => undefined, onCreate, onAnimalAction, onAddHealth, onAddBodyPicture, onAddGalleryPicture, onOpenEvent, canAccessVisualTracking = false, onVisualTrackingLocked = () => undefined, preferredAnimalId, feedback, onDismissFeedback }: AnimalsWorkspaceScreenProps) {
  const { colors } = useAppTheme();
  const user = useAuthStore((state) => state.user);
  const animalsQuery = useAnimalsQuery();
  const mutations = useAnimalMutations();
  const notificationsQuery = useNotificationsQuery();
  const eventsQuery = useEventsQuery();
  const eventMutations = useEventMutations();
  const animals = useMemo(() => sortAnimalsForWorkspace(animalsQuery.data ?? []), [animalsQuery.data]);
  const [selectedId, setSelectedId] = useState<number | undefined>(preferredAnimalId);
  const [workspaceTab, setWorkspaceTab] = useState<WorkspaceTab>('infos');
  const [createOpen, setCreateOpen] = useState(false);
  const [historyExpanded, setHistoryExpanded] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const [selectedPicture, setSelectedPicture] = useState<AnimalPicture>();
  const [deletePictureOpen, setDeletePictureOpen] = useState(false);
  const [measurementType, setMeasurementType] = useState<'poids' | 'taille'>();
  const [measurementHistoryType, setMeasurementHistoryType] = useState<'poids' | 'taille'>();
  const [medicalDocument, setMedicalDocument] = useState<{ name: string; uri: string; type: 'image' | 'document' }>();
  const [medicalDocumentError, setMedicalDocumentError] = useState<string>();
  const [medicalEventPickerOpen, setMedicalEventPickerOpen] = useState(false);
  const [documentAction, setDocumentAction] = useState<{ eventId: number; name: string }>();
  const [documentActionsOpen, setDocumentActionsOpen] = useState(false);
  const [deleteDocumentOpen, setDeleteDocumentOpen] = useState(false);
  const [pendingDocument, setPendingDocument] = useState<{ eventId: number; uri: string; name: string; mimeType: string; state: 'uploading' | 'error' }>();
  const appliedPreferredAnimalId = useRef<number | undefined>(undefined);
  const selected = animals.find((animal) => animal.id === selectedId) ?? animals[0];
  const picturesQuery = useAnimalBodyPicturesQuery(selected ? String(selected.id) : '');
  const present = animals.filter((animal) => getAnimalPresence(animal) === 'present');
  const history = animals.filter((animal) => getAnimalPresence(animal) === 'history');
  const notifications = Array.isArray(notificationsQuery.data) ? notificationsQuery.data : [];
  const unread = notifications.filter((notification) => !notification.is_read).length;
  const animalsState = resolveAsyncState({ loading: animalsQuery.isLoading, error: animalsQuery.isError, hasData: animals.length > 0 });

  useEffect(() => {
    const resolved = resolveAnimalSelection(animals, selectedId);
    if (resolved !== selectedId) setSelectedId(resolved);
  }, [animals, selectedId]);

  useEffect(() => {
    if (preferredAnimalId != null && appliedPreferredAnimalId.current !== preferredAnimalId && animals.some((animal) => animal.id === preferredAnimalId)) {
      appliedPreferredAnimalId.current = preferredAnimalId;
      setSelectedId(preferredAnimalId);
    }
  }, [animals, preferredAnimalId]);

  useEffect(() => { if (documentAction) setDocumentActionsOpen(true); }, [documentAction]);

  const refresh = () => void Promise.all([animalsQuery.refetch(), notificationsQuery.refetch(), eventsQuery.refetch(), selected ? picturesQuery.refetch() : Promise.resolve()]);
  const addPicture = async () => {
    if (!selected || mutations.addBodyPicture.isPending) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.8 });
    if (result.canceled) return;
    const asset = result.assets[0];
    const filename = asset.fileName || asset.uri.split('/').pop() || `animal-${Date.now()}.jpg`;
    const uploaded = await uploadFile(asset.uri, filename, asset.mimeType || 'image/jpeg', 'animal', String(selected.id));
    if (!uploaded) return;
    await mutations.addBodyPicture.mutateAsync({ animalId: String(selected.id), body: { idanimal: selected.id, filename } });
  };
  const medicalEvents = selected ? getAnimalMedicalEvents(eventsQuery.data ?? [], selected.id) : [];
  const uploadMedicalDocument = async (draft: { eventId: number; uri: string; name: string; mimeType: string }) => {
    setMedicalDocumentError(undefined);
    setPendingDocument({ ...draft, state: 'uploading' });
    try {
      const uploaded = await uploadFile(draft.uri, draft.name, draft.mimeType, 'event', String(draft.eventId));
      if (!uploaded) throw new Error('upload-failed');
      await eventMutations.attachDocument.mutateAsync({ eventId: String(draft.eventId), filename: draft.name });
      setPendingDocument(undefined);
    } catch {
      setPendingDocument({ ...draft, state: 'error' });
      setMedicalDocumentError('Le document n’a pas pu être importé. Vous pouvez réessayer sans le sélectionner à nouveau.');
    }
  };
  const pickMedicalDocument = async (eventId: number) => {
    setMedicalEventPickerOpen(false);
    const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: true, multiple: false });
    if (result.canceled) return;
    const asset = result.assets[0];
    await uploadMedicalDocument({ eventId, uri: asset.uri, name: asset.name, mimeType: asset.mimeType || 'application/octet-stream' });
  };
  const importMedicalDocument = () => {
    if (medicalEvents.length === 1) void pickMedicalDocument(medicalEvents[0].id);
    else if (medicalEvents.length > 1) setMedicalEventPickerOpen(true);
    else onCreate('event');
  };
  const selector = (items: typeof animals) => items.map((animal) => <AnimalSelectorItem key={animal.id} name={animal.nom} imageUrl={animal.image} selected={selected?.id === animal.id} selectionRole="radio" onPress={() => setSelectedId(animal.id)} testID={`workspace-animal-${animal.id}`} />);
  const header = <TopBar title="Animaux" material={material} onNotifications={onNotifications} unreadNotifications={unread} onAccount={onAccount} avatarInitials={getInitials(user?.prenom)} />;
  const bottomBar = <BottomBar items={tabs} activeId="animals" onSelect={onSelectTab} material={material} testID="main-tabs" />;

  const selectCreate = (target: GlobalCreateTarget) => { setCreateOpen(false); onCreate(target); };
  return <><RootScreen header={header} bottomBar={bottomBar} padded={false} floatingAction={<FloatingActionButton accessibilityLabel="Créer" testID="animals-create" onPress={() => setCreateOpen(true)} material={material} />} refreshControl={<RefreshControl refreshing={animalsQuery.isRefetching} onRefresh={refresh} />} contentContainerStyle={{ paddingBottom: spacing.xxl }} testID="animals-workspace">
    {feedback ? <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm }}><Banner tone="success" title="Animal enregistré" message={feedback} onDismiss={onDismissFeedback} testID="animal-save-success" /></View> : null}
    {animalsState === 'loading' ? <View style={{ padding: spacing.md, gap: spacing.md }}><Skeleton type="profile" density="comfortable" /><Skeleton type="card" density="comfortable" /></View> : animalsState === 'error' ? <View style={{ flex: 1, padding: spacing.md }}><ErrorState message="Impossible de charger vos animaux." onRetry={refresh} /></View> : animalsState === 'empty' ? <View style={{ flex: 1, padding: spacing.md }}><EmptyState title="Aucun animal pour le moment" message="Ajoutez votre premier animal pour commencer son carnet Vasco." actionLabel="Ajouter un animal" onAction={() => selectCreate('animal')} /></View> : <>
      {animalsQuery.isError ? <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.sm }}><Banner tone="error" title="Mise à jour impossible" message="Les dernières données disponibles restent affichées." blocking onDismiss={undefined} /></View> : null}
      <View accessibilityRole="radiogroup" accessibilityLabel="Choisir un animal" style={{ paddingTop: spacing.xl }}><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ minWidth: '100%', paddingHorizontal: spacing.sm, gap: 4 }}><View style={{ flexDirection: 'row' }}>{selector(present)}{history.length ? <AnimalSelectorMore expanded={historyExpanded} onPress={() => setHistoryExpanded((value) => !value)} testID="workspace-animal-more" /> : null}{historyExpanded ? selector(history) : null}</View></ScrollView></View>
      <View accessibilityRole="tablist" style={{ height: 48, flexDirection: 'row', paddingHorizontal: spacing.md }}>{workspaceTabs.map((item) => { const active = workspaceTab === item.id; return <Pressable key={item.id} accessibilityRole="tab" accessibilityState={{ selected: active }} onPress={() => setWorkspaceTab(item.id)} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderBottomWidth: active ? 2 : 0, borderBottomColor: colors.textPrimary }}><Text style={{ color: active ? colors.textPrimary : colors.textSecondary, fontFamily: active ? typography.fonts.semiBold : typography.fonts.medium, fontSize: active ? typography.sizes.md : typography.sizes.control }}>{item.label}</Text></Pressable>; })}</View>
      <View style={{ padding: spacing.md }}>{workspaceTab === 'infos' ? <AnimalInfos animal={selected} onActions={() => setActionsOpen(true)} /> : workspaceTab === 'health' ? <AnimalHealth animal={selected} events={eventsQuery.data ?? []} loading={eventsQuery.isLoading} error={eventsQuery.isError} onRetry={() => void eventsQuery.refetch()} onActions={() => setActionsOpen(true)} onOpenEvent={onOpenEvent} documentError={medicalDocumentError} pendingDocument={pendingDocument} onImportDocument={importMedicalDocument} onRetryDocument={() => { if (pendingDocument) void uploadMedicalDocument(pendingDocument); }} onOpenDocument={async (eventId, name) => { setMedicalDocumentError(undefined); try { const uri = await getEventDocumentUrl(String(eventId), name); setMedicalDocument({ name, uri, type: name.toLowerCase().endsWith('.pdf') ? 'document' : 'image' }); } catch { setMedicalDocumentError('Impossible d’ouvrir ce document. Vérifiez votre connexion puis réessayez.'); } }} onDocumentMore={(eventId, name) => setDocumentAction({ eventId, name })} /> : <AnimalBody animal={selected} canAccessVisualTracking={canAccessVisualTracking} onVisualTrackingLocked={onVisualTrackingLocked} onAddPicture={() => onAddBodyPicture ? onAddBodyPicture(selected.id) : void addPicture()} onAddMeasure={() => setMeasurementType('poids')} onOpenMeasure={setMeasurementHistoryType} onActions={() => setActionsOpen(true)} />}</View>
    </>}
    <GlobalCreateMenu open={createOpen} onClose={() => setCreateOpen(false)} onSelect={selectCreate} material={material} />
    <ActionMenu open={medicalEventPickerOpen} title="Associer le document à" onClose={() => setMedicalEventPickerOpen(false)} onSelect={(id) => void pickMedicalDocument(Number(id))} items={medicalEvents.map((event) => ({ id: String(event.id), label: event.nom || event.eventtype, icon: 'calendar' as const }))} testID="medical-document-event-picker" />
    <ActionMenu open={documentActionsOpen && !deleteDocumentOpen} title={documentAction?.name ?? 'Document médical'} onClose={() => setDocumentActionsOpen(false)} onSelect={(action) => { if (action === 'open' && documentAction) { void getEventDocumentUrl(String(documentAction.eventId), documentAction.name).then((uri) => { setMedicalDocument({ name: documentAction.name, uri, type: documentAction.name.toLowerCase().endsWith('.pdf') ? 'document' : 'image' }); setDocumentAction(undefined); }).catch(() => setMedicalDocumentError('Impossible d’ouvrir ce document. Vérifiez votre connexion puis réessayez.')); } if (action === 'delete') setDeleteDocumentOpen(true); }} items={[{ id: 'open', label: 'Ouvrir', icon: 'file' }, { id: 'delete', label: 'Supprimer', icon: 'delete', tone: 'destructive' }]} testID="medical-document-actions" />
    <Dialog open={deleteDocumentOpen} type="destructive" title="Supprimer ce document médical ?" description={`${documentAction?.name ?? 'Ce document'} sera supprimé définitivement de l’événement associé.`} confirmLabel="Supprimer" loading={eventMutations.deleteDocument.isPending} onClose={() => { setDeleteDocumentOpen(false); setDocumentAction(undefined); }} onConfirm={async () => { if (!documentAction) return; setMedicalDocumentError(undefined); try { await eventMutations.deleteDocument.mutateAsync({ eventId: String(documentAction.eventId), filename: documentAction.name }); setDocumentAction(undefined); } catch { setMedicalDocumentError('Le document n’a pas pu être supprimé. Réessayez.'); throw new Error('delete-medical-document'); } }} onError={() => undefined} testID="medical-document-delete-dialog" />
    <MediaViewer open={Boolean(medicalDocument)} uri={medicalDocument?.uri ?? ''} title={medicalDocument?.name ?? 'Document médical'} type={medicalDocument?.type} onClose={() => setMedicalDocument(undefined)} />
  </RootScreen>{selected ? <ActionMenu open={actionsOpen} title={selected.nom} onClose={() => setActionsOpen(false)} onSelect={(action) => { setActionsOpen(false); onAnimalAction?.(action, selected.id); }} items={[{ id: 'edit', label: 'Modifier', icon: 'edit' }, { id: 'departure', label: 'Signaler un départ', icon: 'warning' }, { id: 'death', label: 'Signaler un décès', icon: 'warning' }, { id: 'delete', label: 'Supprimer', icon: 'delete', tone: 'destructive' }]} /> : null}<MediaViewer open={Boolean(selectedPicture)} uri={selectedPicture?.uri ?? ''} title={selected ? `Photo de ${selected.nom}` : 'Photo'} onClose={() => setSelectedPicture(undefined)} onDeleteRequest={() => setDeletePictureOpen(true)} /><Dialog open={deletePictureOpen} type="destructive" title="Supprimer cette photo ?" description="Cette photo de suivi sera supprimée définitivement." confirmLabel="Supprimer" loading={mutations.deleteBodyPicture.isPending} onClose={() => setDeletePictureOpen(false)} onConfirm={async () => { if (!selected || !selectedPicture) return; await mutations.deleteBodyPicture.mutateAsync({ animalId: String(selected.id), pictureId: selectedPicture.id }); setSelectedPicture(undefined); }} />{selected && measurementType ? <AnimalMeasurementSheet animal={selected} initialType={measurementType} onClose={() => setMeasurementType(undefined)} onSaved={() => setMeasurementType(undefined)} /> : null}{selected && measurementHistoryType ? <AnimalMeasurementHistorySheet animal={selected} type={measurementHistoryType} onClose={() => setMeasurementHistoryType(undefined)} /> : null}</>;
}

const sectionLabel = { flexShrink: 0, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xs } as const;

function AnimalInfos({ animal, onActions }: { animal: Animal; onActions: () => void }) {
  const { colors } = useAppTheme();
  const birth = formatAnimalDate(animal.datenaissance); const arrival = formatAnimalDate(animal.datearrivee);
  const rows = [
    ...(animal.numeroidentification ? [['Identification', animal.numeroidentification]] : []),
    ...(birth || arrival ? [['Dates', [birth ? `Né le ${birth}` : undefined, arrival ? `Arrivé le ${arrival}` : undefined].filter(Boolean).join(' · ')]] : []),
    ...(animal.nompere || animal.nommere ? [['Origines', [animal.nompere ? `Père : ${animal.nompere}` : undefined, animal.nommere ? `Mère : ${animal.nommere}` : undefined].filter(Boolean).join(' · ')]] : []),
    ...(animal.informations ? [['Informations complémentaires', animal.informations]] : []),
  ];
  return <View style={{ gap: spacing.lg }}><View style={{ flexDirection: 'row', alignItems: 'flex-start' }}><View style={{ flex: 1, gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.xl, lineHeight: 28 }}>{animal.nom}</Text><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{compactAnimalDetails(animal)}</Text></View><Pressable accessibilityRole="button" accessibilityLabel={`Actions pour ${animal.nom}`} onPress={onActions} style={({ pressed }) => ({ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}><Icon name="moreHorizontal" size="lg" color={colors.primaryDark} /></Pressable></View>{rows.map(([label, value]) => <View key={label} style={{ gap: spacing.xs }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control, lineHeight: 20 }}>{label}</Text><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{value}</Text></View>)}</View>;
}

function SectionHeading({ children, onActions }: { children: string; onActions?: () => void }) { const { colors } = useAppTheme(); return <View style={{ flexDirection: 'row', alignItems: 'center' }}><Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{children}</Text>{onActions ? <Pressable accessibilityRole="button" accessibilityLabel="Actions de l’animal" onPress={onActions} style={({ pressed }) => ({ width: 44, height: 44, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.6 : 1 })}><Icon name="moreHorizontal" size="lg" color={colors.primaryDark} /></Pressable> : null}</View>; }

function AnimalHealth({ animal, events, loading, error, onRetry, onActions, onOpenEvent, onOpenDocument, onDocumentMore = () => undefined, onImportDocument, onRetryDocument, pendingDocument, documentError }: { animal: Animal; events: readonly import('../../../models/Event').Event[]; loading: boolean; error: boolean; onRetry: () => void; onActions: () => void; onOpenEvent?: (eventId: number) => void; onOpenDocument: (eventId: number, name: string) => void; onDocumentMore?: (eventId: number, name: string) => void; onImportDocument: () => void; onRetryDocument: () => void; pendingDocument?: { name: string; state: 'uploading' | 'error' }; documentError?: string }) {
  const medicalEvents = getAnimalMedicalEvents(events, animal.id);
  const history = [...medicalEvents].sort((a, b) => getEventDate(b).getTime() - getEventDate(a).getTime());
  const documents = getAnimalMedicalDocuments(events, animal.id);
  if (error && !events.length) return <View style={{ gap: spacing.md }}><SectionHeading onActions={onActions}>Santé</SectionHeading><ErrorState title="Santé indisponible" message="Impossible de charger les soins, rendez-vous et documents médicaux." onRetry={onRetry} /></View>;
  return <View style={{ gap: spacing.md }}><SectionHeading onActions={onActions}>Historique médical</SectionHeading>{error ? <Banner tone="error" title="Mise à jour impossible" message="Les dernières données médicales restent affichées." blocking onDismiss={undefined} /> : null}{loading ? <Skeleton type="card" density="comfortable" /> : history.length ? history.map((event) => <EventCard key={event.id} type={toEventCardType(event.eventtype)} time={event.heuredebutevent ?? '—'} title={event.nom || event.eventtype} description={event.commentaire} onPress={onOpenEvent ? () => onOpenEvent(event.id) : undefined} />) : <EmptyState title="Aucun soin enregistré" message={`Les soins et rendez-vous médicaux de ${animal.nom} apparaîtront ici.`} actionLabel="Ajouter" onAction={onImportDocument} />}<SectionHeading>Documents médicaux</SectionHeading>{documentError ? <Banner tone="error" title="Action impossible" message={documentError} blocking onDismiss={undefined} /> : null}{pendingDocument ? <FileItem name={pendingDocument.name} type={pendingDocument.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'} state={pendingDocument.state} metadata="Document médical" onRetry={pendingDocument.state === 'error' ? onRetryDocument : undefined} testID="pending-medical-document" /> : null}{loading ? <Skeleton type="card" density="comfortable" /> : documents.length ? <>{documents.map((document) => <FileItem key={`${document.eventId}-${document.name}`} name={document.name} type={document.name.toLowerCase().endsWith('.pdf') ? 'pdf' : 'image'} metadata="Document médical" previewUrl={document.url} onOpen={() => onOpenDocument(document.eventId, document.name)} onMore={() => onDocumentMore(document.eventId, document.name)} />)}<Button label="Importer un document" variant="secondary" fullWidth onPress={onImportDocument} /></> : pendingDocument ? null : <EmptyState title="Aucun document médical" message="Ajoutez une ordonnance, un compte rendu ou une image à un soin ou rendez-vous." actionLabel="Importer" onAction={onImportDocument} />}</View>;
}

function AnimalBody({ animal, canAccessVisualTracking, onVisualTrackingLocked, onAddPicture, onAddMeasure, onOpenMeasure, onActions }: { animal: Animal; canAccessVisualTracking: boolean; onVisualTrackingLocked: () => void; onAddPicture: () => void; onAddMeasure: () => void; onOpenMeasure: (type: 'poids' | 'taille') => void; onActions: () => void }) { const food = [animal.food, animal.quantity != null ? `${animal.quantity} ${animal.unity ?? ''}`.trim() : undefined].filter(Boolean).join(' · '); const weightHistory = useAnimalHistoryQuery(String(animal.id), 'poids'); const heightHistory = useAnimalHistoryQuery(String(animal.id), 'taille'); const weight = getMeasurementSummary(weightHistory.data ?? [], 'kg'); const height = getMeasurementSummary(heightHistory.data ?? [], 'cm'); return <View style={{ gap: spacing.lg }}><SectionHeading onActions={onActions}>Dernières mesures</SectionHeading><View style={{ flexDirection: 'row', gap: spacing.md }}><View style={{ flex: 1 }}><MetricCard label="Poids" value={weight.value} trend={weight.trend} trendLabel={weight.trendLabel} onPress={() => onOpenMeasure('poids')} /></View><View style={{ flex: 1 }}><MetricCard label="Taille" value={height.value} trend={height.trend} trendLabel={height.trendLabel} onPress={() => onOpenMeasure('taille')} /></View></View><Button label="Ajouter une mesure" icon="add" variant="secondary" size="large" fullWidth onPress={onAddMeasure} /><SectionHeading>Alimentation</SectionHeading><BodyText>{food || 'Non renseignée'}</BodyText><SectionHeading>Suivi visuel</SectionHeading>{canAccessVisualTracking ? <MediaUpload state="empty" onPress={onAddPicture} /> : <PremiumGate title="Suivi visuel Premium" message="Ajoutez et comparez les photos d’évolution de votre animal avec l’abonnement Premium." onComparePlans={onVisualTrackingLocked} testID="visual-tracking-premium-gate" />}</View>; }

function AnimalGallery({ animal, pictures, loading, error, onRetry, onAdd, onOpen, onActions }: { animal: Animal; pictures: AnimalPicture[]; loading: boolean; error: boolean; onRetry: () => void; onAdd: () => void; onOpen: (picture: AnimalPicture) => void; onActions: () => void }) { const { colors } = useAppTheme(); const state = resolveAsyncState({ loading, error, hasData: pictures.length > 0 }); return <View style={{ gap: spacing.md }}><SectionHeading onActions={onActions}>Galerie</SectionHeading>{error && state === 'success' ? <Banner tone="error" title="Mise à jour impossible" message="Les photos déjà chargées restent disponibles." blocking onDismiss={undefined} /> : null}{state === 'loading' ? <><Skeleton type="card" density="comfortable" /><Skeleton type="card" density="comfortable" /></> : state === 'error' ? <ErrorState message="Impossible de charger la galerie." onRetry={onRetry} /> : state === 'success' ? <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>{pictures.map((picture) => <Pressable key={picture.id} accessibilityRole="button" accessibilityLabel={`Ouvrir une photo de ${animal.nom}`} onPress={() => onOpen(picture)} style={{ width: '48%', aspectRatio: 1 }}><Image source={{ uri: picture.uri }} contentFit="cover" accessibilityLabel={`Souvenir de ${animal.nom}`} style={{ flex: 1, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }} /></Pressable>)}</View> : <EmptyState title={`Aucun souvenir pour ${animal.nom}`} message="Ajoutez des photos pour suivre son évolution et conserver vos meilleurs moments." actionLabel="Ajouter" onAction={onAdd} />}</View>; }
function BodyText({ children }: { children: string }) { const { colors } = useAppTheme(); return <Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: 22 }}>{children}</Text>; }
