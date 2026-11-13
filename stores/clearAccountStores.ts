import { useRegistrationDraft } from '../features/auth/stores/useRegistrationDraft';
import { useAnimalWizardStore } from './useAnimalWizardStore';
import { useCalendarUIStore } from './useCalendarUIStore';
import { useEventWizardStore } from './useEventWizardStore';
import { useListExplorationStore } from './useListExplorationStore';
import { useNotificationNavigationStore } from './useNotificationNavigationStore';
import { useObjectiveWizardStore } from './useObjectiveWizardStore';
import { useTrackingUIStore } from './useTrackingUIStore';

export function clearAccountStores() {
  useAnimalWizardStore.getState().reset();
  useEventWizardStore.getState().reset();
  useObjectiveWizardStore.getState().reset();
  useRegistrationDraft.getState().reset();
  useCalendarUIStore.setState({
    viewMode: 'month',
    selectedDate: null,
    searchQuery: '',
    activeAnimalFilters: [],
    activeEventTypeFilters: [],
  });
  useListExplorationStore.setState({ entries: {} });
  useTrackingUIStore.setState({
    activeTab: 'objectives',
    selectedAnimalId: undefined,
    statisticsAnimalSelection: 'all',
    objectiveList: 'active',
    statisticsPeriod: 'month',
    statisticsAnchor: new Date().toISOString(),
    selectedStatistic: undefined,
    historyExpanded: false,
  });
  useNotificationNavigationStore.setState({ requestId: 0 });
}
