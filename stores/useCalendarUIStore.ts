import { create } from 'zustand';

type CalendarViewMode = 'month' | 'week' | 'day' | 'agenda';

interface CalendarUIState {
  viewMode: CalendarViewMode;
  selectedDate: string | null;
  activeAnimalFilters: string[];
  activeEventTypeFilters: string[];
  setViewMode: (mode: CalendarViewMode) => void;
  setDate: (date: string | null) => void;
  toggleAnimalFilter: (animalId: string) => void;
  toggleEventTypeFilter: (eventType: string) => void;
  clearFilters: () => void;
}

export const useCalendarUIStore = create<CalendarUIState>()((set) => ({
  viewMode: 'month',
  selectedDate: null,
  activeAnimalFilters: [],
  activeEventTypeFilters: [],

  setViewMode: (viewMode) => set({ viewMode }),

  setDate: (selectedDate) => set({ selectedDate }),

  toggleAnimalFilter: (animalId) =>
    set((state) => ({
      activeAnimalFilters: state.activeAnimalFilters.includes(animalId)
        ? state.activeAnimalFilters.filter((id) => id !== animalId)
        : [...state.activeAnimalFilters, animalId],
    })),

  toggleEventTypeFilter: (eventType) =>
    set((state) => ({
      activeEventTypeFilters: state.activeEventTypeFilters.includes(eventType)
        ? state.activeEventTypeFilters.filter((t) => t !== eventType)
        : [...state.activeEventTypeFilters, eventType],
    })),

  clearFilters: () =>
    set({ activeAnimalFilters: [], activeEventTypeFilters: [] }),
}));
