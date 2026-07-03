import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { AppIconButton } from '../../../shared/components/ui';
import { useAppTheme } from '../../../theme/useAppTheme';
import EventCard from '../../../shared/components/cards/EventCard';
import Toast from "react-native-toast-message";
import HeatMapChartComponent from '../../../shared/components/charts/HeatMapChartComponent';
import { EventChartComponentProps } from '../types';
import { Event } from '../../../models/Event';
import { EventStatisticsData } from '../../../models/Statistics';

type GroupedEntry = { date: string; events: Event[]; color?: string };

const BaladeComponent = ({ data, chartConfig, chartParameters }: EventChartComponentProps) => {
    const { colors, fonts } = useAppTheme();
    const [loading, setLoading] = useState(true);
    const [dataToDisplay, setDataToDisplay] = useState(data);
    const [dataByDate, setDataByDate] = useState<GroupedEntry[] | null>(null);
    const flatListRef = useRef<FlatList<GroupedEntry>>(null);
    const [expandedDate, setExpandedDate] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);

        setDataByDate(groupEvents(data, chartParameters.dateDebut, chartParameters.dateFin));
        setDataToDisplay(data);

        setLoading(false);
    }, [data]);

    const groupEvents = (data: EventStatisticsData, dateDebut: string, dateFin: string): GroupedEntry[] => {
        const monthDifference = calculateMonthDifference(dateDebut, dateFin);

        if( monthDifference === 0 ){ // Si affichage par mois, on affiche par date
            return groupByDay(data);
        } else { // Si affichage par an, on affiche par mois
            return groupByMonth(data);
        }
    }

    const groupByDay = (data: EventStatisticsData): GroupedEntry[] => {
        const map = new Map<string, GroupedEntry>();

        data.statistic.forEach((stat) => {
            if (!map.has(stat.date)) {
                map.set(stat.date, { date: stat.date, events: [...stat.events] });
            }
        });

        return Array.from(map.values());
    }

    const groupByMonth = (data: EventStatisticsData): GroupedEntry[] => {
        const map = new Map<string, GroupedEntry>();
        const processedDates = new Set<string>();

        data.statistic.forEach((stat) => {
            if (processedDates.has(stat.date)) {
                return; // Passe à l'élément suivant si la date a déjà été traitée
            }
        
            // Ajoute la date au Set des dates traitées
            processedDates.add(stat.date);

            // Extraire l'année et le mois de la date
            const statDate = new Date(stat.date);
            const yearMonth = `${statDate.getFullYear()}-${String(statDate.getMonth() + 1).padStart(2, '0')}`; // Format "YYYY-MM"
        
            // Si la clé "yearMonth" n'existe pas, on l'ajoute
            if (!map.has(yearMonth)) {
                map.set(yearMonth, { date: yearMonth, events: [...stat.events] }); // On ajoute tout le tableau d'événements
              } else {
                // Sinon, on fusionne les nouveaux événements avec ceux existants
                const existing = map.get(yearMonth)!;
                existing.events = [...existing.events, ...stat.events];
              }
        });

        return Array.from(map.values());
    }

    const calculateMonthDifference = (dateDebut: string, dateFin: string): number => {
        // Vérification si par mois ou par an
        const [, moisDebut] = dateDebut.split("/").map(Number);
        const [, moisFin] = dateFin.split("/").map(Number);

        return moisFin - moisDebut;
    }

    const handleEventsChange = async () => {

        setTimeout(() => Toast.show({
          type: "success",
          position: "top",
          text1: "Modification d'un événement"
        }), 350);
    
    };

    const getDateFin = ( ) => {
        if(chartParameters.dateFin){
            var [jour, mois, annee] = chartParameters.dateFin.split("/").map(Number);
            return new Date(annee, mois - 1, jour);
        }
    }

    const getDateDebut = ( ) => {
        if(chartParameters.dateFin){
            var [jour, mois, annee] = chartParameters.dateDebut.split("/").map(Number);
            return new Date(annee, mois - 1, jour);
        }
    }

    const handleDayPress = (day: { date?: string; events?: Event[] }) => {
        if(day.events === undefined || !day.date){
            return;
        }
        // Trouve l'index de la date dans la liste
        const monthDifference = calculateMonthDifference(chartParameters.dateDebut, chartParameters.dateFin);
        let date: string;
        if(monthDifference > 0){
            const d = new Date(day.date);
            date = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        } else{
            date = day.date;
        }
        const index = dataByDate!.findIndex((item) => item.date === date);
    
        if (index !== -1) {
            setExpandedDate(date);
            // Fait défiler la FlatList vers cet index
            flatListRef.current!.scrollToIndex({ index, animated: true });
        }
    };

    const handleDateCategoryPress = (date: string) => {
        // Si la date est déjà ouverte, on la referme, sinon on l'ouvre
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

    const isExpanded = (item: GroupedEntry) => {
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
            <HeatMapChartComponent
                chartConfig={chartConfig}
                data={dataToDisplay.statistic}
                dateDebut={getDateDebut() as any}
                dateFin={getDateFin() as any}
                handleDayPress={handleDayPress}
            />
            
            <FlatList
                ref={flatListRef}
                data={dataByDate}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                    <>
                        <TouchableOpacity style={styles.card} onPress={() => handleDateCategoryPress(item.date)}>
                            <View style={styles.cardContainer}>
                                <View style={styles.categorieContainer}>
                                    <View style={[styles.indicatorCategorie, {backgroundColor: item.color, marginRight: 15}]} />
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
                                data={item.events}
                                keyExtractor={(event) => event.id.toString()}
                                renderItem={({ item }) => (
                                    <EventCard
                                        eventInfos={item}
                                        withDate={ true }
                                        handleEventsChange={handleEventsChange}
                                    />
                                )}
                            />
                        )}
                    </>
                )}
                scrollEnabled={false}
                contentContainerStyle={styles.listEventContainer}
                style={{paddingLeft:20, paddingRight: 20, paddingBottom: 30}}
            />
        </>
    );
};

export default BaladeComponent;
