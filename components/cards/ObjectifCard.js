import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CompletionBar from '../CompletionBar';
import { Entypo } from '@expo/vector-icons';
import ObjectifService from '../../services/ObjectifService';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import React, { useState, useEffect, useContext } from 'react';
import ModalSubMenuObjectifActions from '../Modals/ModalSubMenuObjectifActions';
import ModalObjectifSubTasks from '../Modals/ModalObjectifSubTasks';
import variables from '../styles/Variables';

const ObjectifCard = ({ objectif }) => {
    const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
    const objectifService = new ObjectifService;
    const [modalManageTasksVisible, setModalManageTasksVisible] = useState(false);
    const [modalObjectifVisible, setModalObjectifVisible] = useState(false);

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
        console.log("modification objectif");
    }

    const handleDelete = () => {
        setLoading(true);
        let data = {};
        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["id"] = objectif.id;
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
                    <Text>{objectif.title}</Text>
                    <TouchableOpacity onPress={() => onPressOptions()}>
                        <Entypo name='dots-three-horizontal' size={20} />
                    </TouchableOpacity>
                </View>
                <View style={styles.completionBarContainer}>
                    <CompletionBar
                        percentage={calculPercentCompletude(objectif)}
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
        marginBottom: 10
    },
    objectifContainer:{
        backgroundColor: variables.blanc,
        padding: 10,
        marginBottom: 10,
        borderRadius: 5
    },
});

export default ObjectifCard;