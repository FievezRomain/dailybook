/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useContactsQuery, useContactMutations, CONTACTS_KEY } from '../useContactsQuery';
import * as ContactService from '../../../services/api/ContactService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { createMockContact } from '../../../tests/factories/contact.factory';

jest.mock('../../../services/api/ContactService');

const mockedGetContacts = ContactService.getContacts as jest.MockedFunction<typeof ContactService.getContacts>;
const mockedCreateContact = ContactService.createContact as jest.MockedFunction<typeof ContactService.createContact>;
const mockedDeleteContact = ContactService.deleteContact as jest.MockedFunction<typeof ContactService.deleteContact>;

describe('useContactsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('uses the correct query key', () => {
    expect(CONTACTS_KEY).toEqual(['contacts']);
  });

  it('returns undefined data initially', () => {
    mockedGetContacts.mockResolvedValue([]);
    const { result } = renderHook(() => useContactsQuery(), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched contacts on success', async () => {
    const contacts = [createMockContact(), createMockContact()];
    mockedGetContacts.mockResolvedValue(contacts as any);

    const { result } = renderHook(() => useContactsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetContacts.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useContactsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useContactMutations — create', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('create mutation calls ContactService.createContact', async () => {
    const contact = createMockContact() as any;
    mockedCreateContact.mockResolvedValue(contact);
    mockedGetContacts.mockResolvedValue([]);

    const { result } = renderHook(() => useContactMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({ nom: 'Dupont' } as any);
    });

    expect(mockedCreateContact).toHaveBeenCalledWith({ nom: 'Dupont' });
  });

  it('create mutation rolls back on error', async () => {
    const wrapper = createQueryWrapper();
    const existing = [createMockContact()] as any[];
    mockedGetContacts.mockResolvedValue(existing);
    mockedCreateContact.mockRejectedValue(new Error('fail'));

    const { result: queryResult } = renderHook(() => useContactsQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useContactMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    await act(async () => {
      try { await mutResult.current.create.mutateAsync({ nom: 'Fail' } as any); }
      catch {}
    });

    await waitFor(() => expect(queryResult.current.data).toHaveLength(1));
  });
});

describe('useContactMutations — remove', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('remove mutation calls ContactService.deleteContact', async () => {
    mockedDeleteContact.mockResolvedValue(undefined as any);
    mockedGetContacts.mockResolvedValue([]);

    const { result } = renderHook(() => useContactMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('1');
    });

    expect(mockedDeleteContact).toHaveBeenCalledWith('1');
  });
});
