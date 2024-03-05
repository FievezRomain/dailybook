import { View, Text, StyleSheet, Image } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect } from 'react';
import { TouchableOpacity } from "react-native";
import AnimalsPicker from "../components/AnimalsPicker";
import AnimalsService from "../services/AnimalsService";
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import StatistiquesBloc from "../components/StatistiquesBloc";
import ObjectifsBloc from "../components/ObjectifsBloc";

const StatsScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [messages, setMessages] = useState({message1: "Mes", message2: "statistiques"})
  const [temporality, setTemporality] = useState("week");
  const [animaux, setAnimaux] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState([]);
  const [loadingObjectif, setLoadingObjectif] = useState(false);
  const animalsService = new AnimalsService;

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMessages({message1: "Mes", message2: "statistiques & objectifs"});
      getAnimals();
    });
    return unsubscribe;
  }, [navigation]);

  const getAnimals = async () => {
    // Si aucun animal est déjà présent dans la liste, alors
    if(animaux.length == 0){
      setLoadingObjectif(true);
      // On récupère les animaux de l'utilisateur courant
      var result = await animalsService.getAnimals(user.id);
      setLoadingObjectif(false);
      // Si l'utilisateur a des animaux, alors
      if(result.rowCount !== 0){
        // On valorise l'animal selectionné par défaut au premier de la liste
        setSelectedAnimal([result.rows[0]]);

        // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
        setAnimaux(result.rows);
      }
    }
  };

  const onTemporalityChange = (value) => {
    setTemporality(value);
  }

  return (
    <>
      {loadingObjectif && (
        <View style={styles.loadingEvent}>
          <Image
            style={styles.loaderEvent}
            source={require("../assets/loader.gif")}
          />
        </View>
      )}
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
      <View style={styles.contentContainer}>
        
        <View style={styles.temporalityIndicator}>
          <TouchableOpacity style={[styles.buttonTouchableOpacity, temporality == "week" ? styles.fondSelectedTouchableOpacity : styles.fondDefaultTouchableOpacity]} onPress={() => onTemporalityChange("week")}>
            <Text style={styles.textDefaultTouchableOpacity}>Semaine</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonTouchableOpacity, temporality == "month" ? styles.fondSelectedTouchableOpacity : styles.fondDefaultTouchableOpacity]} onPress={() => onTemporalityChange("month")}>
            <Text style={styles.textDefaultTouchableOpacity}>Mois</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttonTouchableOpacity, temporality == "year" ? styles.fondSelectedTouchableOpacity : styles.fondDefaultTouchableOpacity]} onPress={() => onTemporalityChange("year")}>
            <Text style={styles.textDefaultTouchableOpacity}>Année</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bloc}>
          <ObjectifsBloc
            animaux={animaux}
            selectedAnimal={selectedAnimal}
            setLoading={setLoadingObjectif}
            temporality={temporality}
            navigation={navigation}
          />
          <StatistiquesBloc/>
        </View>
      </View>
    </>
    );
}

const styles = StyleSheet.create({
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
    width: "85%",
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
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: Variables.aubere
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