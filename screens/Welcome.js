import { View, Text, StyleSheet, Image } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import React, { useState, useContext, useEffect } from 'react';

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
        <Image style={styles.image} />
        <TopTab message1={messages.message1} message2={messages.message2}/>
        <View>
          <Image style={styles.imagePrez} source={require("../assets/welcome_prez.png")} />
        </View>
      </>
      );
}

const styles = StyleSheet.create({
  imagePrez:{
    height: "90%",
    width: "100%",
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
    backgroundColor:  Variables.blanc
  },
})

module.exports = WelcomeScreen;