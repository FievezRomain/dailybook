import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import statisticServiceInstance from "../services/StatisticService";
import ModalDefaultNoValue from './Modals/ModalDefaultNoValue';
import { useEvents } from '../providers/EventsProvider';
import { addColorsToData } from '../utils/Colors';

const ChartWithLoader = ({ ChartComponent, chartType, chartConfig, chartParameters }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { events } = useEvents();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        switch(chartType){
          case 'depense':
            var result = await statisticServiceInstance.getDepenses(chartParameters);
            result.statistic = addColorsToData(result.statistic);
            break;
          case 'entrainement':
            var result = await statisticServiceInstance.getEntrainement(chartParameters);
            break;
        }
        
        setData(result);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [chartType, chartParameters, events]);

  return (
    loading || !data ?
        <ActivityIndicator size="large" />
    :
        data.statistic.length > 0 ?
            <ChartComponent data={data} chartConfig={chartConfig} chartParameters={chartParameters} />
        :
            <View style={{width: "90%", alignSelf: "center"}}>
                <ModalDefaultNoValue
                    text={"Vous n'avez aucune information à afficher pour cette statistique."}
                />
            </View>
            
  );
};

export default ChartWithLoader;
