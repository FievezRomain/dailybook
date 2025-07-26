import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome6, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import ObjectifCard from './cards/ObjectifCard';
import { useAnimaux } from '../contexts/AnimauxProvider';
import { useAuth } from '../contexts/AuthenticatedUserProvider';
import { useTheme } from 'react-native-paper';
import ModalDefaultNoValue from './modals/common/ModalDefaultNoValue';

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
            paddingTop: 10,
            borderRadius: 5,
        },
        headerContainer:{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20,
            paddingLeft: 20,
            paddingRight: 20,
        },
        title:{
            color: colors.default_dark,
            fontSize : 16,
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
                    <SimpleLineIcons name="target" size={20} color={colors.default_dark} style={styles.icon}/>
                    <Text style={[styles.title, styles.textFontBold]}>Objectifs en cours</Text>
                </View>
                <View>
                    <FlatList
                        data={objectifs}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        style={{paddingHorizontal: 20, paddingBottom: 5, paddingTop: 5}}
                        ListEmptyComponent={
                            <ModalDefaultNoValue
                                text={"Vous n'avez aucun objectif en cours"}
                            />
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity key={item.id}>
                                <View style={styles.objectifContainer}>
                                    <View style={[styles.cardObjectifContainer]}>
                                        <ObjectifCard
                                            objectif={item}
                                            animaux={animaux}
                                            handleObjectifChange={handleObjectifChange}
                                            handleObjectifDelete={handleObjectifDelete}
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                        
                </View>
            </View>
        </>
    );
}

export default ObjectifsInProgressBloc;