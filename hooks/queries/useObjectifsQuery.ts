import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as ObjectifService from '../../services/api/ObjectifService';
import { CreateObjectifPayload, UpdateObjectifPayload } from '../../features/objectifs/types';
import { Objectif } from '../../models/Objectif';

export const OBJECTIFS_KEY = ['objectifs'] as const;

export function useObjectifsQuery() {
  return useQuery({
    queryKey: OBJECTIFS_KEY,
    queryFn: ObjectifService.getObjectifs,
  });
}

export function useObjectifMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: OBJECTIFS_KEY });

  const create = useMutation({
    mutationFn: (body: CreateObjectifPayload) => ObjectifService.createObjectif(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: OBJECTIFS_KEY });
      const snapshot = queryClient.getQueryData<Objectif[]>(OBJECTIFS_KEY);
      const optimistic: Objectif = {
        ...body,
        id: -1,
        animaux: body.animaux ?? [],
        sousetapes: [],
        datedebut: new Date(),
        datefin: new Date(),
        syncing: true,
      };
      queryClient.setQueryData<Objectif[]>(OBJECTIFS_KEY, (prev = []) => [optimistic, ...prev]);
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(OBJECTIFS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateObjectifPayload }) =>
      ObjectifService.updateObjectif(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: OBJECTIFS_KEY });
      const snapshot = queryClient.getQueryData<Objectif[]>(OBJECTIFS_KEY);
      queryClient.setQueryData<Objectif[]>(OBJECTIFS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, ...body, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(OBJECTIFS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => ObjectifService.deleteObjectif(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: OBJECTIFS_KEY });
      const snapshot = queryClient.getQueryData<Objectif[]>(OBJECTIFS_KEY);
      queryClient.setQueryData<Objectif[]>(OBJECTIFS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(OBJECTIFS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  return { create, update, remove };
}
