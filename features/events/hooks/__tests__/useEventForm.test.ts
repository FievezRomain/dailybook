/** @jest-environment jsdom */
import { renderHook, act, waitFor } from '@testing-library/react';
import { useEventForm } from '../useEventForm';
import * as EventService from '../../../../services/api/EventService';

jest.mock('../../../../services/api/EventService');

const mockedCreateEvent = EventService.createEvent as jest.MockedFunction<typeof EventService.createEvent>;
const mockedUpdateEvent = EventService.updateEvent as jest.MockedFunction<typeof EventService.updateEvent>;

describe('useEventForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns form, loading=false and callbacks on init', () => {
    const { result } = renderHook(() => useEventForm('create'));
    expect(result.current.form).toBeDefined();
    expect(result.current.loading).toBe(false);
    expect(typeof result.current.submit).toBe('function');
    expect(typeof result.current.initValues).toBe('function');
    expect(typeof result.current.resetValues).toBe('function');
  });

  it('submit (create) calls createEvent with form data', async () => {
    mockedCreateEvent.mockResolvedValue(undefined as any);
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const { result } = renderHook(() => useEventForm('create', {}, onSuccess));

    await act(async () => {
      await result.current.submit({ nom: 'Balade du dimanche', eventtype: 'balade' }, onClose);
    });

    expect(mockedCreateEvent).toHaveBeenCalledWith({
      nom: 'Balade du dimanche',
      eventtype: 'balade',
    });
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('submit (modify) calls updateEvent with id and data', async () => {
    const updated = { id: 42, nom: 'Sortie modifiée', eventtype: 'balade' };
    mockedUpdateEvent.mockResolvedValue(updated as any);
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const { result } = renderHook(() => useEventForm('modify', { id: 42 }, onSuccess));

    await act(async () => {
      await result.current.submit({ id: 42, nom: 'Sortie modifiée', eventtype: 'balade' }, onClose);
    });

    expect(mockedUpdateEvent).toHaveBeenCalledWith('42', expect.objectContaining({ nom: 'Sortie modifiée' }));
    expect(onSuccess).toHaveBeenCalledWith(updated);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('sets loading=true during submit then loading=false after', async () => {
    let resolveCreate!: (v: any) => void;
    mockedCreateEvent.mockImplementation(() => new Promise((res) => { resolveCreate = res; }));

    const { result } = renderHook(() => useEventForm('create'));
    const onClose = jest.fn();

    act(() => {
      result.current.submit({ nom: 'Test' }, onClose);
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolveCreate(undefined);
    });

    expect(result.current.loading).toBe(false);
  });

  it('submit handles error and does not call onClose', async () => {
    mockedCreateEvent.mockRejectedValue(new Error('Erreur réseau'));
    const onSuccess = jest.fn();
    const onClose = jest.fn();

    const { result } = renderHook(() => useEventForm('create', {}, onSuccess));

    await act(async () => {
      await result.current.submit({ nom: 'Test' }, onClose);
    });

    expect(onSuccess).not.toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
  });

  it('initValues populates form fields', () => {
    const event = { id: 1, nom: 'Balade', eventtype: 'balade' };
    const { result } = renderHook(() => useEventForm('modify', event));

    act(() => {
      result.current.initValues();
    });

    // After initValues, form values should reflect the event
    expect(result.current.form.getValues('nom')).toBe('Balade');
    expect(result.current.form.getValues('eventtype')).toBe('balade');
  });
});
