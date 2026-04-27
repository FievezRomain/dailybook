import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { createNote, updateNote } from '../../../services/api/NoteService';
import LoggerService from '../../../services/logs/LoggerService';

export function useNoteForm(actionType: string, note: Record<string, unknown> = {}, onSuccess?: (data?: unknown) => void) {
  const form = useForm({ defaultValues: note });
  const { setValue, reset } = form;
  const [loading, setLoading] = useState(false);

  const initValues = () => {
    setValue('id', note.id);
    setValue('titre', note.titre);
    setValue('note', note.note);
  };

  const resetValues = () => reset({});

  const submit = async (data: Record<string, unknown>, onClose: () => void) => {
    if (loading) return;
    setLoading(true);
    try {
      if (actionType === 'modify') {
        const response = await updateNote(String(data.id), { titre: String(data.titre ?? ''), note: String(data.note ?? '') });
        onSuccess?.(response);
      } else {
        await createNote({ titre: String(data.titre ?? ''), note: String(data.note ?? '') });
        onSuccess?.();
      }
      resetValues();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      Toast.show({ type: 'error', position: 'top', text1: message });
      LoggerService.log('useNoteForm error: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, initValues, resetValues, submit };
}
