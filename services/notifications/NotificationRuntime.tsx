import { useEffect } from 'react';
import { AppState } from 'react-native';
import { useQueryClient } from '@tanstack/react-query';
import { NOTIFICATIONS_KEY, useNotificationsQuery } from '../../hooks/queries/useNotificationsQuery';
import { useAuthStore } from '../../stores/useAuthStore';
import { useNotificationNavigationStore } from '../../stores/useNotificationNavigationStore';
import { notificationService } from './ExpoNotificationService';
import { openSession } from '../api/AuthService';

export function NotificationRuntime() {
  const authenticated = useAuthStore((state) => state.isAuthenticated);
  const firebaseUser = useAuthStore((state) => state.firebaseUser);
  const sessionReady = authenticated && Boolean(firebaseUser);
  const queryClient = useQueryClient();
  const query = useNotificationsQuery(sessionReady);
  const requestOpen = useNotificationNavigationStore((state) => state.requestOpen);
  const unread = (query.data ?? []).filter((notification) => !notification.is_read).length;

  useEffect(() => {
    if (authenticated && !sessionReady) return;
    void notificationService.setBadgeCount(sessionReady ? unread : 0).catch(() => undefined);
  }, [authenticated, sessionReady, unread]);

  useEffect(() => {
    if (!sessionReady) return;
    const refresh = () => void queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });
    const open = () => {
      refresh();
      requestOpen();
    };
    const removeReceived = notificationService.addReceivedListener(refresh);
    const removeResponse = notificationService.addResponseListener(open);
    void notificationService.hasLastResponse().then((hasResponse) => {
      if (hasResponse) open();
    }).catch(() => undefined);
    return () => {
      removeReceived();
      removeResponse();
    };
  }, [queryClient, requestOpen, sessionReady]);

  useEffect(() => {
    if (!sessionReady) return;
    const syncToken = () => {
      void notificationService.getToken().catch(() => undefined).then((expotoken) =>
        openSession({ timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, expotoken }),
      ).catch(() => undefined);
    };
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') syncToken();
    });
    return () => subscription.remove();
  }, [sessionReady]);

  return null;
}
