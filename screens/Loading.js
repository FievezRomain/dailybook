import { View, Image, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useAuth } from "../providers/AuthenticatedUserProvider";

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
            navigation.navigate("Login");
          }
        }
        
      } catch (error) {
          console.error('Erreur :', error);
      }
    }, [currentUser, cacheUpdated, navigation, loading]);   

    return (
      <View style={styles.loadingEvent}>
          <Image
          style={styles.loaderEvent}
          source={require("../assets/loader.gif")}
          />
      </View>
    );
}

const styles = StyleSheet.create({
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
})

module.exports = LoadingScreen;