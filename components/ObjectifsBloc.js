import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import variables from "./styles/Variables";
import { TouchableOpacity } from "react-native";
import CompletionBar from './CompletionBar';

const ObjectifsBloc = () =>{
    const [itemStatistique, setItemStatistique] = useState("depense");

    const onItemStatistiqueChange = (value) => {
        setItemStatistique(value);
    }

    return (
        <>
            <View style={styles.composantContainer}>
                <View style={styles.headerContainer}>
                    <SimpleLineIcons name="target" size={24} color={variables.alezan} />
                    <Text style={styles.title}>Objectifs</Text>
                </View>
                <View>
                    <View style={styles.objectifContainer}>
                        <View style={styles.headerObjectif}>
                            <Text>Objectif 1</Text>
                            <TouchableOpacity>
                                <Entypo name='dots-three-horizontal' size={20} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.completionBarContainer}>
                            <CompletionBar
                                percentage={20}
                            />
                        </View>
                        
                    </View>
                    
                </View>
                
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    headerObjectif:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    completionBarContainer:{
        marginTop: 10,
        marginBottom: 10
    },
    statistiquesContainer:{
        justifyContent: "center",
    },
    bottomBar: {
        width: '100%',
        height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
        backgroundColor: variables.souris,
    },
    composantContainer:{
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        height: "50%",
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

export default ObjectifsBloc;
