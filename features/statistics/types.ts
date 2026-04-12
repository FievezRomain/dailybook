import { EventStatisticsData, PhysiqueStatisticsData } from '../../models/Statistics';

export type StatType =
  | 'depenses'
  | 'entrainements'
  | 'balades'
  | 'poids'
  | 'tailles'
  | 'alimentations'
  | 'concours';

export type StatItemKey =
  | 'depense'
  | 'balade'
  | 'entrainement'
  | 'poids'
  | 'taille'
  | 'alimentation'
  | 'concours';

export type Temporality = 'Mois' | 'Année';

export type StatisticsQueryPayload = {
  animaux: number[];
  email: string;
  dateDebut: string;
  dateFin: string;
};

/** Config graphique passée aux composants chart (compatible react-native-chart-kit). */
export type ChartConfig = {
  backgroundGradientFrom?: string;
  backgroundGradientFromOpacity?: number;
  backgroundGradientTo?: string;
  backgroundGradientToOpacity?: number;
  color: (opacity?: number) => string | null;
  labelColor: (opacity?: number) => string | null;
  decimalPlaces?: number;
};

/** Props des composants de stat basés sur des événements (dépense, balade, entraînement, concours). */
export type EventChartComponentProps = {
  data: EventStatisticsData;
  chartConfig: ChartConfig;
  chartParameters: StatisticsQueryPayload;
  forceUpdateDataChart?: () => void;
};

/** Props des composants de stat physiologique (poids, taille, alimentation). */
export type PhysiqueChartComponentProps = {
  data: PhysiqueStatisticsData;
  chartConfig: ChartConfig;
  chartParameters: StatisticsQueryPayload;
  forceUpdateDataChart: () => void;
};

/** Props du bloc statistiques global. */
export type StatistiquesBlocProps = {
  selectedAnimal: Array<{ id: number; nom: string }>;
};
