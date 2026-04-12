import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as AnimalsService from '../../services/api/AnimalsService';

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
    mutationFn: (body: FormData | Record<string, unknown>) =>
      AnimalsService.createAnimal(body),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: FormData | Record<string, unknown> }) =>
      AnimalsService.updateAnimal(id, body),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => AnimalsService.deleteAnimal(id),
    onSuccess: invalidate,
  });

  const createHistory = useMutation({
    mutationFn: ({ animalId, body }: { animalId: string; body: Record<string, unknown> }) =>
      AnimalsService.createAnimalHistory(animalId, body),
    onSuccess: invalidate,
  });

  const updateHistory = useMutation({
    mutationFn: ({ animalId, body }: { animalId: string; body: Record<string, unknown> }) =>
      AnimalsService.updateAnimalHistory(animalId, body),
    onSuccess: invalidate,
  });

  const deleteHistory = useMutation({
    mutationFn: ({
      animalId,
      item,
      historyId,
    }: {
      animalId: string;
      item: string;
      historyId: string;
    }) => AnimalsService.deleteAnimalHistory(animalId, item, historyId),
    onSuccess: invalidate,
  });

  const addBodyPicture = useMutation({
    mutationFn: ({ animalId, body }: { animalId: string; body: FormData }) =>
      AnimalsService.addAnimalBodyPicture(animalId, body),
    onSuccess: (_, { animalId }) =>
      queryClient.invalidateQueries({ queryKey: ['animals', animalId, 'body-pictures'] }),
  });

  const deleteBodyPicture = useMutation({
    mutationFn: (pictureId: string) => AnimalsService.deleteAnimalBodyPicture(pictureId),
    onSuccess: invalidate,
  });

  return { create, update, remove, createHistory, updateHistory, deleteHistory, addBodyPicture, deleteBodyPicture };
}
