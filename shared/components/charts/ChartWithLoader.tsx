import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { getDepenses, getEntrainements, getBalades, getPoids, getTailles, getAlimentations, getConcours } from '../../../services/api/StatisticService';
import ModalDefaultNoValue from '../modals/common/ModalDefaultNoValue';
import { useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { addColorsToData } from '../../utils/Colors';
import { useTheme } from 'react-native-paper';

const ChartWithLoader = ({ ChartComponent, chartType, chartConfig, chartParameters }: {
  ChartComponent: React.ComponentType<any>;
  chartType: string;
  chartConfig: any;
  chartParameters: any;
}) => {
  const { colors } = useTheme();
  const [data, setData] = useState<any>(null);
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
      let result: any = undefined;
      switch (chartType) {
        case 'depense':
          result = await getDepenses(chartParameters);
          result.statistic = addColorsToData(result.statistic, colors as any);
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
      setData(result);
      currentChartComponent.current = ChartComponent;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const forceUpdateDataChart = () => {
    loadData();
  };

  return loading || !data ? (
    <ActivityIndicator size="large" />
  ) : (data.statistic.length > 0 && data.statistic.datasets === undefined) ||
    (data.statistic.datasets !== undefined && data.statistic.datasets.length > 0) ? (
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
