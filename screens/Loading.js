import { View, Image, StyleSheet } from "react-native";
import { useEffect, useContext } from "react";
import AuthService from "../services/AuthService";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";

const LoadingScreen = ({ navigation })=> {
    const authService = new AuthService;
    const { setUser } = useContext(AuthenticatedUserContext);

    useEffect(() => {
    
        authService.getUserLogged().then((myUser) => {
          if(myUser) {
            setUser(myUser)
            navigation.navigate("App");
          }else {
            navigation.navigate("Home");
          }
        }).catch()
        // authService.getUserLogged().then((user) => {
        //   if(user) {
        //     navigation.navigate("App")
        //   }
        // })
      }, []);    

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