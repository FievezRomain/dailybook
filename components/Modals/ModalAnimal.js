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
import DateUtils from "../../utils/DateUtils";
import { getImagePath } from '../../services/Config';

const ModalAnimal = ({isVisible, setVisible, actionType, animal={}, onModify=undefined}) => {
    const { user } = useContext(AuthenticatedUserContext);
    const animalsService = new AnimalsService();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [image, setImage] = useState(null);
    const dateUtils = new DateUtils();
    today = new Date();
    jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
    mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
    annee = today.getFullYear();
    const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));

    useEffect(() => {
        if(animal.id !== undefined){
            initValuesAnimal();
        }
    }, [animal]);

    const initValuesAnimal = () => {
        setValue("id", animal.id);
        setValue("nom", animal.nom);
        setValue("espece", animal.espece);
        setValue("datenaissance", animal.datenaissance !== null ? animal.datenaissance : undefined);
        setValue("race", animal.race !== null ? animal.race : undefined);
        setValue("taille", animal.taille !== null ? animal.taille.toString() : undefined);
        setValue("poids", animal.poids !== null ? animal.poids.toString() : undefined);
        setValue("sexe", animal.sexe !== null ? animal.sexe : undefined);
        setValue("food", animal.food !== null ? animal.food : undefined);
        setValue("quantity", animal.quantity !== null ? animal.quantity.toString() : undefined);
        setValue("couleur", animal.couleur !== null ? animal.couleur : undefined);
        setValue("nomPere", animal.nompere !== null ? animal.nompere : undefined);
        setValue("nomMere", animal.nommere !== null ? animal.nommere : undefined);
        setValue("image", animal.image);
        setValue("previousimage", animal.image);
        setDate(animal.datenaissance);
        setImage(`${getImagePath()}${animal.image}`);
    }

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
        setValue("food", undefined);
        setValue("quantity", undefined);
        setValue("couleur", undefined);
        setValue("nomPere", undefined);
        setValue("nomMere", undefined);
        setImage(null);
    };

    const submitRegister = async(data) =>{
        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["idProprietaire"] =  user.id;

        let formData = data;
        if (data.image != undefined){
            if(actionType !== "modify" || data["previousimage"] !== data["image"]){
                formData = new FormData();
                if(image != null){
                    filename = data.image.split("/");
                    filename = filename[filename.length-1].split(".")[0] + user.id;
                    formData.append("picture", {
                    name: filename,
                    type: "image/jpeg",
                    uri: data.image
                    });
                } else{
                    formData.append("files", "empty");
                }
                data = { ...data, image: data.image };
                formData.append("recipe", JSON.stringify(data));
            }
        }
        

        // Si un animal est selectionné, cela veut dire qu'on doit le modifier, sinon le créer
        if(actionType === "modify"){
            // Modification de l'animal dans le back (BDD)
            animalsService.modify(formData)
            .then((response) =>{
                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Modification de l'animal"
                }); 
                resetValues();
                closeModal();
                onModify(response);
            })
            .catch((err) =>{
                console.log(err);
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
            });
        } else{
            // Création de l'animal dans le back (BDD)
            animalsService.create(formData)
            .then((response) =>{
                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Création de l'animal"
                }); 
                resetValues();
                closeModal();
                onModify(response);
            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
            });
        }
    }

    const onChangeDate = (selectedDate) => {
        nbOccur = (String(selectedDate).match(/\//g) || []).length;
        oldNbOccur = (String(date).match(/\//g) || []).length;
        if(String(selectedDate).length === 2){
            if(nbOccur === 0 && oldNbOccur === 0){
                selectedDate = selectedDate + "/";
                setValue("datenaissance", selectedDate);
                setDate(selectedDate);
            }
        } else if(String(selectedDate).length === 5){
            if(nbOccur === 1 && oldNbOccur === 1){
                selectedDate = selectedDate + "/";
                setValue("datenaissance", selectedDate);
                setDate(selectedDate);
            }
        } else if(String(selectedDate).length === 9){
            firstDatePart = String(selectedDate).split("/")[0];
            if(String(firstDatePart).length === 1){
                selectedDate = "0" + selectedDate;
                setValue("datenaissance", selectedDate);
                setDate(selectedDate);
            }
        }

        setDate(selectedDate);
        setValue("datenaissance", selectedDate);
    };

    const convertDateToText = (fieldname) =>{
        var date = fieldname;
        if(date === undefined || date === null){
          return "";
        }
        if(date.length != 10){
            return "Invalid Date";
        }
        if(date.includes("/")){
            date = dateUtils.dateFormatter(date, "dd/MM/yyyy", "/");
        }
        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateObject  = new Date(date);
        return String(dateObject.toLocaleDateString("fr-FR", options));
    };

    const deleteImage = () => {
        if(actionType === "modify"){
            setValue("image", "todelete");
        }
        setImage(null);
    };

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
                                        <Text style={styles.textInput}>Nom de l'animal : <Text style={{color: "red"}}>*</Text></Text>
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
                                        <Text style={styles.textInput}>Espèce : <Text style={{color: "red"}}>*</Text></Text>
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
                                        <Text style={styles.textInput}>Date de naissance : {convertDateToText(date)} <Text style={{color: "red"}}>*</Text></Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : 01/01/1900"
                                            keyboardType="numeric"
                                            maxLength={10}
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => onChangeDate(text)}
                                            value={date}
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
                                            <TouchableOpacity onPress={() => deleteImage()}>
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
                                        <Text style={styles.textInput}>Nom alimentation :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Pure feed"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("food", text)}
                                            defaultValue={getValues("food")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Quantité (gramme / cl) :</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : 200"
                                            keyboardType="numeric"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("quantity", text)}
                                            defaultValue={getValues("quantity")}
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
    imageContainer:{
        flexDirection: "row",
        alignSelf: "flex-start",
        marginTop: 5,
        marginBottom: 5
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 2,
        zIndex: 1,
    },
})

export default ModalAnimal;