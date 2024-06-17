import { View, Image, StyleSheet, Text } from "react-native";
import { useEffect } from "react";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import variables from "../components/styles/Variables";

const LoadingScreen = ({ navigation })=> {
    const { cacheUpdated, currentUser, loading, emailVerified } = useAuth();

    useEffect(() => {
      try {
        if(!loading){
          if(currentUser && !emailVerified){
            navigation.navigate("VerifyEmail");
          }else if(currentUser && cacheUpdated){
            navigation.navigate("App");
          } else if(!currentUser){
            navigation.navigate("Home");
          }
        }
        
      } catch (error) {
          console.error('Erreur :', error);
      }
    }, [currentUser, cacheUpdated, navigation, loading]);   

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
          <Text style={{color: variables.rouan, fontWeight: "800", fontSize: 22, fontFamily: "Quicksand-Regular"}}>From</Text>
          <Text style={{color: variables.isabelle, fontWeight: "800", fontSize: 22, fontFamily: "Quicksand-Regular"}}> Vasco & Co</Text>
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