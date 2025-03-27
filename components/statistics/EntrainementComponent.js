import React, { useState, useEffect, useRef } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, TouchableOpacity, SectionList } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import EventCard from '../cards/EventCard';
import Toast from "react-native-toast-message";
import HeatMapChartComponent from '../charts/HeatMapChartComentant';

const EntrainementComponent = ({ data, chartConfig, chartParameters }) => {
    const { colors, fonts } = useTheme();
    const [loading, setLoading] = useState(true);
    const [dataToDisplay, setDataToDisplay] = useState(data);
    const [dataByDate, setDataByDate] = useState(null);
    const flatListRef = useRef(null);
    const [expandedDate, setExpandedDate] = useState(null);

    useEffect(() => {
        setLoading(true);

        setDataByDate(groupEvents(data, chartParameters.dateDebut, chartParameters.dateFin));
        setDataToDisplay(data);

        setLoading(false);
    }, [data]);

    const groupEvents = (data, dateDebut, dateFin) => {
        const monthDifference = calculateMonthDifference(dateDebut, dateFin);

        if( monthDifference === 0 ){ // Si affichage par mois, on affiche par date
            return groupByDay(data);
        } else { // Si affichage par an, on affiche par mois
            return groupByMonth(data);
        }
    }

    const groupByDay = (data) => {
        const map = new Map();

        data.statistic.forEach((stat) => {
            if (!map.has(stat.date)) {
                map.set(stat.date, { date: stat.date, events: [...stat.events] });
            }
        });

        return Array.from(map.values());
    }

    const groupByMonth = (data) => {
        const map = new Map();
        const processedDates = new Set();

        data.statistic.forEach((stat) => {
            // Vérifie si cette date a déjà été traitée
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
                const existingEvents = map.get(yearMonth).events;
                map.get(yearMonth).events = [...existingEvents, ...stat.events];
              }
        });

        return Array.from(map.values());
    }

    const calculateMonthDifference = (dateDebut, dateFin) => {
        // Vérification si par mois ou par an
        var [jourDebut, moisDebut, anneeDebut] = dateDebut.split("/").map(Number);
        var [jourFin, moisFin, anneeFin] = dateFin.split("/").map(Number);

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

    const handleDayPress = (day) => {
        if(day.events === undefined){
            return;
        }
        // Trouve l'index de la date dans la liste
        const monthDifference = calculateMonthDifference(chartParameters.dateDebut, chartParameters.dateFin);
        let date = null;
        if(monthDifference > 0){
            date = new Date(day.date);
            date = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        } else{
            date = day.date;
        }
        const index = dataByDate.findIndex((item) => item.date === date);
    
        if (index !== -1) {
            setExpandedDate(date);
            // Fait défiler la FlatList vers cet index
            flatListRef.current.scrollToIndex({ index, animated: true });
        }
    };

    const handleDateCategoryPress = (date) => {
        // Si la date est déjà ouverte, on la referme, sinon on l'ouvre
        setExpandedDate(expandedDate === date ? null : date);
    };

    const getDateToDisplay = (date) => {
        const monthDifference = calculateMonthDifference(chartParameters.dateDebut, chartParameters.dateFin);
        const options = monthDifference > 0 ? { month: 'long', year: 'numeric' } : { day: '2-digit', month: 'long', year: 'numeric' };
        const formatter = new Intl.DateTimeFormat('fr-FR', options);

        let dateFormatted = formatter.format( new Date(date) );

        // Si monthDifference > 0, mettre la première lettre du mois en majuscule
        if (monthDifference > 0) {
            dateFormatted = dateFormatted.charAt(0).toUpperCase() + dateFormatted.slice(1);
        }

        return `${dateFormatted}`;
    }

    const isExpanded = (item) => {
        return expandedDate === item.date;
    }
    

    const styles = StyleSheet.create({
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
            shadowColor: "black",
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
            color: colors.default_dark
        },
    })

    if( loading ){
        return <ActivityIndicator size="large" />;
    }

    return(
        <>
            <HeatMapChartComponent
                chartConfig={chartConfig}
                data={dataToDisplay.statistic}
                dateDebut={getDateDebut()}
                dateFin={getDateFin()}
                handleDayPress={handleDayPress}
            />
            
            <FlatList
                ref={flatListRef}
                data={dataByDate}
                keyExtractor={(item, index) => index}
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
                                    <IconButton icon={"chevron-up"} size={20} iconColor={colors.default_dark} />
                                :
                                    <IconButton icon={"chevron-down"} size={20} iconColor={colors.default_dark} />
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
            />
        </>
    );
};

export default EntrainementComponent;