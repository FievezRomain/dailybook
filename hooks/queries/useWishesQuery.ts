import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as WishService from '../../services/api/WishService';
import { CreateWishPayload, UpdateWishPayload } from '../../features/wishes/types';
import { Wish } from '../../models/Wish';

export const WISHES_KEY = ['wishes'] as const;

export function useWishesQuery() {
  return useQuery({
    queryKey: WISHES_KEY,
    queryFn: WishService.getWishes,
  });
}

export function useWishMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: WISHES_KEY });

  const create = useMutation({
    mutationFn: (body: FormData | CreateWishPayload) => WishService.createWish(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: WISHES_KEY });
      const snapshot = queryClient.getQueryData<Wish[]>(WISHES_KEY);
      const patch = body instanceof FormData ? {} : body;
      const optimistic = { ...patch, id: -1, acquis: false, syncing: true } as Wish;
      queryClient.setQueryData<Wish[]>(WISHES_KEY, (prev = []) => [optimistic, ...prev]);
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(WISHES_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: FormData | UpdateWishPayload }) =>
      WishService.updateWish(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: WISHES_KEY });
      const snapshot = queryClient.getQueryData<Wish[]>(WISHES_KEY);
      const patch = body instanceof FormData ? {} : body;
      queryClient.setQueryData<Wish[]>(WISHES_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, ...patch, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(WISHES_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => WishService.deleteWish(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: WISHES_KEY });
      const snapshot = queryClient.getQueryData<Wish[]>(WISHES_KEY);
      queryClient.setQueryData<Wish[]>(WISHES_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(WISHES_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  return { create, update, remove };
}
