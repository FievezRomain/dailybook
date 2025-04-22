import React, { useEffect, useState } from 'react';
import { ContributionGraph } from 'react-native-chart-kit';
import { Dimensions, ScrollView } from 'react-native';

const screenWidth = Dimensions.get('window').width;

const HeatMapChartComponent = ({ data, chartConfig, dateDebut, dateFin, handleDayPress }) => {

  const calculateDaysBetweenDates = (date1, date2) => {
    // Convertir les chaînes de caractères en objets Date
    const d1 = new Date(date1);
    const d2 = new Date(date2);
  
    // Normaliser les dates à minuit
    d1.setHours(0, 0, 0, 0);
    d2.setHours(0, 0, 0, 0);
  
    // Calculer la différence en millisecondes
    const diffInMs = Math.abs(d2 - d1);
  
    // Convertir les millisecondes en jours
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
  
    return diffInDays;
  };

  const numDays = calculateDaysBetweenDates(dateDebut, dateFin) + 1;
  const squareSize = numDays > 32 ? 20 : 40;
  const horizontal = numDays > 32;
  
  return(
    <ScrollView horizontal={true}>
      <ContributionGraph
          values={data}
          endDate={dateFin}
          numDays={numDays}
          width={horizontal ? 1200 : screenWidth}
          height={250}
          chartConfig={chartConfig}
          squareSize={squareSize}
          accessor='count'
          style={{marginBottom: 10}}
          showMonthLabels={horizontal}
          horizontal={horizontal}
          onDayPress={(date) => handleDayPress(date)}
          getMonthLabel={(monthIndex) => {
              switch(monthIndex){
                  case 0:
                      return "Janvier";
                  case 1:
                      return "Février";
                  case 2:
                      return "Mars";
                  case 3:
                      return "Avril";
                  case 4:
                      return "Mai";
                  case 5: 
                      return "Juin";
                  case 6:
                      return "Juillet";
                  case 7:
                      return "Août";
                  case 8:
                      return "Septembre";
                  case 9:
                      return "Octobre";
                  case 10:
                      return "Novembre";
                  case 11:
                      return "Décembre";
              }
          }}
      />
    </ScrollView>
  )
};

export default HeatMapChartComponent;
