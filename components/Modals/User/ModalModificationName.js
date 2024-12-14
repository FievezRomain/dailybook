import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../providers/AuthenticatedUserProvider";
import { ActivityIndicator } from "react-native";
import LoggerService from "../../../services/LoggerService";
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from "../ModalEditGeneric";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import InputTextInLine from "../../InputTextInLine";

const ModalModificationName = ({isVisible, setVisible, onModify=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser, updateDisplayName } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [loading, setLoading] = useState(false);
    const [displayName, setDisplayName] = useState();
    var previousDisplayName = currentUser.displayName;


    const closeModal = () => {
        setVisible(false);
    };

    const submitRegister = async(data) =>{
        if(loading){
            return;
        }
        setLoading(true);
        try{
            if(previousDisplayName != displayName){
                await updateDisplayName(displayName);
                closeModal();
                onModify();
            }
        }catch(error){
            LoggerService.log( "Erreur lors de la MAJ d'un utilisateur sur Firebase : " + error.message );
            console.error("Erreur lors de la MAJ du user sur Firebase : " + error.message);
        }
        setLoading(false);
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
            alignItems: "center",
            paddingBottom: 15,
            paddingTop: 5
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
            flex: 1
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
            color: "black",
            alignSelf: "baseline"
        },
        iconContainer:{
            backgroundColor: colors.default_dark,
            padding: 20,
            borderRadius: 60,
            height: 120,
            width: 120,
            justifyContent: "center",
            alignItems: "center"
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
            <ModalEditGeneric
                isVisible={isVisible}
                setVisible={setVisible}
                arrayHeight={["70%"]}
            >
                <View style={styles.form}>
                    <View style={styles.containerActionsButtons}>

                        <TouchableOpacity onPress={closeModal} style={{width:"33.33%", alignItems: "center"}}>
                            <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                        </TouchableOpacity>
                        <View style={{width:"33.33%", alignItems: "center"}}>
                            <Text style={styles.textFontBold}>Nom d'utilisateur</Text>
                        </View>
                        <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{width:"33.33%", alignItems: "center"}}>
                            { loading ? 
                                <ActivityIndicator size={10} color={colors.default_dark} />
                            :
                                <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Modifier</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <KeyboardAwareScrollView
                        extraScrollHeight={-250} 
                        contentContainerStyle={{ flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                    >
                        <View style={styles.formContainer}>
                            
                            <View style={{marginBottom: 10}}>
                                <Text style={[styles.textFontBold, {marginBottom: 5}]}>Votre nom d'utilisateur reste privé.</Text>
                                <Text>Ce nom est uniquement utilisé dans votre application sur votre téléphone.</Text> 
                                <Text>Il n'est jamais partagé avec d'autres utilisateurs ni utilisé dans nos traitements internes.</Text>
                            </View>
                            
                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Nom : </Text>
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Exemple : Utilisateur"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setDisplayName(text)}
                                    defaultValue={currentUser.displayName}
                                />
                            </View>

                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </ModalEditGeneric>
        </>
    )
}

export default ModalModificationName;

