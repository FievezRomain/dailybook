import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import CheckboxInput from "../CheckboxInput";
import CompletionBar from "../CompletionBar";
import _ from 'lodash';
import objectifsServiceInstance from "../../services/ObjectifService";
import LoggerService from "../../services/LoggerService";
import { useTheme } from 'react-native-paper';

const ModalObjectifSubTasks = ({isVisible, setVisible, handleTasksStateChange, objectif={}}) => {
    const { colors, fonts } = useTheme();
    const [percentageObjectif, setPercentageObjectif] = useState(0);
    const [temporaryObjectif, setTemporaryObjectif] = useState(_.cloneDeep(objectif));
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();

    useEffect(() => {
        // Réinitialise la copie temporaire lorsque l'objetif change
        setTemporaryObjectif(_.cloneDeep(objectif));
        initValues();
    }, [objectif]);

    useEffect(() => {
        if(objectif.sousEtapes !== undefined){
            // Réinitialise la copie temporaire lorsque l'objetif change
            calculPercentCompletude();
        }
    }, [temporaryObjectif]);

    const initValues = () => {
        setValue("id", objectif.id);
        setValue("datedebut", objectif.datedebut);
        setValue("datefin", objectif.datefin);
        setValue("title", objectif.title);
        setValue("animaux", objectif.animaux);
        setValue("temporalityobjectif", objectif.temporalityobjectif);
        setValue("sousetapes", objectif.sousEtapes);
    };

    const closeModal = () => {
        setTemporaryObjectif(_.cloneDeep(objectif));
        setVisible(false);
    };

    const submitRegister = async (data) => {

        objectifsServiceInstance.updateTasks(data)
            .then((reponse) =>{

                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Modification des étapes réussi"
                });
                handleTasksStateChange(temporaryObjectif);
                closeModal();
            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la MAJ des étapes d'un objectif : " + err.message );
            });
    }

    const calculPercentCompletude = () => {
        var sousEtapesFinished = temporaryObjectif.sousEtapes.filter((item) => item.state == true);

        setPercentageObjectif(Math.floor((sousEtapesFinished.length * 100) / temporaryObjectif.sousEtapes.length));
    }

    const handleChangeState = (newState, objet) => {
        temporaryObjectif.sousEtapes.forEach(element => {
            if (element.id === objet.id) {
                element.state = newState;
            }
        });
        calculPercentCompletude();
        setValue('sousetapes', temporaryObjectif.sousEtapes);
    }

    const styles = StyleSheet.create({
        completionBarContainer:{
            marginTop: 10,
            marginBottom: 10
        },
        headerObjectif:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center"
        },
        checkBoxContainer:{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
        },
        loadingEvent: {
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9,
            width: "100%",
            height: "100%",
            backgroundColor: "#000000b8",
            paddingTop: 50
        },
        modalContainer: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: "100%",
            justifyContent: "flex-end",
        },
        form: {
            backgroundColor: "rgba(255, 255, 255, 1)",
            width: "100%",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 10,
            height: "90%",
            paddingBottom: 10,
            paddingTop: 10,
        },
        toastContainer: {
            zIndex: 9999, 
        },
        containerActionsButtons: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center"
        },
        bottomBar: {
            width: '100%',
            marginBottom: 10,
            marginTop: 10,
            height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
            backgroundColor: colors.text,
        },
        keyboardAvoidingContainer: {
            flex: 1,
        },
        formContainer:{
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 10,
            paddingBottom: 10,
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
    
    })

    return(
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.form}>
                        <View style={styles.toastContainer}>
                            <Toast />
                        </View>
                        <View style={styles.containerActionsButtons}>

                            <TouchableOpacity onPress={closeModal}>
                                <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                            </TouchableOpacity>
                                <Text style={[styles.textFontBold, {color:colors.default_dark}]}>Gérer les étapes</Text>
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                            <View style={styles.formContainer}>
                                <View style={styles.headerObjectif}>
                                    <Text style={styles.textFontRegular}>{objectif.title}</Text>
                                </View>
                                <View style={styles.completionBarContainer}>
                                    <CompletionBar
                                        percentage={percentageObjectif}
                                    />
                                </View>
                                <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: colors.quaternary }}>
                                    {temporaryObjectif.sousEtapes && temporaryObjectif.sousEtapes.map((item, index) => {
                                        return(
                                            <View key={item.id} style={styles.checkBoxContainer}>
                                                <CheckboxInput 
                                                    isChecked={item.state}
                                                    onChange={handleChangeState}
                                                    objet={item}
                                                />
                                                <Text style={styles.textFontRegular}>{item.etape}</Text>
                                            </View>
                                        );
                                    })}
                                </ScrollView>
                            </View>
                            
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        </>
    );
}

export default ModalObjectifSubTasks;