import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as NoteService from '../../services/api/NoteService';
import { CreateNotePayload, UpdateNotePayload } from '../../features/notes/types';
import { Note } from '../../models/Note';

export const NOTES_KEY = ['notes'] as const;

export function useNotesQuery() {
  return useQuery({
    queryKey: NOTES_KEY,
    queryFn: NoteService.getNotes,
  });
}

export function useNoteMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: NOTES_KEY });

  const create = useMutation({
    mutationFn: (body: CreateNotePayload) => NoteService.createNote(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: NOTES_KEY });
      const snapshot = queryClient.getQueryData<Note[]>(NOTES_KEY);
      const optimistic = { ...body, id: -1, syncing: true } as Note;
      queryClient.setQueryData<Note[]>(NOTES_KEY, (prev = []) => [optimistic, ...prev]);
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(NOTES_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateNotePayload }) =>
      NoteService.updateNote(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: NOTES_KEY });
      const snapshot = queryClient.getQueryData<Note[]>(NOTES_KEY);
      queryClient.setQueryData<Note[]>(NOTES_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, ...body, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(NOTES_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => NoteService.deleteNote(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: NOTES_KEY });
      const snapshot = queryClient.getQueryData<Note[]>(NOTES_KEY);
      queryClient.setQueryData<Note[]>(NOTES_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(NOTES_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  return { create, update, remove };
}
