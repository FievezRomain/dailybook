/** @jest-environment jsdom */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useContactForm } from '../useContactForm';
import * as ContactService from '../../../../services/api/ContactService';
import { createQueryWrapper } from '../../../../tests/utils/queryWrapper';

jest.mock('../../../../services/api/ContactService');
jest.mock('../../../../stores/useAuthStore', () => ({
  useAuthStore: () => ({ firebaseUser: { email: 'owner@test.com' } }),
}));

const mockedCreateContact = ContactService.createContact as jest.MockedFunction<typeof ContactService.createContact>;
const mockedUpdateContact = ContactService.updateContact as jest.MockedFunction<typeof ContactService.updateContact>;

describe('useContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns form, loading=false and callbacks on init', () => {
    const { result } = renderHook(() => useContactForm('create'), { wrapper: createQueryWrapper() });
    expect(result.current.form).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.submit).toBe('function');
    expect(typeof result.current.initValues).toBe('function');
    expect(typeof result.current.resetValues).toBe('function');
  });

  it('submit (create) maps the contact email without sending owner identity', async () => {
    mockedCreateContact.mockResolvedValue(undefined as any);
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const { result } = renderHook(() => useContactForm('create', {}, onSuccess), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.submit({ nom: 'Dupont', profession: 'Ostéopathe', email: 'contact@test.com' }, onClose);
    });

    expect(mockedCreateContact).toHaveBeenCalledWith(
      expect.objectContaining({ nom: 'Dupont', email_contact: 'contact@test.com' }),
    );
    expect(mockedCreateContact.mock.calls[0]?.[0]).not.toHaveProperty('emailproprietaire');
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('submit (modify) calls updateContact', async () => {
    const updated = { id: 5, nom: 'Martin' };
    mockedUpdateContact.mockResolvedValue(updated as any);
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const { result } = renderHook(() => useContactForm('modify', { id: 5 }, onSuccess), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.submit({ id: 5, nom: 'Martin' }, onClose);
    });

    expect(mockedUpdateContact).toHaveBeenCalledWith('5', expect.objectContaining({ nom: 'Martin' }));
    expect(onSuccess).toHaveBeenCalledWith(updated);
  });

  it('sets loading=true during submit then loading=false after', async () => {
    let resolveCreate!: (v: any) => void;
    mockedCreateContact.mockImplementation(() => new Promise((res) => { resolveCreate = res; }));

    const { result } = renderHook(() => useContactForm('create'), { wrapper: createQueryWrapper() });
    const onClose = jest.fn();

    act(() => {
      result.current.submit({ nom: 'Test' }, onClose);
    });

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(mockedCreateContact).toHaveBeenCalled());

    await act(async () => {
      resolveCreate(undefined);
    });

    expect(result.current.loading).toBe(false);
  });

  it('initValues populates form fields from contact', () => {
    const contact = { id: 1, nom: 'Dupont', profession: 'Véto', telephone: '0600000000' };
    const { result } = renderHook(() => useContactForm('modify', contact), { wrapper: createQueryWrapper() });

    act(() => {
      result.current.initValues();
    });

    expect(result.current.form.getValues('nom')).toBe('Dupont');
    expect(result.current.form.getValues('profession')).toBe('Véto');
  });

  it('submit handles error and does not call onClose', async () => {
    mockedCreateContact.mockRejectedValue(new Error('Erreur'));
    const onClose = jest.fn();

    const { result } = renderHook(() => useContactForm('create'), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.submit({ nom: 'Test' }, onClose);
    });

    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });
});
