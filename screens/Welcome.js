import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import React, { useState, useContext, useEffect } from 'react';
import EventsBloc from "../components/EventsBloc";
import ObjectifsBloc from "../components/ObjectifsBloc";
import WavyHeader from "../components/WavyHeader";
import EventService from "../services/EventService";
import ObjectifService from "../services/ObjectifService";
import ObjectifsInProgressBloc from "../components/ObjectifsInProgressBloc";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useAuth } from "../providers/AuthenticatedUserProvider";

const WelcomeScreen = ({ navigation })=> {
    const { currentUser } = useAuth();
    const [messages, setMessages] = useState({message1 :"Bienvenue,", message2: ""});
    const eventService = new EventService();
    const objectifService = new ObjectifService();
    const [events, setEvents] = useState([]);
    const [objectifs, setObjectifs] = useState([]);

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        setMessages({message1: "Bienvenue,", message2: currentUser.displayName});
        getEventsForUser();
        getObjectifsForUser();
      });
      return unsubscribe;
    }, [navigation]);

    const getEventsForUser = async () => {
      try {
        const result = await eventService.getEvents(currentUser.id);
        if (result.length !== 0) {
          setEvents(result);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    }

    const getObjectifsForUser = async () => {
      try {
        const result = await objectifService.getObjectifs(currentUser.id);
        if (result.length !== 0) {
          setObjectifs(result);
        }
      } catch (error) {
        console.error("Error fetching objectifs:", error);
      }
    }

    const convertDateToText = () =>{
      options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      dateObject  = new Date();
      dateText = String(dateObject.toLocaleDateString("fr-FR", options));
      dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
      return dateText;
    }

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

    return (
      <>
      <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: Variables.isabelle }}>
      <View style={{flex: 1}}>
        <WavyHeader
            customBgColor={Variables.rouan}
            customHeight={100}
            customTop={90}
            customWavePattern={"M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"}
            customStyles={styles.svgCurve}
          />
        <TopTab message1={messages.message1} message2={messages.message2} withBackground={true}/>
        <View style={styles.summaryContainer}>
            <Text style={styles.summary}>{convertDateToText()}</Text>
        </View>
        <View style={{marginTop: 20}}>
              <EventsBloc 
                events={events}
              />
              <ObjectifsInProgressBloc
                objectifs={objectifs}
                handleObjectifChange={handleObjectifChange}
                handleObjectifDelete={handleObjectifDelete}
              />
        </View>
      </View>
      </ScrollView>
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
    backgroundColor: Variables.default,
  },
  svgCurve:{
    position: 'absolute',
    width: Dimensions.get('window').width
  },
  summaryContainer:{
    paddingLeft: 30,
    top: -5
  },
  summary:{
    color: Variables.alezan,
    fontWeight: "bold",
  },
})

module.exports = WelcomeScreen;