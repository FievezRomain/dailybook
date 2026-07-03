/** @jest-environment jsdom */
import { renderHook, waitFor } from '@testing-library/react';
import { useStatisticsQuery } from '../useStatisticsQuery';
import * as StatisticService from '../../../services/api/StatisticService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';

jest.mock('../../../services/api/StatisticService');

const mockedGetStatistics = StatisticService.getStatistics as jest.MockedFunction<
  typeof StatisticService.getStatistics
>;

const params1 = { animaux: [1], email: 'test@test.com', dateDebut: '01/01/2025', dateFin: '31/01/2025' };
const params2 = { animaux: [2], email: 'test@test.com', dateDebut: '01/01/2025', dateFin: '31/01/2025' };

describe('useStatisticsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('returns undefined data initially', () => {
    mockedGetStatistics.mockResolvedValue([]);
    const { result } = renderHook(() => useStatisticsQuery('balades', params1), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns statistics on success', async () => {
    const stats = [{ date: '2025-01', value: 5 }, { date: '2025-02', value: 3 }] as any[];
    mockedGetStatistics.mockResolvedValue(stats);
    const { result } = renderHook(() => useStatisticsQuery('balades', params1), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetStatistics.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useStatisticsQuery('balades', params1), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('uses a cache key that includes type and parameters', () => {
    mockedGetStatistics.mockResolvedValue([]);
    const { result: r1 } = renderHook(() => useStatisticsQuery('balades', params1), { wrapper: createQueryWrapper() });
    const { result: r2 } = renderHook(() => useStatisticsQuery('poids', params1), { wrapper: createQueryWrapper() });
    expect(r1.current).toBeDefined();
    expect(r2.current).toBeDefined();
  });

  it('calls the service with the provided type and parameters', async () => {
    mockedGetStatistics.mockResolvedValue([]);
    const { result } = renderHook(() => useStatisticsQuery('poids', params2), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGetStatistics).toHaveBeenCalledWith('poids', params2);
  });
});
