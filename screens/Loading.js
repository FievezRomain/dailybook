import { View, Image, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import variables from "../components/styles/Variables";
import AnimalsService from "../services/AnimalsService";
import * as Font from 'expo-font';

const LoadingScreen = ({ navigation })=> {
    const { cacheUpdated, currentUser, loading, emailVerified, reloadUser } = useAuth();
    const animalService = new AnimalsService();

    useEffect(() => {

      const checkAuth = async () => {
        try {
          if( !loading ){
            // On force la MAJ de l'utilisateur pour recharger les infos comme l'emailVerified
            //currentUser && !emailVerified ? await reloadUser(currentUser) : null;
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

      // Vérification de l'auth
      checkAuth();

      const unsubscribe = navigation.addListener("focus", () => {
        checkAuth();
      });
      return unsubscribe;
      
    }, [currentUser, cacheUpdated, navigation, loading, emailVerified]);

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
          <Text style={[{color: variables.rouan, fontSize: 22}, styles.textFontRegular]}>From</Text>
          <Text style={[{color: variables.isabelle, fontSize: 22}, styles.textFontRegular]}> Vasco & Co</Text>
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
  textFontRegular: {
    fontFamily: variables.fontRegular
  }
})

module.exports = LoadingScreen;