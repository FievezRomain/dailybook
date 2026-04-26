import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { authService } from '../services/auth/FirebaseAuthService';
import type { AuthUser } from '../services/auth/IAuthService';
import { secureStorage } from '../utils/secureStorage';
import { getMe } from '../services/api/AuthService';
import { UserProfile } from '../models/User';

interface AuthState {
  firebaseUser: AuthUser | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initAuth: () => () => void;
  setUser: (user: UserProfile | null) => void;
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
        const unsubscribe = authService.onAuthStateChanged(async (authUser) => {
          if (authUser) {
            try {
              const profile = await getMe();
              set({ firebaseUser: authUser, user: profile, isAuthenticated: true, isLoading: false });
            } catch {
              set({ firebaseUser: authUser, user: null, isAuthenticated: true, isLoading: false });
            }
          } else {
            set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },

      setUser: (user) => set({ user }),

      signOutUser: async () => {
        await authService.signOut();
        set({ firebaseUser: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      // On ne persiste que le profil utilisateur, pas les objets auth
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
