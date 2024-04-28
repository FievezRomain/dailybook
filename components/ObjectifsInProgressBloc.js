import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome5, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import variables from './styles/Variables';
import ObjectifCard from './cards/ObjectifCard';
import { Toast } from "react-native-toast-message/lib/src/Toast";

const ObjectifsInProgressBloc = ({ objectifs }) => {
    return(
        <>
            <View style={styles.objectifsInProgressContainer}>
                <View style={styles.headerContainer}>
                    <SimpleLineIcons name="target" size={20} color={variables.alezan} style={styles.icon}/>
                    <Text style={styles.title}>Objectifs en cours</Text>
                </View>
                <View>
                    {objectifs.map((objectifItem, index) => (
                        <TouchableOpacity key={objectifItem.id}>
                            <View style={styles.objectifContainer}>
                                <View style={[styles.cardObjectifContainer]}>
                                    <ObjectifCard
                                        objectif={objectifItem}
                                    />
                                </View>
                            </View>
                            
                        </TouchableOpacity>
                        
                    ))}
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    objectifsInProgressContainer:{
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        borderRadius: 5,
    },
    headerContainer:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    title:{
        color: variables.alezan
    },
    icon:{
        marginRight: 10,
    },
    objectifContainer:{
        display: "flex",
        flexDirection: "row",
        width: "100%"
    },
    cardObjectifContainer:{
        width: "100%"
    },
});

export default ObjectifsInProgressBloc;