import { View, Text } from "react-native";
import { useEffect } from "react";
import AuthService from "../services/AuthService";

const LoadingScreen = ({ navigation })=> {
    const authService = new AuthService;

    useEffect(() => {
    
        authService.getUser().then((myUser) => {
          if(myUser) {
            setUser(myUser)
            navigation.navigate("Welcome");
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
        <View>
            <Text>
            LoadingScreen screen
            </Text>
        </View>
    );
}

module.exports = LoadingScreen;