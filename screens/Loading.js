import { View, Text } from "react-native";
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
        <View>
            <Text>
            LoadingScreen screen
            </Text>
        </View>
    );
}

module.exports = LoadingScreen;