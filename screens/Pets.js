import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import React, { useState, useContext, useEffect, useRef } from 'react';
import AnimalsPicker from "../components/AnimalsPicker";
import AvatarPicker from "../components/AvatarPicker";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimalsService from "../services/AnimalsService";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import ModalVerif from "../components/Modals/ModalVerif";
import DateField from "../components/DateField";
import { Entypo } from '@expo/vector-icons';
import ModalSubMenuAnimalActions from "../components/Modals/ModalSubMenuAnimalActions";
import ModalAnimal from "../components/Modals/ModalAnimal";
import DateUtils from "../utils/DateUtils";
import { getImagePath } from '../services/Config';
import ModalManageBodyAnimal from "../components/Modals/ModalManageBodyAnimal";

const PetsScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [messages, setMessages] = useState({message1: "Mes", message2: "animaux"});
  const animalsService = new AnimalsService;
  const [animaux, setAnimaux] = useState([]);
  const [selected, setSelected] = useState([]);
  const [addingForm, setAddingForm] = useState(false);
  const [image, setImage] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  today = new Date();
  jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
  mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
  annee = today.getFullYear();
  const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));
  const [loadingEvent, setLoadingPets] = useState(false);
  const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
  const [modalSubMenuAnimalActionsVisible, setModalSubMenuAnimalActionsVisible] = useState(false);
  const dateUtils = new DateUtils();
  const [modalManageBodyAnimalVisible, setModalBodyAnimalVisible] = useState(false);
  

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMessages({message1: "Mes", message2: "animaux"});
      
      getAnimals();
      
      
    });
    return unsubscribe;
  }, [navigation]);


  const getAnimals = async () => {
    // Si aucun animal est déjà présent dans la liste, alors
    if(animaux.length == 0){
      setLoadingPets(true);
      // On récupère les animaux de l'utilisateur courant
      var result = await animalsService.getAnimals(user.id);
      setLoadingPets(false);
      // Si l'utilisateur a des animaux, alors
      if(result.rowCount !== 0){
        // On valorise l'animal selectionné par défaut au premier de la liste
        setSelected([result.rows[0]]);
        if(result.rows[0].id !== null ? setValue("id", result.rows[0].id) : null);
        if(result.rows[0].nom !== null ? setValue("nom", result.rows[0].nom) : null);
        if(result.rows[0].espace !== null ? setValue("espece", result.rows[0].espece) : null);
        if(result.rows[0].datenaissance !== null ? setValue("datenaissance", result.rows[0].datenaissance) : null);
        if(result.rows[0].race !== null ? setValue("race", result.rows[0].race) : null );
        if(result.rows[0].taille !== null ? setValue("taille", String(result.rows[0].taille)) : null);
        if(result.rows[0].poids !== null ? setValue("poids", String(result.rows[0].poids)) : null);
        if(result.rows[0].sexe !== null ? setValue("sexe", result.rows[0].sexe) : null);
        if(result.rows[0].food !== null ? setValue("food", result.rows[0].food) : null);
        if(result.rows[0].quantity !== null ? setValue("quantity", String(result.rows[0].quantity)) : null);
        if(result.rows[0].couleur !== null ? setValue("couleur", result.rows[0].couleur) : null);
        if(result.rows[0].nomPere !== null ? setValue("nomPere", result.rows[0].nomPere) : null);
        if(result.rows[0].nomMere !== null ? setValue("nomMere", result.rows[0].nomMere) : null);
        if(result.rows[0].datenaissance !== null ? setDate(result.rows[0].datenaissance) : setDate(null));

        // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
        setAnimaux(result.rows);
      }
    }
  };

  const handleDeletePet = async() =>{
    let data = {};
    // Récupération de l'identifiant de l'utilisateur (propriétaire)
    data["idProprietaire"] =  user.id;
    setLoadingPets(true);

    // Récupération de l'identifiant de l'animal
    data["id"] = selected[0].id;

    animalsService.delete(data)
    .then((response) =>{
      setLoadingPets(false);

      // Une fois la suppression terminée, on valorise le hook avec l'animal en moins
      setAnimaux(animaux.filter((a) => a.id !== data["id"]));

      // On change l'animal sélectionné par le premier de la liste
      var animalToDisplay = animaux.filter((a) => a.id !== data["id"])[0];
      setSelected(animalToDisplay);
      setValue("id", animalToDisplay.id);
      setValue("nom", animalToDisplay.nom);
      setValue("espece", animalToDisplay.espece);
      setValue("datenaissance", animalToDisplay.datenaissance !== null ? dateUtils.dateFormatter(animalToDisplay.datenaissance, "dd/MM/yyyy", "/") : undefined);
      setValue("race", animalToDisplay.race !== null ? animalToDisplay.race : undefined);
      setValue("taille", animalToDisplay.taille !== null ? animalToDisplay.taille.toString() : undefined);
      setValue("poids", animalToDisplay.poids !== null ? animalToDisplay.poids.toString() : undefined);
      setValue("sexe", animalToDisplay.sexe !== null ? animalToDisplay.sexe : undefined);
      setValue("food", animalToDisplay.food !== null ? animalToDisplay.food : undefined);
      setValue("quantity", animalToDisplay.quantity !== null ? animalToDisplay.quantity.toString() : undefined);
      setValue("couleur", animalToDisplay.couleur !== null ? animalToDisplay.couleur : undefined);
      setValue("nomPere", animalToDisplay.nompere !== null ? animalToDisplay.nompere : undefined);
      setValue("nomMere", animalToDisplay.nommere !== null ? animalToDisplay.nommere : undefined);
      setDate(animalToDisplay.datenaissance !== null ? animalToDisplay.datenaissance : String(jour + "/" + mois + "/" + annee));


      // Affichage d'un message de réussite
      Toast.show({
          type: "success",
          position: "top",
          text1: "Suppression réussie"
      }); 
        
    })
    .catch((err) =>{
        console.log(err);
        setLoadingPets(false);
        Toast.show({
            type: "error",
            position: "top",
            text1: err.message
        });
    });
  }

  const handleModify = () => {
    setModalAnimalVisible(true);
  }

  const onModify = (animal) => {
    Toast.show({
      type: "success",
      position: "top",
      text1: "Modification de l'animal"
    }); 

    // Une fois la modification terminée, on valorise le hook avec la liste à jour des animaux
    //animauxTemp = animaux;
    //animauxFiltered = animaux.filter((a) => a.id === response.id);
    //animauxTemp[animaux.indexOf(animauxFiltered)] = response;
    var indice = animaux.findIndex((a) => a.id == animal.id);
    animaux[indice] = animal;
    setAnimaux(animaux);
    setSelected([animaux[indice]]);
  }

  const handleManageBodyAnimal = () => {
    setModalBodyAnimalVisible(true);
  }

  const onModifyBodyAnimalHistory = (animal) =>{
    console.log("enregitrer historique");
  }

  return (
    <>
      {loadingEvent && (
      <View style={styles.loadingEvent}>
          <Image
          style={styles.loaderEvent}
          source={require("../assets/loader.gif")}
          />
      </View>
      )}
      <ModalAnimal
        actionType={"modify"}
        isVisible={modalAnimalVisible}
        setVisible={setModalAnimalVisible}
        animal={selected[0]}
        onModify={onModify}
      />
      <ModalSubMenuAnimalActions
        modalVisible={modalSubMenuAnimalActionsVisible}
        setModalVisible={setModalSubMenuAnimalActionsVisible}
        handleDelete={handleDeletePet}
        handleModify={handleModify}
        handleManageBody={handleManageBodyAnimal}
      />
      <ModalManageBodyAnimal
        isVisible={modalManageBodyAnimalVisible}
        setVisible={setModalBodyAnimalVisible}
        animal={selected[0]}
        onModify={onModifyBodyAnimalHistory}
      />
      <Image style={styles.image} />
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View style={{display: "flex", alignContent: "flex-start", justifyContent: "flex-start", alignItems: "flex-start", marginTop: 20}}>
        <AnimalsPicker
          setAnimaux={setAnimaux}
          animaux={animaux}
          setSelected={setSelected}
          selected={selected}
          setValue={setValue}
          mode="single"
          buttonAdd={true}
          setAddingForm={setAddingForm}
          setDate={setDate}
        />
      </View>
      <View style={styles.form}>
        <View style={styles.headerCard}>
          <View style={styles.titleCard}>
            <Text style={styles.title}>Informations</Text>
          </View>
          
          <TouchableOpacity onPress={() => setModalSubMenuAnimalActionsVisible(true)} >
            <Entypo name='dots-three-horizontal' size={20} />
          </TouchableOpacity>
        </View>
        <ScrollView style={{width:"100%"}}>
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
                editable={false}
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
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.textInput}>Date de naissance :</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Exemple : 01/01/1900"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor={Variables.texte}
                  onChangeText={(text) => onChangeDate(text)}
                  value={date}
                  editable={false}
              />
              {/* <DateField
                defaultValue={getValues}
                style={styles.input}
                setValue={setValue}
                valueName={"datenaissance"}
                getValues={getValues}
                date={date}
                setDate={setDate}
              /> */}
              {/* <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  onChange={onChangeDate}
                  accentColor={Variables.bouton}
                  style={styles.datePicker}
              /> */}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.textInput}>Race :</Text>
              <TextInput
                style={styles.input}
                placeholder="Exemple : Fjord"
                placeholderTextColor={Variables.texte}
                onChangeText={(text) => setValue("race", text)}
                defaultValue={getValues("race")}
                editable={false}
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
                editable={false}
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
                editable={false}
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
                editable={false}
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
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.textInput}>Quantité (gramme / cl) :</Text>
              <TextInput
                style={styles.input}
                placeholder="Exemple : 200"
                placeholderTextColor={Variables.texte}
                onChangeText={(text) => setValue("quantity", text)}
                defaultValue={getValues("quantity")}
                editable={false}
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
                editable={false}
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
                editable={false}
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
                editable={false}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </>
    );
};

