import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import React, { useState, useContext, useEffect } from 'react';
import AnimalsPicker from "../components/AnimalsPicker";
import AvatarPicker from "../components/AvatarPicker";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import DateTimePicker from '@react-native-community/datetimepicker';
import AnimalsService from "../services/AnimalsService";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const PetsScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [messages, setMessages] = useState({message1: "Mes", message2: "animaux"});
  const animalsService = new AnimalsService;
  const [animaux, setAnimaux] = useState([]);
  const [selected, setSelected] = useState(null);
  const [addingForm, setAddingForm] = useState(false);
  const [image, setImage] = useState(null);
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const [date, setDate] = useState(new Date(new Date().getTime()));
  const [loadingEvent, setLoadingPets] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMessages({message1: "Mes", message2: "animaux"});
      getAnimals();
      
    });
    return unsubscribe;
  }, [navigation]);

  /* const submitPets = async(data) =>{
    const formData = new FormData();
    if(image != null){
      formData.append("picture", {
        name: "test",
        type: "image/jpeg",
        uri: data.image.uri
      });
      console.log(data.image.uri);
    } else{
      formData.append("files", "empty");
    }
    data = { ...data, image: data.image };
    formData.append("recipe", JSON.stringify(data));
    
    setLoadingPets(true);
    animalsService.create(formData)
    .then((res) =>{
      setLoadingPets(false);
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
  }; */
  const getAnimals = async () => {
    //A TERMINER
    setLoadingPets(true);
    var result = await animalsService.getAnimals(user.id);
    setLoadingPets(false);
    if(result.rowCount != 0){
      setAnimaux(result.rows)
      console.log(animaux)
    }
  };

  const submitPets = async(data) =>{
    data["idProprietaire"] =  user.id;
    setLoadingPets(true);
    animalsService.create(data)
    .then((res) =>{
      setLoadingPets(false);
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
  };

  const onChangeDate = (event, selectedDate) => {
    setValue("date", selectedDate.getDate() + "/" + parseInt(selectedDate.getMonth()+1) + "/" + selectedDate.getFullYear());
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
      <Image style={styles.image} source={require("../assets/wallpaper_addEvent.jpg")} />
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View style={{display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center", marginTop: 20}}>
        <AnimalsPicker
          setAnimaux={setAnimaux}
          animaux={animaux}
          mode="single"
          buttonAdd={true}
          setAddingForm={setAddingForm}
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
                value={selected && getValues("nom")}
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
                value={selected && getValues("espece")}
                defaultValue={getValues("espece")}
                {...register("espece", { required: true })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.textInput}>Date :</Text>
              <DateTimePicker
                  testID="dateTimePicker"
                  value={date}
                  mode="date"
                  is24Hour={true}
                  onChange={onChangeDate}
                  accentColor={Variables.bouton}
                  style={styles.datePicker}
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
                value={selected && getValues("race")}
                defaultValue={getValues("race")}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.textInput}>Taille (cm) :</Text>
              <TextInput
                style={styles.input}
                placeholder="Exemple : 50"
                placeholderTextColor={Variables.texte}
                onChangeText={(text) => setValue("taille", text)}
                value={selected && getValues("taille")}
                defaultValue={getValues("taille")}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.textInput}>Poids (kg) :</Text>
              <TextInput
                style={styles.input}
                placeholder="Exemple : 30"
                placeholderTextColor={Variables.texte}
                onChangeText={(text) => setValue("poids", text)}
                value={selected && getValues("poids")}
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
                value={selected && getValues("sexe")}
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
                value={selected && getValues("couleur")}
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
                value={selected && getValues("nomPere")}
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
                value={selected && getValues("nomMere")}
                defaultValue={getValues("nomMere")}
              />
            </View>
            <View style={styles.registerButton}>
              <Button type="primary" onPress={handleSubmit(submitPets)}>
                {selected && <Text style={styles.textButton}>Modifier</Text>}
                {!selected && <Text style={styles.textButton}>Créer</Text>}
              </Button>
            </View>
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