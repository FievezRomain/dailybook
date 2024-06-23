import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useForm } from "react-hook-form";
import { SimpleLineIcons } from '@expo/vector-icons';
import NoteService from "../../services/NoteService";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import { ActivityIndicator } from "react-native";

const ModalNote = ({isVisible, setVisible, actionType, note={}, onModify=undefined}) => {
    const { currentUser } = useAuth();
    const noteService = new NoteService();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [loading, setLoading] = useState(false);

    const closeModal = () => {
        setVisible(false);
    };

    const resetValues = () =>{
        setValue("titre", undefined);
        setValue("note", undefined);
    };

    const submitRegister = async(data) =>{
        if(loading){
            return;
        }
        setLoading(true);
        
        data["email"] = currentUser.email;
        
        if(actionType === "modify"){
            noteService.update(data)
                .then((reponse) =>{

                    Toast.show({
                        type: "success",
                        position: "top",
                        text1: "Modification d'un contact réussi"
                    });
                    onModify(reponse);
                    resetValues();
                    closeModal();
                    setLoading(false);
                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    setLoading(false);
                });
        }
        else{
            noteService.create(data)
                .then((reponse) =>{
                    resetValues();
                    closeModal();
                    onModify(reponse);
                    setLoading(false);
                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    setLoading(false);
                });
        }
    }

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
                                <Text style={{color: Variables.aubere}}>Annuler</Text>
                            </TouchableOpacity>
                            { actionType === "modify" && 
                                <Text style={{fontWeight: "bold"}}>Modifier une note</Text>
                            }
                            { actionType === "create" && 
                                <Text style={{fontWeight: "bold"}}>Créer une note</Text>
                            }
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                { loading ? 
                                    <ActivityIndicator size={10} color={Variables.bai} />
                                :
                                    actionType === "modify" ?
                                    <Text style={{color: Variables.alezan}}>Modifier</Text>
                                    :
                                    <Text style={{color: Variables.alezan}}>Créer</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                            <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: Variables.isabelle }}>
                                <View style={styles.formContainer}>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Titre : <Text style={{color: "red"}}>*</Text></Text>
                                        {errors.title && <Text style={styles.errorInput}>Titre obligatoire</Text>}
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Note1"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("titre", text)}
                                            defaultValue={getValues("titre")}
                                            {...register("titre", { required: true })}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        {errors.title && <Text style={styles.errorInput}>Note obligatoire</Text>}
                                        <TextInput
                                            style={styles.inputTextArea}
                                            multiline={true}
                                            placeholder="Exemple : Hello world"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("note", text)}
                                            defaultValue={getValues("note")}
                                            {...register("note", { required: true })}
                                        />
                                    </View>
                                    <View style={{alignSelf: "flex-end"}}>
                                        <View style={{backgroundColor: Variables.alezan, padding: 20, borderRadius: 60, justifyContent: "center", height: 110, width: 110}}>
                                            <SimpleLineIcons name="note"size={60} style={{alignSelf: "flex-end"}} color={Variables.blanc}/>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
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
    inputTextArea: {
        height: 400,
        width: "100%",
        marginBottom: 15,
        borderRadius: 5,
        padding: 15,
        backgroundColor: Variables.rouan,
        color: "black",
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
    iconContainer:{
        backgroundColor: Variables.alezan,
        padding: 20,
        borderRadius: 60,
        height: 120,
        width: 120,
        justifyContent: "center",
        alignItems: "center"
    },
})

export default ModalNote;

