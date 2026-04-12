import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { getFirebaseAuth } from '../firebase';
import { getMe } from '../services/api/AuthService';
import { UserProfile } from '../models/User';

interface AuthState {
  firebaseUser: User | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initAuth: () => () => void;
  setUser: (user: UserProfile | null) => void;
  signOutUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      firebaseUser: null,
      user: null,
      isAuthenticated: false,
      isLoading: true,

      /**
       * Lance l'écoute des changements d'état Firebase.
       * Retourne la fonction d'unsubscribe à appeler au démontage.
       */
      initAuth: () => {
        const auth = getFirebaseAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const profile = await getMe();
              set({ firebaseUser, user: profile, isAuthenticated: true, isLoading: false });
            } catch {
              set({ firebaseUser, user: null, isAuthenticated: true, isLoading: false });
            }
          } else {
            set({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: false });
          }
        });
        return unsubscribe;
      },

      setUser: (user) => set({ user }),

      signOutUser: async () => {
        await signOut(getFirebaseAuth());
        set({ firebaseUser: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // On ne persiste que le profil utilisateur, pas les objets Firebase
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    },
  ),
);
