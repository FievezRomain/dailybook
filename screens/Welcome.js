import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import EventsBloc from "../components/EventsBloc";
import ObjectifsInProgressBloc from "../components/ObjectifsInProgressBloc";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native";
import { useEvents } from "../providers/EventsProvider";
import { useObjectifs } from "../providers/ObjectifsProvider";
import { isAfter, isEqual, startOfDay } from 'date-fns';

const WelcomeScreen = ({ navigation })=> {
  const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState({message1 :"Bienvenue", message2: ""});
    const { events } = useEvents();
    const { objectifs, setObjectifs } = useObjectifs();
          
    useFocusEffect(
      useCallback(() => {
          setMessages({message1: "Bienvenue", message2: currentUser.displayName != null && currentUser.displayName != undefined ? currentUser.displayName.slice(0,17) : currentUser.displayName});
          //getEventsForUser();
          //getObjectifsForUser();
      }, [])
    );

    /* const getEventsForUser = async () => {
      try {
        const result = await eventsServiceInstance.getEvents(currentUser.email);
        setEvents(result);
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
    } */

      const getObjectifsInProgress = () => {
        if( objectifs !== undefined && Array.isArray(objectifs) ){
          return objectifs.filter( (item) =>  item.sousEtapes.some(etape => etape.state === false) && 
            (
              isAfter( startOfDay(new Date(item.datefin)), startOfDay(new Date()) ) 
              ||
              isEqual( startOfDay(new Date(item.datefin)), startOfDay(new Date()) )
            ) 
          );
        }
        return undefined;
      }

    const convertDateToText = () => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateObject = new Date();
      const dateText = dateObject.toLocaleDateString("fr-FR", options);
    
      return dateText;
    };

    const convertDayDateToText = () => {
      var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      var dateObject  = new Date();
      var dateText = String(dateObject.toLocaleDateString("fr-FR", options));
      dateText = String(dateText.split(" ", 1));
      return dateText.charAt(0).toUpperCase() + dateText.slice(1);;
    };

    const handleObjectifChange = (objectif) => {
      let updatedObjectifs = [];
      updatedObjectifs = [... objectifs];

      var index = updatedObjectifs.findIndex((a) => a.id == objectif.id);
      updatedObjectifs[index] = objectif;
      //setObjectifs(updatedObjectifs);

    }

    const handleObjectifDelete = (objectif) => {
      let updatedObjectifs = [];
      updatedObjectifs = [... objectifs];

      var index = updatedObjectifs.findIndex((a) => a.id == objectif.id);
      updatedObjectifs.splice(index, 1);
      //setObjectifs(updatedObjectifs);
    }

    const handleEventChange = async () => {
      //setEvents(await eventService.getEvents(currentUser.email));

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
        backgroundColor: colors.background,
      },
      svgCurve:{
        position: 'absolute',
        width: Dimensions.get('window').width
      },
      summaryContainer:{
        marginTop: 15,
        marginLeft: 20
      },
      summary:{
        fontSize: 20,
        color: colors.default_dark
      },
    });

    return (
      <>
        <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
          <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: colors.quaternary }}>
            <View style={{flex: 1}}>
              <TopTab withBackground={false} withLogo={true}/>
              <View style={styles.summaryContainer}>
                  <Text style={[styles.summary, , {fontFamily: fonts.bodyMedium.fontFamily, marginBottom: 2}]}>{messages.message1} {messages.message2}</Text>
                  <Text style={[styles.summary, {fontFamily: fonts.bodySmall.fontFamily}]}>{convertDayDateToText()} {convertDateToText()}</Text>
              </View>
              <View style={{marginTop: 10, paddingBottom: 10}}>
                    <EventsBloc 
                      events={events}
                      handleEventsChange={handleEventChange}
                    />
                    <ObjectifsInProgressBloc
                      objectifs={getObjectifsInProgress()}
                      handleObjectifChange={handleObjectifChange}
                      handleObjectifDelete={handleObjectifDelete}
                    />
              </View>
              {/* <View style={{width: "90%", marginBottom: 30, alignSelf: "center", backgroundColor: "white", shadowColor: "black", shadowOpacity: 0.1, elevation: 1, shadowOffset: {width: 0,height: 1}, borderRadius: 5}}>
                <LinearGradient colors={[colors.text, colors.default_dark]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} locations={[0, 1]} style={{flex: 1, padding: 20, borderRadius: 5}}>
                  <Text style={{fontFamily: fonts.bodyLarge.fontFamily, color: colors.background, textAlign: "center", marginBottom: 5}}>Avez-vous quelque chose de prévu ?</Text>
                  <Text style={{fontFamily: fonts.default.fontFamily, color: colors.background, textAlign: "center", marginBottom: 15}}>Enregistrez toutes les informations ici</Text>
                  <View style={{width: "70%", alignSelf: "center"}}>
                    <Button
                      onPress={() => navigation.navigate("ActionButton")}
                      size={"s"}
                      type={"quinary"}
                      isLong={false}
                      isUppercase={false}
                    >
                      <Text style={{fontFamily: fonts.bodyLarge.fontFamily}}>Ajouter un élément</Text>
                    </Button>
                  </View>
                </LinearGradient>
              </View> */}
              
            </View>
          </ScrollView>
        </LinearGradient>
      </>
      );
}

module.exports = WelcomeScreen;