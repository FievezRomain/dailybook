import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getDepenses, getEntrainements, getBalades, getPoids, getTailles, getAlimentations, getConcours } from '../../../services/api/StatisticService';
import ModalDefaultNoValue from '../modals/common/ModalDefaultNoValue';
import { useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { addColorsToData } from '../../utils/Colors';
import { useAppTheme } from '../../../theme/useAppTheme';
import { StatisticsData } from '../../../models/Statistics';
import { StatItemKey, ChartConfig, StatisticsQueryPayload } from '../../../features/statistics/types';
import LoggerService from '../../../services/logs/LoggerService';
import { parseApiError } from '../../../utils/errorParser';

const ChartWithLoader = ({ ChartComponent, chartType, chartConfig, chartParameters }: {
  ChartComponent: React.ComponentType<any>;
  chartType: StatItemKey;
  chartConfig: ChartConfig;
  chartParameters: StatisticsQueryPayload;
}) => {
  const { colors } = useAppTheme();
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: events } = useEventsQuery();
  const currentChartComponent = useRef(ChartComponent);
  const RenderedChart = currentChartComponent.current;

  useEffect(() => {
    loadData();
  }, [chartType, chartParameters, events]);

  const loadData = async () => {
    try {
      setLoading(true);
      let result: StatisticsData | undefined = undefined;
      switch (chartType) {
        case 'depense':
          result = await getDepenses(chartParameters);
          (result as any).statistic = addColorsToData((result as any).statistic, colors);
          break;
        case 'entrainement':
          result = await getEntrainements(chartParameters);
          break;
        case 'balade':
          result = await getBalades(chartParameters);
          break;
        case 'poids':
          result = await getPoids(chartParameters);
          break;
        case 'taille':
          result = await getTailles(chartParameters);
          break;
        case 'alimentation':
          result = await getAlimentations(chartParameters);
          break;
        case 'concours':
          result = await getConcours(chartParameters);
          break;
      }
      setData(result ?? null);
      currentChartComponent.current = ChartComponent;
    } catch (error) {
      const parsed = parseApiError(error);
      LoggerService.error('Statistics chart load failed', error, {
        feature: 'statistics',
        operation: 'load_chart',
        chartType,
        errorCode: parsed.code,
      });
    } finally {
      setLoading(false);
    }
  };

  const forceUpdateDataChart = () => {
    loadData();
  };

  if (loading || !data) return <ActivityIndicator size="large" />;

  const statistic = (data as any).statistic;
  const hasData =
    (Array.isArray(statistic) && statistic.length > 0) ||
    (!Array.isArray(statistic) && statistic?.datasets?.length > 0);

  return hasData ? (
    <RenderedChart
      data={data}
      chartConfig={chartConfig}
      chartParameters={chartParameters}
      forceUpdateDataChart={forceUpdateDataChart}
    />
  ) : (
    <View style={{ width: '90%', alignSelf: 'center' }}>
      <ModalDefaultNoValue text={"Vous n'avez aucune information à afficher pour cette statistique."} />
    </View>
  );
};

export default ChartWithLoader;

