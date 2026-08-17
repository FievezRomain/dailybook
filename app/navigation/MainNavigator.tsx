import { useState } from 'react';
import { AnimalActionDialogs, AnimalFormSheetScreen, AnimalsWorkspaceScreen, type SensitiveAnimalAction } from '../../features/animals';
import { AgendaScreen, DayAgendaScreen, EventCreateAiDescriptionScreen, EventCreateAiReviewScreen, EventCreateAnimalsScreen, EventCreateDetailsScreen, EventCreateEntryScreen, EventCreateOptionsScreen, EventCreateSuccessScreen, EventCreateTypeScreen, EventDetailScreen, isPremiumSubscription } from '../../features/events';
import { HomeScreen, type MainTabId } from '../../features/home';
import { ActionSheet, FormSheetHost, PremiumPlansComparison, PremiumRequiredPattern, type OverlayActionItem } from '../../shared/components/ui';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEventWizardStore } from '../../stores/useEventWizardStore';
import { useAnimalsQuery } from '../../hooks/queries/useAnimalsQuery';
import { useAnimalWizardStore } from '../../stores/useAnimalWizardStore';
import { ObjectiveDetailScreen, ObjectiveFormSheetScreen, TrackingScreen } from '../../features/objectifs';
import { useObjectifsQuery } from '../../hooks/queries/useObjectifsQuery';
import { useObjectiveWizardStore } from '../../stores/useObjectiveWizardStore';
import { NoteCreateSuccessScreen, NoteDetailScreen, NoteFormSheetScreen, NotesListScreen, VoiceProcessingScreen, VoiceRecordingScreen, VoiceReviewScreen, type VoiceNoteDraft, type VoiceRecording } from '../../features/notes';
import { useNotesQuery } from '../../hooks/queries/useNotesQuery';
import { VoiceUploadService } from '../../services/storage/VoiceUploadService';
import { WishDetailScreen, WishFormSheetScreen, WishesListScreen } from '../../features/wishes';
import { useWishesQuery } from '../../hooks/queries/useWishesQuery';
import { ContactDetailScreen, ContactFormSheetScreen, ContactsListScreen } from '../../features/contacts';
import { useContactsQuery } from '../../hooks/queries/useContactsQuery';
import { PlusHubScreen } from '../../features/plus';
import { GroupDetailScreen, GroupFormSheetScreen, GroupInvitationScreen, GroupsListScreen } from '../../features/groups';
import { useGroupsQuery } from '../../hooks/queries/useGroupsQuery';
import { NotificationsScreen } from '../../features/notifications';
import type { Notification } from '../../models/Notification';
import { NotificationPreferencesScreen, SettingsAppearanceScreen, SettingsChangePasswordScreen, SettingsOverviewScreen, SettingsPrivacyScreen, SettingsProfileScreen, SettingsSecurityScreen, SettingsSubscriptionScreen } from '../../features/settings';

