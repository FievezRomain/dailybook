import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ContactService from '../../services/api/ContactService';
import { CreateContactPayload, UpdateContactPayload } from '../../features/contacts/types';

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
    onSuccess: invalidate,
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateContactPayload }) =>
      ContactService.updateContact(id, body),
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: (id: string) => ContactService.deleteContact(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
