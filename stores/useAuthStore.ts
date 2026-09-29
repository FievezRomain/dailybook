import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth/FirebaseAuthService';
import type { AuthUser } from '../services/auth/IAuthService';
import { getMe, openSession } from '../services/api/AuthService';
import { UserProfile } from '../models/User';
import { notificationService } from '../services/notifications/ExpoNotificationService';

interface AuthState {
  firebaseUser: AuthUser | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initAuth: () => () => void;
  setUser: (user: UserProfile | null) => void;
  refreshFirebaseUser: () => Promise<AuthUser | null>;
  signOutUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      firebaseUser: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      /**
       * Lance l'écoute des changements d'état d'authentification.
       * Retourne la fonction d'unsubscribe à appeler au démontage.
       */
      initAuth: () => {
        const unsubscribe = authService.onAuthStateChanged((authUser) => {
          if (authUser) {
            set((state) => ({
              firebaseUser: authUser,
              user: state.user,
              isAuthenticated: true,
              isLoading: false,
            }));

            if (authUser.emailVerified) {
              void notificationService.getToken().catch(() => undefined)
                .then((expotoken) => openSession({ firstName: authUser.displayName ?? undefined, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, expotoken }))
                .then(async (session) => ({ ...(await getMe()), subscription: session.subscription }))
                .then((profile) => set({ user: profile }))
                .catch(() => undefined);
            }
          } else {
            set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },

      setUser: (user) => set({ user }),

      refreshFirebaseUser: async () => {
        const firebaseUser = await authService.refreshCurrentUser();
        set({ firebaseUser, isAuthenticated: Boolean(firebaseUser) });
        if (firebaseUser?.emailVerified) {
          await authService.getIdToken(true);
          const expotoken = await notificationService.getToken().catch(() => undefined);
          const session = await openSession({ firstName: firebaseUser.displayName ?? undefined, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, expotoken });
          const profile = { ...(await getMe()), subscription: session.subscription };
          set({ user: profile });
        }
        return firebaseUser;
      },

      signOutUser: async () => {
        await authService.signOut();
        set({ firebaseUser: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // On ne persiste que le profil utilisateur, pas les objets auth
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
