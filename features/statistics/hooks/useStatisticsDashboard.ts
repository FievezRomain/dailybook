import { useMemo } from 'react';
import { useStatisticsQuery } from '../../../hooks/queries/useStatisticsQuery';
import { buildStatisticsQuery } from '../statisticsUtils';
import type { StatisticsPeriod } from '../types';

export function useStatisticsDashboard(period: StatisticsPeriod, animalIds: readonly number[], periodAnchor: Date) {
  const animalKey = animalIds.join(',');
  const parameters = useMemo(
    () => buildStatisticsQuery(period, animalIds, periodAnchor),
    [animalKey, period, periodAnchor],
  );
  const singleAnimal = animalIds.length === 1;
  const poids = useStatisticsQuery('poids', parameters, singleAnimal);
  const tailles = useStatisticsQuery('tailles', parameters, singleAnimal);
  const balades = useStatisticsQuery('balades', parameters);
  const depenses = useStatisticsQuery('depenses', parameters);
  const entrainements = useStatisticsQuery('entrainements', parameters);
  const alimentations = useStatisticsQuery('alimentations', parameters, singleAnimal);
  const concours = useStatisticsQuery('concours', parameters);
  const queries = [balades, depenses, entrainements, concours, ...(singleAnimal ? [poids, tailles, alimentations] : [])];

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
