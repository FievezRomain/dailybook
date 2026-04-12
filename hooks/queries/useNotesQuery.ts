import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as NoteService from '../../services/api/NoteService';

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
    mutationFn: (body: Record<string, unknown>) => NoteService.createNote(body),
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Record<string, unknown> }) =>
      NoteService.updateNote(id, body),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => NoteService.deleteNote(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
