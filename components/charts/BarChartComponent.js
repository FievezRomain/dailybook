import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const BarChartComponent = ({ data, chartConfig }) => (
  <BarChart
    data={data}
    width={screenWidth}
    height={220}
    chartConfig={chartConfig}
    verticalLabelRotation={30}
  />
);

export default BarChartComponent;
