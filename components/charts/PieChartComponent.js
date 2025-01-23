import React from 'react';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
import { addColorsToData } from '../../utils/Colors';

const screenWidth = Dimensions.get('window').width;

const PieChartComponent = ({ data, chartConfig }) => {
  
  return(
    <PieChart
      data={data}
      width={screenWidth}
      height={220}
      chartConfig={chartConfig}
      accessor="value" 
      backgroundColor="transparent"
      paddingLeft="15"
    />
  )
};

export default PieChartComponent;
