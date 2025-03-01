import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import EventCard from '../cards/EventCard';
import Toast from "react-native-toast-message";
import LineChartComponent from '../charts/LineChartComponent';

const TailleComponent = ({ data, chartConfig, chartParameters }) => {
    const { colors, fonts } = useTheme();
    const [loading, setLoading] = useState(true);
    const [dataToDisplay, setDataToDisplay] = useState(data);
    const [expandedCategory, setExpandedCategory] = useState(null);

    const handleEventsChange = async () => {

        setTimeout(() => Toast.show({
          type: "success",
          position: "top",
          text1: "Modification d'un événement"
        }), 350);
    
    };

    const handleCategoryPress = (category) => {
        // Si la catégorie est déjà ouverte, on la referme, sinon on l'ouvre
        setExpandedCategory(expandedCategory === category ? null : category);
    };

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
            <LineChartComponent
                chartConfig={chartConfig}
                data={dataToDisplay.statistic}
            />
            {/* <FlatList
                data={dataToDisplay.statistic}
                keyExtractor={(item) => item.name}
                renderItem={({ item }) => (
                    <>
                        <TouchableOpacity style={styles.card} onPress={() => handleCategoryPress(item.name)}>
                            <View style={styles.cardContainer}>
                                <View style={styles.categorieContainer}>
                                    <View style={[styles.indicatorCategorie, {backgroundColor: item.color, marginRight: 15}]} />
                                    <Text>{item.name}</Text>
                                </View>
                                <View style={styles.categorieContainer}>
                                    {expandedCategory === item.name ?
                                        <IconButton icon={"chevron-up"} size={20} />
                                    :
                                        <IconButton icon={"chevron-down"} size={20} />
                                    }
                                    <Text>{item.exact_value} €</Text>
                                </View>
                                
                            </View>
                        </TouchableOpacity>

                        {(expandedCategory === item.name) && (
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
                                contentContainerStyle={styles.eventsListContainer}
                            />
                        )}
                    </>
                )}
                scrollEnabled={false}
                contentContainerStyle={styles.listEventContainer}
            /> */}
        </>
    );
};

export default TailleComponent;