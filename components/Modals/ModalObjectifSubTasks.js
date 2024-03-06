import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useForm } from "react-hook-form";
import CheckboxInput from "../CheckboxInput";
import CompletionBar from "../CompletionBar";

const ModalObjectifSubTasks = ({isVisible, setVisible, objectif={}}) => {
    const [loadingEvent, setLoadingEvent] = useState(false);
    const [percentageObjectif, setPercentageObjectif] = useState(0);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();

    const closeModal = () => {
        setVisible(false);
    };

    const submitRegister = () => {
        console.log("register");
    }

    const calculPercentCompletude = () => {
        var sousEtapesFinished = objectif.sousEtapes.filter((item) => item.state == true);

        setPercentageObjectif(Math.floor((sousEtapesFinished.length * 100) / objectif.sousEtapes.length));
    }

    const handleChangeState = (newState, objet) => {
        objectif.sousEtapes.forEach(element => {
            if (element.id === objet.id) {
                element.state = newState;
            }
        });
        calculPercentCompletude();
    }

    return(
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={closeModal}
            >
                {loadingEvent && (
                    <View style={styles.loadingEvent}>
                        <Image
                        style={styles.loaderEvent}
                        source={require("../../assets/loader.gif")}
                        />
                    </View>
                )}
                <View style={styles.modalContainer}>
                    <View style={styles.form}>
                        <View style={styles.toastContainer}>
                            <Toast />
                        </View>
                        <View style={styles.containerActionsButtons}>

                            <TouchableOpacity onPress={closeModal}>
                                <Text style={{color: Variables.aubere}}>Annuler</Text>
                            </TouchableOpacity>
                                <Text style={{fontWeight: "bold"}}>Gérer les sous-étapes</Text>
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                <Text style={{color: Variables.alezan}}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                            <View style={styles.formContainer}>
                                <View style={styles.headerObjectif}>
                                    <Text>{objectif.title}</Text>
                                </View>
                                <View style={styles.completionBarContainer}>
                                    <CompletionBar
                                        percentage={percentageObjectif}
                                    />
                                </View>
                                <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: Variables.isabelle }}>
                                    {objectif.sousEtapes && objectif.sousEtapes.map((item, index) => {
                                        return(
                                            <View key={item.id} style={styles.checkBoxContainer}>
                                                <CheckboxInput 
                                                    isChecked={item.state}
                                                    onChange={handleChangeState}
                                                    objet={item}
                                                />
                                                <Text>{item.etape}</Text>
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
        backgroundColor: Variables.souris,
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

})

export default ModalObjectifSubTasks;