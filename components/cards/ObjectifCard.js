import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import CompletionBar from '../CompletionBar';
import { Entypo } from '@expo/vector-icons';
import ObjectifService from '../../services/ObjectifService';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import React, { useState, useEffect, useContext } from 'react';
import ModalSubMenuObjectifActions from '../Modals/ModalSubMenuObjectifActions';
import ModalObjectifSubTasks from '../Modals/ModalObjectifSubTasks';
import variables from '../styles/Variables';
import { getImagePath } from '../../services/Config';

const ObjectifCard = ({ objectif, animaux }) => {
    const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
    const objectifService = new ObjectifService;
    const [modalManageTasksVisible, setModalManageTasksVisible] = useState(false);
    const [modalObjectifVisible, setModalObjectifVisible] = useState(false);
    const [currentObjectif, setCurrentObjectif] = useState({});

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
        setCurrentObjectif(objectif);
    }

    const handleDelete = () => {
        setLoading(true);
        let data = {};
        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["id"] = currentObjectif.id;
        objectifService.delete(data)
            .then((reponse) =>{
                setLoading(false);

                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Suppression d'un objectif réussi"
                });

            })
            .catch((err) =>{
                setLoading(false);
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
            });
    }

    const calculPercentCompletude = (objectif) => {
        var sousEtapesFinished = objectif.sousEtapes.filter((item) => item.state == true);

        return Math.floor((sousEtapesFinished.length * 100) / objectif.sousEtapes.length);
    }

    const getAnimalById = (idAnimal) =>{
        var animal = animaux.filter((animal) => animal.id === idAnimal)[0];

        return animal;
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
                objectif={objectif}
                handleTasksStateChange={onModify}
            />
            <View style={styles.objectifContainer} key={objectif.id}>
                <View style={styles.headerObjectif}>
                    <View style={{display: "flex", flexDirection: "row"}}>
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
                    <TouchableOpacity onPress={() => onPressOptions()}>
                        <Entypo name='dots-three-horizontal' size={20} />
                    </TouchableOpacity>
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