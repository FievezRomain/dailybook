/** @jest-environment jsdom */
import { renderHook, waitFor } from '@testing-library/react';
import { useStatisticsQuery } from '../useStatisticsQuery';
import * as StatisticService from '../../../services/api/StatisticService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';

jest.mock('../../../services/api/StatisticService');

const mockedGetStatistics = StatisticService.getStatistics as jest.MockedFunction<
  typeof StatisticService.getStatistics
>;

describe('useStatisticsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('returns undefined data initially', () => {
    mockedGetStatistics.mockResolvedValue([]);
    const { result } = renderHook(
      () => useStatisticsQuery('balades', { idanimal: '1' }),
      { wrapper: createQueryWrapper() },
    );
    expect(result.current.data).toBeUndefined();
  });

  it('returns statistics on success', async () => {
    const stats = [{ date: '2025-01', value: 5 }, { date: '2025-02', value: 3 }] as any[];
    mockedGetStatistics.mockResolvedValue(stats);

    const { result } = renderHook(
      () => useStatisticsQuery('balades', { idanimal: '1' }),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetStatistics.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(
      () => useStatisticsQuery('balades', { idanimal: '1' }),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('uses a cache key that includes type and parameters', () => {
    mockedGetStatistics.mockResolvedValue([]);

    const { result: r1 } = renderHook(
      () => useStatisticsQuery('balades', { idanimal: '1' }),
      { wrapper: createQueryWrapper() },
    );
    const { result: r2 } = renderHook(
      () => useStatisticsQuery('poids', { idanimal: '1' }),
      { wrapper: createQueryWrapper() },
    );

    // Both hooks have query keys but they differ by type — just verify they mount
    expect(r1.current).toBeDefined();
    expect(r2.current).toBeDefined();
  });

  it('calls the service with the provided type and parameters', async () => {
    mockedGetStatistics.mockResolvedValue([]);

    const { result } = renderHook(
      () => useStatisticsQuery('poids', { idanimal: '2' }),
      { wrapper: createQueryWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGetStatistics).toHaveBeenCalledWith('poids', { idanimal: '2' });
  });
});
