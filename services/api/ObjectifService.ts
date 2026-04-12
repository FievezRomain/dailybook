import httpClient from './httpClient';

export async function getObjectifs() {
  const response = await httpClient.get('/objectifs');
  return response.data;
}

export async function createObjectif(body: Record<string, unknown>) {
  const response = await httpClient.post('/objectifs', body);
  return response.data;
}

/** Mise à jour complète de l'objectif et de ses sous-tâches */
export async function updateObjectif(objectifId: string, body: Record<string, unknown>) {
  const response = await httpClient.put(`/objectifs/${objectifId}`, body);
  return response.data;
}

export async function deleteObjectif(objectifId: string) {
  const response = await httpClient.delete(`/objectifs/${objectifId}`);
  return response.data;
}

// ─── Backward-compatible service adapter ────────────────────────────────────
const objectifsServiceInstance = {
  create: (body: any) => createObjectif(body),
  update: (body: any) => updateObjectif(body.id, body),
  updateTasks: (body: any) => updateObjectif(body.id, body),
};
export default objectifsServiceInstance;
