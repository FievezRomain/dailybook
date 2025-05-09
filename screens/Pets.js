import { View, Text, StyleSheet, Image, ScrollView, TextInput, TouchableOpacity, Animated } from "react-native";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import AnimalsPicker from "../components/AnimalsPicker";
import { useForm } from "react-hook-form";
import animalsServiceInstance from "../services/AnimalsService";
import { Entypo, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import InformationsAnimals from "../components/InformationsAnimals";
import Toast from "react-native-toast-message";
import AnimalBody from "../components/AnimalBody";
import MedicalBook from "../components/MedicalBook";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import DateUtils from '../utils/DateUtils';
import LoggerService from "../services/LoggerService";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from 'react-native-paper';
import ModalValidation from "../components/Modals/ModalValidation";
import { useFocusEffect } from "@react-navigation/native";
import { useAnimaux } from "../providers/AnimauxProvider";

const PetsScreen = ({ navigation }) => {
  const { colors, fonts } = useTheme();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState({message1: "Mes", message2: "Animaux"});
  const { animaux, setAnimaux } = useAnimaux();
  const [selected, setSelected] = useState([]);
  const { setValue } = useForm();
  var today = new Date();
  var jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
  var mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
  var annee = today.getFullYear();
  const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));
  const [activeRubrique, setActiveRubrique] = useState(0);
  const separatorPosition = useRef(new Animated.Value(0)).current;
  const dateUtils = new DateUtils();
  const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      if(selected.length === 0){
        initDisplay();
      }
    }, [navigation])
  );

  useEffect(() => {
    let array = [];

    selected.forEach((obj) => {
      var indice = animaux.findIndex((a) => a.id == obj.id);

      if(indice !== -1){
        array.push(animaux[indice]);
      }
    });

    if( array.length > 0 ){
      setSelected( array );
    }
    
  }, [animaux]);


  const initDisplay = async () => {
      // On valorise l'animal selectionné par défaut au premier de la liste
      setSelected([animaux[0]]);
      if(animaux[0].id !== null ? setValue("id", animaux[0].id) : null);
      if(animaux[0].nom !== null ? setValue("nom", animaux[0].nom) : null);
      if(animaux[0].espace !== null ? setValue("espece", animaux[0].espece) : null);
      if(animaux[0].datenaissance !== null ? setValue("datenaissance", animaux[0].datenaissance) : null);
      if(animaux[0].race !== null ? setValue("race", animaux[0].race) : null );
      if(animaux[0].taille !== null ? setValue("taille", String(animaux[0].taille)) : null);
      if(animaux[0].poids !== null ? setValue("poids", String(animaux[0].poids)) : null);
      if(animaux[0].sexe !== null ? setValue("sexe", animaux[0].sexe) : null);
      if(animaux[0].food !== null ? setValue("food", animaux[0].food) : null);
      if(animaux[0].quantity !== null ? setValue("quantity", String(animaux[0].quantity)) : null);
      if(animaux[0].couleur !== null ? setValue("couleur", animaux[0].couleur) : null);
      if(animaux[0].nompere !== null ? setValue("nompere", animaux[0].nomPere) : null);
      if(animaux[0].nommere !== null ? setValue("nommere", animaux[0].nomMere) : null);
      if(animaux[0].datenaissance !== null ? setDate(animaux[0].datenaissance) : setDate(null));
  };

  const handleDeletePet = async() =>{
    setModalValidationDeleteVisible(true);
  }

  const confirmDeletePet = async() =>{
    setModalValidationDeleteVisible(false);
    let data = {};
    // Récupération de l'identifiant de l'utilisateur (propriétaire)
    data["email"] =  currentUser.email;

    // Récupération de l'identifiant de l'animal
    data["id"] = selected[0].id;

    animalsServiceInstance.delete(data)
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
      setValue("nompere", animalToDisplay.nompere !== null ? animalToDisplay.nompere : undefined);
      setValue("nommere", animalToDisplay.nommere !== null ? animalToDisplay.nommere : undefined);
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
        LoggerService.log( "Erreur lors de la suppression d'un animal : " + err.message );
    });
  }

  const onModify = (animal) => {
    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Modification de l'animal"
    }), 300);
  }

  const moveSeparator = (index) => {
    Animated.timing(separatorPosition, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const styles = StyleSheet.create({

    rubriqueContainer:{
      marginTop: 10,
      marginBottom: 25,
    },
    iconsContainer:{
      display: "flex", 
      flexDirection: "row", 
      paddingVertical: 10
    },
    separatorFix:{
      borderTopColor: colors.quaternary, 
      borderTopWidth: 0.4, 
      position: 'absolute', 
      bottom: 0, 
      height: 2, 
      width: "100%"
    },
    separatorAnimated:{
      height: 3, 
      backgroundColor: colors.default_dark, 
      position: 'absolute', 
      bottom: 0, 
      width: '33.3%',
    }
  });

  return (
    <>
      <ModalValidation
          displayedText={"Êtes-vous sûr de vouloir supprimer l'animal ?"}
          onConfirm={confirmDeletePet}
          setVisible={setModalValidationDeleteVisible}
          visible={modalValidationDeleteVisible}
          title={"Suppression d'un animal"}
      />
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
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
            <TouchableOpacity style={{width: "33.3%", alignItems: "center", justifyContent: "center", flexDirection: "row"}} onPress={() => { setActiveRubrique(0); moveSeparator(0); }}>
              <Entypo name="info-with-circle" size={20} color={activeRubrique === 0 ? colors.default_dark : colors.quaternary} style={{marginRight: 5}}/>
              <Text style={[{color: activeRubrique === 0 ? colors.default_dark : colors.quaternary}, styles.textFontMedium]}>Informations</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: "33.3%", alignItems: "center", justifyContent: "center", flexDirection: "row"}} onPress={() => { setActiveRubrique(1); moveSeparator(1); }}>
              <MaterialCommunityIcons name="clipboard-pulse-outline" size={20} color={activeRubrique === 1 ? colors.default_dark : colors.quaternary} style={{marginRight: 5}}/>
              <Text style={[{color: activeRubrique === 1 ? colors.default_dark : colors.quaternary}, styles.textFontMedium]}>Physique</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: "33.3%", alignItems: "center", justifyContent: "center", flexDirection: "row"}} onPress={() => { setActiveRubrique(2); moveSeparator(2); }}>
              <FontAwesome6 name="book-medical" size={20} color={activeRubrique === 2 ? colors.default_dark : colors.quaternary} style={{marginRight: 5}}/>
              <Text style={[{color: activeRubrique === 2 ? colors.default_dark : colors.quaternary}, styles.textFontMedium]}>Santé</Text>
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
          <AnimalBody 
            animal={selected[0]}
            onModify={onModify}
          />
        }
        {activeRubrique === 2 &&
          <MedicalBook 
            animal={selected[0]}
            navigation={navigation}
          />
        }
      </LinearGradient>
    </>
  );
};

module.exports = PetsScreen;