/** @jest-environment jsdom */
import { renderHook, waitFor, act } from '@testing-library/react';
import { useWishesQuery, useWishMutations, WISHES_KEY } from '../useWishesQuery';
import * as WishService from '../../../services/api/WishService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';
import { createMockWish } from '../../../tests/factories/wish.factory';

jest.mock('../../../services/api/WishService');

const mockedGetWishes = WishService.getWishes as jest.MockedFunction<typeof WishService.getWishes>;
const mockedCreateWish = WishService.createWish as jest.MockedFunction<typeof WishService.createWish>;
const mockedDeleteWish = WishService.deleteWish as jest.MockedFunction<typeof WishService.deleteWish>;

describe('useWishesQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('uses the correct query key', () => {
    expect(WISHES_KEY).toEqual(['wishes']);
  });

  it('returns undefined data initially', () => {
    mockedGetWishes.mockResolvedValue([]);
    const { result } = renderHook(() => useWishesQuery(), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns fetched wishes on success', async () => {
    const wishes = [createMockWish(), createMockWish()];
    mockedGetWishes.mockResolvedValue(wishes as any);

    const { result } = renderHook(() => useWishesQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetWishes.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useWishesQuery(), { wrapper: createQueryWrapper() });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe('useWishMutations — create', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('create mutation calls WishService.createWish', async () => {
    mockedCreateWish.mockResolvedValue(createMockWish() as any);
    mockedGetWishes.mockResolvedValue([]);

    const { result } = renderHook(() => useWishMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.create.mutateAsync({ nom: 'Selle neuve' } as any);
    });

    expect(mockedCreateWish).toHaveBeenCalledWith({ nom: 'Selle neuve' });
  });

  it('create mutation rolls back on error', async () => {
    const wrapper = createQueryWrapper();
    mockedGetWishes.mockResolvedValue([createMockWish()] as any);
    mockedCreateWish.mockRejectedValue(new Error('fail'));

    const { result: queryResult } = renderHook(() => useWishesQuery(), { wrapper });
    const { result: mutResult } = renderHook(() => useWishMutations(), { wrapper });

    await waitFor(() => expect(queryResult.current.isSuccess).toBe(true));

    await act(async () => {
      try { await mutResult.current.create.mutateAsync({ nom: 'Fail' } as any); } catch {}
    });

    await waitFor(() => expect(queryResult.current.data).toHaveLength(1));
  });
});

describe('useWishMutations — remove', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('remove mutation calls WishService.deleteWish', async () => {
    mockedDeleteWish.mockResolvedValue(undefined as any);
    mockedGetWishes.mockResolvedValue([]);

    const { result } = renderHook(() => useWishMutations(), { wrapper: createQueryWrapper() });

    await act(async () => {
      await result.current.remove.mutateAsync('1');
    });

    expect(mockedDeleteWish).toHaveBeenCalledWith('1');
  });
});
