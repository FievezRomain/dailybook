import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect } from 'react';
import EventsBloc from "../components/EventsBloc";
import WavyHeader from "../components/WavyHeader";
import EventService from "../services/EventService";
import ObjectifService from "../services/ObjectifService";
import ObjectifsInProgressBloc from "../components/ObjectifsInProgressBloc";
import Toast from "react-native-toast-message";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import LoggerService from "../services/LoggerService";
import Constants from 'expo-constants';
import { LinearGradient } from "expo-linear-gradient";
import Button from "../components/Button";

const WelcomeScreen = ({ navigation })=> {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState({message1 :"Bienvenue", message2: ""});
    const eventService = new EventService();
    const objectifService = new ObjectifService();
    const [events, setEvents] = useState([]);
    const [objectifs, setObjectifs] = useState([]);

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        setMessages({message1: "Bienvenue", message2: currentUser.displayName != null && currentUser.displayName != undefined ? currentUser.displayName.slice(0,17) : currentUser.displayName});
        getEventsForUser();
        getObjectifsForUser();
      });
      return unsubscribe;
    }, [navigation]);

    const getEventsForUser = async () => {
      try {
        const result = await eventService.getEvents(currentUser.email);
        if (result.length !== 0) {
          setEvents(result);
        }
      } catch (error) {
        LoggerService.log( "Erreur lors de la récupération des events : " + error.message );
        console.error("Error fetching events:", error);
      }
    }

    const getObjectifsForUser = async () => {
      try {
        const result = await objectifService.getObjectifs(currentUser.email);
        if (result.length !== 0) {
          setObjectifs(result);
        }
      } catch (error) {
        LoggerService.log( "Erreur lors de la récupération des objectifs : " + error.message );
        console.error("Error fetching objectifs:", error);
      }
    }

    const convertDateToText = () => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateObject = new Date();
      const dateText = dateObject.toLocaleDateString("fr-FR", options);
    
      return dateText;
    };

    const convertDayDateToText = () => {
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateObject  = new Date();
      dateText = String(dateObject.toLocaleDateString("fr-FR", options));
      dateText = String(dateText.split(" ", 1));
      return dateText.charAt(0).toUpperCase() + dateText.slice(1);;
    };

    const handleObjectifChange = (objectif) => {
      let updatedObjectifs = [];
      updatedObjectifs = [... objectifs];

      var index = updatedObjectifs.findIndex((a) => a.id == objectif.id);
      updatedObjectifs[index] = objectif;
      setObjectifs(updatedObjectifs);
    }

    const handleObjectifDelete = (objectif) => {
      let updatedObjectifs = [];
      updatedObjectifs = [... objectifs];

      var index = updatedObjectifs.findIndex((a) => a.id == objectif.id);
      updatedObjectifs.splice(index, 1);
      setObjectifs(updatedObjectifs);
    }

    const handleEventChange = (idEventModified, response) => {
      let updatedEvents = [];
      updatedEvents = [... events];

      var index = updatedEvents.findIndex((a) => a.id == idEventModified);
      updatedEvents[index] = response;
      setEvents(updatedEvents);
    }

    const handleEventDelete = (event) => {
      let updatedEvents = [];
      updatedEvents = [... events];

      // Si l'event à des enfants, on supprime les enfants du tableau des events
      var eventsEnfants = [];
      updatedEvents.map(element => {
          if( element.idparent === event.id ){
              eventsEnfants.push(element);
          }
      })

      eventsEnfants.map(element => {
          var index = updatedEvents.findIndex(objet => objet.id === element.id);

          if(index !== -1){
            updatedEvents.splice(index, 1);
          }

      })

      // Suppression de l'event parent suite à la suppression des enfants
      var index = updatedEvents.findIndex((a) => a.id == event.id);
      updatedEvents.splice(index, 1);
      setEvents(updatedEvents);
    }

    return (
      <>
        <LinearGradient colors={[Variables.blanc, Variables.default]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: Variables.isabelle }}>
            <View style={{flex: 1}}>
              <Image
                source={require('../assets/fond_accueil.png')}
                style={{width: "100%", height: 700, position: "absolute"}}
              />
              
              <TopTab message1={messages.message1} message2={messages.message2} withBackground={true}/>
              <View style={styles.summaryContainer}>
                  <Text style={[styles.summary, {fontFamily: Variables.fontRegular}]}>{convertDayDateToText()}</Text>
                  <Text style={[styles.summary, {fontFamily: Variables.fontBold}]}>{convertDateToText()}</Text>
              </View>
              <View style={{marginTop: 60, paddingBottom: 10}}>
                    <EventsBloc 
                      events={events}
                      handleDeletedEvent={handleEventDelete}
                      handleModifiedEvent={handleEventChange}
                    />
                    <ObjectifsInProgressBloc
                      objectifs={objectifs}
                      handleObjectifChange={handleObjectifChange}
                      handleObjectifDelete={handleObjectifDelete}
                    />
              </View>
              <View style={{width: "90%", marginBottom: 30, alignSelf: "center", backgroundColor: "white", shadowColor: "black", shadowOpacity: 0.1, elevation: 1, shadowOffset: {width: 0,height: 1}, borderRadius: 5}}>
                <LinearGradient colors={[Variables.bai_brun, Variables.bai]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 1]} style={{flex: 1, padding: 20, borderRadius: 5}}>
                  <Text style={{fontFamily: Variables.fontBold, color: Variables.blanc, textAlign: "center", marginBottom: 5}}>Avez-vous quelque chose de prévu ?</Text>
                  <Text style={{fontFamily: Variables.fontRegular, color: Variables.blanc, textAlign: "center", marginBottom: 15}}>Enregistrez toutes les informations ici</Text>
                  <View style={{width: "70%", alignSelf: "center"}}>
                    <Button
                      onPress={() => navigation.navigate("ActionButton")}
                      size={"s"}
                      type={"quinary"}
                      isLong={false}
                      isUppercase={false}
                    >
                      <Text style={{fontFamily: Variables.fontBold}}>Ajouter un élément</Text>
                    </Button>
                  </View>
                </LinearGradient>
              </View>
              
            </View>
          </ScrollView>
        </LinearGradient>
      </>
      );
}

const styles = StyleSheet.create({
  imagePrez:{
    height: "90%",
    width: "100%",
  },
  contentContainer:{
    display: "flex",
    height: "90%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    height: "100%",
    backgroundColor: Variables.blanc,
  },
  svgCurve:{
    position: 'absolute',
    width: Dimensions.get('window').width
  },
  summaryContainer:{
    marginTop: 15,
    top: -5
  },
  summary:{
    color: Variables.blanc,
    textAlign: "center",
    fontSize: 20,
  },
})

module.exports = WelcomeScreen;