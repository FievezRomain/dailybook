import { useAuth } from "../../providers/AuthenticatedUserProvider";
import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { useForm } from "react-hook-form";
import ModalAnimals from "./ModalSelectAnimals";
import AnimalsService from "../../services/AnimalsService";
import ObjectifService from "../../services/ObjectifService";
import ModalDropdwn from "./ModalDropdown";
import Button from "../Button";
import { AntDesign } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import DatePickerModal from "./ModalDatePicker";
import DateUtils from "../../utils/DateUtils";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoggerService from "../../services/LoggerService";

const ModalObjectif = ({isVisible, setVisible, actionType, objectif={}, onModify=undefined}) => {
    const { currentUser } = useAuth();
    const animalsService = new AnimalsService;
    const objectifService = new ObjectifService;
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
    const [animaux, setAnimaux] = useState([]);
    const [selected, setSelected] = useState([]);
    const [modalDropdownTemporalityVisible, setModalDropdownTemporalityVisible] = useState(false);
    const [temporalityObjectif, setTemporalityObjectif] = useState(false);
    const [inputs, setInputs] = useState(['']);
    const dateUtils = new DateUtils();
    const list = [
        {title: "Semaine", id: "week"},
        {title: "Mois", id: "month"},
        {title: "Année", id: "year"},
    ];
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if(isVisible){
          getAnimals();
          initValuesEvent();
        }
    }, [isVisible]);
    
    useEffect(() => {
        initValuesEvent();
    }, [animaux]);

    useEffect(() => {
        changeObjectifEndDate();
    }, [modalDropdownTemporalityVisible])

    const getAnimals = async () => {
  
        // Si aucun animal est déjà présent dans la liste, alors
        if(animaux.length == 0){
            // On récupère les animaux de l'utilisateur courant
            var result = await animalsService.getAnimals(currentUser.email);
            // Si l'utilisateur a des animaux, alors
            if(result.length !== 0){
            // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
                setAnimaux(result);
            
            }
        }
      
    };

    const initValuesEvent = () => {
        setValue("id", objectif.id);
        setValue("datedebut", objectif.datedebut === undefined ? new Date().toISOString().split('T')[0] : objectif.datedebut.split('T')[0]);
        setValue("datefin", objectif.datefin === undefined ? dateUtils.dateFormatter(new Date().toISOString().split('T')[0], "yyyy-mm-dd", "-") : dateUtils.dateFormatter(objectif.datefin.split('T')[0], "yyyy-mm-dd", "-"));
        setValue("title", objectif.title);
        setValue("animaux", objectif.animaux);
        if(objectif.animaux != undefined){
            var animauxSelected = animaux.filter((item) => objectif.animaux.includes(item.id));
            if(animauxSelected != undefined){
              setSelected(animaux.filter((item) => objectif.animaux.includes(item.id)));
            }
        }
        setValue("temporalityobjectif", objectif.temporalityobjectif);
        if(objectif.temporalityobjectif != undefined){
            setTemporalityObjectif(list.filter((item) => item.id == objectif.temporalityobjectif)[0]);
        }
        setValue("sousetapes", objectif.sousEtapes);
        if(objectif.sousEtapes != undefined){
            setInputs(objectif.sousEtapes);
        }
    }

    const closeModal = () => {
        resetValues();
        setVisible(false);
    };

    const resetValues = () =>{
        setInputs(['']);
        setSelected([]);
        setTemporalityObjectif(false);
        setValue('title', "");
        setValue("id", "");
        setValue("temporalityobjectif", "");
        setValue("animaux", []);
        setValue("sousetapes", []);
        setValue("datedebut", new Date().toISOString().split('T')[0]);
        setValue("datefin", new Date().toISOString().split('T')[0]);
        setAnimaux([]);
    };

    const submitRegister = async(data) =>{
        if(loading){
            return;
        }
        setLoading(true);

        var complete = true;

        if(selected.length === 0){
            complete = false;
            Toast.show({
              type: "error",
              position: "top",
              text1: "Veuillez saisir au moins un animal"
            });
        } else{
            setValue("animaux", selected.map(function(item) { return item["id"] }));
        }
        if(temporalityObjectif === false){
            complete = false;
            Toast.show({
                type: "error",
                position: "top",
                text1: "Veuillez saisir une temporalité"
            });
        }
        if(data.datedebut === undefined){
            complete = false;
            Toast.show({
              type: "error",
              position: "top",
              text1: "Veuillez saisir une date de début pour l'objectif"
            });
        }
        const isNotEmpty = inputs.some(str => str.etape !== undefined && str.etape.trim().length > 0);
        if(!isNotEmpty){
            complete = false;
            Toast.show({
                type: "error",
                position: "top",
                text1: "Veuillez saisir au moins une sous-étape"
            });
        }

        // Si formulaire complet, on enregistre
        if(complete === true){
            data.expotoken = JSON.parse(await AsyncStorage.getItem("userExpoToken"));
            if(actionType === "modify"){
                objectifService.update(data)
                    .then((reponse) =>{

                        Toast.show({
                            type: "success",
                            position: "top",
                            text1: "Modification d'un objectif réussi"
                        });
                        onModify(reponse);
                        closeModal();
                        setLoading(false);
                    })
                    .catch((err) =>{
                        Toast.show({
                            type: "error",
                            position: "top",
                            text1: err.message
                        });
                        LoggerService.log( "Erreur lors de la MAJ d'un objectif : " + err.message );
                        setLoading(false);
                    });
            }
            else{
                objectifService.create(data)
                    .then((reponse) =>{

                        Toast.show({
                            type: "success",
                            position: "top",
                            text1: "Création d'un objectif réussi"
                        });
                        closeModal();
                        setLoading(false);
                    })
                    .catch((err) =>{
                        Toast.show({
                            type: "error",
                            position: "top",
                            text1: err.message
                        });
                        LoggerService.log( "Erreur lors de la création d'un objectif : " + err.message );
                        setLoading(false);
                    });
            }
        } else{
            setLoading(false);
        }
    };

    // Fonction pour mettre à jour le state avec une nouvelle valeur ajoutée
    const handleInputChange = (text, index) => {
        const newInputs = [...inputs];
        newInputs[index] = {'id': undefined, 'etape': text, 'state': false, 'order': index};
        setInputs(newInputs);
        setValue("sousetapes", newInputs);
    };

    // Fonction pour ajouter un nouvel input
    const handleAddInput = () => {
        setInputs([...inputs, '']);
    };

    const handleRemoveInput = (index) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
        setValue("sousetapes", newInputs);
    };

    const convertDateToText = (fieldname) =>{
        var date = watch(fieldname);
        if(date == undefined){
            return "";
        }
        if(date.includes("/")){
            date = dateUtils.dateFormatter(date, "dd/MM/yyyy", "/");
        }
        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateObject  = new Date(date);
        return String(dateObject.toLocaleDateString("fr-FR", options));
    };

    const onChangeDate = (propertyName, selectedDate) => {
        setValue(propertyName, selectedDate);
        changeObjectifEndDate();
    };

    const changeObjectifEndDate = () => {
        if(temporalityObjectif === false || temporalityObjectif === undefined || getValues("datedebut") === undefined){
            return;
        }
        var dateFin = new Date(getValues("datedebut"));
        if(temporalityObjectif.id === "week"){
            dateFin.setDate(dateFin.getDate() + 7);
        }
        if(temporalityObjectif.id === "month"){
            dateFin.setMonth(dateFin.getMonth() + 1);
        }
        if(temporalityObjectif.id === "year"){
            dateFin.setFullYear(dateFin.getFullYear() + 1);
        }
        setValue("datefin", dateFin.toLocaleDateString());
    }

    return(
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={closeModal}
            >
                <ModalAnimals
                    modalVisible={modalAnimalVisible}
                    setModalVisible={setModalAnimalVisible}
                    setAnimaux={setAnimaux}
                    animaux={animaux}
                    selected={selected}
                    setSelected={setSelected}
                    setValue={setValue}
                    valueName={"animaux"}
                />
                <ModalDropdwn
                    list={list}
                    modalVisible={modalDropdownTemporalityVisible}
                    setModalVisible={setModalDropdownTemporalityVisible}
                    setState={setTemporalityObjectif}
                    state={temporalityObjectif}
                    setValue={setValue}
                    valueName={"temporalityobjectif"}
                />
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
                                <Text style={[styles.textFontBold]}>Modifier un objectif</Text>
                            }
                            { actionType === "create" && 
                                <Text style={[styles.textFontBold]}>Créer un objectif</Text>
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
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Animal : <Text style={{color: "red"}}>*</Text></Text>
                                    <TouchableOpacity 
                                    style={styles.textInput}
                                    disabled={animaux.length > 0 ? false : true}
                                    onPress={()=>{setModalAnimalVisible(true)}} 
                                    >
                                    <View style={styles.containerAnimaux}>
                                        {animaux.length === 0 &&
                                        <View><Text style={[styles.badgeAnimal, styles.errorInput, styles.textFontRegular]}>Pour ajouter un événement vous devez d'abord créer un animal</Text></View>
                                        }
                                        {selected.length == 0 && animaux.length > 0 &&
                                        <View style={[styles.containerBadgeAnimal, {width: "100%"}]}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>Sélectionner un ou plusieurs animaux</Text></View>
                                        }
                                        {selected.map((animal, index) => {
                                        return (
                                            <View key={animal.id} style={styles.containerBadgeAnimal}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{animal.nom}</Text></View>
                                        );
                                        })}
                                    </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Titre de l'objectif : <Text style={{color: "red"}}>*</Text></Text>
                                    {errors.title && <Text style={[styles.errorInput, styles.textFontRegular]}>Titre obligatoire</Text>}
                                    <TextInput
                                        style={[styles.input, styles.textFontRegular]}
                                        placeholder="Exemple : Rendez-vous vétérinaire"
                                        placeholderTextColor={Variables.texte}
                                        onChangeText={(text) => setValue("title", text)}
                                        defaultValue={getValues("title")}
                                        {...register("title", { required: true })}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Temporalité : <Text style={{color: "red"}}>*</Text></Text>
                                    <TouchableOpacity 
                                    style={styles.textInput} 
                                    onPress={()=>{setModalDropdownTemporalityVisible(true)}} 
                                    >
                                    <View style={styles.containerAnimaux}>
                                        {temporalityObjectif == false &&
                                        <View style={[styles.containerBadgeAnimal, {width: "100%"}]}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>Sélectionner une temporalité</Text></View>
                                        }
                                        {
                                        temporalityObjectif != false &&
                                        <View style={[styles.containerBadgeAnimal, {width: "100%"}]}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{temporalityObjectif.title}</Text></View>
                                        }
                                    </View>
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.containerDate}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Date de début : {convertDateToText("datedebut")} <Text style={{color: "red"}}>*</Text></Text>
                                    <DatePickerModal
                                        onDayChange={onChangeDate}
                                        propertyName={"datedebut"}
                                        defaultDate={getValues("datedebut")}
                                    />
                                </View>

                                <View style={styles.containerDate}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Date de fin : {convertDateToText("datefin")} </Text>
                                    <TextInput
                                        value={getValues("datefin")}
                                        style={styles.input}
                                        editable={false}
                                    />
                                </View>

                                <View style={styles.inputContainer}>
                                    <Text style={[styles.textInput, styles.textFontRegular]}>Étapes de l'objectif : <Text style={{color: "red"}}>*</Text></Text>
                                    {inputs.map((value, index) => (
                                        <View style={styles.sousEtapesContainer} key={index}>
                                            <TextInput
                                                style={[styles.inputSousEtape, styles.textFontRegular]}
                                                value={value.etape}
                                                onChangeText={(text) => handleInputChange(text, index)}
                                                placeholder="Entrez une valeur"
                                            />
                                            <TouchableOpacity onPress={() => handleRemoveInput(index)}>
                                                <AntDesign name="delete" size={20} color={Variables.alezan}/>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                    <Button
                                        onPress={handleAddInput}
                                        type={"primary"}
                                        size={"s"}
                                        isLong={true}
                                    >
                                        <Text style={styles.textFontMedium}>Ajouter une sous-étape</Text>
                                    </Button>
                                </View>

                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
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
    containerAnimaux: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap"
    },
    badgeAnimal: {
        padding: 8,
    },
    errorInput: {
        color: "red"
    },
    badgeAnimal: {
        padding: 8,
    },
    containerBadgeAnimal: {
        borderRadius: 5,
        backgroundColor: Variables.rouan,
        marginRight: 5,
        marginBottom: 5,
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
    inputSousEtape: {
        height: 40,
        width: "95%",
        borderRadius: 5,
        paddingLeft: 15,
        backgroundColor: Variables.rouan,
        color: "black",
        marginRight: 10
    },
    sousEtapesContainer: {
        display: "flex",
        flexDirection: "row",
        marginBottom: 15,
        width: "100%",
        alignItems: "center"
    },
    toastContainer: {
        zIndex: 9999, 
    },
    containerDate:{
        flexDirection: "column",
        alignSelf: "flex-start",
        width: "100%"
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

});

export default ModalObjectif;