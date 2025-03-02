import React, { useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit';
import { Dimensions, ScrollView } from 'react-native';

let screenWidth = Dimensions.get('window').width;
const spaceForPoint = 50;

const LineChartComponent = ({ data, chartConfig }) => {

  useEffect(() => {
    if(data.labels != undefined && data.labels.length > 5){
      screenWidth = screenWidth + (spaceForPoint * (data.labels.length - 5));
    } else{
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
        bezier // Pour des courbes lissées
        verticalLabelRotation={30}
      />
    </ScrollView>
  );
};

export default LineChartComponent;
