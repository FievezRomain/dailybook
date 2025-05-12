import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo, MaterialIcons } from '@expo/vector-icons';
import animalsServiceInstance from '../../services/AnimalsService';
import Toast from "react-native-toast-message";
import React, { useState, useEffect, useContext } from 'react';
import ModalManageBodyAnimal from '../modals/animals/ModalManageBodyAnimal';
import LoggerService from '../../services/LoggerService';
import { useAuth } from '../../providers/AuthenticatedUserProvider';
import { Image } from "expo-image";
import { Divider, useTheme } from 'react-native-paper';
import ModalValidation from "../modals/common/ModalValidation";
import Feather from '@expo/vector-icons/Feather';
import ModalSubMenuPhysiqueActions from '../modals/animals/ModalSubMenuPhysiqueActions';

const PhysiqueCard = ({ infos, itemType, handlePhysiqueChange, handlePhysiqueDelete }) => {
    const { colors, fonts } = useTheme();
    const [modalSubMenuPhysiqueVisible, setModalSubMenuPhysiqueVisible] = useState(false);
    const [modalPhysiqueVisible, setModalPhysiqueVisible] = useState(false);
    const [currentPhysique, setCurrentPhysique] = useState(infos);
    const { currentUser } = useAuth();
    const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

    useEffect(() =>{
        if(infos !== undefined){
            setCurrentPhysique(infos);
        }
    }, [infos]);

    const onPressOptions = () => {
        setModalSubMenuPhysiqueVisible(true)
    }

    const handleModify = () => {
        setModalPhysiqueVisible(true);
    }

    const onModify = () => {
        handlePhysiqueChange();
    }

    const handleDelete = () =>{
        setModalValidationDeleteVisible(true);
    }

    const confirmDelete = () => {
        let data = {};
        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["id"] = currentPhysique.id;
        data["idanimal"] = currentPhysique.idanimal;
        data["item"] = itemType;

        animalsServiceInstance.deleteHistory(data)
            .then((reponse) =>{

                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Suppression d'un objectif réussi"
                });

                handlePhysiqueDelete();

            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la suppression d'un objectif : " + err.message );
            });
        
        setModalValidationDeleteVisible(false);
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
        container:{
            backgroundColor: colors.background,
            borderRadius: 5, 
            marginBottom: 10,
            shadowColor: colors.default_dark, 
            shadowOpacity: 0.1, 
            elevation: 1, 
            shadowOffset: {width: 0,height: 1},
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
            <ModalSubMenuPhysiqueActions
                modalVisible={modalSubMenuPhysiqueVisible}
                setModalVisible={setModalSubMenuPhysiqueVisible}
                handleModify={handleModify}
                handleDelete={handleDelete}
            />
            <ModalManageBodyAnimal
                actionType={"modify"}
                isVisible={modalPhysiqueVisible}
                setVisible={setModalPhysiqueVisible}
                objectif={currentPhysique}
                onModify={onModify}
                item={itemType}
                infos={currentPhysique}
            />
            <ModalValidation
                displayedText={"Êtes-vous sûr de vouloir supprimer cet élément de l'historique ?"}
                onConfirm={confirmDelete}
                setVisible={setModalValidationDeleteVisible}
                visible={modalValidationDeleteVisible}
                title={"Suppression d'un historique de physique"}
            />

            <View key={currentPhysique.id} style={styles.container}>
                <View style={{display: "flex",flexDirection: "row"}}>
                    <View style={{flexDirection: "row",justifyContent: "space-between", width: "100%",borderTopStartRadius: 5,borderTopEndRadius: 5, padding: 10}}>
                        <View>
                            <Text style={[{color:colors.default_dark}, styles.textFontBold]}>{currentPhysique.type !== "quantity" || currentPhysique.unity === null ? currentPhysique.value : currentPhysique.value + " " + currentPhysique.unity}</Text>
                        </View>
                        <TouchableOpacity onPress={() => onPressOptions()}>
                            <Entypo name='dots-three-horizontal' size={20} color={colors.default_dark} />
                        </TouchableOpacity>
                    </View>
                    
                </View>
            </View>
        </>
        
    );
}

export default PhysiqueCard;