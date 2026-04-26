import { useMemo } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { getFirebaseAuth } from '../firebase';

interface CurrentUser {
  /** Profile utilisateur (backend) */
  user: ReturnType<typeof useAuthStore.getState>['user'];
  /** Roles issus des custom claims Firebase */
  roles: string[];
  /** ID interne backend (custom claim) */
  internal_id: string | null;
  /** Vérifie si l'utilisateur possède un rôle donné */
  hasRole: (role: string) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

/**
 * Hook RBAC — expose l'utilisateur courant avec ses rôles et claims Firebase.
 * Les rôles et internal_id sont lus depuis les custom claims du token Firebase.
 * Pour les rafraîchir, appeler `getIdTokenResult(true)` depuis l'AuthService.
 */
export function useCurrentUser(): CurrentUser {
  const { user, firebaseUser, isAuthenticated, isLoading } = useAuthStore();

  const { roles, internal_id } = useMemo(() => {
    // Les custom claims sont synchronisées dans le token lors du refresh.
    // On lit la version en cache depuis `firebaseUser` pour éviter un appel async ici.
    const claims = (firebaseUser as { _tokenResponse?: { claims?: Record<string, unknown> } } | null)
      ?._tokenResponse?.claims;

    return {
      roles: Array.isArray(claims?.['roles']) ? (claims!['roles'] as string[]) : [],
      internal_id: typeof claims?.['internal_id'] === 'string' ? (claims['internal_id'] as string) : null,
    };
  }, [firebaseUser]);

  const hasRole = useMemo(
    () => (role: string) => roles.includes(role),
    [roles],
  );

  return {
    user,
    roles,
    internal_id,
    hasRole,
    isAuthenticated,
    isLoading,
  };
}
