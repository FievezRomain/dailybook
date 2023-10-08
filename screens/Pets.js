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
import ModalVerif from "../components/ModalVerif";
import DateField from "../components/DateField";

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
  const [modalVisible, setModalVisible] = useState(false);
  

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
        if(result.rows[0].couleur !== null ? setValue("couleur", result.rows[0].couleur) : null);
        if(result.rows[0].nomPere !== null ? setValue("nomPere", result.rows[0].nomPere) : null);
        if(result.rows[0].nomMere !== null ? setValue("nomMere", result.rows[0].nomMere) : null);
        if(result.rows[0].datenaissance !== null ? setDate(result.rows[0].datenaissance) : setDate(null));

        // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
        setAnimaux(result.rows);
      }
    }
  };

  const submitPets = async(data) =>{
    // Récupération de l'identifiant de l'utilisateur (propriétaire)
    data["idProprietaire"] =  user.id;
    setLoadingPets(true);

    const formData = data;
    if (data.image != undefined){
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
    

    // Si un animal est selectionné, cela veut dire qu'on doit le modifier, sinon le créer
    if(selected.length > 0){
      // Modification de l'animal dans le back (BDD)
      animalsService.modify(formData)
      .then((response) =>{
        setLoadingPets(false);
        // Une fois la modification terminée, on valorise le hook avec la liste à jour des animaux
        //animauxTemp = animaux;
        //animauxFiltered = animaux.filter((a) => a.id === response.id);
        //animauxTemp[animaux.indexOf(animauxFiltered)] = response;
        indice = animaux.findIndex((a) => a.id == response.id);
        animaux[indice] = response;
        setAnimaux(animaux);
        setSelected([animaux[indice]]);
          Toast.show({
              type: "success",
              position: "top",
              text1: "Modification réussie"
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
    } else{
      // Création de l'animal dans le back (BDD)
      animalsService.create(formData)
      .then((response) =>{
        setLoadingPets(false);
        // Une fois la création terminée, on valorise le hook avec la liste à jour des animaux
        setAnimaux([...animaux, response]);
          Toast.show({
              type: "success",
              position: "top",
              text1: "Création d'un nouvel animal réussie"
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
    
  };

  const deletePet = async() =>{
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
      setSelected([]);
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
    setValue("datenaissance", selectedDate);
    setDate(selectedDate);
  };

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
      <ModalVerif
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        event={deletePet}
        message={"Êtes-vous sûr de vouloir supprimer cet animal ?"}
      />
      <Image style={styles.image} source={require("../assets/wallpaper_addEvent.jpg")} />
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
            <View style={styles.inputContainer}>
              <Text style={styles.textInput}>Date :</Text>
              <TextInput
                  style={styles.input}
                  placeholder="Exemple : 01/01/1900"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor={Variables.texte}
                  onChangeText={(text) => onChangeDate(text)}
                  value={date}
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
              <Text style={styles.textInput}>Image :</Text>
              <AvatarPicker
                setImage={setImage}
                setValue={setValue}
              />
              {image &&
                <View style={styles.imageContainer}>
                  <Image source={{uri: image}} style={styles.avatar}/>
                  <TouchableOpacity onPress={() => setImage(null)}>
                    <Image source={require("../assets/cross.png")} style={{height: 20, width: 20}}/>
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
                placeholder="Exemple : 50"
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
                placeholder="Exemple : 30"
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
                placeholder="Exemple : Rouge tricolor"
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
            <View style={styles.registerButton}>
              <Button type="primary" onPress={handleSubmit(submitPets)}>
                {selected.length > 0 && <Text style={styles.textButton}>Modifier</Text>}
                {selected.length == 0 && <Text style={styles.textButton}>Créer</Text>}
              </Button>
            </View>
              {selected.length > 0 && 
                <View style={styles.registerButton}>
                  <Button type="primary" onPress={() => setModalVisible(!modalVisible)}>
                    <Text style={styles.textButton}>Supprimer</Text>
                  </Button>
                </View>
              }
          </View>
        </ScrollView>
      </View>
    </>
    );
};

const styles = StyleSheet.create({
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
    backgroundColor:  Variables.fond
  },
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    justifyContent: "center",
    width: "90%",
    height: "65%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    marginTop: 10,
    paddingBottom: 10,
    paddingTop: 10,
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
    backgroundColor: Variables.fond_secondary,
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
    marginBottom: 5
  },
  datePicker:{
    marginBottom: 10,
    alignSelf: "flex-start",
    borderRadius: 5,
  },
})

module.exports = PetsScreen;