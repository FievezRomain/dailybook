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
import { FileService, fileDownloadKey } from './FileService';

const _crud = createCrudService<Animal, CreateAnimalPayload, UpdateAnimalPayload>('/animals');

export async function getAnimals(): Promise<Animal[]> {
  const animals = await _crud.getAll();
  const urls = await FileService.getDownloadUrls(animals.flatMap((animal) => animal.image
    ? [{ filename: animal.image, ressourceType: 'animal' as const, ressourceId: animal.id }]
    : []));
  return animals.map((animal) => animal.image
    ? { ...animal, imageUrl: urls.get(fileDownloadKey({ filename: animal.image, ressourceType: 'animal', ressourceId: animal.id })) ?? animal.imageUrl }
    : animal);
}
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
  const pictures: Array<BodyPicturePayload & { id?: number; url?: string }> = Array.isArray(response.data) ? response.data : [];
  const urls = await FileService.getDownloadUrls(pictures.map((picture) => ({
    filename: picture.filename,
    ressourceType: 'body',
    ressourceId: animalId,
  })));
  return pictures.map((picture) => ({
    ...picture,
    url: urls.get(fileDownloadKey({ filename: picture.filename, ressourceType: 'body', ressourceId: animalId })) ?? picture.url,
  }));
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
