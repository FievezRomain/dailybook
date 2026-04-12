import httpClient from './httpClient';
import { createCrudService } from './factory';
import { CreateEventPayload, UpdateEventPayload, PatchEventPayload } from '../../features/events/types';
import { Event } from '../../models/Event';

const _crud = createCrudService<Event, CreateEventPayload, UpdateEventPayload>('/events');

export const getEvents = _crud.getAll;
export const createEvent = _crud.create;
export const updateEvent = _crud.update;
export const deleteEvent = _crud.remove;

/** Mise à jour partielle : état, commentaire, note, dépense */
export async function patchEvent(eventId: string, body: PatchEventPayload): Promise<Event> {
  const response = await httpClient.patch(`/events/${eventId}`, body);
  return response.data;
}

export async function getEventDocumentUrl(eventId: string, filename: string): Promise<string> {
  const response = await httpClient.get(`/events/${eventId}/documents/${filename}`);
  return response.data;
}
