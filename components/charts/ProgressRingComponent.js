import React from 'react';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ProgressRingComponent = ({ data, chartConfig }) => (
  <ProgressChart
    data={data}
    width={screenWidth}
    height={220}
    strokeWidth={16} // Largeur de l'anneau
    radius={32} // Rayon de l'anneau
    chartConfig={chartConfig}
    hideLegend={false} // Affiche ou cache la légende
  />
);

export default ProgressRingComponent;
