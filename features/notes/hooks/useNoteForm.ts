import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Toast from 'react-native-toast-message';
import { useNoteMutations } from '../../../hooks/queries/useNotesQuery';
import LoggerService from '../../../services/logs/LoggerService';
import { parseApiError } from '../../../utils/errorParser';
import { CreateNotePayload, UpdateNotePayload } from '../types';
import type { Note } from '../../../models/Note';
import { noteFormSchema, type NoteFormValues } from '../../../business/validators/note';

export function useNoteForm(actionType: 'create' | 'modify', note: Partial<Note> = {}, onSuccess?: (data?: unknown) => void) {
  const form = useForm<NoteFormValues>({
    defaultValues: { id: note.id, titre: note.titre ?? '', note: note.note ?? '' },
    resolver: zodResolver(noteFormSchema),
  });
  const { setValue, reset } = form;
  const [loading, setLoading] = useState(false);
  const { create, update } = useNoteMutations();

  const initValues = () => {
    setValue('id', note.id);
    setValue('titre', note.titre ?? '');
    setValue('note', note.note ?? '');
  };

  const resetValues = () => reset({ titre: '', note: '' });

  const submit = async (data: NoteFormValues, _legacyOnClose?: () => void) => {
    if (loading) return;
    setLoading(true);
    try {
      if (actionType === 'modify') {
        const body: UpdateNotePayload = {
          id: Number(data.id),
          titre: String(data.titre ?? ''),
          note: String(data.note ?? ''),
          is_pinned: note.is_pinned ?? false,
        };
        const response = await update.mutateAsync({ id: String(data.id), body });
        onSuccess?.(response);
      } else {
        const body: CreateNotePayload = {
          titre: String(data.titre ?? ''),
          note: String(data.note ?? ''),
        };
        await create.mutateAsync(body);
        onSuccess?.();
      }
      resetValues();
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      Toast.show({ type: 'error', position: 'top', text1: parsed.message });
      LoggerService.error('Note form submit failed', err, {
        feature: 'notes',
        operation: actionType === 'modify' ? 'update' : 'create',
        errorCode: parsed.code,
        hasId: data.id != null,
        hasTitle: Boolean(data.titre),
      });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, initValues, resetValues, submit };
}
