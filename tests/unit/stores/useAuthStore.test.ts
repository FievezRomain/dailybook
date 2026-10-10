import type { AuthUser } from '../../../services/auth/IAuthService';

const mocks = {
  authListener: undefined as ((user: AuthUser | null) => void) | undefined,
  clearQueries: jest.fn(),
  getMe: jest.fn(),
  openSession: jest.fn(),
  removeItem: jest.fn(),
  signOut: jest.fn(),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: { removeItem: mocks.removeItem },
}));
jest.mock('../../../services/query/queryClient', () => ({
  clearAuthenticatedQueryState: mocks.clearQueries,
}));
jest.mock('../../../stores/clearAccountStores', () => ({ clearAccountStores: jest.fn() }));
jest.mock('../../../services/api/AuthService', () => ({
  getMe: mocks.getMe,
  openSession: mocks.openSession,
}));
jest.mock('../../../services/notifications/ExpoNotificationService', () => ({
  notificationService: { getToken: jest.fn().mockResolvedValue(undefined) },
}));
jest.mock('../../../services/auth/FirebaseAuthService', () => ({
  authService: {
    onAuthStateChanged: (listener: (user: AuthUser | null) => void) => {
      mocks.authListener = listener;
      return jest.fn();
    },
    refreshCurrentUser: jest.fn(),
    getIdToken: jest.fn(),
    signOut: mocks.signOut,
  },
}));

import { useAuthStore } from '../../../stores/useAuthStore';

const authUser = (uid: string, emailVerified = false): AuthUser => ({
  uid,
  email: `${uid}@example.test`,
  displayName: uid,
  emailVerified,
  photoURL: null,
});

describe('useAuthStore account isolation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mocks.authListener = undefined;
    useAuthStore.setState({ firebaseUser: null, user: null, isAuthenticated: false, isLoading: true });
  });

  it('drops the previous profile and all query data when the Firebase uid changes', () => {
    useAuthStore.getState().initAuth();
    mocks.authListener?.(authUser('first-account'));
    useAuthStore.setState({ user: { id: 1, prenom: 'Ancien compte' } as never });

    mocks.authListener?.(authUser('second-account'));

    expect(useAuthStore.getState().firebaseUser?.uid).toBe('second-account');
    expect(useAuthStore.getState().user).toBeNull();
    expect(mocks.clearQueries).toHaveBeenCalledTimes(2);
    expect(mocks.removeItem).toHaveBeenCalledWith('auth-storage');
  });

  it('clears local account data before Firebase sign-out completes', async () => {
    mocks.signOut.mockResolvedValue(undefined);
    useAuthStore.setState({
      firebaseUser: authUser('first-account'),
      user: { id: 1, prenom: 'Ancien compte' } as never,
      isAuthenticated: true,
    });

    await useAuthStore.getState().signOutUser();

    expect(useAuthStore.getState()).toMatchObject({ firebaseUser: null, user: null, isAuthenticated: false });
    expect(mocks.clearQueries).toHaveBeenCalledTimes(1);
    expect(mocks.signOut).toHaveBeenCalledTimes(1);
  });

  it('ignores a late profile response from the previous Firebase account', async () => {
    let resolveOldProfile: ((value: unknown) => void) | undefined;
    mocks.openSession.mockResolvedValue({ subscription: 'Premium' });
    mocks.getMe.mockImplementation(() => new Promise((resolve) => { resolveOldProfile = resolve; }));
    useAuthStore.getState().initAuth();

    mocks.authListener?.(authUser('first-account', true));
    await Promise.resolve();
    await Promise.resolve();
    mocks.authListener?.(authUser('second-account'));
    resolveOldProfile?.({ id: 1, prenom: 'Ancien compte' });
    await Promise.resolve();
    await Promise.resolve();

    expect(useAuthStore.getState().firebaseUser?.uid).toBe('second-account');
    expect(useAuthStore.getState().user).toBeNull();
  });
});
