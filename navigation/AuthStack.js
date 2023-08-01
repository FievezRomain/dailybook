import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen, SignInScreen, SignUpScreen, LoadingScreen } from "../screens";
import AppStack from './AppStack';
import AuthService from "../services/AuthService";
import { useContext, useEffect } from "react";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import { useNavigation } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const authService = new AuthService;
  const { setUser } = useContext(AuthenticatedUserContext);
  const navigation = useNavigation();
  const routeWithoutListen = ["Loading", "Home", "Login", "Register"];

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      if(!(routeWithoutListen.includes(navigation.getCurrentRoute().name))){
        authService.getUser().then((myUser) => {
          setUser(myUser);
        })
      }
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator>
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="App" component={AppStack} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={SignInScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={SignUpScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
};

export default AuthStack;