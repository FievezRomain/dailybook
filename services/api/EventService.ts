import httpClient from './httpClient';

export async function getEvents() {
  const response = await httpClient.get('/events');
  return response.data;
}

export async function createEvent(body: Record<string, unknown>) {
  const response = await httpClient.post('/events', body);
  return response.data;
}

export async function updateEvent(eventId: string, body: Record<string, unknown>) {
  const response = await httpClient.put(`/events/${eventId}`, body);
  return response.data;
}

/** Mise à jour partielle : état, commentaire, note, dépense */
export async function patchEvent(eventId: string, body: Record<string, unknown>) {
  const response = await httpClient.patch(`/events/${eventId}`, body);
  return response.data;
}

export async function deleteEvent(eventId: string) {
  const response = await httpClient.delete(`/events/${eventId}`);
  return response.data;
}

export async function getEventDocumentUrl(eventId: string, filename: string) {
  const response = await httpClient.get(`/events/${eventId}/documents/${filename}`);
  return response.data;
}

// ─── Backward-compatible service adapter ────────────────────────────────────
const eventsServiceInstance = {
  create: (body: any) => createEvent(body),
  update: (body: any) => updateEvent(body.id, body),
  updateCommentaireNote: (body: any) => patchEvent(body.id, body),
};
export default eventsServiceInstance;
