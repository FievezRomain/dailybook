import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance, type ColorSchemeName } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type ThemePreference = 'system' | 'light' | 'dark';
export type ResolvedTheme = 'light' | 'dark';

const resolveTheme = (preference: ThemePreference, systemScheme: ColorSchemeName): ResolvedTheme =>
  preference === 'system' ? (systemScheme === 'dark' ? 'dark' : 'light') : preference;

interface ThemeState {
  preference: ThemePreference;
  resolvedTheme: ResolvedTheme;
  setPreference: (preference: ThemePreference) => void;
  syncSystemTheme: (scheme: ColorSchemeName) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      preference: 'system',
      resolvedTheme: resolveTheme('system', Appearance.getColorScheme()),
      setPreference: (preference) =>
        set({ preference, resolvedTheme: resolveTheme(preference, Appearance.getColorScheme()) }),
      syncSystemTheme: (scheme) => {
        if (get().preference === 'system') set({ resolvedTheme: resolveTheme('system', scheme) });
      },
    }),
    {
      name: 'vasco-theme',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: ({ preference }) => ({ preference }),
      merge: (persisted, current) => {
        const preference = (persisted as Partial<ThemeState>)?.preference ?? 'system';
        return { ...current, preference, resolvedTheme: resolveTheme(preference, Appearance.getColorScheme()) };
      },
    },
  ),
);
