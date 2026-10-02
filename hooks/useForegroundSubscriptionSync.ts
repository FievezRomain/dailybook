import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../stores/useAuthStore';
import { notificationService } from '../services/notifications/ExpoNotificationService';
import { openSession } from '../services/api/AuthService';
import { logger } from '../services/logs/LoggerService';

/** Reuse the existing foreground token synchronization to refresh paid access. */
export function useForegroundSubscriptionSync(): void {
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const identity = useAuthStore((state) => state.firebaseUser);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authenticated || !identity?.emailVerified) return;
    let disposed = false;
    let pending = false;
    let previous = AppState.currentState;
    const currentSession = () => !disposed && useAuthStore.getState().isAuthenticated
      && useAuthStore.getState().firebaseUser === identity;

    async function refresh() {
      if (pending || !currentSession()) return;
      pending = true;
      try {
        // Missing notification permission must not block subscription refresh.
        const expotoken = await notificationService.getToken().catch(() => undefined);
        if (!currentSession()) return;
        const result = await openSession({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, expotoken });
        if (!currentSession()) return;
        if (typeof result.subscription !== 'string') throw new Error('INVALID_SUBSCRIPTION_RESPONSE');
        const state = useAuthStore.getState();
        if (state.user && state.user.subscription !== result.subscription) {
          state.setUser({ ...state.user, subscription: result.subscription });
          // Group and other Premium views must not retain their previous access result.
          await queryClient.invalidateQueries();
        }
      } catch {
        // Offline/background refresh is non-blocking: keep the last known value,
        // never announce success and do not send an error payload or identity to logs.
        logger.breadcrumb('auth', 'Foreground subscription refresh unavailable');
      } finally { pending = false; }
    }

    const listener = AppState.addEventListener('change', (state) => {
      const resumed = state === 'active' && previous !== 'active';
      previous = state;
      if (resumed) void refresh();
    });
    return () => { disposed = true; listener.remove(); };
  }, [authenticated, identity, queryClient]);
}
