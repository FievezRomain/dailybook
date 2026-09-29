import httpClient from './httpClient';
import type { StatType, StatisticsQueryPayload, StatisticsResponseMap } from '../../features/statistics/types';

export async function getStatistics<T extends StatType>(type: T, parameters: StatisticsQueryPayload): Promise<StatisticsResponseMap[T]> {
  const response = await httpClient.post(`/statistics/${type}`, parameters);
  return response.data as StatisticsResponseMap[T];
}

// Raccourcis par type — conservés pour compatibilité avec les appels existants
export const getDepenses = (params: StatisticsQueryPayload) => getStatistics('depenses', params);
export const getEntrainements = (params: StatisticsQueryPayload) => getStatistics('entrainements', params);
export const getBalades = (params: StatisticsQueryPayload) => getStatistics('balades', params);
export const getPoids = (params: StatisticsQueryPayload) => getStatistics('poids', params);
export const getTailles = (params: StatisticsQueryPayload) => getStatistics('tailles', params);
export const getAlimentations = (params: StatisticsQueryPayload) => getStatistics('alimentations', params);
export const getConcours = (params: StatisticsQueryPayload) => getStatistics('concours', params);
