import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as EventService from '../../services/api/EventService';
import { CreateEventPayload, UpdateEventPayload, PatchEventPayload } from '../../features/events/types';
import { Event } from '../../models/Event';

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
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: EVENTS_KEY });
      const snapshot = queryClient.getQueryData<Event[]>(EVENTS_KEY);
      const optimistic = { ...body, id: -1, syncing: true } as unknown as Event;
      queryClient.setQueryData<Event[]>(EVENTS_KEY, (prev = []) => [optimistic, ...prev]);
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(EVENTS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateEventPayload }) =>
      EventService.updateEvent(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: EVENTS_KEY });
      const snapshot = queryClient.getQueryData<Event[]>(EVENTS_KEY);
      queryClient.setQueryData<Event[]>(EVENTS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, ...body, syncing: true } as Event : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(EVENTS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  /** Mise à jour partielle : état, commentaire, note, dépense */
  const patch = useMutation({
    mutationFn: ({ id, body }: { id: string; body: PatchEventPayload }) =>
      EventService.patchEvent(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: EVENTS_KEY });
      const snapshot = queryClient.getQueryData<Event[]>(EVENTS_KEY);
      queryClient.setQueryData<Event[]>(EVENTS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, ...body, syncing: true } as Event : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(EVENTS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => EventService.deleteEvent(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: EVENTS_KEY });
      const snapshot = queryClient.getQueryData<Event[]>(EVENTS_KEY);
      queryClient.setQueryData<Event[]>(EVENTS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(EVENTS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  return { create, update, patch, remove };
}
