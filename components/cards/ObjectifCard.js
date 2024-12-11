import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import CompletionBar from '../CompletionBar';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import objectifsServiceInstance from '../../services/ObjectifService';
import Toast from "react-native-toast-message";
import React, { useState, useEffect, useContext } from 'react';
import ModalSubMenuObjectifActions from '../Modals/ModalSubMenuObjectifActions';
import ModalObjectifSubTasks from '../Modals/ModalObjectifSubTasks';
import ModalObjectif from '../Modals/ModalObjectif';
import LoggerService from '../../services/LoggerService';
import FileStorageService from '../../services/FileStorageService';
import { useAuth } from '../../providers/AuthenticatedUserProvider';
import { Image } from "expo-image";
import { Divider, useTheme } from 'react-native-paper';
import ModalValidation from "../Modals/ModalValidation";

const ObjectifCard = ({ objectif, animaux, handleObjectifChange, handleObjectifDelete }) => {
    const { colors, fonts } = useTheme();
    const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
    const [modalManageTasksVisible, setModalManageTasksVisible] = useState(false);
    const [modalObjectifVisible, setModalObjectifVisible] = useState(false);
    const [currentObjectif, setCurrentObjectif] = useState(objectif);
    const fileStorageService = new FileStorageService();
    const { currentUser } = useAuth();
    const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

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

    const handleDelete = () =>{
        setModalValidationDeleteVisible(true);
    }

    const confirmDelete = () => {
        let data = {};
        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["id"] = currentObjectif.id;
        objectifsServiceInstance.delete(data)
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
                LoggerService.log( "Erreur lors de la suppression d'un objectif : " + err.message );
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
        objectifsServiceInstance.updateTasks(data)
            .then((reponse) =>{
                handleObjectifChange(currentObjectif);
            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la MAJ des tâches d'un objectif : " + err.message );
            })
    }

    const getDayText = (date) =>{
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var dateObject  = new Date(date);
        var dateText = String(dateObject.toLocaleDateString("fr-FR", options));
        dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
        return dateText.slice(0,3);
    }

    const getDateText = (date) =>{
        var dateObjet = new Date(date);
        var jour = ('0' + dateObjet.getDate()).slice(-2); 
        var mois = ('0' + (dateObjet.getMonth() + 1)).slice(-2);
        const dateFormatee = jour + '/' + mois;
        return dateFormatee;
    }

    const getYearText = (date) =>{
        var dateObjet = new Date(date);
        var annee = dateObjet.getFullYear();
        return annee;
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
            borderColor: colors.accent,
            borderWidth: 0.2,
            borderRadius: 60,
            overflow: "hidden"
        },
        objectifContainer:{
            backgroundColor: colors.background,
            borderRadius: 5,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
            shadowColor: "black",
            shadowOpacity: 0.1,
            elevation: 1,
            shadowOffset: {
                width: 0,
                height: 1
            },
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
            <ModalValidation
                displayedText={"Êtes-vous sûr de vouloir supprimer l'objectif ?"}
                onConfirm={confirmDelete}
                setVisible={setModalValidationDeleteVisible}
                visible={modalValidationDeleteVisible}
                title={"Suppression d'un objectif"}
            />
            {/* <View style={styles.objectifContainer} key={objectif.id}>
                <View style={styles.headerObjectif}>
                    <View style={{display: "flex", flexDirection: "row"}}>
                        <View style={{display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "flex-start", width: "90%"}}>
                            <Text style={{fontWeight: "bold"}}>{objectif.title}</Text>
                            {objectif !== undefined && animaux.length !== 0 && objectif.animaux.map((eventAnimal, index) => {
                                var animal = getAnimalById(eventAnimal);
                                return(
                                    <View key={animal.id} style={{marginLeft: 5}}>
                                        <View style={{height: 20, width: 20, backgroundColor: colors.accent, borderRadius: 10, justifyContent: "center"}}>
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
                                        <MaterialIcons name="check-box" size={30} color={colors.accent} />
                                        ||
                                        <MaterialIcons name="check-box-outline-blank" size={30} color={colors.quaternary} />
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
                
            </View> */}

            <View style={styles.objectifContainer} key={objectif.id}>
                <View style={{display: "flex",flexDirection: "row"}}>
                    <View style={{flexDirection: "row",justifyContent: "space-between", width: "100%",borderTopStartRadius: 5,borderTopEndRadius: 5, padding: 10}}>
                        <View>
                            <Text style={[styles.textFontBold]}>{objectif.title}</Text>
                        </View>
                        <TouchableOpacity onPress={() => onPressOptions()}>
                            <Entypo name='dots-three-horizontal' size={20} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
                <Divider/>
                <View style={{display: "flex", flexDirection: "row", backgroundColor: colors.background, borderBottomStartRadius: 5, borderBottomEndRadius: 5}}>
                    <View style={{justifyContent: "center", padding: 10, marginRight: 10, borderRightWidth: 0.3, borderColor: colors.accent, alignItems: "center"}}>
                        <Text style={styles.textFontRegular}>{getDayText(objectif.datefin)}.</Text>
                        <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(objectif.datefin)}</Text>
                        <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(objectif.datefin)}</Text>
                    </View>
                    <View style={{paddingVertical: 10,display: "flex", flexDirection: "column", width: "80%"}}>

                        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
                            <View style={{flexDirection: "column", width: "80%"}}>
                                {currentObjectif.sousEtapes !== undefined && currentObjectif.sousEtapes.map((etape, index) => {
                                    return(
                                        <TouchableOpacity key={etape.id} style={{marginLeft: 5}} onPress={() => handleTasksStateChange(etape)}>
                                            <View style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                                                {etape.state === true &&
                                                    <MaterialIcons name="check-box" size={30} color={colors.accent} />
                                                    ||
                                                    <MaterialIcons name="check-box-outline-blank" size={30} color={colors.accent} />
                                                }
                                                <Text style={[styles.textFontRegular, {flexShrink: 1, flexWrap: 'wrap'}]}>{etape.etape}</Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })}
                            </View>
                            <View style={{flexDirection: "row"}}>
                                {objectif !== undefined && animaux.length !== 0 && objectif.animaux.map((eventAnimal, index) => {
                                    var animal = getAnimalById(eventAnimal);
                                    return(
                                        <View key={animal.id} style={{marginLeft: -3}}>
                                            <View style={{height: 20, width: 20, backgroundColor: colors.accent, borderRadius: 10, justifyContent: "center"}}>
                                                { animal.image !== null ? 
                                                    <Image style={[styles.avatar]} source={{uri: fileStorageService.getFileUrl( animal.image, currentUser.uid )}} cachePolicy="disk" />
                                                    :
                                                    <Text style={[styles.avatarText, styles.textFontRegular]}>{animal.nom[0]}</Text>
                                                }
                                            </View>
                                        </View>
                                    )
                                })}
                            </View>
                        </View>
                        

                        <View style={[styles.completionBarContainer, {flexDirection: "column", marginRight: 10}]}>
                            <CompletionBar
                                percentage={calculPercentCompletude(currentObjectif)}
                            />
                        </View>
                    </View>
                    
                </View>
            </View>
        </>
        
    );
}

export default ObjectifCard;