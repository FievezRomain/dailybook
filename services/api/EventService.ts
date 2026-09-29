import httpClient from './httpClient';
import { createCrudService } from './factory';
import { CreateEventPayload, UpdateEventPayload, PatchEventPayload, type AgendaHighlight } from '../../features/events/types';
import { Event } from '../../models/Event';

const _crud = createCrudService<Event, CreateEventPayload, UpdateEventPayload>('/events');

export const getEvents = _crud.getAll;
export async function getAgendaHighlights(year: number): Promise<AgendaHighlight[]> {
  const response = await httpClient.get('/events/highlights', { params: { year } });
  return response.data;
}
export async function deleteEvent(id: string, scope: 'occurrence' | 'following' | 'series' = 'occurrence'): Promise<void> {
  await httpClient.delete(`/events/${id}`, { params: { scope } });
}

export async function createEvent(body: CreateEventPayload): Promise<Event> {
  const response = await httpClient.post('/events', body);
  const data: Event | Event[] = response.data;
  if (!Array.isArray(data)) return data;
  const candidates = data.filter((event) => event.eventtype === body.eventtype && event.dateevent === body.dateevent && event.nom === body.nom);
  const created = candidates.sort((a, b) => b.id - a.id)[0];
  if (!created) throw new Error("Le backend n'a pas confirmé la création de l'événement.");
  return created;
}

export async function updateEvent(id: string, body: UpdateEventPayload): Promise<Event> {
  const response = await httpClient.put(`/events/${id}`, body);
  const data: Event | Event[] = response.data;
  if (!Array.isArray(data)) return data;
  const updated = data.find((event) => event.id === Number(id));
  if (!updated) throw new Error("Le backend n'a pas confirmé la modification de l'événement.");
  return updated;
}

/** Mise à jour partielle : état, commentaire, note, dépense */
export async function patchEvent(eventId: string, body: PatchEventPayload): Promise<Event> {
  const response = await httpClient.patch(`/events/${eventId}`, body);
  return response.data;
}

export async function getEventDocumentUrl(eventId: string, filename: string): Promise<string> {
  const response = await httpClient.get(`/events/${eventId}/documents/${encodeURIComponent(filename)}`);
  const data: unknown = response.data;
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'url' in data && typeof data.url === 'string') return data.url;
  throw new Error('URL de document invalide.');
}

export async function deleteEventDocument(eventId: string, filename: string): Promise<void> {
  await httpClient.delete(`/events/${eventId}/documents/${encodeURIComponent(filename)}`);
}

export async function attachEventDocument(eventId: string, filename: string): Promise<void> {
  await httpClient.post(`/events/${eventId}/documents/${encodeURIComponent(filename)}`);
}
