import { Event } from './Event';

export type HistoryEntry = {
  id: number;
  idanimal: number;
  date: string;
  value: number | string;
  unity?: string;
  type?: string;
};

export type ChartDataset = {
  label: string;
  data: (number | null)[];
  backgroundColor?: string;
};

export type ChartData = {
  labels: string[];
  datasets: ChartDataset[];
};

/** Item retourné par le backend pour les stats événementielles (balade, concours, dépense, entraînement). */
export type StatisticItem = {
  value?: number;
  exact_value?: number;
  name?: string;
  date?: string;
  count?: number;
  events?: Event[];
  /** Couleur ajoutée côté frontend pour le pie chart. */
  color?: string;
};

/** Réponse API pour les stats basées sur des événements (balade, concours, dépense, entraînement). */
export type EventStatisticsData = {
  statistic: StatisticItem[];
  total?: number;
};

/** Réponse API pour les stats physiologiques (poids, taille, alimentation). */
export type PhysiqueStatisticsData = {
  statistic: ChartData;
  history: HistoryEntry[];
};

export type StatisticsData = EventStatisticsData | PhysiqueStatisticsData;
