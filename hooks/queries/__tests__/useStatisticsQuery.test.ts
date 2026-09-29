/** @jest-environment jsdom */
import { renderHook, waitFor } from '@testing-library/react';
import { useStatisticsQuery } from '../useStatisticsQuery';
import * as StatisticService from '../../../services/api/StatisticService';
import { createQueryWrapper } from '../../../tests/utils/queryWrapper';

jest.mock('../../../services/api/StatisticService');

const mockedGetStatistics = StatisticService.getStatistics as jest.MockedFunction<
  typeof StatisticService.getStatistics
>;

const params1 = { animaux: [1], dateDebut: '2025-01-01', dateFin: '2025-01-31' };
const params2 = { animaux: [2], dateDebut: '2025-01-01', dateFin: '2025-01-31' };

describe('useStatisticsQuery', () => {
  beforeEach(() => { jest.clearAllMocks(); });

  it('returns undefined data initially', () => {
    mockedGetStatistics.mockResolvedValue({ statistic: [] });
    const { result } = renderHook(() => useStatisticsQuery('balades', params1), { wrapper: createQueryWrapper() });
    expect(result.current.data).toBeUndefined();
  });

  it('returns statistics on success', async () => {
    const stats = { statistic: [{ date: '2025-01-01', exact_value: 5 }, { date: '2025-02-01', exact_value: 3 }] };
    mockedGetStatistics.mockResolvedValue(stats);
    const { result } = renderHook(() => useStatisticsQuery('balades', params1), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.statistic).toHaveLength(2);
  });

  it('sets isError when the service throws', async () => {
    mockedGetStatistics.mockRejectedValue(new Error('Network error'));
    const { result } = renderHook(() => useStatisticsQuery('balades', params1), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it('uses a cache key that includes type and parameters', () => {
    mockedGetStatistics.mockResolvedValue({ statistic: [] });
    const { result: r1 } = renderHook(() => useStatisticsQuery('balades', params1), { wrapper: createQueryWrapper() });
    const { result: r2 } = renderHook(() => useStatisticsQuery('poids', params1), { wrapper: createQueryWrapper() });
    expect(r1.current).toBeDefined();
    expect(r2.current).toBeDefined();
  });

  it('calls the service with the provided type and parameters', async () => {
    mockedGetStatistics.mockResolvedValue({ statistic: [] });
    const { result } = renderHook(() => useStatisticsQuery('poids', params2), { wrapper: createQueryWrapper() });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockedGetStatistics).toHaveBeenCalledWith('poids', params2);
  });

  it('does not call the service without an animal', () => {
    renderHook(() => useStatisticsQuery('poids', { ...params1, animaux: [] }), { wrapper: createQueryWrapper() });
    expect(mockedGetStatistics).not.toHaveBeenCalled();
  });
});
