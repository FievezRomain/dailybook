import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as EventService from '../../services/api/EventService';
import { CreateEventPayload, UpdateEventPayload, PatchEventPayload } from '../../features/events/types';

export const EVENTS_KEY = ['events'] as const;

export function useEventsQuery() {
  return useQuery({
    queryKey: EVENTS_KEY,
    queryFn: EventService.getEvents,
  });
}

export function useEventMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: EVENTS_KEY });

  const create = useMutation({
    mutationFn: (body: CreateEventPayload) => EventService.createEvent(body),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEventPayload }) =>
      EventService.updateEvent(id, body),
    onSuccess: invalidate,
  });

  /** Mise à jour partielle : état, commentaire, note, dépense */
  const patch = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchEventPayload }) =>
      EventService.patchEvent(id, body),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => EventService.deleteEvent(id),
    onSuccess: invalidate,
  });

  return { create, update, patch, remove };
}
