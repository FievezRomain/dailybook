import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useForm } from "react-hook-form";

const ModalContact = ({isVisible, setVisible, actionType, contact={}, onModify=undefined}) => {
    const [loadingEvent, setLoadingEvent] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();

    const closeModal = () => {
        setVisible(false);
    };

    const resetValues = () =>{
        console.log("vider les variables ici");
    };

    const submitRegister = async(data) =>{
        console.log("créer");
        resetValues();
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
                            { actionType === "modify" && 
                                <Text style={{fontWeight: "bold"}}>Modifier un contact</Text>
                            }
                            { actionType === "create" && 
                                <Text style={{fontWeight: "bold"}}>Créer un contact</Text>
                            }
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                { actionType === "modify" && 
                                <Text style={{color: Variables.alezan}}>Modifier</Text>
                                }
                                { actionType === "create" && 
                                <Text style={{color: Variables.alezan}}>Créer</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                            <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: Variables.isabelle }}>
                                <View style={styles.formContainer}>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Nom : <Text style={{color: "red"}}>*</Text></Text>
                                        {errors.title && <Text style={styles.errorInput}>Nom obligatoire</Text>}
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : John Doe"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("nom", text)}
                                            defaultValue={getValues("nom")}
                                            {...register("nom", { required: true })}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Profession : </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Vétérinaire"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("profession", text)}
                                            defaultValue={getValues("profession")}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Numéro de téléphone : </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : 0606060606"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("numero", text)}
                                            defaultValue={getValues("numero")}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Email : </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : test@gmail.com"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("email", text)}
                                            defaultValue={getValues("email")}
                                        />
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

export default ModalContact;

