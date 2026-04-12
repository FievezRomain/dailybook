import React from 'react';
import { BarChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const BarChartComponent = ({ data, chartConfig }: { data: any; chartConfig: any }) => (
  <BarChart
    data={data}
    width={screenWidth}
    height={220}
    chartConfig={chartConfig}
    verticalLabelRotation={30}
    yAxisLabel=""
    yAxisSuffix=""
  />
);

export default BarChartComponent;
