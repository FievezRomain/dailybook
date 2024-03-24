import { View, Text, StyleSheet, Image } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import React, { useState, useContext, useEffect } from 'react';
import EventsBloc from "../components/EventsBloc";
import ObjectifsBloc from "../components/ObjectifsBloc";

const WelcomeScreen = ({ navigation })=> {
    const { user } = useContext(AuthenticatedUserContext);
    const [messages, setMessages] = useState({message1 :"Bienvenue,", message2: user.prenom})

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        setMessages({message1: "Bienvenue,", message2: user.prenom});
      });
      return unsubscribe;
    }, [navigation]);

    return (
      <>
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View style={{height: "100%", backgroundColor: Variables.isabelle}}>
          <View style={styles.image}>
            <View>
              <EventsBloc />
            </View>
          </View>
      </View>
        
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
})

module.exports = WelcomeScreen;