import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity } from 'react-native';
import { AppIconButton } from '../../../shared/components/ui';
import { useAppTheme } from '../../../theme/useAppTheme';
import EventCard from '../../../shared/components/cards/EventCard';
import Toast from "react-native-toast-message";
import LineChartComponent from '../../../shared/components/charts/LineChartComponent';
import PhysiqueCard from '../../animals/components/PhysiqueCard';
import { PhysiqueChartComponentProps } from '../types';
import { PhysiqueStatisticsData, HistoryEntry } from '../../../models/Statistics';
import { AnimalHistoryItem } from '../../animals/types';

type GroupedHistoryEntry = { date: string; history: HistoryEntry[] };

const AlimentationComponent = ({ data, chartConfig, chartParameters, forceUpdateDataChart }: PhysiqueChartComponentProps) => {
    const { colors, fonts } = useAppTheme();
    const [loading, setLoading] = useState(false);
    const [dataToDisplay, setDataToDisplay] = useState(data);
    const [dataByDate, setDataByDate] = useState<GroupedHistoryEntry[] | null>(null);
    const [expandedDate, setExpandedDate] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        setDataByDate(groupEvents(data, chartParameters.dateDebut, chartParameters.dateFin));
        setDataToDisplay(data);

        setLoading(false);
    }, [data]);

    const handleEventsChange = async ( ) => {
        forceUpdateDataChart();

        setTimeout(() => Toast.show({
          type: "success",
          position: "top",
          text1: "Modification de l'historique"
        }), 350);
    
    };

    const handleEventsDelete = async ( ) => {
        forceUpdateDataChart();

        setTimeout(() => Toast.show({
          type: "success",
          position: "top",
          text1: "Suppression d'un historique"
        }), 350);
    
    };

    const groupEvents = (data: PhysiqueStatisticsData, dateDebut: string, dateFin: string): GroupedHistoryEntry[] => {
        const monthDifference = calculateMonthDifference(dateDebut, dateFin);

        if( monthDifference === 0 ){
            return groupByDay(data);
        } else {
            return groupByMonth(data);
        }
    }

    const groupByDay = (data: PhysiqueStatisticsData): GroupedHistoryEntry[] => {
        const map = new Map<string, GroupedHistoryEntry>();

        data.history.forEach((stat: HistoryEntry) => {
            if (!map.has(stat.date)) {
                map.set(stat.date, { date: stat.date, history: [stat] });
            } else {
                map.get(stat.date)!.history.push(stat);
            }
        });

        return Array.from(map.values());
    }

    const groupByMonth = (data: PhysiqueStatisticsData): GroupedHistoryEntry[] => {
        const map = new Map<string, GroupedHistoryEntry>();

        data.history.forEach((stat: HistoryEntry) => {
            const statDate = new Date(stat.date);
            const yearMonth = `${statDate.getFullYear()}-${String(statDate.getMonth() + 1).padStart(2, '0')}`;
        
            if (!map.has(yearMonth)) {
                map.set(yearMonth, { date: yearMonth, history: [stat] });
              } else {
                map.get(yearMonth)!.history.push(stat);
              }
        });

        return Array.from(map.values());
    }

    const calculateMonthDifference = (dateDebut: string, dateFin: string): number => {
        // Vérification si par mois ou par an
        var [jourDebut, moisDebut, anneeDebut] = dateDebut.split("/").map(Number);
        var [jourFin, moisFin, anneeFin] = dateFin.split("/").map(Number);

        return moisFin - moisDebut;
    }

    const handleDateCategoryPress = (date: string) => {
        setExpandedDate(expandedDate === date ? null : date);
    };

    const getDateToDisplay = (date: string) => {
        const monthDifference = calculateMonthDifference(chartParameters.dateDebut, chartParameters.dateFin);
        const options: Intl.DateTimeFormatOptions = monthDifference > 0 ? { month: 'long', year: 'numeric' } : { day: '2-digit', month: 'long', year: 'numeric' };
        const formatter = new Intl.DateTimeFormat('fr-FR', options);

        let dateFormatted = formatter.format( new Date(date) );

        // Si monthDifference > 0, mettre la première lettre du mois en majuscule
        if (monthDifference > 0) {
            dateFormatted = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
        }

        return `${dateFormatted}`;
    }

    const isExpanded = (item: GroupedHistoryEntry) => {
        return expandedDate === item.date;
    }

    const styles = {
        container:{
            width: "90%",
            alignSelf: "center"
        },
        dates:{
            fontFamily: fonts.labelLarge.fontFamily
        },
        text:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        listEventContainer: {
            display: "flex",
            alignSelf: "center",
            width: "90%",
            paddingBottom: 150
        },
        card:{
            backgroundColor: colors.background,
            width: "100%",
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
            shadowColor: colors.textPrimary,
            shadowOpacity: 0.1,
            elevation: 1,
            shadowRadius: 5,
            shadowOffset: {width:0, height:2}
        },
        cardContainer:{
            flexDirection: "row",
            justifyContent: "space-between"
        },
        indicatorCategorie:{
            height: 10,
            width: 10,
            borderRadius: 15
        },
        categorieContainer:{
            flexDirection: "row",
            alignItems: "center"
        },
        textColor:{
            color: colors.textPrimary
        },
    } as const;

    if( loading ){
        return <ActivityIndicator size="large" />;
    }

    return(
        <>
            <LineChartComponent
                chartConfig={chartConfig}
                data={dataToDisplay.statistic}
            />
            <FlatList
                data={dataByDate}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <>
                        <TouchableOpacity style={styles.card} onPress={() => handleDateCategoryPress(item.date)}>
                            <View style={styles.cardContainer}>
                                <View style={styles.categorieContainer}>
                                    <Text style={[styles.text, styles.textColor]}>{getDateToDisplay(item.date)}</Text>
                                </View>
                                <View style={styles.categorieContainer}>
                                {expandedDate === item.date ?
                                    <AppIconButton icon={"chevron-up"} size={20} color={colors.textPrimary} />
                                :
                                    <AppIconButton icon={"chevron-down"} size={20} color={colors.textPrimary} />
                                }
                                </View>
                                
                            </View>
                        </TouchableOpacity>

                        {(isExpanded(item)) && (
                            <FlatList
                                data={item.history}
                                keyExtractor={(item, index) => index.toString()}
                                renderItem={({ item }) => (
                                    <PhysiqueCard
                                        infos={item}
                                        handlePhysiqueChange={handleEventsChange}
                                        handlePhysiqueDelete={handleEventsDelete}
                                        itemType={item.type as AnimalHistoryItem}
                                    />
                                )}
                            />
                        )}
                    </>
                )}
                scrollEnabled={false}
                contentContainerStyle={styles.listEventContainer}
                style={{marginTop: 10, paddingLeft:20, paddingRight: 20, paddingBottom: 30}}
            />
        </>
    );
};

export default AlimentationComponent;
