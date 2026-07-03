import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { createContact, updateContact } from '../../../services/api/ContactService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { CreateContactPayload, UpdateContactPayload } from '../types';
import LoggerService from '../../../services/logs/LoggerService';

export function useContactForm(actionType: string, contact: Record<string, unknown> = {}, onSuccess?: (data?: unknown) => void) {
  const { firebaseUser } = useAuthStore();
  const form = useForm({ defaultValues: contact });
  const { setValue, reset } = form;
  const [loading, setLoading] = useState(false);

  const initValues = () => {
    setValue('id', contact.id);
    setValue('nom', contact.nom);
    setValue('profession', contact.profession);
    setValue('telephone', contact.telephone);
    setValue('email', contact.email);
    setValue('emailproprietaire', contact.emailproprietaire);
  };

  const resetValues = () => reset({});

  const submit = async (data: Record<string, unknown>, onClose: () => void) => {
    if (loading) return;
    setLoading(true);
    data['emailproprietaire'] = firebaseUser?.email ?? '';
    try {
      if (actionType === 'modify') {
        const response = await updateContact(String(data.id), data as unknown as UpdateContactPayload);
        onSuccess?.(response);
      } else {
        await createContact(data as unknown as CreateContactPayload);
        onSuccess?.();
      }
      resetValues();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      Toast.show({ type: 'error', position: 'top', text1: message });
      LoggerService.log('useContactForm error: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, initValues, resetValues, submit };
}
