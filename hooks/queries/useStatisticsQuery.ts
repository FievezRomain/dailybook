import { useQuery } from '@tanstack/react-query';
import * as StatisticService from '../../services/api/StatisticService';
import type { StatType, StatisticsQueryPayload, StatisticsResponseMap } from '../../features/statistics/types';

export function useStatisticsQuery<T extends StatType>(type: T, parameters: StatisticsQueryPayload, enabled = true) {
  return useQuery<StatisticsResponseMap[T]>({
    queryKey: ['statistics', type, parameters],
    queryFn: () => StatisticService.getStatistics(type, parameters),
    enabled: enabled && parameters.animaux.length > 0,
    staleTime: 10 * 60 * 1000,
  });
}
