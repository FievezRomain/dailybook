import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome6, FontAwesome, MaterialCommunityIcons, Entypo, SimpleLineIcons } from '@expo/vector-icons';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import variables from "./styles/Variables";
import { TouchableOpacity } from "react-native";
import CompletionBar from './CompletionBar';
import ObjectifService from '../services/ObjectifService';
import ModalSubMenuObjectifActions from './Modals/ModalSubMenuObjectifActions';
import ModalObjectif from './Modals/ModalObjectif';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import ModalObjectifSubTasks from './Modals/ModalObjectifSubTasks';
import ObjectifCard from './cards/ObjectifCard';

const ObjectifsBloc = ({ animaux, selectedAnimal, temporality, navigation }) =>{
    const { currentUser } = useAuth();
    const [objectifsArray, setObjectifsArray] = useState([]);
    const [objectifsArrayDisplay, setObjectifsArrayDisplay] = useState([]);
    const [currentObjectif, setCurrentObjectif] = useState({});
    const objectifService = new ObjectifService;
    const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
    const [modalObjectifVisible, setModalObjectifVisible] = useState(false);
    const [modalManageTasksVisible, setModalManageTasksVisible] = useState(false);

    useEffect(() => {
        if(animaux.length !== 0){
            getObjectifs();
        }
    }, [animaux, navigation]);

    useEffect(() => {
        changeObjectifsDisplay();
    }, [objectifsArray, temporality, selectedAnimal]);

    const getObjectifs = async () => {
        var result = await objectifService.getObjectifs(currentUser.email);

        if(result.length != 0){
            setObjectifsArray(result);
        }
    }

    const changeObjectifsDisplay = () => {
        var filteredObjectifs = []

        filteredObjectifs = objectifsArray.filter((item) => item.temporalityobjectif === temporality);

        setObjectifsArrayDisplay(filteredObjectifs);
    }

    const handleModify = () => {
        setModalObjectifVisible(true);
    }

    const onModify = (objectif) => {
        var tempArray = objectifsArray;

        var index = tempArray.findIndex(objet => objet.id === objectif.id);

        if(index !== -1){
            tempArray[index] = objectif;
        }

        setObjectifsArray(tempArray);
        changeObjectifsDisplay();
    }
    const handleDelete = (objectif) => {
        let updatedObjectifs = [];
        updatedObjectifs = [... objectifsArray];

        var index = updatedObjectifs.findIndex((a) => a.id == objectif.id);
        updatedObjectifs.splice(index, 1);

        setObjectifsArray(updatedObjectifs);
        changeObjectifsDisplay();
    }

    const handleManageTasks = () => {
        setModalManageTasksVisible(true);
    }

    return (
        <>
            <ModalSubMenuObjectifActions
                modalVisible={modalSubMenuObjectifVisible}
                setModalVisible={setModalSubMenuObjectifVisible}
                handleModify={handleModify}
                handleDelete={handleDelete}
                handleManageTasks={handleManageTasks}
            />
            <ModalObjectif
                actionType={"modify"}
                isVisible={modalObjectifVisible}
                setVisible={setModalObjectifVisible}
                objectif={currentObjectif}
                onModify={onModify}
            />
            <ModalObjectifSubTasks
                isVisible={modalManageTasksVisible}
                setVisible={setModalManageTasksVisible}
                objectif={currentObjectif}
                handleTasksStateChange={onModify}
            />
            <View style={styles.composantContainer}>
                <Text style={{textAlign: "center", color: variables.alezan, fontWeight: "bold", fontSize: 16, paddingVertical: 15}}>Objectifs</Text>
                <View>
                    {objectifsArrayDisplay.length !== 0 ?
                        objectifsArrayDisplay.map((objectif, index) => {
                            return(
                                <View style={styles.objectifContainer} key={objectif.id}>
                                    <ObjectifCard
                                            objectif={objectif}
                                            animaux={animaux}
                                            handleObjectifChange={onModify}
                                            handleObjectifDelete={handleDelete}
                                        />
                                    
                                </View>
                            );
                        })
                    :
                        <View>
                            <Text style={{color: "gray", textAlign: "center"}}>Vous n'avez aucun objectif</Text>
                        </View>
                    }
                    
                    
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
