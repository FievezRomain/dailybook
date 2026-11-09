import { useRegistrationDraft } from '../features/auth/stores/useRegistrationDraft';
import { useAnimalWizardStore } from './useAnimalWizardStore';
import { useCalendarUIStore } from './useCalendarUIStore';
import { useEventWizardStore } from './useEventWizardStore';
import { useListExplorationStore } from './useListExplorationStore';
import { useMainNavigationStore } from './useMainNavigationStore';
import { useNotificationNavigationStore } from './useNotificationNavigationStore';
import { useObjectiveWizardStore } from './useObjectiveWizardStore';

export function clearAccountStores() {
  useAnimalWizardStore.getState().reset();
  useEventWizardStore.getState().reset();
  useObjectiveWizardStore.getState().reset();
  useRegistrationDraft.getState().reset();
  useCalendarUIStore.setState({
    viewMode: 'month',
    selectedDate: null,
    activeAnimalFilters: [],
    activeEventTypeFilters: [],
  });
  useListExplorationStore.setState({ entries: {} });
  useMainNavigationStore.setState({
    tab: 'home',
    createOrigin: 'root',
    preferredAnimalId: undefined,
    voiceRecording: undefined,
    voiceDraft: undefined,
    animalFeedback: undefined,
    agendaFeedback: undefined,
  });
  useNotificationNavigationStore.setState({ requestId: 0 });
}
