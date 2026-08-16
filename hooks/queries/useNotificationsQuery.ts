import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as NotificationService from '../../services/api/NotificationService';
import { Notification } from '../../models/Notification';

export const NOTIFICATIONS_KEY = ['notifications'] as const;

export function useNotificationsQuery() {
  return useQuery({
    queryKey: NOTIFICATIONS_KEY,
    queryFn: NotificationService.getNotifications,
  });
}

export function useNotificationMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: NOTIFICATIONS_KEY });

  const markAllAsRead = useMutation({
    mutationFn: NotificationService.markAllAsRead,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const snapshot = queryClient.getQueryData<Notification[]>(NOTIFICATIONS_KEY);
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_KEY, (prev = []) =>
        prev.map((item) => ({ ...item, is_read: true, syncing: true })),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(NOTIFICATIONS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const setRead = useMutation({
    mutationFn: ({ id, isRead }: { id: number; isRead: boolean }) => NotificationService.setRead(id, isRead),
    onMutate: async ({ id, isRead }) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const snapshot = queryClient.getQueryData<Notification[]>(NOTIFICATIONS_KEY);
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_KEY, (prev = []) =>
        prev.map((item) => item.id === id ? { ...item, is_read: isRead, syncing: true } : item),
      );
      return { snapshot };
    },
    onError: async (_error, _variables, context) => {
      if (context?.snapshot) queryClient.setQueryData(NOTIFICATIONS_KEY, context.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: NotificationService.deleteNotification,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATIONS_KEY });
      const snapshot = queryClient.getQueryData<Notification[]>(NOTIFICATIONS_KEY);
      queryClient.setQueryData<Notification[]>(NOTIFICATIONS_KEY, (prev = []) => prev.filter((item) => item.id !== id));
      return { snapshot };
    },
    onError: async (_error, _variables, context) => {
      if (context?.snapshot) queryClient.setQueryData(NOTIFICATIONS_KEY, context.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: invalidate,
  });

  return { markAllAsRead, setRead, remove };
}
