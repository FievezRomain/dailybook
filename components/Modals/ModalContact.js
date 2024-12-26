import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { AntDesign } from '@expo/vector-icons';
import contactsServiceInstance from "../../services/ContactService";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import { ActivityIndicator } from "react-native";
import LoggerService from "../../services/LoggerService";
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ModalContact = ({isVisible, setVisible, actionType, contact={}, onModify=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isVisible) {
            initValues();
        }
    }, [isVisible]);

    const closeModal = () => {
        setVisible(false);
    };

    const resetValues = () =>{
        setValue("id", undefined);
        setValue("nom", undefined);
        setValue("profession", undefined);
        setValue("telephone", undefined);
        setValue("email", undefined);
        setValue("emailproprietaire", undefined);
    };

    const initValues = () => {
        setValue("id", contact.id);
        setValue("nom", contact.nom);
        setValue("profession", contact.profession);
        setValue("telephone", contact.telephone);
        setValue("email", contact.email);
        setValue("emailproprietaire", contact.emailproprietaire);
    };

    const submitRegister = async(data) =>{
        if(loading){
            return;
        }
        setLoading(true);

        data["emailproprietaire"] = currentUser.email;
        
        if(actionType === "modify"){
            contactsServiceInstance.update(data)
                .then((reponse) =>{

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
                    LoggerService.log( "Erreur lors de la MAJ d'un contact : " + err.message );
                    setLoading(false);
                });
        }
        else{
            contactsServiceInstance.create(data)
                .then((reponse) =>{
                    
                    resetValues();
                    closeModal();
                    onModify();
                    setLoading(false);

                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    LoggerService.log( "Erreur lors de la création d'un contact : " + err.message );
                    setLoading(false);
                });
        }
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
                arrayHeight={["90%"]}
            >
                <View style={styles.form}>
                    <View style={styles.containerActionsButtons}>

                        <TouchableOpacity onPress={closeModal} style={{width:"33.33%", alignItems: "center"}}>
                            <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                        </TouchableOpacity>
                        <View style={{width:"33.33%", alignItems: "center"}}>
                            <Text style={[styles.textFontBold, {fontSize: 16}]}>Contact</Text>
                        </View>
                        <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{width:"33.33%", alignItems: "center"}}>
                            { loading ? 
                                <ActivityIndicator size={10} color={colors.default_dark} />
                            :
                                actionType === "modify" ?
                                <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Modifier</Text>
                                :
                                <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Créer</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <KeyboardAwareScrollView style={{height:"100%"}}>
                        <View style={styles.formContainer}>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Nom : <Text style={{color: "red"}}>*</Text></Text>
                                {errors.title && <Text style={[styles.errorInput, styles.textFontRegular]}>Nom obligatoire</Text>}
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Exemple : John Doe"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("nom", text)}
                                    defaultValue={watch("nom")}
                                    {...register("nom", { required: true })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Profession : </Text>
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Exemple : Vétérinaire"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("profession", text)}
                                    defaultValue={watch("profession")}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Numéro de téléphone : </Text>
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Exemple : 0606060606"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("telephone", text)}
                                    defaultValue={watch("telephone")}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Email : </Text>
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Exemple : test@gmail.com"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("email", text)}
                                    defaultValue={watch("email")}
                                />
                            </View>
                                {/* <View  style={{flexDirection:"row", justifyContent:"flex-end", marginTop: 150, alignItems: "flex-end"}}  >
                                <View style={styles.iconContainer}>
                                    <AntDesign name="contacts" size={70} color={colors.background} style={{marginRight: 5}}/>
                                </View>
                                </View> */}
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </ModalEditGeneric>
        </>
    )
}

export default ModalContact;

