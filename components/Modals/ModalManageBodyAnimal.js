import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView, ActivityIndicator } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { AntDesign } from '@expo/vector-icons';
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";
import DatePickerModal from "./ModalDatePicker";
import animalsServiceInstance from "../../services/AnimalsService";
import LoggerService from "../../services/LoggerService";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const ModalManageBodyAnimal = ({isVisible, setVisible, actionType, animal={}, item, infos, onModify=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [arrayHeight, setArrayHeight] = useState("35%");
    const [loading, setLoading] = useState(false);

    useEffect(()=> {
        setArrayHeight("35%");
        initValues();
    }, [isVisible]);

    const initValues = () => {
        if( actionType === "create" ){
            setValue("datemodification", new Date().toISOString().split('T')[0]);
            setValue("value", undefined);
            setValue("idAnimal", animal.id);
            setValue("item", item);
        } else{
            setValue("datemodification", new Date(infos.date).toISOString().split('T')[0]);
            setValue("value", infos.value.toString());
            setValue("id", infos.id);
            setValue("item", item);
            setValue("idAnimal", infos.idanimal);
        }
    }

    const closeModal = () => {
        setVisible(false);
    };

    const submitRegister = async(data) =>{
        if(loading){
            return;
        }
        setLoading(true);

        // Modification des , en . pour les champs numériques taille, poids et quantity à cause de la possibilité de mettre les 2 sur android
        if( item === "taille" || item === "poids" || item === "quantity" ){
            data["value"] = data["value"].replace(",", ".");
        }

        // Vérification de la valeur des entiers/décimal
        if( item === "taille" || item === "poids" || item === "quantity" ){
            if( !checkNumericFormat(data, "value") ){
                setLoading(false);
                return;
            }
        }

        // Appel du service pour contacter l'API back
        if( actionType === "create" ){
            animalsServiceInstance.createHistory(data)
                .then((response) =>{
                    closeModal();
                    onModify( );
                    setLoading(false);
                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    LoggerService.log( "Erreur lors de la modification du physique de l'animal (création d'un élément) : " + err.message );
                    setLoading(false);
                });
        } else {
            animalsServiceInstance.modifyHistory(data)
                .then((response) =>{
                    closeModal();
                    onModify( {datemodification: getValues("datemodification"), value: getValues("value")} );
                    setLoading(false);
                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    LoggerService.log( "Erreur lors de la modification du physique de l'animal (modification d'un élément) : " + err.message );
                    setLoading(false);
                });
        }
        

        closeModal();
    };

    const checkNumericFormat = (data, attribute) => {
        if( data[attribute] != undefined && data[attribute] != undefined )
        {
            const numericValue = parseFloat(data[attribute].replace(',', '.').replace(" ", ""));
            if (isNaN(numericValue)) {
                Toast.show({
                    position: "top",
                    type: "error",
                    text1: "Problème de format sur la valeur",
                    text2: "Seul les chiffres, virgule et point sont acceptés"
                });
                return false;
            } else{
                data[attribute] = numericValue;
            }
        }
        return true;
    };

    const getInput = () => {
        switch(item){
            case 'taille':
                return <>
                    <Text style={[styles.textInput, styles.textFontRegular]}>Taille (cm) : <Text style={{color: "red"}}>*</Text></Text>
                    {errors.taille && <Text style={[styles.errorInput, styles.textFontRegular]}>Taille obligatoire</Text>}
                    <TextInput
                        style={[styles.input, styles.textFontRegular]}
                        placeholder="Exemple : 140"
                        keyboardType="decimal-pad"
                        inputMode="decimal"
                        placeholderTextColor={colors.secondary}
                        onChangeText={(text) => setValue("value", text)}
                        defaultValue={watch("value")}
                        {...register("value", { required: true })}
                    />
                </>;
            case 'poids':
                return <>
                    <Text style={[styles.textInput, styles.textFontRegular]}>Poids (kg) : <Text style={{color: "red"}}>*</Text></Text>
                    {errors.taille && <Text style={[styles.errorInput, styles.textFontRegular]}>Poids obligatoire</Text>}
                    <TextInput
                        style={[styles.input, styles.textFontRegular]}
                        placeholder="Exemple : 400"
                        keyboardType="decimal-pad"
                        inputMode="decimal"
                        placeholderTextColor={colors.secondary}
                        onChangeText={(text) => setValue("value", text)}
                        value={watch("value")}
                        {...register("value", { required: true })}
                    />
                </>;
            case 'food':
                return <>
                    <Text style={[styles.textInput, styles.textFontRegular]}>Nom alimentation : <Text style={{color: "red"}}>*</Text></Text>
                    {errors.taille && <Text style={[styles.errorInput, styles.textFontRegular]}>Nom alimentation obligatoire</Text>}
                    <TextInput
                        style={[styles.input, styles.textFontRegular]}
                        placeholder="Exemple : Granulés X"
                        placeholderTextColor={colors.secondary}
                        onChangeText={(text) => setValue("value", text)}
                        defaultValue={watch("value")}
                        {...register("value", { required: true })}
                    />
                </>;
            case 'quantity':
                return <>
                    <Text style={[styles.textInput, styles.textFontRegular]}>Quantité (gramme / cl) : <Text style={{color: "red"}}>*</Text></Text>
                    {errors.taille && <Text style={[styles.errorInput, styles.textFontRegular]}>Quantité obligatoire</Text>}
                    <TextInput
                        style={[styles.input, styles.textFontRegular]}
                        placeholder="Exemple : 200"
                        keyboardType="decimal-pad"
                        inputMode="decimal"
                        placeholderTextColor={colors.secondary}
                        onChangeText={(text) => setValue("value", text)}
                        defaultValue={watch("value")}
                        {...register("value", { required: true })}
                    />
                </>;
            default:
                break;
        }
    }

    const convertDateToText = (fieldname) =>{
        let date = watch(fieldname);
        if(date == undefined){
          return "";
        }
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        let dateObject  = new Date(date);
        return String(dateObject.toLocaleDateString("fr-FR", options));
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
            color: colors.default_dark,
            alignSelf: "baseline"
        },
        containerDate:{
            flexDirection: "column",
            alignSelf: "flex-start",
            width: "100%",
            marginBottom: 15,
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
                arrayHeight={[arrayHeight]}
            >
                
                    <View style={styles.form}>
                    
                        <View style={styles.containerActionsButtons}>

                            <TouchableOpacity onPress={closeModal} style={{width: "33.33%", alignItems: "center"}}>
                                <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                            </TouchableOpacity>
                            <View style={{width:"33.33%", alignItems: "center"}}>
                                <Text style={[styles.textFontBold]} >Physique</Text>
                            </View>
                            <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{width: "33.33%", alignItems: "center"}}>
                                { loading ?
                                        <ActivityIndicator size={10} color={colors.default_dark} />
                                    :
                                        <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Enregistrer</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <Divider/>
                        <KeyboardAwareScrollView
                            enableResetScrollToCoords={false}
                            enableAutomaticScroll={false}
                            contentContainerStyle={{height: "100%"}}
                            onKeyboardWillShow={() => setArrayHeight("70%")}
                            onKeyboardWillHide={() => setArrayHeight("35%")}
                        >

                            <View style={styles.formContainer}>
                                <View style={styles.inputContainer}>
                                    <View style={styles.containerDate}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Date : {convertDateToText("datemodification")} <Text style={{color: "red"}}>*</Text></Text>
                                        <DatePickerModal
                                            onDayChange={(propertyName, selectedDate) => setValue("datemodification", selectedDate)}
                                            propertyName={"datemodification"}
                                            defaultDate={getValues("datemodification")}
                                        />
                                    </View>
                                    {getInput()}
                                </View>
                            </View>
                            </KeyboardAwareScrollView>
                    </View>
            </ModalEditGeneric>
        </>
    )
}

export default ModalManageBodyAnimal;