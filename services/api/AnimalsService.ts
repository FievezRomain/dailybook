import httpClient from './httpClient';
import { createCrudService } from './factory';
import {
  CreateAnimalPayload,
  UpdateAnimalPayload,
  AnimalHistoryPayload,
  AnimalHistoryItem,
} from '../../features/animals/types';
import { Animal } from '../../models/Animal';

const _crud = createCrudService<Animal, CreateAnimalPayload, UpdateAnimalPayload>('/animals');

export const getAnimals = _crud.getAll;
export const createAnimal = _crud.create;
export const updateAnimal = _crud.update;
export const deleteAnimal = _crud.remove;

// ─── Historique physique ──────────────────────────────────────────────────────

export async function createAnimalHistory(animalId: string, body: AnimalHistoryPayload): Promise<void> {
  await httpClient.post(`/animals/${animalId}/history`, body);
}

export async function updateAnimalHistory(animalId: string, body: AnimalHistoryPayload): Promise<void> {
  await httpClient.put(`/animals/${animalId}/history`, body);
}

export async function deleteAnimalHistory(
  animalId: string,
  item: AnimalHistoryItem,
  historyId: string,
): Promise<void> {
  await httpClient.delete(`/animals/${animalId}/history/${item}/${historyId}`);
}

// ─── Photos du physique ───────────────────────────────────────────────────────

export async function getAnimalBodyPictures(animalId: string) {
  const response = await httpClient.get(`/animals/${animalId}/body-pictures`);
  return response.data;
}

export async function addAnimalBodyPicture(animalId: string, body: FormData) {
  const response = await httpClient.post(`/animals/${animalId}/body-pictures`, body, {
    headers: { 'Content-Type': 'multipart/form-data' },
    transformRequest: (data) => data,
  });
  return response.data;
}

export async function deleteAnimalBodyPicture(pictureId: string): Promise<void> {
  await httpClient.delete(`/animals/body-pictures/${pictureId}`);
}
