import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome6, FontAwesome, MaterialCommunityIcons, Entypo, Feather } from '@expo/vector-icons';
import variables from "./styles/Variables";
import { TouchableOpacity } from "react-native";
import OfferInformations from './OfferInformations';

const StatistiquesBloc = () =>{
    const [itemStatistique, setItemStatistique] = useState("depense");

    const onItemStatistiqueChange = (value) => {
        setItemStatistique(value);
    }

    return (
        <>
            <View style={styles.composantContainer}>
                <Text style={{textAlign: "center", color: variables.alezan, fontWeight: "bold", fontSize: 16, paddingVertical: 15}}>Statistiques</Text>
                

                {/* <View style={styles.statistiqueIndicatorContainer}>
                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("depense")}}>
                        <FontAwesome6 name="money-bill-wave" size={20} style={itemStatistique == "depense" ? styles.itemIconSelected : styles.itemIconDefault}  />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("alimentation")}}>
                        <MaterialCommunityIcons name="food-apple" size={20} style={itemStatistique == "alimentation" ? styles.itemIconSelected : styles.itemIconDefault}  />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("entrainement")}}>
                        <Entypo name="traffic-cone" size={20} style={itemStatistique == "entrainement" ? styles.itemIconSelected : styles.itemIconDefault}  />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("concours")}}>
                        <FontAwesome name="trophy" size={20} style={itemStatistique == "concours" ? styles.itemIconSelected : styles.itemIconDefault}  />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("balade")}}>
                        <Entypo name="compass" size={20} style={itemStatistique == "balade" ? styles.itemIconSelected : styles.itemIconDefault}  />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("soins")}}>
                        <FontAwesome6 name="hand-holding-medical" size={20} style={itemStatistique == "soins" ? styles.itemIconSelected : styles.itemIconDefault}  />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("rdv")}}>
                        <FontAwesome name="stethoscope" size={20} style={itemStatistique == "rdv" ? styles.itemIconSelected : styles.itemIconDefault}  />
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomBar} />
                <View style={styles.statistiquesContainer}>
                    <Text>Découvrez vos statistiques avec la version premuim</Text>
                </View> */}
                
            </View>
            <OfferInformations />
        </>
    );
}

const styles = StyleSheet.create({
    statistiquesContainer:{
        marginTop: 10,
        justifyContent: "center",
    },
    bottomBar: {
        width: '100%',
        height: 0.4, // ou la hauteur que vous souhaitez pour votre barre
        backgroundColor: variables.souris,
    },
    composantContainer:{
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
    },
    headerContainer:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 20,
        marginBottom: 10,
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
    },
    itemIconDefault:{
        color: variables.rouan,
    },
    itemIconSelected:{
        color: variables.alezan,
    },
});

export default StatistiquesBloc;
