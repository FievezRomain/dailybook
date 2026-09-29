/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import {
  useNotificationsQuery,
  useNotificationMutations,
  NOTIFICATIONS_KEY,
} from '../useNotificationsQuery';
import * as NotificationService from '../../../services/api/NotificationService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';

jest.mock('../../../services/api/NotificationService');

const mockedGetNotifications = NotificationService.getNotifications as jest.MockedFunction<
  typeof NotificationService.getNotifications
>;
const mockedMarkAllAsRead = NotificationService.markAllAsRead as jest.MockedFunction<
  typeof NotificationService.markAllAsRead
>;
const mockedSetRead = NotificationService.setRead as jest.MockedFunction<typeof NotificationService.setRead>;
const mockedDeleteNotification = NotificationService.deleteNotification as jest.MockedFunction<typeof NotificationService.deleteNotification>;

describe('useNotificationsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('uses the correct query key', () => {
    expect(NOTIFICATIONS_KEY).toEqual(['notifications']);
  });

  it('returns undefined data initially', () => {
    mockedGetNotifications.mockResolvedValue([]);
    const { result } = renderHook(() => useNotificationsQuery(), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched notifications on success', async () => {
    const notifications = [
      { id: 1, message: 'Test', is_read: false },
      { id: 2, message: 'Test 2', is_read: true },
    ] as any[];
    mockedGetNotifications.mockResolvedValue(notifications);

    const { result } = renderHook(() => useNotificationsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetNotifications.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useNotificationsQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useNotificationMutations — markAllAsRead', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('markAllAsRead mutation calls NotificationService.markAllAsRead', async () => {
    mockedMarkAllAsRead.mockResolvedValue(undefined as any);
    mockedGetNotifications.mockResolvedValue([]);

    const { result } = renderHook(() => useNotificationMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.markAllAsRead.mutateAsync(undefined as any);
    });

    expect(mockedMarkAllAsRead).toHaveBeenCalledTimes(1);
  });

  it('markAllAsRead optimistically marks all notifications as read', async () => {
    const wrapper = createQueryWrapper();
    const notifications = [
      { id: 1, message: 'A', is_read: false },
      { id: 2, message: 'B', is_read: false },
    ] as any[];
    mockedGetNotifications.mockResolvedValue(notifications);

    let resolveMarkRead!: (v: any) => void;
    mockedMarkAllAsRead.mockImplementation(
      () => new Promise((res) => { resolveMarkRead = res; }),
    );

    const { result: queryResult } = renderHook(() => useNotificationsQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useNotificationMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    act(() => {
      mutResult.current.markAllAsRead.mutate(undefined as any);
    });

    await waitFor(() =>
      expect(queryResult.current.data?.every((n: any) => n.is_read)).toBe(true),
    );

    resolveMarkRead(undefined);
    await waitFor(() => !mutResult.current.markAllAsRead.isPending);
  });
});

describe('useNotificationMutations — individual actions', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('optimistically toggles read state and rolls back on failure', async () => {
    const wrapper = createQueryWrapper();
    mockedGetNotifications.mockResolvedValue([{ id: 1, message: 'A', is_read: false }] as any[]);
    let rejectSetRead!: (error: Error) => void;
    mockedSetRead.mockImplementation(() => new Promise((_resolve, reject) => { rejectSetRead = reject; }));
    const { result: queryResult } = renderHook(() => useNotificationsQuery(), { wrapper });
    const { result: mutationResult } = renderHook(() => useNotificationMutations(), { wrapper });
    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    act(() => mutationResult.current.setRead.mutate({ id: 1, isRead: true }));
    await waitFor(() => expect(queryResult.current.data?.[0].is_read).toBe(true));
    act(() => rejectSetRead(new Error('Network error')));
    await waitFor(() => expect(mutationResult.current.setRead.isError).toBe(true));
    expect(queryResult.current.data?.[0].is_read).toBe(false);
  });

  it('optimistically removes a notification and rolls back on failure', async () => {
    const wrapper = createQueryWrapper();
    mockedGetNotifications.mockResolvedValue([{ id: 1, message: 'A', is_read: false }] as any[]);
    let rejectDelete!: (error: Error) => void;
    mockedDeleteNotification.mockImplementation(() => new Promise((_resolve, reject) => { rejectDelete = reject; }));
    const { result: queryResult } = renderHook(() => useNotificationsQuery(), { wrapper });
    const { result: mutationResult } = renderHook(() => useNotificationMutations(), { wrapper });
    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    act(() => mutationResult.current.remove.mutate(1));
    await waitFor(() => expect(queryResult.current.data).toEqual([]));
    act(() => rejectDelete(new Error('Network error')));
    await waitFor(() => expect(mutationResult.current.remove.isError).toBe(true));
    expect(queryResult.current.data).toHaveLength(1);
  });
});
