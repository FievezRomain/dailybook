import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Animated } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect, useRef } from 'react';
import AnimalsPicker from "../components/AnimalsPicker";
import { useForm } from "react-hook-form";
import AnimalsService from "../services/AnimalsService";
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import InformationsAnimals from "../components/InformationsAnimals";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import NutritionHistory from "../components/NutritionHistory";
import MedicalBook from "../components/MedicalBook";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import DateUtils from '../utils/DateUtils';

const PetsScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState({message1: "Mes", message2: "animaux"});
  const animalsService = new AnimalsService;
  const [animaux, setAnimaux] = useState([]);
  const [selected, setSelected] = useState([{}]);
  const { setValue } = useForm();
  today = new Date();
  jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
  mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
  annee = today.getFullYear();
  const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));
  const [activeRubrique, setActiveRubrique] = useState(0);
  const separatorPosition = useRef(new Animated.Value(0)).current;
  const dateUtils = new DateUtils();
  

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
      // On récupère les animaux de l'utilisateur courant
      var result = await animalsService.getAnimals(currentUser.email);
      // Si l'utilisateur a des animaux, alors
      if(result.length !== 0){
        // On valorise l'animal selectionné par défaut au premier de la liste
        setSelected([result[0]]);
        if(result[0].id !== null ? setValue("id", result[0].id) : null);
        if(result[0].nom !== null ? setValue("nom", result[0].nom) : null);
        if(result[0].espace !== null ? setValue("espece", result[0].espece) : null);
        if(result[0].datenaissance !== null ? setValue("datenaissance", result[0].datenaissance) : null);
        if(result[0].race !== null ? setValue("race", result[0].race) : null );
        if(result[0].taille !== null ? setValue("taille", String(result[0].taille)) : null);
        if(result[0].poids !== null ? setValue("poids", String(result[0].poids)) : null);
        if(result[0].sexe !== null ? setValue("sexe", result[0].sexe) : null);
        if(result[0].food !== null ? setValue("food", result[0].food) : null);
        if(result[0].quantity !== null ? setValue("quantity", String(result[0].quantity)) : null);
        if(result[0].couleur !== null ? setValue("couleur", result[0].couleur) : null);
        if(result[0].nomPere !== null ? setValue("nomPere", result[0].nomPere) : null);
        if(result[0].nomMere !== null ? setValue("nomMere", result[0].nomMere) : null);
        if(result[0].datenaissance !== null ? setDate(result[0].datenaissance) : setDate(null));

        // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
        setAnimaux(result);
      }
    }
  };

  const handleDeletePet = async() =>{
    let data = {};
    // Récupération de l'identifiant de l'utilisateur (propriétaire)
    data["email"] =  currentUser.email;

    // Récupération de l'identifiant de l'animal
    data["id"] = selected[0].id;

    animalsService.delete(data)
    .then((response) =>{

      // Une fois la suppression terminée, on valorise le hook avec l'animal en moins
      setAnimaux(animaux.filter((a) => a.id !== data["id"]));

      // On change l'animal sélectionné par le premier de la liste
      var animalToDisplay = animaux.filter((a) => a.id !== data["id"])[0];
      
      if(animalToDisplay === undefined){
        navigation.navigate("FirstPageAddAnimal");
        return;
      } else{
        setSelected([animalToDisplay]);
      }
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
        Toast.show({
            type: "error",
            position: "top",
            text1: err.message
        });
    });
  }

  const onModify = (animal) => {
    Toast.show({
      type: "success",
      position: "top",
      text1: "Modification de l'animal"
    }); 

    var indice = animaux.findIndex((a) => a.id == animal.id);
    animaux[indice] = animal;
    setAnimaux(animaux);
    setSelected([animaux[indice]]);
  }

  const moveSeparator = (index) => {
    Animated.timing(separatorPosition, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
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
          setDate={setDate}
        />
      </View>
      <View style={styles.rubriqueContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={{width: "33.3%", alignItems: "center"}} onPress={() => { setActiveRubrique(0); moveSeparator(0); }}>
            <Entypo name="info-with-circle" size={30} color={activeRubrique === 0 ? Variables.alezan : "gray"}/>
          </TouchableOpacity>
          <TouchableOpacity style={{width: "33.3%", alignItems: "center"}} onPress={() => { setActiveRubrique(1); moveSeparator(1); }}>
            <FontAwesome6 name="utensils" size={25} color={activeRubrique === 1 ? Variables.alezan : "gray"}/>
          </TouchableOpacity>
          <TouchableOpacity style={{width: "33.3%", alignItems: "center"}} onPress={() => { setActiveRubrique(2); moveSeparator(2); }}>
            <FontAwesome6 name="book-medical" size={25} color={activeRubrique === 2 ? Variables.alezan : "gray"}/>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorFix}></View>
        <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1, 2], outputRange: ['0%', '33.3%', '66.6%'] }) }]} />
      </View>
      {activeRubrique === 0 && 
        <InformationsAnimals
          animal={selected[0]}
          onDelete={handleDeletePet}
          onModify={onModify}
        />
      }
      {activeRubrique === 1 &&
        <NutritionHistory 
          animal={selected[0]}
        />
      }
      {activeRubrique === 2 &&
        <MedicalBook 
          animal={selected[0]}
        />
      }
    </>
    );
};

const styles = StyleSheet.create({

  rubriqueContainer:{
    marginTop: 10,
    marginBottom: 10,
  },
  iconsContainer:{
    display: "flex", 
    flexDirection: "row", 
    paddingVertical: 10
  },
  separatorFix:{
    borderTopColor: "gray", 
    borderTopWidth: 1, 
    position: 'absolute', 
    bottom: 0, 
    height: 2, 
    width: "100%"
  },
  separatorAnimated:{
    height: 3, 
    backgroundColor: Variables.alezan, 
    position: 'absolute', 
    bottom: 0, 
    width: '33.3%',
  }
})

module.exports = PetsScreen;