import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome6, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import variables from './styles/Variables';
import ObjectifCard from './cards/ObjectifCard';
import Toast from "react-native-toast-message";
import AnimalsService from "../services/AnimalsService";
import { useAuth } from '../providers/AuthenticatedUserProvider';

const ObjectifsInProgressBloc = ({ objectifs, handleObjectifChange, handleObjectifDelete }) => {
    const { currentUser } = useAuth();
    const animalsService = new AnimalsService;
    const [animaux, setAnimaux] = useState([]);

    useEffect(() => {
        if(animaux.length == 0){
            getAnimaux();
        }
    }, [objectifs]);

    const getAnimaux = async () => {
        var result = await animalsService.getAnimals(currentUser.email);

        setAnimaux(result);
    }

    return(
        <>
            <View style={styles.objectifsInProgressContainer}>
                <View style={styles.headerContainer}>
                    <SimpleLineIcons name="target" size={20} color={variables.bai} style={styles.icon}/>
                    <Text style={[styles.title, styles.textFontBold]}>Objectifs en cours</Text>
                </View>
                <View>
                    {objectifs.length === 0 &&
                        <View style={{backgroundColor: variables.blanc, marginBottom: 30, width: "100%", padding: 20, borderRadius: 5, shadowColor: "black", shadowOpacity: 0.1, shadowOffset: {width: 0,height: 1},}}>
                            <Text style={[styles.textFontRegular]}>Vous n'avez aucun objectif en cours</Text>
                        </View>
                    }
                    {objectifs.map((objectifItem, index) => (
                        <TouchableOpacity key={objectifItem.id}>
                            <View style={styles.objectifContainer}>
                                <View style={[styles.cardObjectifContainer]}>
                                    <ObjectifCard
                                        objectif={objectifItem}
                                        animaux={animaux}
                                        handleObjectifChange={handleObjectifChange}
                                        handleObjectifDelete={handleObjectifDelete}
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
        color: variables.bai,
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
    textFontRegular:{
        fontFamily: variables.fontRegular
    },
    textFontMedium:{
        fontFamily: variables.fontMedium
    },
    textFontBold:{
        fontFamily: variables.fontBold
    }
});

export default ObjectifsInProgressBloc;