import { View, Text, StyleSheet, Image } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect } from 'react';

const StatsScreen = ({ navigation }) => {
  const [messages, setMessages] = useState({message1: "Mes", message2: "statistiques"})

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMessages({message1: "Mes", message2: "statistiques"});
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <>
      <Image style={styles.image} source={require("../assets/wallpaper_addEvent.jpg")} />
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View>
        <Image style={styles.imagePrez} source={require("../assets/stats_prez.png")} />
      </View>
    </>
    );
}

const styles = StyleSheet.create({
  imagePrez:{
    height: "90%",
    width: "100%",
    marginTop: 10
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
})

module.exports = StatsScreen;