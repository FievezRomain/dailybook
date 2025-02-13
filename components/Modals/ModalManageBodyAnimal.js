import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import { useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";

const ModalManageBodyAnimal = ({isVisible, setVisible, animal={}, onModify=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();

    const closeModal = () => {
        setVisible(false);
    };

    const submitRegister = async(data) =>{
        console.log("enregistrer");
        closeModal();
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
            width: "100%",
            paddingBottom: 40
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
            backgroundColor: colors.quaternary,
            color: colors.default_dark,
            alignSelf: "baseline"
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
            <ModalEditGeneric
                isVisible={isVisible}
                setVisible={setVisible}
                arrayHeight={["90%"]}
            >
                    <View style={styles.form}>
                        <View style={styles.containerActionsButtons}>

                            <TouchableOpacity onPress={closeModal}>
                                <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                            </TouchableOpacity>
                            <Text style={styles.textFontBold}>Historique du physique</Text>
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                            <View style={styles.formContainer}>
                                <View style={{display: "flex", flexDirection: "column"}}>
                                    <Text style={styles.textFontRegular}>À venir...</Text>
                                </View>
                            </View>
                        </KeyboardAvoidingView>
                    </View>
            </ModalEditGeneric>
        </>
    )
}

export default ModalManageBodyAnimal;