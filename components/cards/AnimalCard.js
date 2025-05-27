import { useEffect, useState } from "react";
import { StyleSheet, Text } from "react-native";
import { useAnimaux } from "../../providers/AnimauxProvider";

const AnimalCard = ({ animal, animalState, userRole }) => {
    const { animaux } = useAnimaux();
    const currentAnimal = getGlobalCurrantAnimalByAnimalGroup( animal );

    const getGlobalCurrantAnimalByAnimalGroup = ( animal ) => {
        let index = animaux.findIndex(objet => objet.id === animal.id);

        if( index !== -1 ) return animaux[index];
        
        return {};
    }

    const styles = StyleSheet.create({

    });

    return(
        <>
            <View>
                <Text>{currentAnimal.nom}</Text>
                <Text>{currentAnimal.provenance}</Text>
            </View>
        </>
    );
}

export default AnimalCard;