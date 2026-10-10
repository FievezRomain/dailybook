import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/auth/FirebaseAuthService';
import type { AuthUser } from '../services/auth/IAuthService';
import { getMe, openSession } from '../services/api/AuthService';
import { UserProfile } from '../models/User';
import { notificationService } from '../services/notifications/ExpoNotificationService';
import { clearAuthenticatedQueryState } from '../services/query/queryClient';
import { clearAccountStores } from './clearAccountStores';

const legacyAuthStorageKey = 'auth-storage';
let authRevision = 0;

function clearAccountState() {
  clearAuthenticatedQueryState();
  clearAccountStores();
  void AsyncStorage.removeItem(legacyAuthStorageKey);
}

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

export const useAuthStore = create<AuthState>((set, get) => ({
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
          const revision = ++authRevision;
          const previousUid = get().firebaseUser?.uid;
          if (authUser) {
            if (previousUid !== authUser.uid) clearAccountState();
            set({
              firebaseUser: authUser,
              user: previousUid === authUser.uid ? get().user : null,
              isAuthenticated: true,
              isLoading: false,
            });

            if (authUser.emailVerified) {
              void notificationService.getToken().catch(() => undefined)
                .then((expotoken) => openSession({ firstName: authUser.displayName ?? undefined, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, expotoken }))
                .then(async (session) => ({ ...(await getMe()), subscription: session.subscription }))
                .then((profile) => {
                  if (revision === authRevision && get().firebaseUser?.uid === authUser.uid) set({ user: profile });
                })
                .catch(() => undefined);
            }
          } else {
            clearAccountState();
            set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },

      setUser: (user) => set({ user }),

      refreshFirebaseUser: async () => {
        const revision = ++authRevision;
        const firebaseUser = await authService.refreshCurrentUser();
        const previousUid = get().firebaseUser?.uid;
        const sameIdentity = Boolean(firebaseUser && previousUid === firebaseUser.uid);
        if (!sameIdentity) clearAccountState();
        set({ firebaseUser, user: sameIdentity ? get().user : null, isAuthenticated: Boolean(firebaseUser), isLoading: false });
        if (firebaseUser?.emailVerified) {
          await authService.getIdToken(true);
          const expotoken = await notificationService.getToken().catch(() => undefined);
          const session = await openSession({ firstName: firebaseUser.displayName ?? undefined, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, expotoken });
          const profile = { ...(await getMe()), subscription: session.subscription };
          if (revision === authRevision && get().firebaseUser?.uid === firebaseUser.uid) set({ user: profile });
        }
        return firebaseUser;
      },

      signOutUser: async () => {
        ++authRevision;
        set({ firebaseUser: null, user: null, isAuthenticated: false });
        clearAccountState();
        await authService.signOut();
      },
}));
