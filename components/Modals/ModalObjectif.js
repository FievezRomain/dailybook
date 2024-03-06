import { AuthenticatedUserContext } from "../../providers/AuthenticatedUserProvider";
import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { useForm } from "react-hook-form";
import ModalAnimals from "./ModalAnimals";
import AnimalsService from "../../services/AnimalsService";
import ObjectifService from "../../services/ObjectifService";
import ModalDropdwn from "./ModalDropdown";
import Button from "../Button";
import { AntDesign } from '@expo/vector-icons';
import { Toast } from "react-native-toast-message/lib/src/Toast";

const ModalObjectif = ({isVisible, setVisible, actionType, objectif={}, onModify=undefined}) => {
    const { user } = useContext(AuthenticatedUserContext);
    const animalsService = new AnimalsService;
    const objectifService = new ObjectifService;
    const [loadingEvent, setLoadingEvent] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
    const [animaux, setAnimaux] = useState([]);
    const [selected, setSelected] = useState([]);
    const [modalDropdownTemporalityVisible, setModalDropdownTemporalityVisible] = useState(false);
    const [temporalityObjectif, setTemporalityObjectif] = useState(false);
    const [inputs, setInputs] = useState(['']);
    const list = [
        {title: "Semaine", id: "week"},
        {title: "Mois", id: "month"},
        {title: "Année", id: "year"},
    ];

    useEffect(() => {
        if(isVisible){
          getAnimals();
          initValuesEvent();
        }
    }, [isVisible]);
    
    useEffect(() => {
        initValuesEvent();
    }, [animaux]);

    const getAnimals = async () => {
  
        // Si aucun animal est déjà présent dans la liste, alors
        if(animaux.length == 0){
            setLoadingEvent(true);
            // On récupère les animaux de l'utilisateur courant
            var result = await animalsService.getAnimals(user.id);
            setLoadingEvent(false);
            // Si l'utilisateur a des animaux, alors
            if(result.rowCount !== 0){
            // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
                setAnimaux(result.rows);
            
            }
        }
      
    };

    const initValuesEvent = () => {
        setValue("id", objectif.id);
        setValue("title", objectif.title);
        setValue("animaux", objectif.animaux);
        if(objectif.animaux != undefined){
            var animauxSelected = animaux.filter((item) => objectif.animaux.includes(String(item.id)));
            if(animauxSelected != undefined){
              setSelected(animaux.filter((item) => objectif.animaux.includes(String(item.id))));
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
    };

    const submitRegister = async(data) =>{
        var complete = true;
        setLoadingEvent(true);

        if(selected.length === 0){
            complete = false;
            setLoadingEvent(false);
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
            setLoadingEvent(false);
            Toast.show({
                type: "error",
                position: "top",
                text1: "Veuillez saisir une temporalité"
            });
        }
        const isNotEmpty = inputs.some(str => str.etape.trim().length > 0);
        if(!isNotEmpty){
            complete = false;
            setLoadingEvent(false);
            Toast.show({
                type: "error",
                position: "top",
                text1: "Veuillez saisir au moins une sous-étape"
            });
        }

        // Si formulaire complet, on enregistre
        if(complete === true){
            if(actionType === "modify"){
                objectifService.update(data)
                    .then((reponse) =>{
                        setLoadingEvent(false);

                        Toast.show({
                            type: "success",
                            position: "top",
                            text1: "Modification d'un objectif réussi"
                        });
                        onModify(reponse);
                        closeModal();
                    })
                    .catch((err) =>{
                        setLoadingEvent(false);
                        Toast.show({
                            type: "error",
                            position: "top",
                            text1: err.message
                        });
                    });
            }
            else{
                objectifService.create(data)
                    .then((reponse) =>{
                        setLoadingEvent(false);

                        Toast.show({
                            type: "success",
                            position: "top",
                            text1: "Création d'un objectif réussi"
                        });
                        closeModal();
                    })
                    .catch((err) =>{
                        setLoadingEvent(false);
                        Toast.show({
                            type: "error",
                            position: "top",
                            text1: err.message
                        });
                    });
            }
        }
    };

    // Fonction pour mettre à jour le state avec une nouvelle valeur ajoutée
    const handleInputChange = (text, index) => {
        const newInputs = [...inputs];
        newInputs[index] = {'id': undefined, 'etape': text, 'state': false};
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
                                <Text style={{color: Variables.aubere}}>Annuler</Text>
                            </TouchableOpacity>
                            { actionType === "modify" && 
                                <Text style={{fontWeight: "bold"}}>Modifier un objectif</Text>
                            }
                            { actionType === "create" && 
                                <Text style={{fontWeight: "bold"}}>Créer un objectif</Text>
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
                                        <Text style={styles.textInput}>Animal : <Text style={{color: "red"}}>*</Text></Text>
                                        <TouchableOpacity 
                                        style={styles.textInput}
                                        disabled={animaux.length > 0 ? false : true}
                                        onPress={()=>{setModalAnimalVisible(true)}} 
                                        >
                                        <View style={styles.containerAnimaux}>
                                            {animaux.length === 0 &&
                                            <View><Text style={[styles.badgeAnimal, styles.errorInput]}>Pour ajouter un événement vous devez d'abord créer un animal</Text></View>
                                            }
                                            {selected.length == 0 && animaux.length > 0 &&
                                            <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Sélectionner un animal</Text></View>
                                            }
                                            {selected.map((animal, index) => {
                                            return (
                                                <View key={animal.id} style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>{animal.nom}</Text></View>
                                            );
                                            })}
                                        </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Titre de l'objectif : <Text style={{color: "red"}}>*</Text></Text>
                                        {errors.title && <Text style={styles.errorInput}>Titre obligatoire</Text>}
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Rendez-vous vétérinaire"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("title", text)}
                                            defaultValue={getValues("title")}
                                            {...register("title", { required: true })}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Temporalité : <Text style={{color: "red"}}>*</Text></Text>
                                        <TouchableOpacity 
                                        style={styles.textInput} 
                                        onPress={()=>{setModalDropdownTemporalityVisible(true)}} 
                                        >
                                        <View style={styles.containerAnimaux}>
                                            {temporalityObjectif == false &&
                                            <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Sélectionner une temporalité</Text></View>
                                            }
                                            {
                                            temporalityObjectif != false &&
                                            <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>{temporalityObjectif.title}</Text></View>
                                            }
                                        </View>
                                        </TouchableOpacity>
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Sous-étapes de l'objectif : <Text style={{color: "red"}}>*</Text></Text>
                                        {inputs.map((value, index) => (
                                            <View style={styles.sousEtapesContainer} key={index}>
                                                <TextInput
                                                    style={styles.inputSousEtape}
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
                                        size={"m"}
                                        >
                                            <Text>Ajouter une sous-étape</Text>
                                        </Button>
                                    </View>

                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
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
        borderRadius: 10,
        backgroundColor: Variables.rouan,
        margin: 5,
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

});

export default ModalObjectif;