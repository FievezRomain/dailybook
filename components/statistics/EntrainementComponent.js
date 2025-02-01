import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import EventCard from '../cards/EventCard';
import Toast from "react-native-toast-message";
import HeatMapChartComponent from '../charts/HeatMapChartComentant';

const EntrainementComponent = ({ data, chartConfig, chartParameters }) => {
    const { colors, fonts } = useTheme();
    const [loading, setLoading] = useState(true);
    const [dataToDisplay, setDataToDisplay] = useState(data);

    useEffect(() => {
        setLoading(true);

        setDataToDisplay(data);
        console.log(data)

        setLoading(false);
    }, [data]);

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
        }
    })

    if( loading ){
        return <ActivityIndicator size="large" />;
    }

    return(
        <>
            <View style={styles.container}>
                <Text style={styles.text}>Total:  €</Text>
            </View>
            <HeatMapChartComponent
                chartConfig={chartConfig}
                data={dataToDisplay.statistic}
                dateFin={getDateFin()}
            />
            
            <FlatList
                data={dataToDisplay.statistic}
                keyExtractor={(item, index) => index}
                renderItem={({ item }) => (
                    <>
                        <TouchableOpacity style={styles.card}>
                            <View style={styles.cardContainer}>
                                <View style={styles.categorieContainer}>
                                    <View style={[styles.indicatorCategorie, {backgroundColor: item.color, marginRight: 15}]} />
                                    <Text>{item.date}</Text>
                                </View>
                                <View style={styles.categorieContainer}>
                                    <Text>{item.exact_value} €</Text>
                                </View>
                                
                            </View>
                        </TouchableOpacity>
                    </>
                )}
                scrollEnabled={false}
                contentContainerStyle={styles.listEventContainer}
            />
        </>
    );
};

export default EntrainementComponent;