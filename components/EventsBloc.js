import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';
import variables from './styles/Variables';
import CompletionBar from './CompletionBar';

const EventsBloc = ({ navigation, events }) => {
    return(
        <>
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='check-circle' size={20} color={variables.alezan} style={styles.icon} />
                    <Text style={styles.title}>Tâches</Text>
                </View>
                <View>
                    {/** Liste des tâches pour aujourd'hui */ }
                </View>
                <View>
                    <Text style={styles.title}>Progression :</Text>
                    <View style={styles.containerCompletionBar}>
                        <CompletionBar
                            percentage={10}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='calendar' size={20} color={variables.alezan} style={styles.icon}/>
                    <Text style={styles.title}>Évenements à venir</Text>
                </View>
                <View>
                    {/** Liste des tâches à venir */ }
                </View>
            </View>
        </View>
            
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        width: "100%",
        alignItems: "center",
        marginTop: 30,
    },
    card:{
        width: "90%",
        padding: 20,
        borderRadius: 5,
        backgroundColor: variables.rouan,
        marginBottom: 10,
    },
    headerContainer:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center"
    },
    title:{
        color: variables.alezan
    },
    icon:{
        marginRight: 10,
    },
    containerCompletionBar:{
        padding: 10,
    },

});

export default EventsBloc;