const styles = StyleSheet.create({
  headerCard:{
    display: "flex",
    flexDirection: "row",
    width: "90%"
  },
  titleCard:{
    alignItems: "center", 
    flex: 1
  },
  title:{
    color: Variables.alezan,
  },
  errorInput: {
    color: "red"
  },
  loaderEvent: {
    width: 200,
    height: 200
  },
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
  textButton:{
    color: "white"
  },
  registerButton: {
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: Variables.bouton,
    borderRadius: 10
  },
  imagePrez:{
    height: "90%",
    width: "100%"
  },
  screenContainer:{
    backgroundColor: Variables.fond,
  },
  contentContainer:{
    display: "flex",
    height: "90%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    position: "absolute",
    justifyContent: "center",
    backgroundColor:  Variables.default
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: Variables.blanc,
    justifyContent: "center",
    width: "90%",
    height: "65%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    marginTop: 10,
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius:5,
    shadowOffset:{width:0, height:2}
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
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    borderWidth: 2,
    zIndex: 1,
  },
  imageContainer:{
    flexDirection: "row",
    alignSelf: "flex-start",
    marginTop: 5,
    marginBottom: 15
  },
  datePicker:{
    marginBottom: 10,
    alignSelf: "flex-start",
    borderRadius: 5,
  },
})

module.exports = PetsScreen;