import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome6, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import ObjectifCard from './ObjectifCard';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useAppTheme } from '../../../theme/useAppTheme';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';

const ObjectifsInProgressBloc = ({ objectifs, handleObjectifChange, handleObjectifDelete }: any) => {
    const { data: animaux = [] } = useAnimalsQuery();
    const { colors, fonts } = useAppTheme();

    const styles = {
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
            color: colors.textPrimary,
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
    } as const;

    return(
        <>
            <View style={styles.objectifsInProgressContainer}>
                <View style={styles.headerContainer}>
                    <SimpleLineIcons name="target" size={20} color={colors.textPrimary} style={styles.icon}/>
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
