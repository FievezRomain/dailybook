/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useEventsQuery, useEventMutations, EVENTS_KEY } from '../useEventsQuery';
import * as EventService from '../../../services/api/EventService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { createMockEvent, createMockBaladeEvent } from '../../../tests/factories/event.factory';

jest.mock('../../../services/api/EventService');

const mockedGetEvents = EventService.getEvents as jest.MockedFunction<typeof EventService.getEvents>;
const mockedCreateEvent = EventService.createEvent as jest.MockedFunction<typeof EventService.createEvent>;
const mockedDeleteEvent = EventService.deleteEvent as jest.MockedFunction<typeof EventService.deleteEvent>;
const mockedUpdateEvent = EventService.updateEvent as jest.MockedFunction<typeof EventService.updateEvent>;

describe('useEventsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('uses the correct query key', () => {
    expect(EVENTS_KEY).toEqual(['events']);
  });

  it('returns undefined data initially', () => {
    mockedGetEvents.mockResolvedValue([]);
    const { result } = renderHook(() => useEventsQuery(), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched events on success', async () => {
    const events = [createMockBaladeEvent(), createMockBaladeEvent()];
    mockedGetEvents.mockResolvedValue(events as any);

    const { result } = renderHook(() => useEventsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetEvents.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useEventsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useEventMutations — create', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('create mutation calls EventService.createEvent', async () => {
    const event = createMockEvent() as any;
    mockedCreateEvent.mockResolvedValue(event);
    mockedGetEvents.mockResolvedValue([]);

    const { result } = renderHook(() => useEventMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({ nom: 'Balade', animaux: [1], eventtype: 'balade' } as any);
    });

    expect(mockedCreateEvent).toHaveBeenCalledWith({ nom: 'Balade', animaux: [1], eventtype: 'balade' });
  });

  it('create mutation optimistically adds item with syncing:true', async () => {
    const wrapper = createQueryWrapper();
    mockedGetEvents.mockResolvedValue([createMockEvent()] as any);

    let resolveCreate!: (v: any) => void;
    mockedCreateEvent.mockImplementation(
      () => new Promise((res) => { resolveCreate = res; }),
    );

    const { result: queryResult } = renderHook(() => useEventsQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useEventMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    act(() => {
      mutResult.current.create.mutate({ nom: 'Optimiste', animaux: [1], eventtype: 'balade' } as any);
    });

    await waitFor(() =>
      expect(queryResult.current.data?.some((e: any) => e.syncing)).toBe(true),
    );

    resolveCreate(createMockEvent({ id: 99 }) as any);
    await waitFor(() => !mutResult.current.create.isPending);
  });

  it('create mutation rolls back on error', async () => {
    const wrapper = createQueryWrapper();
    const existing = [createMockEvent()] as any[];
    mockedGetEvents.mockResolvedValue(existing);
    mockedCreateEvent.mockRejectedValue(new Error('fail'));

    const { result: queryResult } = renderHook(() => useEventsQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useEventMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    await act(async () => {
      try { await mutResult.current.create.mutateAsync({ nom: 'Fail', animaux: [], eventtype: 'autre' } as any); }
      catch {}
    });

    await waitFor(() => expect(queryResult.current.data).toHaveLength(1));
  });
});

describe('useEventMutations — remove', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('remove mutation calls EventService.deleteEvent', async () => {
    mockedDeleteEvent.mockResolvedValue(undefined as any);
    mockedGetEvents.mockResolvedValue([]);

    const { result } = renderHook(() => useEventMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('1');
    });

    expect(mockedDeleteEvent).toHaveBeenCalledWith('1');
  });
});
