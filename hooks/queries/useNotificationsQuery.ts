import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as NotificationService from '../../services/api/NotificationService';

export const NOTIFICATIONS_KEY = ['notifications'] as const;

export function useNotificationsQuery() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: NotificationService.getNotifications,
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();

  const markAllAsRead = useMutation({
    mutationFn: NotificationService.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY }),
  });

  return { markAllAsRead };
}
