import { useQuery } from '@tanstack/react-query';
import * as StatisticService from '../../services/api/StatisticService';

type StatType =
  | 'depenses'
  | 'entrainements'
  | 'balades'
  | 'poids'
  | 'tailles'
  | 'alimentations'
  | 'concours';

export function useStatisticsQuery(type: StatType, parameters: Record<string, unknown>) {
  return useQuery({
    queryKey: ['statistics', type, parameters],
    queryFn: () => StatisticService.getStatistics(type, parameters),
    // Les stats ne sont pas des données en temps réel — on évite les refetch auto
    staleTime: 10 * 60 * 1000,
  });
}
