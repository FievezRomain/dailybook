import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useNoteMutations } from '../../../hooks/queries/useNotesQuery';
import LoggerService from '../../../services/logs/LoggerService';
import { parseApiError } from '../../../utils/errorParser';
import { CreateNotePayload, UpdateNotePayload } from '../types';
import type { Note } from '../../../models/Note';

export type NoteFormValues = Partial<Note>;

export function useNoteForm(actionType: string, note: NoteFormValues = {}, onSuccess?: (data?: unknown) => void) {
  const form = useForm<NoteFormValues>({ defaultValues: note });
  const { setValue, reset } = form;
  const [loading, setLoading] = useState(false);
  const { create, update } = useNoteMutations();

  const initValues = () => {
    setValue('id', note.id);
    setValue('titre', note.titre);
    setValue('note', note.note);
  };

  const resetValues = () => reset({});

  const submit = async (data: NoteFormValues, onClose: () => void) => {
    if (loading) return;
    setLoading(true);
    try {
      if (actionType === 'modify') {
        const body: UpdateNotePayload = {
          id: Number(data.id),
          titre: String(data.titre ?? ''),
          note: String(data.note ?? ''),
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
      onClose();
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
