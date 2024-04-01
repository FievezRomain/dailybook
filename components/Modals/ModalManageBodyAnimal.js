import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useForm } from "react-hook-form";
import { AntDesign } from '@expo/vector-icons';
import ContactService from "../../services/ContactService";
import { AuthenticatedUserContext } from "../../providers/AuthenticatedUserProvider";

const ModalManageBodyAnimal = ({isVisible, setVisible, animal={}, onModify=undefined}) => {
    const { user } = useContext(AuthenticatedUserContext);
    const contactService = new ContactService();
    const [loadingEvent, setLoadingEvent] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();

    const closeModal = () => {
        setVisible(false);
    };

    const submitRegister = async(data) =>{
        console.log("enregistrer");
        closeModal();
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
                            <Text style={{fontWeight: "bold"}}>Historique du physique</Text>
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                <Text style={{color: Variables.alezan}}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                            <View style={styles.formContainer}>
                                <View style={{display: "flex", flexDirection: "column"}}>
                                    <Text>À venir...</Text>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
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
    loaderEvent: {
        width: 200,
        height: 200
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
    inputContainer:{
        alignItems: "center",
        width: "100%"
    },
    textInput:{
        alignSelf: "flex-start",
        marginBottom: 5
    },
    input: {
        height: 40,
        width: "100%",
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 15,
        backgroundColor: Variables.rouan,
        color: "black",
        alignSelf: "baseline"
    },
})

export default ModalManageBodyAnimal;