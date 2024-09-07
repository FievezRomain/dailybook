import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useForm } from "react-hook-form";
import AnimalsService from "../../services/AnimalsService";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import AvatarPicker from "../AvatarPicker";
import DateUtils from "../../utils/DateUtils";
import { ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoggerService from "../../services/LoggerService";
import FileStorageService from "../../services/FileStorageService";
import { Image } from "expo-image";

const ModalAnimal = ({isVisible, setVisible, actionType, animal={}, onModify=undefined}) => {
    const { currentUser } = useAuth();
    const animalsService = new AnimalsService();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [image, setImage] = useState(null);
    const dateUtils = new DateUtils();
    today = new Date();
    jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
    mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
    annee = today.getFullYear();
    const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));
    const [loading, setLoading] = useState(false);
    const fileStorageService = new FileStorageService();

    useEffect(() => {
        if(animal.id !== undefined){
            initValuesAnimal();
        }
    }, [animal]);

    const initValuesAnimal = () => {
        setValue("id", animal.id);
        setValue("nom", animal.nom);
        setValue("espece", animal.espece);
        setValue("datenaissance", animal.datenaissance !== null ? (animal.datenaissance.includes("-") ?  dateUtils.dateFormatter( animal.datenaissance, "yyyy-mm-dd", "-") : animal.datenaissance) : undefined);
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
        setDate(animal.datenaissance !== null ? (animal.datenaissance.includes("-") ?  dateUtils.dateFormatter( animal.datenaissance, "yyyy-mm-dd", "-") : animal.datenaissance) : null);
        setImage(fileStorageService.getFileUrl( animal.image, currentUser.uid ));
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
        setDate(String(jour + "/" + mois + "/" + annee));
    };

    const submitRegister = async(data) =>{
        if(loading){
            return;
        }
        setLoading(true);

        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["email"] =  currentUser.email;

        // Modification des , en . pour les champs numériques taille, poids et quantity à cause de la possibilité de mettre les 2 sur android
        data["poids"] !== undefined ? data["poids"] = data["poids"].replace(",", ".") : undefined;
        data["taille"] !== undefined ? data["taille"] = data["taille"].replace(",", ".") : undefined;
        data["quantity"] !== undefined ? data["quantity"] = data["quantity"].replace(",", ".") : undefined;
        
        // Modification du format de la date pour le bon stockage en base
        if( data["datenaissance"] !== null && data["datenaissance"] !== undefined ){
            data["datenaissance"] = dateUtils.dateFormatter( data["datenaissance"], "dd/MM/yyyy", "/");
        }

        // Ajout d'un 0 sur la première partie de la date de naissance si on a 9 caractères dans la date de naissance
        if( data["datenaissance"] !== null && data["datenaissance"] !== undefined && data["datenaissance"].length === 9){
            data["datenaissance"] = "0" + data["datenaissance"];
            setDate(data["datenaissance"]);
        }

        // Si une image est saisie
        if (data.image != undefined){
            // Si on est sur une création ou que l'image de base est modifiée, on enregistre sur le S3 et on renseigne uniquement le filename dans data pour la BDD
            if(actionType !== "modify" || data["previousimage"] !== data["image"]){
                if(image != null){
                    var filename = data.image.split("/");
                    filename = filename[filename.length-1];

                    await fileStorageService.uploadFile(image, filename, "image/jpeg", currentUser.uid);

                    data.image = filename;
                } 
            }
        }
        

        // Si un animal est selectionné, cela veut dire qu'on doit le modifier, sinon le créer
        if(actionType === "modify"){
            // Modification de l'animal dans le back (BDD)
            animalsService.modify(data)
            .then((response) =>{
                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Modification de l'animal"
                }); 
                resetValues();
                closeModal();
                onModify(response);
                setLoading(false);
            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la MAJ d'un animal : " + err.message );
                setLoading(false);
            });
        } else{
            // Création de l'animal dans le back (BDD)
            animalsService.create(data)
            .then((response) =>{
                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Création de l'animal"
                }); 
                resetValues();
                closeModal();
                onModify(response);
                setLoading(false);
            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la création d'un animal : " + err.message );
                setLoading(false);
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
                                <Text style={[{color: Variables.aubere}, styles.textFontRegular]}>Annuler</Text>
                            </TouchableOpacity>
                            { actionType === "modify" && 
                                <Text style={[styles.textFontBold]}>Modifier un animal</Text>
                            }
                            { actionType === "create" && 
                                <Text style={[styles.textFontBold]}>Créer un animal</Text>
                            }
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                { loading ? 
                                    <ActivityIndicator size={10} color={Variables.bai} />
                                :
                                    actionType === "modify" ?
                                    <Text style={[{color: Variables.alezan}, styles.textFontRegular]}>Modifier</Text>
                                    :
                                    <Text style={[{color: Variables.alezan}, styles.textFontRegular]}>Créer</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAwareScrollView>
                            <View style={styles.formContainer}>

                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Nom de l'animal : <Text style={{color: "red"}}>*</Text></Text>
                                    {errors.nom && <Text style={[styles.errorInput, styles.textFontRegular]}>Nom obligatoire</Text>}
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Vasco"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("nom", text)}
                                        defaultValue={getValues("nom")}
                                        {...register("nom", { required: true })}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Espèce : <Text style={{color: "red"}}>*</Text></Text>
                                    {errors.nom && <Text style={[styles.errorInput, styles.textFontRegular]}>Espèce obligatoire</Text>}
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Cheval"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("espece", text)}
                                        defaultValue={getValues("espece")}
                                        {...register("espece", { required: true })}
                                    />
                                </View>
                                <View style={styles.containerDate}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Date de naissance : {convertDateToText(date)} <Text style={{color: "red"}}>*</Text></Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : 01/01/1900"
                                        keyboardType="numeric"
                                        maxLength={10}
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => onChangeDate(text)}
                                        value={date}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Image :</Text>
                                    <AvatarPicker
                                        setImage={setImage}
                                        setValue={setValue}
                                    />
                                    {image &&
                                        <View style={styles.imageContainer}>
                                            <Image source={{uri: image}} style={styles.avatar} cachePolicy="disk"/>
                                            <TouchableOpacity onPress={() => deleteImage()}>
                                                <Image source={require("../../assets/cross.png")} style={{height: 20, width: 20}}/>
                                            </TouchableOpacity>
                                        </View>
                                    }
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Race :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Fjord"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("race", text)}
                                        defaultValue={getValues("race")}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Taille (cm) :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : 140"
                                        keyboardType="numeric"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("taille", text)}
                                        defaultValue={getValues("taille")}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Poids (kg) :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : 400"
                                        keyboardType="numeric"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("poids", text)}
                                        defaultValue={getValues("poids")}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Sexe :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Mâle"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("sexe", text)}
                                        defaultValue={getValues("sexe")}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Nom alimentation :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Granulés X"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("food", text)}
                                        defaultValue={getValues("food")}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Quantité (gramme / cl) :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : 200"
                                        keyboardType="numeric"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("quantity", text)}
                                        defaultValue={getValues("quantity")}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Couleur :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Isabelle"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("couleur", text)}
                                        defaultValue={getValues("couleur")}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Nom du père :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Esgard"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("nomPere", text)}
                                        defaultValue={getValues("nomPere")}
                                    />
                                </View>
                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Nom de la mère :</Text>
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Sherry"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("nomMere", text)}
                                        defaultValue={getValues("nomMere")}
                                    />
                                </View>

                            </View>
                        </KeyboardAwareScrollView>
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
    textFontRegular:{
        fontFamily: Variables.fontRegular
    },
    textFontMedium:{
        fontFamily: Variables.fontMedium
    },
    textFontBold:{
        fontFamily: Variables.fontBold
    }
    
})

export default ModalAnimal;