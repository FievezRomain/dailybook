import { View, Text, StyleSheet, Image, Animated } from "react-native";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { TouchableOpacity } from "react-native";
import AnimalsPicker from "../components/AnimalsPicker";
import StatistiquesBloc from "../components/StatistiquesBloc";
import ObjectifsBloc from "../components/ObjectifsBloc";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import StatePicker from "../components/StatePicker"
import { SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import Toast from "react-native-toast-message";
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native";
import { useAnimaux } from "../providers/AnimauxProvider";

const StatsScreen = ({ navigation }) => {
  const { colors, fonts } = useTheme();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState({message1: "Mes", message2: "performances"})
  const arrayState = [
    {value: 'En cours', label: 'En cours', checkedColor: colors.background, uncheckedColor: colors.text, style: {borderRadius: 5}, rippleColor: "transparent"},
    {value: 'Terminé', label: 'Terminé', checkedColor: colors.background, uncheckedColor: colors.text, style: {borderRadius: 5}, rippleColor: "transparent"},
  ];
  const [temporality, setTemporality] = useState('En cours');
  const { animaux } = useAnimaux();
  const [selectedAnimal, setSelectedAnimal] = useState([]);
  const [activeRubrique, setActiveRubrique] = useState(0);
  const separatorPosition = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setMessages({message1: "Mes", message2: "Performances"});
      getAnimals();
    }, [])
  );

  const getAnimals = async () => {
    if(animaux.length !== 0){
      // On valorise l'animal selectionné par défaut au premier de la liste
      setSelectedAnimal([animaux[0]]);
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
      borderTopColor: colors.quaternary, 
      borderTopWidth: 0.4, 
      position: 'absolute', 
      bottom: 0, 
      height: 2, 
      width: "100%"
    },
    textFontBold:{
      fontFamily: fonts.labelLarge.fontFamily
    },
    textFontRegular:{
      fontFamily: fonts.default.fontFamily
    },
    textFontMedium:{
      fontFamily: fonts.labelMedium.fontFamily
    },
    separatorAnimated:{
      height: 3, 
      backgroundColor: colors.accent, 
      position: 'absolute', 
      bottom: 0, 
      width: '50%',
    },
    textDefaultTouchableOpacity:{
      color: colors.background
    },
    buttonTouchableOpacity:{
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 5,
      marginRight: 5,
    },
    fondDefaultTouchableOpacity:{
      backgroundColor: colors.neutral,
    },
    fondSelectedTouchableOpacity:{
      backgroundColor: colors.accent
    },
    contentContainer:{
      flex: 1,
      display: "flex",
      alignSelf: "center",
      height: "100%",
      width: "100%",
      borderRadius: 10,
    },
    temporalityIndicator:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-end",
      width: "100%",
      alignSelf: "center",
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 15,
      top: 5,
      zIndex: 1,
    },
    bloc:{
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 10,
      shadowColor: "black",
      shadowOpacity: 0.1,
      elevation: 1,
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
      backgroundColor: colors.onSurface
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
  
  });

  return (
    <>
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
        <TopTab message1={messages.message1} message2={messages.message2} />
        <View style={{display: "flex", alignContent: "flex-start", justifyContent: "flex-start", alignItems: "flex-start", marginTop: 20}}>
            <AnimalsPicker
              animaux={animaux}
              setSelected={setSelectedAnimal}
              selected={selectedAnimal}
              mode="single"
            />
        </View>
        <View style={styles.rubriqueContainer}>
          <View style={styles.iconsContainer}>
            <TouchableOpacity style={{width: "50%", alignItems: "center", justifyContent: "center", flexDirection: "row"}} onPress={() => { setActiveRubrique(0); moveSeparator(0); }}>
              <SimpleLineIcons name="target" size={20} color={activeRubrique === 0 ? colors.accent : colors.quaternary} style={{marginRight: 5}}/>
              <Text style={[{color :activeRubrique === 0 ? colors.accent : colors.quaternary}, styles.textFontMedium]}>Objectifs</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{width: "50%", alignItems: "center", flexDirection: "row", justifyContent: "center"}} onPress={() => { setActiveRubrique(1); moveSeparator(1); }}>
              <FontAwesome name="pie-chart" size={20} color={activeRubrique === 1 ? colors.accent : colors.quaternary} style={{marginRight: 5}}/>
              <Text style={[{color: activeRubrique === 1 ? colors.accent : colors.quaternary}, styles.textFontMedium]}>Statistiques</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.separatorFix}></View>
          <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] }) }]} />
        </View>
        <View style={styles.contentContainer}>

          
          <View style={styles.temporalityIndicator}>
            <StatePicker
              arrayState={arrayState}
              handleChange={onTemporalityChange}
              defaultState={temporality}
              color={colors.secondaryContainer}
            />
          </View>

          {activeRubrique === 0 ?
            <ObjectifsBloc
              animaux={animaux}
              selectedAnimal={selectedAnimal}
              temporality={temporality}
              navigation={navigation}
            />
          :
            <StatistiquesBloc/>
          }
        </View>
      </LinearGradient>
    </>
    );
}

module.exports = StatsScreen;