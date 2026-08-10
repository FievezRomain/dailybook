import { useState } from 'react';
import { AnimalActionDialogs, AnimalFormSheetScreen, AnimalsWorkspaceScreen, type SensitiveAnimalAction } from '../../features/animals';
import { AgendaScreen, DayAgendaScreen, EventCreateAiDescriptionScreen, EventCreateAiReviewScreen, EventCreateAnimalsScreen, EventCreateDetailsScreen, EventCreateEntryScreen, EventCreateOptionsScreen, EventCreateSuccessScreen, EventCreateTypeScreen, EventDetailScreen, isPremiumSubscription } from '../../features/events';
import { HomeScreen, type MainTabId } from '../../features/home';
import { FormSheetHost, PremiumRequiredPattern } from '../../shared/components/ui';
import { useAuthStore } from '../../stores/useAuthStore';
import { useEventWizardStore } from '../../stores/useEventWizardStore';
import { useAnimalsQuery } from '../../hooks/queries/useAnimalsQuery';
import { useAnimalWizardStore } from '../../stores/useAnimalWizardStore';
import { TrackingScreen } from '../../features/objectifs';

export function MainNavigator() {
  const [tab, setTab] = useState<MainTabId>('home');
  const [preferredAnimalId, setPreferredAnimalId] = useState<number>();
  const [statisticsGate, setStatisticsGate] = useState(false);
  const [animalFeedback, setAnimalFeedback] = useState<string>();
  const resetWizard = useEventWizardStore((state) => state.reset);
  const resetAnimalWizard = useAnimalWizardStore((state) => state.reset);
  const animals = useAnimalsQuery().data ?? [];
  const user = useAuthStore((state) => state.user);
  const [route, setRoute] = useState<{ name: 'root' } | { name: 'day'; date: string } | { name: 'event'; eventId: number; feedback?: string } | { name: 'animalForm'; mode: 'create' | 'edit'; animalId?: number } | { name: 'animalAction'; action: SensitiveAnimalAction; animalId: number } | { name: 'eventCreateEntry' } | { name: 'eventCreateType' } | { name: 'eventCreateDetails' } | { name: 'eventCreateAnimals' } | { name: 'eventCreateOptions' } | { name: 'eventCreateSuccess'; eventId?: number } | { name: 'eventCreateAiPremium' } | { name: 'eventCreateAiDescription' } | { name: 'eventCreateAiReview' } | { name: 'eventCreateGroupsPremium' } | { name: 'eventEditDetails'; eventId: number } | { name: 'eventEditAnimals'; eventId: number } | { name: 'eventEditOptions'; eventId: number } | { name: 'eventEditGroupsPremium'; eventId: number } | { name: 'eventDuplicateDetails'; sourceEventId: number } | { name: 'eventDuplicateAnimals'; sourceEventId: number } | { name: 'eventDuplicateOptions'; sourceEventId: number } | { name: 'eventDuplicateGroupsPremium'; sourceEventId: number }>({ name: 'root' });
  const selectTab = (next: MainTabId) => { setTab(next); setRoute({ name: 'root' }); };
  const create = (target: string) => {
    if (target === 'animal') { resetAnimalWizard(); setRoute({ name: 'animalForm', mode: 'create' }); return; }
    if (target !== 'event') return;
    resetWizard();
    setRoute({ name: 'eventCreateEntry' });
  };
  const agenda = () => { resetWizard(); setTab('agenda'); setRoute({ name: 'root' }); };
  const tracking = () => <TrackingScreen onSelectTab={selectTab} onCreate={create} onCreateObjective={() => create('objective')} onOpenObjective={() => undefined} onObjectiveActions={() => undefined} onStatistics={() => { if (!isPremiumSubscription(user?.subscription)) setStatisticsGate(true); }} />;
  const rootContext = () => tab === 'agenda'
    ? <AgendaScreen onSelectTab={selectTab} onOpenDay={(date) => setRoute({ name: 'day', date })} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} onCreate={create} />
    : tab === 'animals' ? <AnimalsWorkspaceScreen onSelectTab={selectTab} preferredAnimalId={preferredAnimalId} feedback={animalFeedback} onDismissFeedback={() => setAnimalFeedback(undefined)} onCreate={create} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} onAnimalAction={(action, animalId) => setRoute(action === 'edit' ? { name: 'animalForm', mode: 'edit', animalId } : { name: 'animalAction', action, animalId })} />
    : tab === 'tracking' ? tracking()
    : <HomeScreen onSelectTab={selectTab} onEvent={(eventId) => setRoute({ name: 'event', eventId })} onCreate={create} />;
  const eventContext = (eventId: number) => <EventDetailScreen eventId={eventId} onBack={() => setRoute({ name: 'root' })} onDeleted={() => setRoute({ name: 'root' })} onEdit={(id) => setRoute({ name: 'eventEditDetails', eventId: id })} onDuplicate={(sourceEventId) => setRoute({ name: 'eventDuplicateDetails', sourceEventId })} />;
  if (statisticsGate) return <PremiumRequiredPattern feature="statistics" onBack={() => setStatisticsGate(false)} onComparePlans={() => undefined} />;
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
  if (route.name === 'day') return <DayAgendaScreen date={route.date} onBack={() => setRoute({ name: 'root' })} onSelectTab={selectTab} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} />;
  if (tab === 'agenda') return <AgendaScreen onSelectTab={selectTab} onOpenDay={(date) => setRoute({ name: 'day', date })} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} onCreate={create} />;
  if (tab === 'animals') return <AnimalsWorkspaceScreen onSelectTab={selectTab} preferredAnimalId={preferredAnimalId} feedback={animalFeedback} onDismissFeedback={() => setAnimalFeedback(undefined)} onCreate={create} onOpenEvent={(eventId) => setRoute({ name: 'event', eventId })} onAnimalAction={(action, animalId) => setRoute(action === 'edit' ? { name: 'animalForm', mode: 'edit', animalId } : { name: 'animalAction', action, animalId })} />;
  if (tab === 'tracking') return tracking();
  return <HomeScreen onSelectTab={selectTab} onEvent={(eventId) => setRoute({ name: 'event', eventId })} onCreate={create} />;
}
