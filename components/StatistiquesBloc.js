import { View, Text, StyleSheet } from "react-native";
import React, { useState, useContext, useEffect } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import variables from "./styles/Variables";
import { TouchableOpacity } from "react-native";

const StatistiquesBloc = () =>{
    return (
        <>
            <View style={styles.composantContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name="bar-chart" size={24} color={variables.alezan} />
                    <Text style={styles.title}>Statistiques</Text>
                </View>
                <View>
                    <View style={styles.statistiqueIndicatorContainer}>
                        <TouchableOpacity style={styles.itemIndicatorStatistique}>
                            <FontAwesome name="money" size={20} style={styles.itemIcon}  />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemIndicatorStatistique}>
                            <FontAwesome name="spoon" size={20} style={styles.itemIcon}  />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemIndicatorStatistique}>
                            <FontAwesome name="bicycle" size={20} style={styles.itemIcon}  />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemIndicatorStatistique}>
                            <FontAwesome name="trophy" size={20} style={styles.itemIcon}  />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.itemIndicatorStatistique}>
                            <FontAwesome name="medkit" size={20} style={styles.itemIcon}  />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    composantContainer:{
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    headerContainer:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 20
    },
    title:{
        color: variables.isabelle,
        marginLeft: 10,
    },
    statistiqueIndicatorContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
    },
    itemIndicatorStatistique:{
        padding: 5,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: variables.alezan,
    },
    itemIcon:{
        color: variables.blanc,
    },
});

module.exports = StatistiquesBloc;