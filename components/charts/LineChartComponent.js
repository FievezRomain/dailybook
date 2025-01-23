import React from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const LineChartComponent = ({ data, chartConfig }) => (
  <LineChart
    data={data}
    width={screenWidth}
    height={220}
    chartConfig={chartConfig}
    bezier // Pour des courbes lissées
    verticalLabelRotation={30}
  />
);

export default LineChartComponent;
