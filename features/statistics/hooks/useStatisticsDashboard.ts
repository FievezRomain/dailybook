import { useMemo } from 'react';
import { useStatisticsQuery } from '../../../hooks/queries/useStatisticsQuery';
import { buildStatisticsQuery } from '../statisticsUtils';
import type { StatisticsPeriod } from '../types';

export function useStatisticsDashboard(period: StatisticsPeriod, animalIds: readonly number[]) {
  const animalKey = animalIds.join(',');
  const parameters = useMemo(
    () => buildStatisticsQuery(period, animalIds),
    [animalKey, period],
  );
  const poids = useStatisticsQuery('poids', parameters);
  const tailles = useStatisticsQuery('tailles', parameters);
  const balades = useStatisticsQuery('balades', parameters);
  const depenses = useStatisticsQuery('depenses', parameters);
  const entrainements = useStatisticsQuery('entrainements', parameters);
  const alimentations = useStatisticsQuery('alimentations', parameters);
  const concours = useStatisticsQuery('concours', parameters);
  const queries = [poids, tailles, balades, depenses, entrainements, concours];

  return {
    parameters,
    poids,
    tailles,
    balades,
    depenses,
    entrainements,
    alimentations,
    concours,
    isLoading: queries.some((query) => query.isLoading),
    isError: queries.some((query) => query.isError),
    refetch: () => Promise.all(queries.map((query) => query.refetch())),
  };
}
