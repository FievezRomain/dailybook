import { create } from 'zustand';

interface NotificationNavigationState {
  requestId: number;
  requestOpen: () => void;
}

export const useNotificationNavigationStore = create<NotificationNavigationState>((set) => ({
  requestId: 0,
  requestOpen: () => set((state) => ({ requestId: state.requestId + 1 })),
}));
