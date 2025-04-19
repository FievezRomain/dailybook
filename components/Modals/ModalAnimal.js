import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import animalsServiceInstance from "../../services/AnimalsService";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import AvatarPicker from "../AvatarPicker";
import DateUtils from "../../utils/DateUtils";
import { ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoggerService from "../../services/LoggerService";
import FileStorageService from "../../services/FileStorageService";
import { Image } from "expo-image";
import DropdawnList from "../DropdawnList";
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";
import Constants from 'expo-constants';

const ModalAnimal = ({isVisible, setVisible, actionType, animal={}, onModify=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue, setError, getValues, watch, clearErrors } = useForm();
    const [image, setImage] = useState(null);
    const dateUtils = new DateUtils();
    var today = new Date();
    var jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
    var mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
    var annee = today.getFullYear();
    const [date, setDate] = useState(undefined);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);
    const fileStorageService = new FileStorageService();
    const especeList = [
        { label: 'Chat', value: 'Chat' },
        { label: 'Chien', value: 'Chien' },
        { label: 'Poisson', value: 'Poisson' },
        { label: 'Oiseaux', value: 'Oiseaux' },
        { label: 'Lapin', value: 'Lapin' },
        { label: 'Rongeur', value: 'Rongeur' },
        { label: 'Reptile', value: 'Reptile' },
        { label: 'Furet', value: 'Furet' },
        { label: 'Cheval', value: 'Cheval' },
        { label: 'Poney', value: 'Poney' },
        { label: 'Âne', value: 'Âne' },
        { label: 'Mulet et bardot', value: 'Mulet et bardot' },
        { label: 'Poule', value: 'Poule' },
        { label: 'Canard', value: 'Canard' },
        { label: 'Cochon', value: 'Cochon' },
        { label: 'Chèvre', value: 'Chèvre' },
        { label: 'Mouton', value: 'Mouton' },
        { label: 'Bovin', value: 'Bovin' },
        { label: 'Dinde', value: 'Dinde' },
        { label: 'Oie', value: 'Oie' },
        { label: 'Caille', value: 'Caille' },
        { label: 'Écureuil', value: 'Écureuil' },
        { label: 'Amphibien', value: 'Amphibien' },
        { label: 'Insecte', value: 'Insecte' },
        { label: 'Crustacé', value: 'Crustacé' },
        { label: 'Arachnide', value: 'Arachnide' },
        { label: 'Lama et alpaga', value: 'Lama et alpaga' },
        { label: 'Autruche et émeu', value: 'Autruche et émeu' },
        { label: 'Autre', value: 'Autre' },
    ];
    const [espece, setEspece] = useState(undefined);

    useEffect(() => {
        if(animal.id !== undefined){
            initValuesAnimal();
        }
    }, [animal]);

    useEffect(() => {
        setValue("espece", espece);
    }), [espece];

    const initValuesAnimal = () => {
        setValue("id", animal.id);
        setValue("nom", animal.nom);
        setValue("espece", animal.espece);
        setEspece(animal.espece);
        setValue("datenaissance", animal.datenaissance !== null ? (animal.datenaissance.includes("-") ?  dateUtils.dateFormatter( animal.datenaissance, "yyyy-mm-dd", "-") : animal.datenaissance) : undefined);
        setValue("datedeces", animal.datedeces !== null ? animal.datedeces : undefined);
        setValue("race", animal.race !== null ? animal.race : undefined);
        setValue("taille", animal.taille !== null ? animal.taille.toString() : undefined);
        setValue("poids", animal.poids !== null ? animal.poids.toString() : undefined);
        setValue("sexe", animal.sexe !== null ? animal.sexe : undefined);
        setValue("food", animal.food !== null ? animal.food : undefined);
        setValue("quantity", animal.quantity !== null ? animal.quantity.toString() : undefined);
        setValue("couleur", animal.couleur !== null ? animal.couleur : undefined);
        setValue("nomPere", animal.nompere !== null ? animal.nompere : undefined);
        setValue("nomMere", animal.nommere !== null ? animal.nommere : undefined);
        setValue("numeroidentification", animal.numeroidentification !== null ? animal.numeroidentification : undefined);
        setValue("image", animal.image);
        setValue("previousimage", animal.image);
        setValue("informations", animal.informations !== null ? animal.informations : undefined);
        setDate(animal.datenaissance !== null ? (animal.datenaissance.includes("-") ?  dateUtils.dateFormatter( animal.datenaissance, "yyyy-mm-dd", "-") : animal.datenaissance) : null);
        setImage(animal.image !== null ? fileStorageService.getFileUrl( animal.image, currentUser.uid ) : null);
    }

    const closeModal = () => {
        setVisible(false);
    };

    const resetValues = () =>{
        setValue("id", undefined);
        setValue("nom", undefined);
        setValue("espece", undefined);
        setValue("datenaissance", undefined);
        setValue("datedeces", undefined);
        setValue("race", undefined);
        setValue("taille", undefined);
        setValue("poids", undefined);
        setValue("sexe", undefined);
        setValue("food", undefined);
        setValue("quantity", undefined);
        setValue("couleur", undefined);
        setValue("nomPere", undefined);
        setValue("nomMere", undefined);
        setValue("image", undefined);
        setValue("numeroidentification", undefined);
        setValue("informations", undefined);
        setImage(null);
        setDate(String(jour + "/" + mois + "/" + annee));
        setEspece(undefined);
    };

    const submitRegister = async(data) =>{
        if(loading){
            return;
        }
        setLoading(true);

        // Vérification du champ espèce
        if (!espece) {
            setError("espece", { type: "manual" });
            setLoading(false);
            return;
        }

        // Récupération de l'identifiant de l'utilisateur (propriétaire)
        data["email"] =  currentUser.email;

        // Modification des , en . pour les champs numériques taille, poids et quantity à cause de la possibilité de mettre les 2 sur android
        data["poids"] !== undefined ? data["poids"] = data["poids"].replace(",", ".") : undefined;
        data["taille"] !== undefined ? data["taille"] = data["taille"].replace(",", ".") : undefined;
        data["quantity"] !== undefined ? data["quantity"] = data["quantity"].replace(",", ".") : undefined;
        
        // Modification du format de la date pour le bon stockage en base
        if( data["datenaissance"] !== null && data["datenaissance"] !== undefined && data["datenaissance"].length === 0 ){
            data["datenaissance"] = undefined;
        }

        if( ( data["datenaissance"] !== null && data["datenaissance"] !== undefined ) && ( data["datenaissance"].length !== 10 || !dateUtils.isDateValid( dateUtils.dateFormatter( data["datenaissance"], "dd/MM/yyyy", "/") ) ) ){
            Toast.show({
                position: "top",
                type: "error",
                text1: "Problème de format de date"
            });
            setLoading(false);
            return;
        }

        if( data["datenaissance"] !== null && data["datenaissance"] !== undefined ){
            data["datenaissance"] = dateUtils.dateFormatter( data["datenaissance"], "dd/MM/yyyy", "/");
        }

        // Vérification de la valeur des entiers/décimal
        if( !checkNumericFormat(data, "taille") || !checkNumericFormat(data, "poids") || !checkNumericFormat(data, "quantity") ){
            setLoading(false);
            return;
        }

        // Ajout d'un 0 sur la première partie de la date de naissance si on a 9 caractères dans la date de naissance
        /* if( data["datenaissance"] !== null && data["datenaissance"] !== undefined && data["datenaissance"].length === 9){
            data["datenaissance"] = "0" + data["datenaissance"];
            setDate(data["datenaissance"]);
        } */

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
            animalsServiceInstance.modify(data)
            .then((response) =>{
                
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
            animalsServiceInstance.create(data)
            .then((response) =>{
                
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
        let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateObject  = new Date(date);
        return String(dateObject.toLocaleDateString("fr-FR", options));
    };

    const deleteImage = () => {
        if(actionType === "modify"){
            setValue("image", "todelete");
        }
        setImage(null);
    };

    const checkNumericFormat = (data, attribute) => {
        if( data[attribute] != undefined && data[attribute] != undefined )
        {
            const numericValue = parseFloat(data[attribute].replace(',', '.').replace(" ", ""));
            if (isNaN(numericValue)) {
                Toast.show({
                    position: "top",
                    type: "error",
                    text1: "Problème de format sur l'attribut " + attribute,
                    text2: "Seul les chiffres, virgule et point sont acceptés"
                });
                return false;
            } else{
                data[attribute] = numericValue;
            }
        }
        return true;
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
        inputTextArea: {
            height: 100,
            width: "100%",
            marginBottom: 15,
            borderRadius: 5,
            paddingLeft: 15,
            paddingRight: 15,
            backgroundColor: colors.quaternary,
            color: colors.default_dark,
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
        },
        avatar: {
            width: 60,
            height: 60,
            borderRadius: 50,
            borderWidth: 2,
            zIndex: 1,
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
        separatorForm:{
            width: '100%',
            marginBottom: 20,
            marginTop: 10,
            height: 0.5, // ou la hauteur que vous souhaitez pour votre barre
            backgroundColor: colors.text,
        },
        
    })

    return(
        <>
            <ModalEditGeneric
                isVisible={isVisible}
                setVisible={setVisible}
                arrayHeight={["90%"]}
                scrollInside={false}
            >
                    <View style={styles.form}>
                        <View style={styles.containerActionsButtons}>
                            <TouchableOpacity onPress={closeModal} style={{width:"33.33%", alignItems: "center"}}>
                                <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                            </TouchableOpacity>
                            <View style={{width:"33.33%", alignItems: "center"}}>
                                <Text style={[styles.textFontBold, {fontSize: 16, color:colors.default_dark}]}>Animal</Text>
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
                        <Divider/>
                        <KeyboardAwareScrollView
                            ref={scrollRef}
                            enableOnAndroid={true}
                            enableResetScrollToCoords={false}
                        >
                            <View style={styles.formContainer}>

                                <View>
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Nom de l'animal : <Text style={{color: "red"}}>*</Text></Text>
                                        {errors.nom && <Text style={[styles.errorInput, styles.textFontRegular]}>Nom obligatoire</Text>}
                                        <TextInput
                                            style={[styles.input, styles.textFontRegular]}
                                            placeholder="Exemple : Vasco"
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => setValue("nom", text)}
                                            defaultValue={getValues("nom")}
                                            {...register("nom", { required: true })}
                                        />
                                    </View>
                                    <View style={[styles.inputContainer]}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Espèce : <Text style={{color: "red"}}>*</Text></Text>
                                        {errors.espece && <Text style={[styles.errorInput, styles.textFontRegular]}>Espèce obligatoire</Text>}
                                        <DropdawnList
                                            list={especeList}
                                            setValue={(value) => {
                                                setEspece(value);
                                                if (value) {
                                                  clearErrors("espece");  // Efface l'erreur si une valeur est sélectionnée
                                                }
                                            }}
                                            value={espece}
                                        />
                                    </View>
                                </View>

                                <Divider/>

                                <View style={{paddingTop: 10}}>
                                    <View style={[styles.inputContainer, {marginBottom: 10}]}>
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
                                    <View style={styles.containerDate}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Date de naissance : {convertDateToText(date)} </Text>
                                        <TextInput
                                            style={[styles.input, styles.textFontRegular]}
                                            placeholder="Exemple : 01/01/1900"
                                            keyboardType="numeric"
                                            inputMode="numeric"
                                            maxLength={10}
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => onChangeDate(text)}
                                            defaultValue={date}
                                        />
                                    </View>
                                    <View style={styles.containerDate}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Numéro d'identification :</Text>
                                        <TextInput
                                            style={[styles.input, styles.textFontRegular]}
                                            placeholder="XXXXXXXXXX"
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => setValue("numeroidentification", text)}
                                            defaultValue={watch("numeroidentification")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Race :</Text>
                                        <TextInput
                                            style={[styles.input, styles.textFontRegular]}
                                            placeholder="Exemple : Fjord"
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => setValue("race", text)}
                                            defaultValue={getValues("race")}
                                        />
                                    </View>
                                    {actionType === "create" && 
                                        <>
                                            <View style={styles.inputContainer}>
                                                <Text style={[styles.textInput, styles.textFontRegular]}>Taille (cm) :</Text>
                                                <TextInput
                                                    style={[styles.input, styles.textFontRegular]}
                                                    placeholder="Exemple : 140"
                                                    keyboardType="decimal-pad"
                                                    inputMode="decimal"
                                                    placeholderTextColor={colors.secondary}
                                                    onChangeText={(text) => setValue("taille", text)}
                                                    defaultValue={getValues("taille")}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={[styles.textInput, styles.textFontRegular]}>Poids (kg) :</Text>
                                                <TextInput
                                                    style={[styles.input, styles.textFontRegular]}
                                                    placeholder="Exemple : 400"
                                                    keyboardType="decimal-pad"
                                                    inputMode="decimal"
                                                    placeholderTextColor={colors.secondary}
                                                    onChangeText={(text) => setValue("poids", text)}
                                                    defaultValue={getValues("poids")}
                                                />
                                            </View>
                                        </>
                                    }
                                    
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Sexe :</Text>
                                        <TextInput
                                            style={[styles.input, styles.textFontRegular]}
                                            placeholder="Exemple : Mâle"
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => setValue("sexe", text)}
                                            defaultValue={getValues("sexe")}
                                        />
                                    </View>
                                    {actionType === "create" && 
                                        <>
                                            <View style={styles.inputContainer}>
                                                <Text style={[styles.textInput, styles.textFontRegular]}>Nom alimentation :</Text>
                                                <TextInput
                                                    style={[styles.input, styles.textFontRegular]}
                                                    placeholder="Exemple : Granulés X"
                                                    placeholderTextColor={colors.secondary}
                                                    onChangeText={(text) => setValue("food", text)}
                                                    defaultValue={getValues("food")}
                                                />
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={[styles.textInput, styles.textFontRegular]}>Quantité (gramme / cl) :</Text>
                                                <TextInput
                                                    style={[styles.input, styles.textFontRegular]}
                                                    placeholder="Exemple : 200"
                                                    keyboardType="decimal-pad"
                                                    inputMode="decimal"
                                                    placeholderTextColor={colors.secondary}
                                                    onChangeText={(text) => setValue("quantity", text)}
                                                    defaultValue={getValues("quantity")}
                                                />
                                            </View>
                                        </>
                                    }
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Couleur :</Text>
                                        <TextInput
                                            style={[styles.input, styles.textFontRegular]}
                                            placeholder="Exemple : Isabelle"
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => setValue("couleur", text)}
                                            defaultValue={getValues("couleur")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Nom du père :</Text>
                                        <TextInput
                                            style={[styles.input, styles.textFontRegular]}
                                            placeholder="Exemple : Esgard"
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => setValue("nomPere", text)}
                                            defaultValue={getValues("nomPere")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Nom de la mère :</Text>
                                        <TextInput
                                            style={[styles.input, styles.textFontRegular]}
                                            placeholder="Exemple : Sherry"
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => setValue("nomMere", text)}
                                            defaultValue={getValues("nomMere")}
                                        />
                                    </View>
                                    <View style={styles.inputContainer}>
                                        <Text style={[styles.textInput, styles.textFontRegular]}>Informations supplémentaires :</Text>
                                        <TextInput
                                            style={[styles.inputTextArea, styles.textFontRegular]}
                                            multiline={true}
                                            numberOfLines={4}
                                            maxLength={2000}
                                            placeholder="Exemple : Allergique aux incariens"
                                            placeholderTextColor={colors.secondary}
                                            onChangeText={(text) => setValue("informations", text)}
                                            defaultValue={getValues("informations")}
                                            onFocus={(e) => {
                                                if(Constants.platform.ios){
                                                  setTimeout(() => {
                                                    scrollRef.current?.scrollToEnd({ animated: true });
                                                  }, 100);
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                                
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
            </ModalEditGeneric>
        </>
    )
}

export default ModalAnimal;