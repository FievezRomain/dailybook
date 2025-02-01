import React from 'react';
import { ContributionGraph } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HeatMapChartComponent = ({ data, chartConfig, dateFin }) => {
  
  return(
    <ContributionGraph
        values={data}
        endDate={dateFin}
        numDays={31}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        squareSize={40}
        accessor='count'
        showMonthLabels={true}
        horizontal={false}
        onDayPress={() => console.log("uwu")}
        getMonthLabel={(monthIndex) => {
            switch(monthIndex){
                case 0:
                    return "Janvier";
            }
        }}
    />
  )
};

export default HeatMapChartComponent;
