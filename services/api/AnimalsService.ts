import httpClient from './httpClient';

export async function getAnimals() {
  const response = await httpClient.get('/animals');
  return response.data;
}

export async function createAnimal(body: FormData | Record<string, unknown>) {
  const isMultipart = body instanceof FormData;
  const response = await httpClient.post('/animals', body, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : undefined,
    transformRequest: isMultipart ? (data) => data : undefined,
  });
  return response.data;
}

export async function updateAnimal(animalId: string, body: FormData | Record<string, unknown>) {
  const isMultipart = body instanceof FormData;
  const response = await httpClient.put(`/animals/${animalId}`, body, {
    headers: isMultipart ? { 'Content-Type': 'multipart/form-data' } : undefined,
    transformRequest: isMultipart ? (data) => data : undefined,
  });
  return response.data;
}

export async function deleteAnimal(animalId: string) {
  const response = await httpClient.delete(`/animals/${animalId}`);
  return response.data;
}

// ─── Historique physique ──────────────────────────────────────────────────────

export async function createAnimalHistory(animalId: string, body: Record<string, unknown>) {
  const response = await httpClient.post(`/animals/${animalId}/history`, body);
  return response.data;
}

export async function updateAnimalHistory(animalId: string, body: Record<string, unknown>) {
  const response = await httpClient.put(`/animals/${animalId}/history`, body);
  return response.data;
}

export async function deleteAnimalHistory(
  animalId: string,
  item: string,
  historyId: string,
) {
  const response = await httpClient.delete(
    `/animals/${animalId}/history/${item}/${historyId}`,
  );
  return response.data;
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

export async function deleteAnimalBodyPicture(pictureId: string) {
  const response = await httpClient.delete(`/animals/body-pictures/${pictureId}`);
  return response.data;
}

// ─── Backward-compatible service adapter ────────────────────────────────────
const animalsServiceInstance = {
  create: (body: any) => createAnimal(body),
  modify: (body: any) => updateAnimal(body.id, body),
  createHistory: (body: any) => createAnimalHistory(body.id, body),
  modifyHistory: (body: any) => updateAnimalHistory(body.id, body),
};
export default animalsServiceInstance;
