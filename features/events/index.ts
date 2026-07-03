// Events feature — public API
export { default as CalendarScreen } from './screens/CalendarScreen';
export { default as ActionScreen } from './screens/ActionScreen';
export { default as EventEntryScreen } from './screens/EventEntryScreen';
export { default as EventAIScreen } from './screens/EventAIScreen';
export { default as EventTypeScreen } from './screens/EventTypeScreen';
export { default as EventFormScreen } from './screens/EventFormScreen';
export { default as EventAnimalsScreen } from './screens/EventAnimalsScreen';
export { default as EventOptionsScreen } from './screens/EventOptionsScreen';

export { default as EventsBloc } from './components/EventsBloc';
export { default as ModalEventDetails } from './components/ModalEventDetails';
export { default as ModalEvents } from './components/ModalEvents';
export { default as ModalFilterCalendar } from './components/ModalFilterCalendar';

export { useEventForm } from './hooks/useEventForm';

export type { ActionType, CreateEventPayload } from './types';
