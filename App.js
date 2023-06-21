import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AuthService from "./services/AuthService";
import { HomeScreen, WelcomeScreen, SignInScreen, SignUpScreen } from "./screens";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { AuthenticatedUserProvider } from "./providers/AuthenticatedUserProvider";
import { useContext } from "react";
import LoadingScreen from "./screens/Loading";

export default function App() {

  const Stack = createNativeStackNavigator();
  /*const navigation = useNavigation();
  const authService = new AuthService;
  const { setUser } = useContext(AuthenticatedUserProvider);

  useEffect( async () => {
    const unsubscribe = navigation.addListener("state", () => {
      authService.getUser().then((myUser) => {
        setUser(myUser);
      })
    });
    return unsubscribe;
  }, [navigation]) */



  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={SignInScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={SignUpScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};
