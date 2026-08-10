import httpClient from './httpClient';
import { createCrudService } from './factory';
import {
  CreateAnimalPayload,
  UpdateAnimalPayload,
  AnimalHistoryPayload,
  AnimalHistoryItem,
  BodyPicturePayload,
  AnimalHistoryRecord,
} from '../../features/animals/types';
import { Animal } from '../../models/Animal';
import { FileService } from './FileService';

const _crud = createCrudService<Animal, CreateAnimalPayload, UpdateAnimalPayload>('/animals');

export const getAnimals = _crud.getAll;
export const createAnimal = _crud.create;
export const updateAnimal = _crud.update;
export const deleteAnimal = _crud.remove;

// ─── Historique physique ──────────────────────────────────────────────────────

export async function createAnimalHistory(animalId: string, body: AnimalHistoryPayload): Promise<void> {
  await httpClient.post(`/animals/${animalId}/history`, body);
}

export async function updateAnimalHistory(animalId: string, item: AnimalHistoryItem, historyId: string, body: AnimalHistoryPayload): Promise<void> {
  await httpClient.put(`/animals/${animalId}/history/${item}/${historyId}`, body);
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
  const pictures = Array.isArray(response.data) ? response.data : [];
  return Promise.all(pictures.map(async (picture: BodyPicturePayload & { id?: number }) => ({
    ...picture,
    url: await FileService.getDownloadUrl(picture.filename, 'animal', animalId),
  })));
}

export async function getAnimalHistory(animalId: string, item: AnimalHistoryItem): Promise<AnimalHistoryRecord[]> {
  const response = await httpClient.get(`/animals/${animalId}/history/${item}`);
  return response.data;
}

export async function addAnimalBodyPicture(animalId: string, body: BodyPicturePayload) {
  const response = await httpClient.post(`/animals/${animalId}/body-pictures`, body);
  return response.data;
}

export async function deleteAnimalBodyPicture(pictureId: string): Promise<void> {
  await httpClient.delete(`/animals/body-pictures/${pictureId}`);
}
