import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome5, FontAwesome, MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import variables from "./styles/Variables";
import { TouchableOpacity } from "react-native";
import CompletionBar from './CompletionBar';
import ObjectifService from '../services/ObjectifService';
import ModalSubMenuActions from './Modals/ModalSubMenuActions';
import ModalObjectif from './Modals/ModalObjectif';

const ObjectifsBloc = ({ animaux, selectedAnimal, setLoading, temporality, navigation }) =>{
    const { user } = useContext(AuthenticatedUserContext);
    const [objectifsArray, setObjectifsArray] = useState([]);
    const [objectifsArrayDisplay, setObjectifsArrayDisplay] = useState([]);
    const [currentObjectif, setCurrentObjectif] = useState({});
    const objectifService = new ObjectifService;
    const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
    const [modalObjectifVisible, setModalObjectifVisible] = useState(false);

    useEffect(() => {
        if(animaux.length !== 0){
            getObjectifs();
        }
    }, [animaux, navigation]);

    useEffect(() => {
        if(objectifsArray.length !== 0){
            changeObjectifsDisplay();
        }
    }, [objectifsArray, temporality, selectedAnimal]);

    const getObjectifs = async () => {
        setLoading(true);

        var result = await objectifService.getObjectifs(user.id);

        setLoading(false);

        if(result.length != 0){
            setObjectifsArray(result);
        }
    }

    const changeObjectifsDisplay = () => {
        var filteredObjectifs = []
        var existingObj = objectifsArray[selectedAnimal[0].id];

        if(existingObj){
            var objectifsAnimal = objectifsArray[selectedAnimal[0].id];

            filteredObjectifs = objectifsAnimal.filter((item) => item.temporalityobjectif == temporality);
        }

        setObjectifsArrayDisplay(filteredObjectifs);
    }

    const calculPercentCompletude = (objectif) => {
        var sousEtapesFinished = objectif.sousEtapes.filter((item) => item.state == true);

        return Math.floor((sousEtapesFinished.length * 100) / objectif.sousEtapes.length);
    }

    const handleModify = () => {
        setModalObjectifVisible(true);
    }

    const onModify = () => {
        console.log("modifié !");
    }
    const handleDelete = () => {
        console.log("supprimer");
        console.log(currentObjectif);
    }
    const onPressOptions = (objectif) => {
        let clesFiltrees = Object.keys(objectifsArray).filter((cle) => {
            return objectifsArray[cle].some((element) => element.id === objectif.id);
        });
        objectif.animaux = clesFiltrees;
        setCurrentObjectif(objectif);
        setModalSubMenuObjectifVisible(true)
    }

    return (
        <>
            <ModalSubMenuActions
                modalVisible={modalSubMenuObjectifVisible}
                setModalVisible={setModalSubMenuObjectifVisible}
                handleModify={handleModify}
                handleDelete={handleDelete}
            />
            <ModalObjectif
                actionType={"modify"}
                isVisible={modalObjectifVisible}
                setVisible={setModalObjectifVisible}
                objectif={currentObjectif}
                onModify={onModify}
            />
            <View style={styles.composantContainer}>
                <View style={styles.headerContainer}>
                    <SimpleLineIcons name="target" size={24} color={variables.alezan} />
                    <Text style={styles.title}>Objectifs</Text>
                </View>
                <View>
                    {objectifsArrayDisplay.map((objectif, index) => {
                        return(
                            <View style={styles.objectifContainer} key={objectif.id}>
                                <View style={styles.headerObjectif}>
                                    <Text>{objectif.title}</Text>
                                    <TouchableOpacity onPress={() => onPressOptions(objectif)}>
                                        <Entypo name='dots-three-horizontal' size={20} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.completionBarContainer}>
                                    <CompletionBar
                                        percentage={calculPercentCompletude(objectif)}
                                    />
                                </View>
                                
                            </View>
                        );
                    })}
                    
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
