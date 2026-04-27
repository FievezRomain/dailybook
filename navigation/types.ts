import type { NavigatorScreenParams } from '@react-navigation/native';

// ─── Tab Navigator ────────────────────────────────────────────────────────────

export type TabParamList = {
  Accueil: undefined;
  Performance: undefined;
  Calendrier: undefined;
  Animaux: undefined;
  Autre: undefined;
};

// ─── App (main) Stack ─────────────────────────────────────────────────────────

export type AppStackParamList = {
  Tab: NavigatorScreenParams<TabParamList>;
  Settings: undefined;
  Note: { noteId?: string } | undefined;
  Contact: { contactId?: string } | undefined;
  Wish: { wishId?: string } | undefined;
  DiscoverPremium: undefined;
  Account: undefined;
  GroupList: undefined;
  GroupDetail: { groupId: string };
  Notification: undefined;
  // ── Animals ──────────────────────────────────────────────────────────────
  AnimalDetail: { animalId: number };
  AnimalAddWizard: undefined;
  // ── Events wizard ────────────────────────────────────────────────────────
  EventEntry: undefined;
  EventAI: { prefilled?: string } | undefined;
  EventWizardType: undefined;
  EventWizardForm: { eventType: string; prefilled?: Record<string, unknown> } | undefined;
  EventWizardAnimals: { formData: Record<string, unknown> };
  EventWizardOptions: { formData: Record<string, unknown> };
  // ── Notes / Objectifs ────────────────────────────────────────────────────
  NoteAI: undefined;
  ObjectifList: undefined;
  ObjectifAdd: undefined;
};

// ─── Auth Stack ───────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Loading: undefined;
  VerifyEmail: undefined;
  App: NavigatorScreenParams<AppStackParamList>;
  Home: undefined;
  Login: undefined;
  Register: undefined;
  FirstPageAddAnimal: undefined;
};

// ─── Root (NavigationContainer) ───────────────────────────────────────────────

export type RootParamList = AuthStackParamList & AppStackParamList;

// ─── Screen prop helpers ──────────────────────────────────────────────────────

import type {
  NativeStackNavigationProp,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps } from '@react-navigation/native';

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, T>,
  NativeStackScreenProps<AppStackParamList>
>;

// Convenience navigation-prop-only type for components that just navigate
export type AppNavigationProp = NativeStackNavigationProp<AppStackParamList>;
