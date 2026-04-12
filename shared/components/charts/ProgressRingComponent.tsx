import React from 'react';
import { ProgressChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const ProgressRingComponent = ({ data, chartConfig }: { data: any; chartConfig: any }) => (
  <ProgressChart
    data={data}
    width={screenWidth}
    height={220}
    strokeWidth={16}
    radius={32}
    chartConfig={chartConfig}
    hideLegend={false}
  />
);

export default ProgressRingComponent;
