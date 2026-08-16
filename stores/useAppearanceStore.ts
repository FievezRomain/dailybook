import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface AppearanceState {
  glassEnabled: boolean;
  reduceMotion: boolean;
  setGlassEnabled: (enabled: boolean) => void;
  setReduceMotion: (enabled: boolean) => void;
}

export const useAppearanceStore = create<AppearanceState>()(persist((set) => ({
  glassEnabled: true,
  reduceMotion: false,
  setGlassEnabled: (glassEnabled) => set({ glassEnabled }),
  setReduceMotion: (reduceMotion) => set({ reduceMotion }),
}), { name: 'vasco-appearance', storage: createJSONStorage(() => AsyncStorage) }));
