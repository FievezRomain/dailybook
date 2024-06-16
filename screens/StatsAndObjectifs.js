import { View, Text, StyleSheet, Image, Animated } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect, useRef } from 'react';
import { TouchableOpacity } from "react-native";
import AnimalsPicker from "../components/AnimalsPicker";
import AnimalsService from "../services/AnimalsService";
import StatistiquesBloc from "../components/StatistiquesBloc";
import ObjectifsBloc from "../components/ObjectifsBloc";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import TemporalityPicker from "../components/TemporalityPicker";
import { SimpleLineIcons, FontAwesome } from '@expo/vector-icons';

const StatsScreen = ({ navigation }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState({message1: "Mes", message2: "performances"})
  const list = [
    {title: "Semaine", id: "week"},
    {title: "Mois", id: "month"},
    {title: "Année", id: "year"}
  ];
  const [temporality, setTemporality] = useState(list[0]);
  const [animaux, setAnimaux] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState([]);
  const animalsService = new AnimalsService;
  const [activeRubrique, setActiveRubrique] = useState(0);
  const separatorPosition = useRef(new Animated.Value(0)).current;
  

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMessages({message1: "Mes", message2: "performances"});
      getAnimals();
    });
    return unsubscribe;
  }, [navigation]);

  const getAnimals = async () => {
    // Si aucun animal est déjà présent dans la liste, alors
    if(animaux.length == 0){
      // On récupère les animaux de l'utilisateur courant
      var result = await animalsService.getAnimals(currentUser.id);
      // Si l'utilisateur a des animaux, alors
      if(result.length !== 0){
        // On valorise l'animal selectionné par défaut au premier de la liste
        setSelectedAnimal([result[0]]);

        // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
        setAnimaux(result);
      }
    }
  };

  const onTemporalityChange = (value) => {
    setTemporality(value);
  };

  const moveSeparator = (index) => {
    Animated.timing(separatorPosition, {
      toValue: index,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  return (
    <>
      <Image style={styles.image}/>
      <TopTab message1={messages.message1} message2={messages.message2} />
      <View style={{display: "flex", alignContent: "flex-start", justifyContent: "flex-start", alignItems: "flex-start", marginTop: 20, marginBottom: 10}}>
          <AnimalsPicker
            animaux={animaux}
            setSelected={setSelectedAnimal}
            selected={selectedAnimal}
            mode="single"
          />
      </View>
      <View style={styles.rubriqueContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={{width: "50%", alignItems: "center"}} onPress={() => { setActiveRubrique(0); moveSeparator(0); }}>
            <SimpleLineIcons name="target" size={30} color={activeRubrique === 0 ? Variables.alezan : "gray"}/>
          </TouchableOpacity>
          <TouchableOpacity style={{width: "50%", alignItems: "center"}} onPress={() => { setActiveRubrique(1); moveSeparator(1); }}>
            <FontAwesome name="pie-chart" size={25} color={activeRubrique === 1 ? Variables.alezan : "gray"}/>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorFix}></View>
        <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] }) }]} />
      </View>
      <View style={styles.contentContainer}>

        
        <View style={styles.temporalityIndicator}>
          <TemporalityPicker
            arrayState={list}
            handleChange={onTemporalityChange}
            defaultState={temporality}
          />
        </View>

        {activeRubrique === 0 ?
          <ObjectifsBloc
            animaux={animaux}
            selectedAnimal={selectedAnimal}
            temporality={temporality.id}
            navigation={navigation}
          />
        :
          <StatistiquesBloc/>
        }
      </View>
    </>
    );
}

const styles = StyleSheet.create({
  iconsContainer:{
    display: "flex", 
    flexDirection: "row", 
    paddingVertical: 10
  },
  rubriqueContainer:{
    marginTop: 10,
    marginBottom: 10,
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
    width: '50%',
  },
  textDefaultTouchableOpacity:{
    color: Variables.blanc
  },
  buttonTouchableOpacity:{
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginRight: 5,
  },
  fondDefaultTouchableOpacity:{
    backgroundColor: Variables.isabelle,
  },
  fondSelectedTouchableOpacity:{
    backgroundColor: Variables.alezan
  },
  contentContainer:{
    flex: 1,
    display: "flex",
    alignSelf: "center",
    marginBottom: 30,
    height: "100%",
    width: "90%",
    borderRadius: 10,
  },
  temporalityIndicator:{
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    top: 5,
    zIndex: 1,
    marginRight: 5,
  },
  bloc:{
    flex: 1,
    backgroundColor: Variables.blanc,
    borderRadius: 10,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: {width:0, height:2}
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: Variables.default
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

})

module.exports = StatsScreen;