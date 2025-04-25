import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import { useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";
import { useAnimalForm } from "../../hooks/useAnimalForm";
import DatePickerModal from "./ModalDatePicker";
import DateUtils from "../../utils/DateUtils";
import { format } from 'date-fns'

const ModalReportDeath = ({isVisible, setVisible, actionType, animal={}, onModify=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const [espece, setEspece] = useState(undefined);
    const [image, setImage] = useState(null);
    var today = new Date();
    var jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
    var mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
    var annee = today.getFullYear();
    const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch , setError} = useForm();
    const dateUtils = new DateUtils();

    const closeModal = () => {
        setVisible(false);
    };

    const { initializeAnimal, resetAnimalValues, submitAnimal, loading } = useAnimalForm(
        setValue,
        currentUser,
        onModify,
        closeModal
    );

    useEffect(() => {
        if (animal) {
            initializeAnimal(animal, setEspece, setImage, setDate);
            setValue("datedeces", animal.datedeces === undefined ? dateUtils.dateFormatter(format(new Date(), 'dd/MM/yyyy'), "dd/MM/yyyy", "/") : dateUtils.dateFormatter(new Date(animal.datedeces).toLocaleDateString(), "dd/MM/yyyy", "/"));
        }
    }, [animal]);

    

    const submitRegister = async(data) =>{
        submitAnimal(data, actionType, setDate, espece, setEspece, setError);
    }

    const convertDateToText = (fieldname) =>{
        var date = watch(fieldname);
        if(date == undefined){
          return "";
        }
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var dateObject;
        if (date.includes('/')) {
            dateObject = new Date(dateUtils.dateFormatter(date, "dd/MM/yyyy", "/"));
        } else {
            // Si la date est déjà au format ISO
            dateObject = new Date(date);
        }
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
            alignItems: "center",
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
            marginBottom: 5,
            color : colors.default_dark
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
        },
        containerDate:{
            flexDirection: "column",
            alignSelf: "center",
            width: "90%",
            marginBottom: 15,
        },
    });

    return(
        <>
            <ModalEditGeneric
                isVisible={isVisible}
                setVisible={setVisible}
                arrayHeight={["30%", "90%"]}
            >
                    <View style={styles.form}>
                        <View style={styles.containerActionsButtons}>

                            <TouchableOpacity onPress={closeModal} style={{width: "33.33%", alignItems: "center"}}>
                                <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                            </TouchableOpacity>
                            <Text style={[styles.textFontBold, {width: "33.33%", alignSelf: "center", textAlign: "center", color:colors.default_dark}]}>Signaler le décès</Text>
                            <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{width: "33.33%", alignItems: "center"}}>
                                <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Enregistrer</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                            <View style={styles.containerDate}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Date <Text style={{color: "red"}}>*</Text> : {convertDateToText("datedeces")} </Text>
                                <DatePickerModal
                                    onDayChange={(property, value) => setValue(property, value)}
                                    propertyName={"datedeces"}
                                    defaultDate={getValues("datedeces")}
                                />
                            </View>
                    </View>
            </ModalEditGeneric>
        </>
    )
}

export default ModalReportDeath;