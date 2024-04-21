import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import React, { useState, useContext, useEffect } from 'react';
import EventsBloc from "../components/EventsBloc";
import ObjectifsBloc from "../components/ObjectifsBloc";
import WavyHeader from "../components/WavyHeader";

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
      <View style={{flex: 1}}>
        <WavyHeader
            customBgColor={Variables.alezan}
            customHeight={160}
            customTop={130}
            customWavePattern={"M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"}
            customStyles={styles.svgCurve}
          />
        <TopTab message1={messages.message1} message2={messages.message2} withBackground={true}/>
        <View style={{marginTop: 100}}>
            <EventsBloc />
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
  svgCurve:{
    position: 'absolute',
    width: Dimensions.get('window').width
  },
})

module.exports = WelcomeScreen;