/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { useEventsQuery, useEventMutations, EVENTS_KEY } from '../../../hooks/queries/useEventsQuery';
import * as EventService from '../../../services/api/EventService';

jest.mock('../../../services/api/EventService');

const mockedGetEvents = EventService.getEvents as jest.MockedFunction<typeof EventService.getEvents>;
const mockedCreateEvent = EventService.createEvent as jest.MockedFunction<typeof EventService.createEvent>;
const mockedDeleteEvent = EventService.deleteEvent as jest.MockedFunction<typeof EventService.deleteEvent>;

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) =>
    React.createElement(QueryClientProvider, { client: queryClient }, children);
}

describe('useEventsQuery', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns empty array as default data', () => {
    mockedGetEvents.mockResolvedValue([]);
    const { result } = renderHook(() => useEventsQuery(), { wrapper: createWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched events on success', async () => {
    const mockEvents = [
      { id: 1, nom: 'Event 1', dateevent: '2024-06-15', animaux: [1], eventtype: 'balade' },
    ] as any[];
    mockedGetEvents.mockResolvedValue(mockEvents);

    const { result } = renderHook(() => useEventsQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockEvents);
  });

  it('uses the correct query key', () => {
    expect(EVENTS_KEY).toEqual(['events']);
  });

  it('sets isError when the service throws', async () => {
    mockedGetEvents.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useEventsQuery(), { wrapper: createWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useEventMutations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('create mutation calls EventService.createEvent', async () => {
    const mockEvent = { id: 1, nom: 'Test' } as any;
    mockedCreateEvent.mockResolvedValue(mockEvent);
    mockedGetEvents.mockResolvedValue([]);

    const { result } = renderHook(() => useEventMutations(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({ nom: 'Test' } as any);
    });

    expect(mockedCreateEvent).toHaveBeenCalledWith({ nom: 'Test' });
  });

  it('remove mutation calls EventService.deleteEvent', async () => {
    mockedDeleteEvent.mockResolvedValue(undefined);
    mockedGetEvents.mockResolvedValue([]);

    const { result } = renderHook(() => useEventMutations(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('42');
    });

    expect(mockedDeleteEvent).toHaveBeenCalledWith('42');
  });
});
