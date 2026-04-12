import httpClient from './httpClient';

type StatType =
  | 'depenses'
  | 'entrainements'
  | 'balades'
  | 'poids'
  | 'tailles'
  | 'alimentations'
  | 'concours';

export async function getStatistics(type: StatType, parameters: Record<string, unknown>) {
  const response = await httpClient.post(`/statistics/${type}`, parameters);
  return response.data;
}

// Raccourcis par type — conservés pour compatibilité avec les appels existants
export const getDepenses = (params: Record<string, unknown>) => getStatistics('depenses', params);
export const getEntrainements = (params: Record<string, unknown>) => getStatistics('entrainements', params);
export const getBalades = (params: Record<string, unknown>) => getStatistics('balades', params);
export const getPoids = (params: Record<string, unknown>) => getStatistics('poids', params);
export const getTailles = (params: Record<string, unknown>) => getStatistics('tailles', params);
export const getAlimentations = (params: Record<string, unknown>) => getStatistics('alimentations', params);
export const getConcours = (params: Record<string, unknown>) => getStatistics('concours', params);
