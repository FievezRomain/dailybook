import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useForm } from "react-hook-form";
import { AntDesign } from '@expo/vector-icons';
import AnimalsService from "../../services/AnimalsService";
import { AuthenticatedUserContext } from "../../providers/AuthenticatedUserProvider";
import DatePickerModal from "./ModalDatePicker";
import AvatarPicker from "../AvatarPicker";

const ModalAnimal = ({isVisible, setVisible, actionType, animal={}, onModify=undefined}) => {
    const { user } = useContext(AuthenticatedUserContext);
    const animalService = new AnimalsService();
    const [loadingEvent, setLoadingEvent] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [image, setImage] = useState(null);

    const closeModal = () => {
        setVisible(false);
    };

    const resetValues = () =>{
        setValue("id", undefined);
        setValue("nom", undefined);
        setValue("espece", undefined);
        setValue("datenaissance", undefined);
        setValue("race", undefined);
        setValue("taille", undefined);
        setValue("poids", undefined);
        setValue("sexe", undefined);
        setValue("couleur", undefined);
        setValue("nomPere", undefined);
        setValue("nomMere", undefined);
    };

    const submitRegister = async(data) =>{
        console.log("register");
    }

    const onChangeDate = (propertyName, selectedDate) => {
        setValue(propertyName, selectedDate);
    };

    const convertDateToText = (fieldname) =>{
        var date = watch(fieldname);
        if(date == undefined){
          return "";
        }
        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateObject  = new Date(date);
        return String(dateObject.toLocaleDateString("fr-FR", options));
    };

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
                                <Text style={{fontWeight: "bold"}}>Modifier un animal</Text>
                            }
                            { actionType === "create" && 
                                <Text style={{fontWeight: "bold"}}>Créer un animal</Text>
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
                                        <Text style={styles.textInput}>Nom de l'animal :</Text>
                                        {errors.nom && <Text style={styles.errorInput}>Nom obligatoire</Text>}
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Vasco"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("nom", text)}
                                            defaultValue={getValues("nom")}
                                            {...register("nom", { required: true })}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Espèce :</Text>
                                        {errors.nom && <Text style={styles.errorInput}>Espèce obligatoire</Text>}
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Cheval"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("espece", text)}
                                            defaultValue={getValues("espece")}
                                            {...register("espece", { required: true })}
                                        />
                                    </View>
                                    <View style={styles.containerDate}>
                                        <Text style={styles.textInput}>Date : {convertDateToText("date")} <Text style={{color: "red"}}>*</Text></Text>
                                        <DatePickerModal
                                        onDayChange={onChangeDate}
                                        propertyName={"date"}
                                        defaultDate={getValues("date")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Image :</Text>
                                        <AvatarPicker
                                            setImage={setImage}
                                            setValue={setValue}
                                        />
                                        {image &&
                                            <View style={styles.imageContainer}>
                                            <Image source={{uri: image}} style={styles.avatar}/>
                                            <TouchableOpacity onPress={() => setImage(null)}>
                                                <Image source={require("../../assets/cross.png")} style={{height: 20, width: 20}}/>
                                            </TouchableOpacity>
                                            </View>
                                        }
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Race :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Fjord"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("race", text)}
                                            defaultValue={getValues("race")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Taille (cm) :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : 140"
                                            keyboardType="numeric"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("taille", text)}
                                            defaultValue={getValues("taille")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Poids (kg) :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : 300"
                                            keyboardType="numeric"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("poids", text)}
                                            defaultValue={getValues("poids")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Sexe :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Mâle"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("sexe", text)}
                                            defaultValue={getValues("sexe")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Couleur :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Noir"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("couleur", text)}
                                            defaultValue={getValues("couleur")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Nom du père :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Sirius"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("nomPere", text)}
                                            defaultValue={getValues("nomPere")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Nom de la mère :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Hermès"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("nomMere", text)}
                                            defaultValue={getValues("nomMere")}
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
    errorInput: {
        color: "red"
    },
    containerDate:{
        flexDirection: "column",
        alignSelf: "flex-start",
        width: "100%"
    },
})

export default ModalAnimal;