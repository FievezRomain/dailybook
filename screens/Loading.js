import { View, Image, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import variables from "../components/styles/Variables";
import AnimalsService from "../services/AnimalsService";
import * as Font from 'expo-font';

const LoadingScreen = ({ navigation })=> {
    const { cacheUpdated, currentUser, loading, emailVerified } = useAuth();
    const [fontsLoaded, setFontsLoaded] = useState(false);
    const animalService = new AnimalsService();

    useEffect(() => {

      const checkAuth = async () => {
        try {
          if(!loading && fontsLoaded){
            if(currentUser && !emailVerified){
              navigation.navigate("VerifyEmail");
            }else if(currentUser && cacheUpdated){
              var animaux = await animalService.getAnimals(currentUser.email);
              if(Array.isArray(animaux) && animaux.length > 0){
                navigation.navigate("App");
              } else{
                navigation.navigate("FirstPageAddAnimal");
              }
            } else if(!currentUser){
              navigation.navigate("Home");
            }
          }
          
        } catch (error) {
            console.error('Erreur :', error);
        }
      };

      // Chargement de la font
      if( !fontsLoaded ){
        loadFonts().then(() => setFontsLoaded(true));
      }

      // Vérification de l'auth
      checkAuth();
      
    }, [currentUser, cacheUpdated, navigation, loading, fontsLoaded]);   

    const loadFonts = () => {
      return Font.loadAsync({
        'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
        'Quicksand-Light': require('../assets/fonts/Quicksand-Light.ttf'),
        'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
        'Quicksand-Regular': require('../assets/fonts/Quicksand-Regular.ttf'),
        'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf')
      });
    };

    return (
      <View style={styles.loadingEvent}>
          <Image
            style={styles.logo}
            source={require("../assets/logo.png")}
          />
          <Image
            style={styles.loaderEvent}
            source={require("../assets/loader.gif")}
          />
        <View style={{position: "absolute", bottom: 0, marginBottom: 50, flexDirection: "row"}}>
          <Text style={{color: variables.rouan, fontFamily: "Quicksand", fontWeight: "bold", fontSize: 22}}>From</Text>
          <Text style={{color: variables.isabelle, fontFamily: "Quicksand", fontWeight: "bold", fontSize: 22}}> Vasco & Co</Text>
        </View>
      </View>
    );
}

const styles = StyleSheet.create({
  loaderEvent: {
    width: 150,
    height: 150
  },
  logo:{
    width: 250,
    height: 250
  },
  loadingEvent: {
    display: "flex",
    height: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
})

module.exports = LoadingScreen;