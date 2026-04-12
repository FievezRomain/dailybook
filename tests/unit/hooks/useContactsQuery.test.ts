/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useContactsQuery, useContactMutations, CONTACTS_KEY } from '../../../hooks/queries/useContactsQuery';
import * as ContactService from '../../../services/api/ContactService';

jest.mock('../../../services/api/ContactService');

const mockedGetContacts = ContactService.getContacts as jest.MockedFunction<typeof ContactService.getContacts>;
const mockedCreateContact = ContactService.createContact as jest.MockedFunction<typeof ContactService.createContact>;
const mockedDeleteContact = ContactService.deleteContact as jest.MockedFunction<typeof ContactService.deleteContact>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useContactsQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns undefined data initially', () => {
    mockedGetContacts.mockResolvedValue([]);
    const { result } = renderHook(() => useContactsQuery(), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched contacts on success', async () => {
    const mockContacts = [
      { id: 1, nom: 'Dupont', prenom: 'Jean', email: 'jean@example.com' },
    ] as any[];
    mockedGetContacts.mockResolvedValue(mockContacts);

    const { result } = renderHook(() => useContactsQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockContacts);
  });

  it('uses the correct query key', () => {
    expect(CONTACTS_KEY).toEqual(['contacts']);
  });

  it('sets isError when the service throws', async () => {
    mockedGetContacts.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useContactsQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useContactMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create mutation calls ContactService.createContact', async () => {
    const mockContact = { id: 1, nom: 'Dupont' } as any;
    mockedCreateContact.mockResolvedValue(mockContact);
    mockedGetContacts.mockResolvedValue([]);

    const { result } = renderHook(() => useContactMutations(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({ nom: 'Dupont' } as any);
    });

    expect(mockedCreateContact).toHaveBeenCalledWith({ nom: 'Dupont' });
  });

  it('remove mutation calls ContactService.deleteContact', async () => {
    mockedDeleteContact.mockResolvedValue(undefined);
    mockedGetContacts.mockResolvedValue([]);

    const { result } = renderHook(() => useContactMutations(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('5');
    });

    expect(mockedDeleteContact).toHaveBeenCalledWith('5');
  });
});
