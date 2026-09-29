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
      const optimisticItem: Objectif = {
        id: -1,
        title: body.title,
        animaux: body.animaux ?? [],
        sousetapes: [],
        datedebut: new Date(body.datedebut ?? Date.now()),
        datefin: new Date(body.datefin ?? Date.now()),
        syncing: true,
      };
      queryClient.setQueryData<Objectif[]>(OBJECTIFS_KEY, (prev = []) => [optimisticItem, ...prev]);
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
        prev.map((item) => (item.id === Number(id) ? { ...item, ...body, syncing: true } as unknown as Objectif : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(OBJECTIFS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async (updated, { id }) => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      if (updated) queryClient.setQueryData<Objectif[]>(OBJECTIFS_KEY, (previous = []) => previous.map((item) => item.id === Number(id) ? updated : item));
      else await invalidate();
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

  const updateSubtask = useMutation({
    mutationFn: ({ objectiveId, subtaskId, state }: { objectiveId: string; subtaskId: number; state: boolean }) =>
      ObjectifService.updateSubtaskState(objectiveId, subtaskId, state),
    onMutate: async ({ objectiveId, subtaskId, state }) => {
      await queryClient.cancelQueries({ queryKey: OBJECTIFS_KEY });
      const snapshot = queryClient.getQueryData<Objectif[]>(OBJECTIFS_KEY);
      queryClient.setQueryData<Objectif[]>(OBJECTIFS_KEY, (previous = []) => previous.map((objective) =>
        objective.id === Number(objectiveId)
          ? { ...objective, sousetapes: objective.sousetapes.map((step) => step.id === subtaskId ? { ...step, state } : step) }
          : objective,
      ));
      return { snapshot };
    },
    onError: (_error, _variables, context) => {
      if (context?.snapshot) queryClient.setQueryData(OBJECTIFS_KEY, context.snapshot);
    },
  });

  return { create, update, updateSubtask, remove };
}
