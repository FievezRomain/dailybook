import { useQuery } from '@tanstack/react-query';
import * as StatisticService from '../../services/api/StatisticService';
import { StatisticsQueryPayload } from '../../features/statistics/types';

type StatType =
  | 'depenses'
  | 'entrainements'
  | 'balades'
  | 'poids'
  | 'tailles'
  | 'alimentations'
  | 'concours';

export function useStatisticsQuery(type: StatType, parameters: StatisticsQueryPayload) {
  return useQuery({
    queryKey: ['statistics', type, parameters],
    queryFn: () => StatisticService.getStatistics(type, parameters),
    // Les stats ne sont pas des données en temps réel — on évite les refetch auto
    staleTime: 10 * 60 * 1000,
  });
}
