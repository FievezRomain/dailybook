import { useRegistrationDraft } from '../features/auth/stores/useRegistrationDraft';
import { useAnimalWizardStore } from './useAnimalWizardStore';
import { useCalendarUIStore } from './useCalendarUIStore';
import { useEventWizardStore } from './useEventWizardStore';
import { useListExplorationStore } from './useListExplorationStore';
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
  useNotificationNavigationStore.setState({ requestId: 0 });
}
