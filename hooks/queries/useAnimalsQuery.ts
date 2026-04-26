import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as AnimalsService from '../../services/api/AnimalsService';
import {
  CreateAnimalPayload,
  UpdateAnimalPayload,
  AnimalHistoryPayload,
  AnimalHistoryItem,
} from '../../features/animals/types';
import { Animal } from '../../models/Animal';

export const ANIMALS_KEY = ['animals'] as const;

export function useAnimalsQuery() {
  return useQuery({
    queryKey: ANIMALS_KEY,
    queryFn: AnimalsService.getAnimals,
  });
}

export function useAnimalBodyPicturesQuery(animalId: string) {
  return useQuery({
    queryKey: ['animals', animalId, 'body-pictures'],
    queryFn: () => AnimalsService.getAnimalBodyPictures(animalId),
    enabled: !!animalId,
  });
}

export function useAnimalMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ANIMALS_KEY });

  const create = useMutation({
    mutationFn: (body: FormData | CreateAnimalPayload) => AnimalsService.createAnimal(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: ANIMALS_KEY });
      const snapshot = queryClient.getQueryData<Animal[]>(ANIMALS_KEY);
      const optimistic = { ...(body instanceof FormData ? {} : body), id: -1, syncing: true } as Animal;
      queryClient.setQueryData<Animal[]>(ANIMALS_KEY, (prev = []) => [optimistic, ...prev]);
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(ANIMALS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: FormData | UpdateAnimalPayload }) =>
      AnimalsService.updateAnimal(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: ANIMALS_KEY });
      const snapshot = queryClient.getQueryData<Animal[]>(ANIMALS_KEY);
      const patch = body instanceof FormData ? {} : body;
      queryClient.setQueryData<Animal[]>(ANIMALS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, ...patch, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(ANIMALS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => AnimalsService.deleteAnimal(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ANIMALS_KEY });
      const snapshot = queryClient.getQueryData<Animal[]>(ANIMALS_KEY);
      queryClient.setQueryData<Animal[]>(ANIMALS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(ANIMALS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const createHistory = useMutation({
    mutationFn: ({ animalId, body }: { animalId: string; body: AnimalHistoryPayload }) =>
      AnimalsService.createAnimalHistory(animalId, body),
    onSuccess: () => invalidate(),
    onError: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
  });

  const updateHistory = useMutation({
    mutationFn: ({ animalId, body }: { animalId: string; body: AnimalHistoryPayload }) =>
      AnimalsService.updateAnimalHistory(animalId, body),
    onSuccess: () => invalidate(),
    onError: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
  });

  const deleteHistory = useMutation({
    mutationFn: ({
      animalId,
      item,
      historyId,
    }: {
      animalId: string;
      item: AnimalHistoryItem;
      historyId: string;
    }) => AnimalsService.deleteAnimalHistory(animalId, item, historyId),
    onSuccess: () => invalidate(),
    onError: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
  });

  const addBodyPicture = useMutation({
    mutationFn: ({ animalId, body }: { animalId: string; body: FormData }) =>
      AnimalsService.addAnimalBodyPicture(animalId, body),
    onSuccess: (_, { animalId }) =>
      queryClient.invalidateQueries({ queryKey: ['animals', animalId, 'body-pictures'] }),
    onError: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
  });

  const deleteBodyPicture = useMutation({
    mutationFn: (pictureId: string) => AnimalsService.deleteAnimalBodyPicture(pictureId),
    onSuccess: () => invalidate(),
    onError: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
  });

  return { create, update, remove, createHistory, updateHistory, deleteHistory, addBodyPicture, deleteBodyPicture };
}
