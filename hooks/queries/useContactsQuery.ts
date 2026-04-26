import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as Haptics from 'expo-haptics';
import * as ContactService from '../../services/api/ContactService';
import { CreateContactPayload, UpdateContactPayload } from '../../features/contacts/types';
import { Contact } from '../../models/Contact';

export const CONTACTS_KEY = ['contacts'] as const;

export function useContactsQuery() {
  return useQuery({
    queryKey: CONTACTS_KEY,
    queryFn: ContactService.getContacts,
  });
}

export function useContactMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: CONTACTS_KEY });

  const create = useMutation({
    mutationFn: (body: CreateContactPayload) => ContactService.createContact(body),
    onMutate: async (body) => {
      await queryClient.cancelQueries({ queryKey: CONTACTS_KEY });
      const snapshot = queryClient.getQueryData<Contact[]>(CONTACTS_KEY);
      const optimistic = { ...body, id: -1, emailproprietaire: '', syncing: true } as Contact;
      queryClient.setQueryData<Contact[]>(CONTACTS_KEY, (prev = []) => [optimistic, ...prev]);
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(CONTACTS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateContactPayload }) =>
      ContactService.updateContact(id, body),
    onMutate: async ({ id, body }) => {
      await queryClient.cancelQueries({ queryKey: CONTACTS_KEY });
      const snapshot = queryClient.getQueryData<Contact[]>(CONTACTS_KEY);
      queryClient.setQueryData<Contact[]>(CONTACTS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, ...body, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(CONTACTS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  const remove = useMutation({
    mutationFn: (id: string) => ContactService.deleteContact(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: CONTACTS_KEY });
      const snapshot = queryClient.getQueryData<Contact[]>(CONTACTS_KEY);
      queryClient.setQueryData<Contact[]>(CONTACTS_KEY, (prev = []) =>
        prev.map((item) => (item.id === Number(id) ? { ...item, syncing: true } : item)),
      );
      return { snapshot };
    },
    onError: async (_err, _vars, ctx) => {
      if (ctx?.snapshot) queryClient.setQueryData(CONTACTS_KEY, ctx.snapshot);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => undefined);
    },
    onSuccess: async () => {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      await invalidate();
    },
  });

  return { create, update, remove };
}
