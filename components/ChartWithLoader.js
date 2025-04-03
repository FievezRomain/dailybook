import React, { useState, useEffect, useRef } from 'react';
import { View, ActivityIndicator } from 'react-native';
import statisticServiceInstance from "../services/StatisticService";
import ModalDefaultNoValue from './Modals/ModalDefaultNoValue';
import { useEvents } from '../providers/EventsProvider';
import { addColorsToData } from '../utils/Colors';
import { useTheme } from 'react-native-paper';

const ChartWithLoader = ({ ChartComponent, chartType, chartConfig, chartParameters }) => {
  const { colors } = useTheme();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { events } = useEvents();
  const currentChartComponent = useRef(ChartComponent);
  const RenderedChart = currentChartComponent.current;

  useEffect(() => {
    loadData();
  }, [chartType, chartParameters, events]);

  const loadData = async () => {
    try {
      setLoading(true);

      let result = undefined;
      switch(chartType){
        
        case 'depense':
            result = await statisticServiceInstance.getDepenses(chartParameters);
            result.statistic = addColorsToData(result.statistic, colors);
          break;
        case 'entrainement':
            result = await statisticServiceInstance.getEntrainements(chartParameters);
          break;
        case 'balade':
            result = await statisticServiceInstance.getBalades(chartParameters);
          break;
        case 'poids':
            result = await statisticServiceInstance.getPoids(chartParameters);
          break;
        case 'taille':
            result = await statisticServiceInstance.getTailles(chartParameters);
          break;
        case 'alimentation':
            result = await statisticServiceInstance.getAlimentations(chartParameters);
          break;
        case 'concours':
            result = await statisticServiceInstance.getConcours(chartParameters);
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
  }

  return (
    loading || !data ?
        <ActivityIndicator size="large" />
    :
        (data.statistic.length > 0 && data.statistic.datasets === undefined) || (data.statistic.datasets !== undefined && data.statistic.datasets.length > 0) ?
            <RenderedChart data={data} chartConfig={chartConfig} chartParameters={chartParameters} forceUpdateDataChart={forceUpdateDataChart} />
        :
            <View style={{width: "90%", alignSelf: "center"}}>
                <ModalDefaultNoValue
                    text={"Vous n'avez aucune information à afficher pour cette statistique."}
                />
            </View>
            
  );
};

export default ChartWithLoader;
