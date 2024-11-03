import { View, Image, StyleSheet, Text } from "react-native";
import { useEffect, useState } from "react";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import AnimalsService from "../services/AnimalsService";
import * as Font from 'expo-font';
import LoggerService from "../services/LoggerService";
import Constants from 'expo-constants';
import { useTheme } from 'react-native-paper';

const LoadingScreen = ({ navigation })=> {
  const { colors, fonts } = useTheme();
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
                LoggerService.log("Connexion réussie");
                navigation.navigate("App");
              } else{
                navigation.navigate("FirstPageAddAnimal");
              }
            } else if(!currentUser){
              navigation.navigate("Home");
            }
          }
          
        } catch (error) {
            LoggerService.log( "Erreur dans le traitement pour vérifier la connexion de l'utilisateur : \n" 
            + "Valeur du currentUser : " + currentUser + "\n "
            + "Valeur de la vérification de l'email : " + emailVerified + "\n "
            + "Etat du chargement : " + loading + "\n "
            + "Etat de la mise à jour du cache : " + cacheUpdated + "\n "
            + "Message d'erreur : " +  error.message );
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
        fontFamily: fonts.default.fontFamily
      }
    });

    return (
      <View style={styles.loadingEvent}>
          <Image
            style={styles.loaderEvent}
            source={require("../assets/loader.gif")}
          />
        <View style={{position: "absolute", bottom: 0, marginBottom: 50}}>
          <View style={{flexDirection: "row"}}>
            <Text style={[{color: colors.quaternary, fontSize: 22}, styles.textFontRegular]}>From</Text>
            <Text style={[{color: colors.neutral, fontSize: 22}, styles.textFontRegular]}> Vasco & Co</Text>
          </View>
          <View style={{flexDirection: "column"}}>
            <Text style={[styles.textFontRegular, {color: colors.neutral, textAlign: "center"}]}>{Constants.expoConfig?.version}</Text>
          </View>
        </View>
      </View>
    );
}

module.exports = LoadingScreen;