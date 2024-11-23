import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome6, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ObjectifCard from './cards/ObjectifCard';
import { useAnimaux } from '../providers/AnimauxProvider';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import { useTheme } from 'react-native-paper';

const ObjectifsInProgressBloc = ({ objectifs, handleObjectifChange, handleObjectifDelete }) => {
    const { currentUser } = useAuth();
    const { animaux } = useAnimaux();
    const { colors, fonts } = useTheme();

/*     useEffect(() => {
        if(animaux.length == 0){
            getAnimaux();
        }
    }, [objectifs]);

    const getAnimaux = async () => {
        var result = await animalsServiceInstance.getAnimals(currentUser.email);

        setAnimaux(result);
    } */

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
            color: colors.accent,
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
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return(
        <>
            <View style={styles.objectifsInProgressContainer}>
                <View style={styles.headerContainer}>
                    <SimpleLineIcons name="target" size={20} color={colors.accent} style={styles.icon}/>
                    <Text style={[styles.title, styles.textFontBold]}>Objectifs en cours</Text>
                </View>
                <View>
                    {objectifs.length === 0 &&
                        <View style={{backgroundColor: colors.background, marginBottom: 20, width: "100%", padding: 20, borderRadius: 5, shadowColor: "black", shadowOpacity: 0.1, elevation: 1, shadowOffset: {width: 0,height: 1},}}>
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

export default ObjectifsInProgressBloc;