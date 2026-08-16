import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useContactMutations } from '../../../hooks/queries/useContactsQuery';
import { CreateContactPayload, UpdateContactPayload } from '../types';
import LoggerService from '../../../services/logs/LoggerService';
import { parseApiError } from '../../../utils/errorParser';
import type { Contact } from '../../../models/Contact';

export type ContactFormValues = Partial<Contact>;

export function useContactForm(actionType: string, contact: ContactFormValues = {}, onSuccess?: (data?: unknown) => void) {
  const form = useForm<ContactFormValues>({ defaultValues: contact });
  const { setValue, reset } = form;
  const [loading, setLoading] = useState(false);
  const { create, update } = useContactMutations();

  const initValues = () => {
    setValue('id', contact.id);
    setValue('nom', contact.nom);
    setValue('profession', contact.profession);
    setValue('telephone', contact.telephone);
    setValue('email', contact.email);
    setValue('emailproprietaire', contact.emailproprietaire);
  };

  const resetValues = () => reset({});

  const buildPayload = (data: ContactFormValues): CreateContactPayload => ({
    nom: data.nom ?? '',
    profession: data.profession,
    telephone: data.telephone,
    email_contact: data.email ?? undefined,
  });

  const submit = async (data: ContactFormValues, onClose: () => void) => {
    if (loading) return;
    setLoading(true);
    try {
      const payload = buildPayload(data);
      if (actionType === 'modify') {
        const body: UpdateContactPayload = { ...payload, id: Number(data.id) };
        const response = await update.mutateAsync({ id: String(data.id), body });
        onSuccess?.(response);
      } else {
        await create.mutateAsync(payload);
        onSuccess?.();
      }
      resetValues();
      onClose();
    } catch (err: unknown) {
      const parsed = parseApiError(err);
      Toast.show({ type: 'error', position: 'top', text1: parsed.message });
      LoggerService.error('Contact form submit failed', err, {
        feature: 'contacts',
        operation: actionType === 'modify' ? 'update' : 'create',
        errorCode: parsed.code,
        hasId: data.id != null,
        hasPhone: Boolean(data.telephone),
        hasEmail: Boolean(data.email),
      });
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, initValues, resetValues, submit };
}
