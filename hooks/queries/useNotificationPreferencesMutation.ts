import { useMutation } from '@tanstack/react-query';
import { updateNotificationPreferences } from '../../services/api/AuthService';
import { useAuthStore } from '../../stores/useAuthStore';

export function useNotificationPreferencesMutation() {
  const setUser = useAuthStore((state) => state.setUser);
  return useMutation({
    mutationFn: updateNotificationPreferences,
    onSuccess: ({ daily_reminder_enabled }) => {
      const current = useAuthStore.getState().user;
      if (current) setUser({ ...current, daily_reminder_enabled });
    },
  });
}
