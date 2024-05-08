import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CompletionBar from '../CompletionBar';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import ObjectifService from '../../services/ObjectifService';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import React, { useState, useEffect, useContext } from 'react';
import ModalSubMenuObjectifActions from '../Modals/ModalSubMenuObjectifActions';
import ModalObjectifSubTasks from '../Modals/ModalObjectifSubTasks';
import variables from '../styles/Variables';
import { getImagePath } from '../../services/Config';
import ModalObjectif from '../Modals/ModalObjectif';

const ObjectifCard = ({ objectif, animaux, handleObjectifChange, handleObjectifDelete }) => {
    const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
    const objectifService = new ObjectifService;
    const [modalManageTasksVisible, setModalManageTasksVisible] = useState(false);
    const [modalObjectifVisible, setModalObjectifVisible] = useState(false);
    const [currentObjectif, setCurrentObjectif] = useState(objectif);

    useEffect(() =>{
        if(objectif !== undefined){
            setCurrentObjectif(objectif);
        }
    }, [objectif]);

    const onPressOptions = () => {
        setModalSubMenuObjectifVisible(true)
    }

    const handleManageTasks = () => {
        setModalManageTasksVisible(true);
    }

    const handleModify = () => {
        setModalObjectifVisible(true);
    }

    const onModify = (objectif) => {
        Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'un objectif réussi"
        });

        setCurrentObjectif(objectif);
        handleObjectifChange(objectif);
    }

    const handleDelete = () => {
        let data = {};
        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["id"] = currentObjectif.id;
        objectifService.delete(data)
            .then((reponse) =>{

                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Suppression d'un objectif réussi"
                });

                handleObjectifDelete(currentObjectif);

            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
            });
    }

    const calculPercentCompletude = (objectif) => {
        if(objectif.sousEtapes != undefined){
            var sousEtapesFinished = objectif.sousEtapes.filter((item) => item.state == true);

            return Math.floor((sousEtapesFinished.length * 100) / objectif.sousEtapes.length);
        }
    }

    const getAnimalById = (idAnimal) =>{
        var animal = animaux.filter((animal) => animal.id === idAnimal)[0];

        return animal;
    }

    const handleTasksStateChange = async (etape) =>{
        var objectifUpdated = currentObjectif;
        var indice = objectifUpdated.sousEtapes.findIndex((a) => a.id === etape.id);
        let data = {};

        etape.state = etape.state === false ? true : false;
        objectifUpdated.sousEtapes[indice] = etape;
        await setCurrentObjectif(objectifUpdated);
        
        data["id"] = currentObjectif.id;
        data["datedebut"] = currentObjectif.datedebut;
        data["datefin"] = currentObjectif.datefin;
        data["title"] = currentObjectif.title;
        data["animaux"] = currentObjectif.animaux;
        data["temporalityobjectif"] = currentObjectif.temporalityobjectif;
        data["sousetapes"] = currentObjectif.sousEtapes;
        objectifService.updateTasks(data)
            .then((reponse) =>{
                handleObjectifChange(currentObjectif);
            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
            })
    }

    return(
        <>
            <ModalSubMenuObjectifActions
                modalVisible={modalSubMenuObjectifVisible}
                setModalVisible={setModalSubMenuObjectifVisible}
                handleModify={handleModify}
                handleDelete={handleDelete}
                handleManageTasks={handleManageTasks}
            />
            <ModalObjectifSubTasks
                isVisible={modalManageTasksVisible}
                setVisible={setModalManageTasksVisible}
                objectif={currentObjectif}
                handleTasksStateChange={onModify}
            />
            <ModalObjectif
                actionType={"modify"}
                isVisible={modalObjectifVisible}
                setVisible={setModalObjectifVisible}
                objectif={currentObjectif}
                onModify={onModify}
            />
            <View style={styles.objectifContainer} key={objectif.id}>
                <View style={styles.headerObjectif}>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "90%"}}>
                            <Text style={{fontWeight: "bold"}}>{objectif.title}</Text>
                            {objectif !== undefined && animaux.length !== 0 && objectif.animaux.map((eventAnimal, index) => {
                                var animal = getAnimalById(eventAnimal);
                                return(
                                    <View key={animal.id} style={{marginLeft: 5}}>
                                        <View style={{height: 20, width: 20, backgroundColor: variables.bai, borderRadius: 10, justifyContent: "center"}}>
                                            { animal.image !== null ? 
                                                <Image style={[styles.avatar]} source={{uri: `${getImagePath()}${animal.image}`}} />
                                                :
                                                <Text style={styles.avatarText}>{animal.nom[0]}</Text>
                                            }
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                    </View>
                    <TouchableOpacity style={{display: "flex", flexDirection: "row", justifyContent: "center", width: "10%"}} onPress={() => onPressOptions()}>
                        <Entypo name='dots-three-horizontal' size={20} />
                    </TouchableOpacity>
                </View>
                <View style={{display: "flex", flexDirection: "column"}}>
                    {currentObjectif.sousEtapes !== undefined && currentObjectif.sousEtapes.map((etape, index) => {
                        return(
                            <TouchableOpacity key={etape.id} style={{marginLeft: 5}} onPress={() => handleTasksStateChange(etape)}>
                                <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                    {etape.state === true &&
                                        <MaterialIcons name="check-box" size={30} color={variables.alezan} />
                                        ||
                                        <MaterialIcons name="check-box-outline-blank" size={30} color={variables.rouan} />
                                    }
                                    <Text>{etape.etape}</Text>
                                </View>
                            </TouchableOpacity>
                        )
                    })}
                </View>
                <View style={styles.completionBarContainer}>
                    <CompletionBar
                        percentage={calculPercentCompletude(currentObjectif)}
                    />
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
        marginBottom: 10,
        borderColor: variables.bai,
        borderWidth: 0.2,
        borderRadius: 60,
        overflow: "hidden"
    },
    objectifContainer:{
        backgroundColor: variables.blanc,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
    avatarText: {
        color: "white",
        textAlign: "center"
    },
    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        zIndex: 1,
        justifyContent: "center"
    },
});

export default ObjectifCard;