import React, { useEffect, useRef } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView } from 'react-native';

let screenWidth = Dimensions.get('window').width;
const spaceForPoint = 50;

const LineChartComponent = ({ data, chartConfig }: { data: any; chartConfig: any }) => {
  useEffect(() => {
    if (data.labels != undefined && data.labels.length > 5) {
      screenWidth = Dimensions.get('window').width + spaceForPoint * (data.labels.length - 5);
    } else {
      screenWidth = Dimensions.get('window').width;
    }
  }, [data]);

  return (
    <ScrollView horizontal>
      <LineChart
        data={data}
        width={screenWidth}
        height={300}
        chartConfig={chartConfig}
        bezier
        verticalLabelRotation={30}
      />
    </ScrollView>
  );
};

export default LineChartComponent;