export function MainNavigator() {
  const [tab, setTab] = useState<MainTabId>('home');
  const [preferredAnimalId, setPreferredAnimalId] = useState<number>();
  const [statisticsGate, setStatisticsGate] = useState(false);
  const [statisticsPlans, setStatisticsPlans] = useState(false);
  const [voicePlans, setVoicePlans] = useState(false);
  const [groupsPlans, setGroupsPlans] = useState(false);
  const [visualTrackingPlans, setVisualTrackingPlans] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState<'overview' | 'profile' | 'appearance' | 'notifications' | 'security' | 'changePassword' | 'privacy' | 'subscription'>();
  const [voiceRecording, setVoiceRecording] = useState<VoiceRecording>();
  const [voiceDraft, setVoiceDraft] = useState<VoiceNoteDraft>();
  const [createdVoiceNoteId, setCreatedVoiceNoteId] = useState<number>();
  const [animalFeedback, setAnimalFeedback] = useState<string>();
  const resetWizard = useEventWizardStore((state) => state.reset);
  const resetAnimalWizard = useAnimalWizardStore((state) => state.reset);
  const resetObjectiveWizard = useObjectiveWizardStore((state) => state.reset);
  const animals = useAnimalsQuery().data ?? [];
  const objectives = useObjectifsQuery().data ?? [];
  const noteItems = useNotesQuery().data ?? [];
  const wishItems = useWishesQuery().data ?? [];
  const contactItems = useContactsQuery().data ?? [];
  const user = useAuthStore((state) => state.user);
  const premium = isPremiumSubscription(user?.subscription);
  const groupItems = useGroupsQuery().data ?? [];
  const [route, setRoute] = useState<{ name: 'root' } | { name: 'day'; date: string } | { name: 'event'; eventId: number; feedback?: string } | { name: 'objective'; objectiveId: number; actionsOpen?: boolean } | { name: 'objectiveForm'; mode: 'create' | 'edit'; objectiveId?: number } | { name: 'notes' } | { name: 'note'; noteId: number } | { name: 'noteCreateChoice' } | { name: 'noteVoicePremium' } | { name: 'noteVoiceRecording' } | { name: 'noteVoiceProcessing' } | { name: 'noteVoiceReview' } | { name: 'noteVoiceSuccess' } | { name: 'noteForm'; mode: 'create' | 'edit'; noteId?: number } | { name: 'wishes' } | { name: 'wish'; wishId: number } | { name: 'wishForm'; mode: 'create' | 'edit'; wishId?: number } | { name: 'contacts' } | { name: 'contact'; contactId: number } | { name: 'contactForm'; mode: 'create' | 'edit'; contactId?: number } | { name: 'groups' } | { name: 'group'; groupId: number } | { name: 'groupInvitation'; invitationId: number } | { name: 'groupPremium' } | { name: 'groupForm'; mode: 'create' | 'edit'; groupId?: number; initialStep?: 0 | 1 | 2 } | { name: 'animalForm'; mode: 'create' | 'edit'; animalId?: number } | { name: 'animalAction'; action: SensitiveAnimalAction; animalId: number } | { name: 'eventCreateEntry' } | { name: 'eventCreateType' } | { name: 'eventCreateDetails' } | { name: 'eventCreateAnimals' } | { name: 'eventCreateOptions' } | { name: 'eventCreateSuccess'; eventId?: number } | { name: 'eventCreateAiPremium' } | { name: 'eventCreateAiDescription' } | { name: 'eventCreateAiReview' } | { name: 'eventCreateGroupsPremium' } | { name: 'eventEditDetails'; eventId: number } | { name: 'eventEditAnimals'; eventId: number } | { name: 'eventEditOptions'; eventId: number } | { name: 'eventEditGroupsPremium'; eventId: number } | { name: 'eventDuplicateDetails'; sourceEventId: number } | { name: 'eventDuplicateAnimals'; sourceEventId: number } | { name: 'eventDuplicateOptions'; sourceEventId: number } | { name: 'eventDuplicateGroupsPremium'; sourceEventId: number }>({ name: 'root' });
  const selectTab = (next: MainTabId) => { setNotificationsOpen(false); setSettingsOpen(undefined); setTab(next); setRoute({ name: 'root' }); };
  const openNotifications = () => setNotificationsOpen(true);
  const openSettings = () => { setNotificationsOpen(false); setSettingsOpen('overview'); };
  const openNotificationTarget = (notification: Notification) => {
    setNotificationsOpen(false);
    if (!notification.object_id) return;
    if (notification.type === 'event') setRoute({ name: 'event', eventId: notification.object_id });
    else if (notification.type === 'objective') setRoute({ name: 'objective', objectiveId: notification.object_id });
    else if (notification.type === 'note') setRoute({ name: 'note', noteId: notification.object_id });
    else if (notification.type === 'wish') setRoute({ name: 'wish', wishId: notification.object_id });
    else if (notification.type === 'contact') setRoute({ name: 'contact', contactId: notification.object_id });
  };
  const create = (target: string) => {
    if (target === 'animal') { resetAnimalWizard(); setRoute({ name: 'animalForm', mode: 'create' }); return; }
    if (target === 'objective') { resetObjectiveWizard(); setRoute({ name: 'objectiveForm', mode: 'create' }); return; }
    if (target === 'wish') { setRoute({ name: 'wishForm', mode: 'create' }); return; }
    if (target === 'contact') { setRoute({ name: 'contactForm', mode: 'create' }); return; }
    if (target === 'group') { setRoute(premium ? { name: 'groupForm', mode: 'create' } : { name: 'groupPremium' }); return; }
    if (target === 'note') { setRoute({ name: 'noteCreateChoice' }); return; }
    if (target !== 'event') return;
    resetWizard();
    setRoute({ name: 'eventCreateEntry' });
  };
  const agenda = () => { resetWizard(); setTab('agenda'); setRoute({ name: 'root' }); };
  const tracking = () => <TrackingScreen canAccessStatistics={isPremiumSubscription(user?.subscription)} onStatisticsLocked={() => setStatisticsGate(true)} onSelectTab={selectTab} onCreate={create} onCreateObjective={() => create('objective')} onOpenObjective={(objectiveId) => setRoute({ name: 'objective', objectiveId })} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} onNotifications={openNotifications} onAccount={openSettings} />;
  const notes = () => <NotesListScreen onSelectTab={selectTab} onOpenNote={(noteId) => setRoute({ name: 'note', noteId })} onCreateNote={() => setRoute({ name: 'noteCreateChoice' })} onCreate={create} onNotifications={openNotifications} onAccount={openSettings} />;
  const wishes = () => <WishesListScreen activeMainTab={tab} onSelectTab={selectTab} onOpenWish={(wishId) => setRoute({ name: 'wish', wishId })} onCreateWish={() => setRoute({ name: 'wishForm', mode: 'create' })} onCreate={create} onNotifications={openNotifications} onAccount={openSettings} />;
  const contacts = () => <ContactsListScreen onSelectTab={selectTab} onOpenContact={(contactId) => setRoute({ name: 'contact', contactId })} onCreateContact={() => setRoute({ name: 'contactForm', mode: 'create' })} onCreate={create} onNotifications={openNotifications} onAccount={openSettings} />;
  const groups = () => <GroupsListScreen onSelectTab={selectTab} onOpenGroup={(groupId) => setRoute({ name: 'group', groupId })} onOpenInvitation={(invitationId) => setRoute({ name: 'groupInvitation', invitationId })} onCreateGroup={() => setRoute(premium ? { name: 'groupForm', mode: 'create' } : { name: 'groupPremium' })} onCreate={create} onNotifications={openNotifications} onAccount={openSettings} />;
  const plus = () => <PlusHubScreen onSelectTab={selectTab} onGroups={() => setRoute({ name: 'groups' })} onContacts={() => setRoute({ name: 'contacts' })} onNotes={() => setRoute({ name: 'notes' })} onWishes={() => setRoute({ name: 'wishes' })} onCreate={create} onNotifications={openNotifications} onAccount={openSettings} />;
  const noteCreationActions: readonly OverlayActionItem<'write' | 'voice'>[] = [
    { id: 'write', label: 'Écrire une note', description: 'Saisir un titre et un contenu', icon: 'edit' },
    { id: 'voice', label: 'Enregistrer une note vocale', description: 'Utiliser le micro puis corriger la transcription', icon: 'microphone' },
  ];
  const clearVoiceDraft = () => {
    if (voiceRecording) VoiceUploadService.deleteLocal(voiceRecording.uri);
    setVoiceRecording(undefined);
    setVoiceDraft(undefined);
  };
  const rootContext = () => tab === 'agenda'
    ? <AgendaScreen onSelectTab={selectTab} onOpenDay={(date) => setRoute({ name: 'day', date })} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} onCreate={create} onNotifications={openNotifications} />
    : tab === 'animals' ? <AnimalsWorkspaceScreen onSelectTab={selectTab} preferredAnimalId={preferredAnimalId} feedback={animalFeedback} onDismissFeedback={() => setAnimalFeedback(undefined)} onCreate={create} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} canAccessVisualTracking={premium} onVisualTrackingLocked={() => setVisualTrackingPlans(true)} onAnimalAction={(action, animalId) => setRoute(action === 'edit' ? { name: 'animalForm', mode: 'edit', animalId } : { name: 'animalAction', action, animalId })} onNotifications={openNotifications} />
    : tab === 'tracking' ? tracking()
    : tab === 'more' ? plus()
    : <HomeScreen onSelectTab={selectTab} onEvent={(eventId) => setRoute({ name: 'event', eventId })} onObjective={(objectiveId) => setRoute({ name: 'objective', objectiveId })} onCreate={create} onNotifications={openNotifications} onAccount={openSettings} />;
  const eventContext = (eventId: number) => <EventDetailScreen eventId={eventId} onBack={() => setRoute({ name: 'root' })} onDeleted={() => setRoute({ name: 'root' })} onEdit={(id) => setRoute({ name: 'eventEditDetails', eventId: id })} onDuplicate={(sourceEventId) => setRoute({ name: 'eventDuplicateDetails', sourceEventId })} />;
  if (settingsOpen === 'notifications') return <NotificationPreferencesScreen activeTab={tab} onSelectTab={selectTab} onBack={() => setSettingsOpen('overview')} />;
  if (settingsOpen === 'profile') return <SettingsProfileScreen activeTab={tab} onSelectTab={selectTab} onBack={() => setSettingsOpen('overview')} />;
  if (settingsOpen === 'appearance') return <SettingsAppearanceScreen activeTab={tab} onSelectTab={selectTab} onBack={() => setSettingsOpen('overview')} />;
  if (settingsOpen === 'security') return <SettingsSecurityScreen activeTab={tab} onSelectTab={selectTab} onBack={() => setSettingsOpen('overview')} onChangePassword={() => setSettingsOpen('changePassword')} />;
  if (settingsOpen === 'changePassword') return <SettingsChangePasswordScreen activeTab={tab} onSelectTab={selectTab} onBack={() => setSettingsOpen('security')} />;
  if (settingsOpen === 'privacy') return <SettingsPrivacyScreen activeTab={tab} onSelectTab={selectTab} onBack={() => setSettingsOpen('overview')} onDeleteAccount={() => undefined} />;
  if (settingsOpen === 'subscription') return <SettingsSubscriptionScreen activeTab={tab} onSelectTab={selectTab} onBack={() => setSettingsOpen('overview')} onManage={() => setGroupsPlans(true)} />;
  if (settingsOpen === 'overview') return <SettingsOverviewScreen activeTab={tab} onSelectTab={selectTab} onBack={() => setSettingsOpen(undefined)} onOpen={setSettingsOpen} />;
  if (notificationsOpen) return <NotificationsScreen activeTab={tab} onSelectTab={selectTab} onAccount={openSettings} onOpenNotification={openNotificationTarget} />;
  if (statisticsPlans) return <PremiumPlansComparison onBack={() => setStatisticsPlans(false)} onDiscoverPremium={() => undefined} onContinueFree={() => { setStatisticsPlans(false); setStatisticsGate(false); }} testID="statistics-plans-comparison" />;
  if (statisticsGate) return <PremiumRequiredPattern feature="statistics" onBack={() => setStatisticsGate(false)} onComparePlans={() => setStatisticsPlans(true)} testID="statistics-premium-required" />;
  if (voicePlans) return <PremiumPlansComparison onBack={() => setVoicePlans(false)} onDiscoverPremium={() => undefined} onContinueFree={() => { setVoicePlans(false); setRoute({ name: 'root' }); }} testID="voice-plans-comparison" />;
  if (groupsPlans) return <PremiumPlansComparison onBack={() => setGroupsPlans(false)} onDiscoverPremium={() => undefined} onContinueFree={() => { setGroupsPlans(false); setRoute({ name: 'root' }); }} testID="groups-plans-comparison" />;
  if (visualTrackingPlans) return <PremiumPlansComparison onBack={() => setVisualTrackingPlans(false)} onDiscoverPremium={() => undefined} onContinueFree={() => setVisualTrackingPlans(false)} testID="visual-tracking-plans-comparison" />;
  if (route.name === 'groupPremium') return <PremiumRequiredPattern feature="groups" onBack={() => setRoute({ name: 'root' })} onComparePlans={() => setGroupsPlans(true)} testID="groups-premium-required" />;
  if (route.name === 'groupForm') {
    const selectedGroup = route.groupId ? groupItems.find((item) => item.id === route.groupId) : undefined;
    const background = selectedGroup ? <GroupDetailScreen groupId={selectedGroup.id} onBack={() => setRoute({ name: 'groups' })} onEdit={() => undefined} onDeleted={() => setRoute({ name: 'groups' })} onAddMember={() => undefined} onAddAnimal={() => undefined} /> : groups();
    return <>{background}<FormSheetHost><GroupFormSheetScreen mode={route.mode} group={selectedGroup} initialStep={route.initialStep} onClose={() => setRoute(selectedGroup ? { name: 'group', groupId: selectedGroup.id } : { name: 'groups' })} onSaved={(groupId) => setRoute(groupId ? { name: 'group', groupId } : { name: 'groups' })} /></FormSheetHost></>;
  }
  if (route.name === 'groupInvitation') return <GroupInvitationScreen invitationId={route.invitationId} onBack={() => setRoute({ name: 'groups' })} onAccepted={() => setRoute({ name: 'groups' })} onDeclined={() => setRoute({ name: 'groups' })} />;
  if (route.name === 'group') return <GroupDetailScreen groupId={route.groupId} onBack={() => setRoute({ name: 'groups' })} onEdit={() => setRoute(premium ? { name: 'groupForm', mode: 'edit', groupId: route.groupId } : { name: 'groupPremium' })} onDeleted={() => setRoute({ name: 'groups' })} onAddMember={() => setRoute(premium ? { name: 'groupForm', mode: 'edit', groupId: route.groupId, initialStep: 1 } : { name: 'groupPremium' })} onAddAnimal={() => setRoute(premium ? { name: 'groupForm', mode: 'edit', groupId: route.groupId, initialStep: 2 } : { name: 'groupPremium' })} />;
  if (route.name === 'groups') return groups();
  if (route.name === 'noteCreateChoice') return <>{notes()}<ActionSheet open title="Créer une note" subtitle="Choisissez votre mode de saisie" items={noteCreationActions} onClose={() => setRoute({ name: 'root' })} onSelect={(choice) => { if (choice === 'write') setRoute({ name: 'noteForm', mode: 'create' }); else if (isPremiumSubscription(user?.subscription)) setRoute({ name: 'noteVoiceRecording' }); else setRoute({ name: 'noteVoicePremium' }); }} testID="note-create-choice" /></>;
  if (route.name === 'noteVoicePremium') return <PremiumRequiredPattern feature="voiceNotes" onBack={() => setRoute({ name: 'noteCreateChoice' })} onComparePlans={() => setVoicePlans(true)} testID="voice-premium-required" />;
  if (route.name === 'noteVoiceRecording') return <VoiceRecordingScreen onCancel={() => setRoute({ name: 'root' })} onRecorded={(recording) => { setVoiceRecording(recording); setRoute({ name: 'noteVoiceProcessing' }); }} />;
  if (route.name === 'noteVoiceProcessing') return voiceRecording ? <VoiceProcessingScreen recording={voiceRecording} onCancel={() => { clearVoiceDraft(); setRoute({ name: 'root' }); }} onTranscribed={(draft) => { setVoiceDraft(draft); setRoute({ name: 'noteVoiceReview' }); }} /> : notes();
  if (route.name === 'noteVoiceReview') return voiceRecording && voiceDraft ? <VoiceReviewScreen recording={voiceRecording} draft={voiceDraft} onCancel={() => { clearVoiceDraft(); setRoute({ name: 'root' }); }} onCreated={(noteId) => { setCreatedVoiceNoteId(noteId); setVoiceRecording(undefined); setVoiceDraft(undefined); setRoute({ name: 'noteVoiceSuccess' }); }} /> : notes();
  if (route.name === 'noteVoiceSuccess') return <NoteCreateSuccessScreen onBackToNotes={() => setRoute({ name: 'root' })} onViewNote={() => setRoute(createdVoiceNoteId ? { name: 'note', noteId: createdVoiceNoteId } : { name: 'root' })} />;
  if (route.name === 'noteForm') {
    const selectedNote = route.noteId ? noteItems.find((item) => item.id === route.noteId) : undefined;
    return <>{route.noteId ? <NoteDetailScreen noteId={route.noteId} onBack={() => setRoute({ name: 'root' })} onEdit={() => undefined} onDeleted={() => setRoute({ name: 'root' })} /> : notes()}<FormSheetHost><NoteFormSheetScreen mode={route.mode} note={selectedNote} onClose={() => setRoute(route.noteId ? { name: 'note', noteId: route.noteId } : { name: 'root' })} onSaved={() => setRoute({ name: 'root' })} /></FormSheetHost></>;
  }
  if (route.name === 'wishForm') {
    const selectedWish = route.wishId ? wishItems.find((item) => item.id === route.wishId) : undefined;
    const background = selectedWish ? <WishDetailScreen wishId={selectedWish.id} activeTab={tab} onBack={() => setRoute({ name: 'wishes' })} onEdit={() => undefined} onDeleted={() => setRoute({ name: 'wishes' })} onSelectTab={selectTab} /> : wishes();
    return <>{background}<FormSheetHost><WishFormSheetScreen mode={route.mode} wish={selectedWish} onClose={() => setRoute(selectedWish ? { name: 'wish', wishId: selectedWish.id } : { name: 'wishes' })} onSaved={(wishId) => setRoute(wishId ? { name: 'wish', wishId } : { name: 'wishes' })} /></FormSheetHost></>;
  }
  if (route.name === 'wish') return <WishDetailScreen wishId={route.wishId} activeTab={tab} onBack={() => setRoute({ name: 'wishes' })} onEdit={() => setRoute({ name: 'wishForm', mode: 'edit', wishId: route.wishId })} onDeleted={() => setRoute({ name: 'wishes' })} onSelectTab={selectTab} />;
  if (route.name === 'wishes') return wishes();
  if (route.name === 'contactForm') {
    const selectedContact = route.contactId ? contactItems.find((item) => item.id === route.contactId) : undefined;
    const background = selectedContact ? <ContactDetailScreen contactId={selectedContact.id} activeTab={tab} onBack={() => setRoute({ name: 'contacts' })} onEdit={() => undefined} onDeleted={() => setRoute({ name: 'contacts' })} onSelectTab={selectTab} /> : contacts();
    return <>{background}<FormSheetHost><ContactFormSheetScreen mode={route.mode} contact={selectedContact} onClose={() => setRoute(selectedContact ? { name: 'contact', contactId: selectedContact.id } : { name: 'contacts' })} onSaved={(contactId) => setRoute(contactId ? { name: 'contact', contactId } : { name: 'contacts' })} /></FormSheetHost></>;
  }
  if (route.name === 'contact') return <ContactDetailScreen contactId={route.contactId} activeTab={tab} onBack={() => setRoute({ name: 'contacts' })} onEdit={() => setRoute({ name: 'contactForm', mode: 'edit', contactId: route.contactId })} onDeleted={() => setRoute({ name: 'contacts' })} onSelectTab={selectTab} />;
  if (route.name === 'contacts') return contacts();
  if (route.name === 'notes') return notes();
  if (route.name === 'objectiveForm') {
    const objective = route.objectiveId ? objectives.find((item) => item.id === route.objectiveId) : undefined;
    const background = objective ? <ObjectiveDetailScreen objective={objective} animals={animals} onBack={() => setRoute({ name: 'root' })} onEdit={() => undefined} onDeleted={() => setRoute({ name: 'root' })} onDuplicate={() => undefined} /> : rootContext();
    return <>{background}<FormSheetHost><ObjectiveFormSheetScreen mode={route.mode} objective={objective} animals={animals} onClose={() => { resetObjectiveWizard(); setRoute(objective ? { name: 'objective', objectiveId: objective.id } : { name: 'root' }); }} onSaved={(objectiveId) => { resetObjectiveWizard(); setTab('tracking'); setRoute(objectiveId ? { name: 'objective', objectiveId } : { name: 'root' }); }} /></FormSheetHost></>;
  }
  if (route.name === 'animalForm') {
    const animal = route.animalId ? animals.find((item) => item.id === route.animalId) : undefined;
    return <>{rootContext()}<FormSheetHost><AnimalFormSheetScreen mode={route.mode} animal={animal} onClose={() => { resetAnimalWizard(); setRoute({ name: 'root' }); }} onSaved={(savedAnimal) => { setPreferredAnimalId(savedAnimal.id); setAnimalFeedback(route.mode === 'edit' ? 'Les modifications ont bien été enregistrées.' : `${savedAnimal.nom} a bien été ajouté à vos animaux.`); resetAnimalWizard(); setTab('animals'); setRoute({ name: 'root' }); }} /></FormSheetHost></>;
  }
  if (route.name === 'animalAction') {
    const animal = animals.find((item) => item.id === route.animalId);
    if (!animal) return rootContext();
    return <>{rootContext()}<AnimalActionDialogs action={route.action} animal={animal} onClose={() => setRoute({ name: 'root' })} onDone={() => setRoute({ name: 'root' })} /></>;
  }
  if (route.name === 'eventCreateGroupsPremium') return <PremiumRequiredPattern feature="groups" onBack={() => setRoute({ name: 'eventCreateOptions' })} onComparePlans={() => undefined} />;
  if (route.name === 'eventEditGroupsPremium') return <PremiumRequiredPattern feature="groups" onBack={() => setRoute({ name: 'eventEditOptions', eventId: route.eventId })} onComparePlans={() => undefined} />;
  if (route.name === 'eventEditOptions') return <>{eventContext(route.eventId)}<FormSheetHost><EventCreateOptionsScreen eventId={route.eventId} onBack={() => setRoute({ name: 'eventEditAnimals', eventId: route.eventId })} onClose={() => setRoute({ name: 'event', eventId: route.eventId })} onCreated={(eventId) => { resetWizard(); setRoute({ name: 'event', eventId: eventId ?? route.eventId, feedback: 'Les modifications ont bien été enregistrées.' }); }} onPremiumGroups={() => setRoute({ name: 'eventEditGroupsPremium', eventId: route.eventId })} /></FormSheetHost></>;
  if (route.name === 'eventEditAnimals') return <>{eventContext(route.eventId)}<FormSheetHost><EventCreateAnimalsScreen onBack={() => setRoute({ name: 'eventEditDetails', eventId: route.eventId })} onClose={() => setRoute({ name: 'event', eventId: route.eventId })} onContinue={() => setRoute({ name: 'eventEditOptions', eventId: route.eventId })} /></FormSheetHost></>;
  if (route.name === 'eventEditDetails') return <>{eventContext(route.eventId)}<FormSheetHost><EventCreateDetailsScreen onBack={() => setRoute({ name: 'event', eventId: route.eventId })} onClose={() => setRoute({ name: 'event', eventId: route.eventId })} onContinue={() => setRoute({ name: 'eventEditAnimals', eventId: route.eventId })} /></FormSheetHost></>;
  if (route.name === 'eventDuplicateGroupsPremium') return <PremiumRequiredPattern feature="groups" onBack={() => setRoute({ name: 'eventDuplicateOptions', sourceEventId: route.sourceEventId })} onComparePlans={() => undefined} />;
  if (route.name === 'eventDuplicateOptions') return <>{eventContext(route.sourceEventId)}<FormSheetHost><EventCreateOptionsScreen onBack={() => setRoute({ name: 'eventDuplicateAnimals', sourceEventId: route.sourceEventId })} onClose={() => setRoute({ name: 'event', eventId: route.sourceEventId })} onCreated={(eventId) => { resetWizard(); setRoute({ name: 'eventCreateSuccess', eventId }); }} onPremiumGroups={() => setRoute({ name: 'eventDuplicateGroupsPremium', sourceEventId: route.sourceEventId })} /></FormSheetHost></>;
  if (route.name === 'eventDuplicateAnimals') return <>{eventContext(route.sourceEventId)}<FormSheetHost><EventCreateAnimalsScreen onBack={() => setRoute({ name: 'eventDuplicateDetails', sourceEventId: route.sourceEventId })} onClose={() => setRoute({ name: 'event', eventId: route.sourceEventId })} onContinue={() => setRoute({ name: 'eventDuplicateOptions', sourceEventId: route.sourceEventId })} /></FormSheetHost></>;
  if (route.name === 'eventDuplicateDetails') return <>{eventContext(route.sourceEventId)}<FormSheetHost><EventCreateDetailsScreen onBack={() => setRoute({ name: 'event', eventId: route.sourceEventId })} onClose={() => setRoute({ name: 'event', eventId: route.sourceEventId })} onContinue={() => setRoute({ name: 'eventDuplicateAnimals', sourceEventId: route.sourceEventId })} /></FormSheetHost></>;
  if (route.name === 'eventCreateAiPremium') return <PremiumRequiredPattern feature="aiCreation" onBack={() => setRoute({ name: 'eventCreateEntry' })} onComparePlans={() => undefined} />;
  if (route.name === 'eventCreateAiReview') return <>{rootContext()}<FormSheetHost><EventCreateAiReviewScreen onBack={() => setRoute({ name: 'eventCreateAiDescription' })} onClose={() => { resetWizard(); setRoute({ name: 'root' }); }} onEdit={() => setRoute({ name: 'eventCreateDetails' })} onContinue={() => setRoute({ name: 'eventCreateAnimals' })} /></FormSheetHost></>;
  if (route.name === 'eventCreateAiDescription') return <>{rootContext()}<FormSheetHost><EventCreateAiDescriptionScreen onBack={() => setRoute({ name: 'eventCreateEntry' })} onClose={() => { resetWizard(); setRoute({ name: 'root' }); }} onAnalyzed={() => setRoute({ name: 'eventCreateAiReview' })} /></FormSheetHost></>;
  if (route.name === 'eventCreateSuccess') return <EventCreateSuccessScreen onAgenda={agenda} onCreateAnother={() => { resetWizard(); setRoute({ name: 'eventCreateEntry' }); }} />;
  if (route.name === 'eventCreateOptions') return <>{rootContext()}<FormSheetHost><EventCreateOptionsScreen onBack={() => setRoute({ name: 'eventCreateAnimals' })} onClose={() => { resetWizard(); setRoute({ name: 'root' }); }} onCreated={(eventId) => setRoute({ name: 'eventCreateSuccess', eventId })} onPremiumGroups={() => setRoute({ name: 'eventCreateGroupsPremium' })} /></FormSheetHost></>;
  if (route.name === 'eventCreateAnimals') return <>{rootContext()}<FormSheetHost><EventCreateAnimalsScreen onBack={() => setRoute({ name: 'eventCreateDetails' })} onClose={() => { resetWizard(); setRoute({ name: 'root' }); }} onContinue={() => setRoute({ name: 'eventCreateOptions' })} /></FormSheetHost></>;
  if (route.name === 'eventCreateDetails') return <>{rootContext()}<FormSheetHost><EventCreateDetailsScreen onBack={() => setRoute({ name: 'eventCreateType' })} onClose={() => { resetWizard(); setRoute({ name: 'root' }); }} onContinue={() => setRoute({ name: 'eventCreateAnimals' })} /></FormSheetHost></>;
  if (route.name === 'eventCreateType') return <>{rootContext()}<FormSheetHost><EventCreateTypeScreen onBack={() => setRoute({ name: 'eventCreateEntry' })} onClose={() => { resetWizard(); setRoute({ name: 'root' }); }} onContinue={() => setRoute({ name: 'eventCreateDetails' })} /></FormSheetHost></>;
  if (route.name === 'eventCreateEntry') return <>{rootContext()}<FormSheetHost><EventCreateEntryScreen onBack={() => setRoute({ name: 'root' })} onClose={() => setRoute({ name: 'root' })} onGuided={() => setRoute({ name: 'eventCreateType' })} onAi={() => { if (isPremiumSubscription(user?.subscription)) setRoute({ name: 'eventCreateAiDescription' }); else setRoute({ name: 'eventCreateAiPremium' }); }} /></FormSheetHost></>;
  if (route.name === 'event') return <EventDetailScreen eventId={route.eventId} initialFeedback={route.feedback} onBack={() => setRoute({ name: 'root' })} onDeleted={() => setRoute({ name: 'root' })} onEdit={(eventId) => setRoute({ name: 'eventEditDetails', eventId })} onDuplicate={(sourceEventId) => setRoute({ name: 'eventDuplicateDetails', sourceEventId })} />;
  if (route.name === 'objective') {
    const objective = objectives.find((item) => item.id === route.objectiveId);
    if (!objective) return tracking();
    return <ObjectiveDetailScreen objective={objective} animals={animals} initialActionsOpen={route.actionsOpen} onBack={() => setRoute({ name: 'root' })} onEdit={() => setRoute({ name: 'objectiveForm', mode: 'edit', objectiveId: objective.id })} onDeleted={() => setRoute({ name: 'root' })} onDuplicate={() => setRoute({ name: 'objectiveForm', mode: 'create', objectiveId: objective.id })} />;
  }
  if (route.name === 'note') return <NoteDetailScreen noteId={route.noteId} onBack={() => setRoute({ name: 'root' })} onEdit={() => setRoute({ name: 'noteForm', mode: 'edit', noteId: route.noteId })} onDeleted={() => setRoute({ name: 'root' })} />;
  if (route.name === 'day') return <DayAgendaScreen date={route.date} onBack={() => setRoute({ name: 'root' })} onSelectTab={selectTab} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} />;
  if (tab === 'agenda') return <AgendaScreen onSelectTab={selectTab} onOpenDay={(date) => setRoute({ name: 'day', date })} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} onCreate={create} onNotifications={openNotifications} />;
  if (tab === 'animals') return <AnimalsWorkspaceScreen onSelectTab={selectTab} preferredAnimalId={preferredAnimalId} feedback={animalFeedback} onDismissFeedback={() => setAnimalFeedback(undefined)} onCreate={create} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} onAnimalAction={(action, animalId) => setRoute(action === 'edit' ? { name: 'animalForm', mode: 'edit', animalId } : { name: 'animalAction', action, animalId })} onNotifications={openNotifications} />;
  if (tab === 'tracking') return tracking();
  if (tab === 'more') return plus();
  return <HomeScreen onSelectTab={selectTab} onEvent={(eventId) => setRoute({ name: 'event', eventId })} onObjective={(objectiveId) => setRoute({ name: 'objective', objectiveId })} onCreate={create} onNotifications={openNotifications} onAccount={openSettings} />;
}
