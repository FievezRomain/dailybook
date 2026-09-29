import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { createEvent, updateEvent } from '../../../services/api/EventService';
import LoggerService from '../../../services/logs/LoggerService';
import { parseApiError } from '../../../utils/errorParser';
import type { CreateEventPayload, UpdateEventPayload } from '../types';

export function useEventForm(actionType: string, event: Record<string, unknown> = {}, onSuccess?: (data?: unknown) => void) {
  const form = useForm({ defaultValues: event });
  const { setValue, reset } = form;
  const [loading, setLoading] = useState(false);

  const initValues = () => {
    Object.entries(event).forEach(([key, value]) => setValue(key as any, value));
  };

  const resetValues = () => reset({});

  const submit = async (data: Record<string, unknown>, onClose: () => void) => {
    if (loading) return;
    setLoading(true);
    try {
      if (actionType === 'modify') {
        const response = await updateEvent(String(data.id), data as unknown as UpdateEventPayload);
        onSuccess?.(response);
      } else {
        await createEvent(data as unknown as CreateEventPayload);
        onSuccess?.();
      }
      resetValues();
      onClose();
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      Toast.show({ type: 'error', position: 'top', text1: parsed.message });
      LoggerService.error('Event form submit failed', err, {
        feature: 'events',
        operation: actionType === 'modify' ? 'update' : 'create',
        errorCode: parsed.code,
        hasId: data.id != null,
        hasAnimals: Array.isArray(data.animaux) ? data.animaux.length > 0 : undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, initValues, resetValues, submit };
}
