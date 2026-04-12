import React from 'react';
import { ContributionGraph } from 'react-native-chart-kit';
import { Dimensions, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HeatMapChartComponent = ({
  data,
  chartConfig,
  dateDebut,
  dateFin,
  handleDayPress,
}: {
  data: any;
  chartConfig: any;
  dateDebut: string;
  dateFin: string;
  handleDayPress: (date: any) => void;
}) => {
  const calculateDaysBetweenDates = (date1: string, date2: string): number => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
    const diffInMs = Math.abs(d2.getTime() - d1.getTime());
    return diffInMs / (1000 * 60 * 60 * 24);
  };

  const numDays = calculateDaysBetweenDates(dateDebut, dateFin) + 1;
  const squareSize = numDays > 32 ? 20 : 40;
  const horizontal = numDays > 32;

  return (
    <ScrollView horizontal={true}>
      <ContributionGraph
        values={data}
        endDate={new Date(dateFin)}
        numDays={numDays}
        width={horizontal ? 1200 : screenWidth}
        height={250}
        chartConfig={chartConfig}
        squareSize={squareSize}
        accessor='count'
        style={{ marginBottom: 10 }}
        showMonthLabels={horizontal}
        horizontal={horizontal}
        onDayPress={(date) => handleDayPress(date)}
        tooltipDataAttrs={() => ({})}
        getMonthLabel={(monthIndex) => {
          const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
          return months[monthIndex] ?? '';
        }}
      />
    </ScrollView>
  );
};

export default HeatMapChartComponent;
