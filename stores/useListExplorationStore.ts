import { create } from 'zustand';

export interface ListExplorationEntry {
  scrollOffset: number;
  filters?: unknown;
  selectedId?: string | null;
}

interface ListExplorationStore {
  entries: Record<string, ListExplorationEntry>;
  updateEntry: (key: string, patch: Partial<ListExplorationEntry>) => void;
  clearEntry: (key: string) => void;
}

export const useListExplorationStore = create<ListExplorationStore>()((set) => ({
  entries: {},
  updateEntry: (key, patch) => set((state) => ({ entries: { ...state.entries, [key]: { ...(state.entries[key] ?? { scrollOffset: 0 }), ...patch } } })),
  clearEntry: (key) => set((state) => { const entries = { ...state.entries }; delete entries[key]; return { entries }; }),
}));
