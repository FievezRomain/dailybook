import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen, SignInScreen, SignUpScreen, LoadingScreen, VerifyEmailScreen, FirstPageAddAnimalScreen } from "../screens";
import AppStack from './AppStack';
import { View } from "react-native";
import Toast from "react-native-toast-message";

const Stack = createNativeStackNavigator();

const AuthStack = () => {

  return (
    <>
    <View style={{zIndex:999}}><Toast/></View>
    <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="App" component={AppStack} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Login" component={SignInScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Register" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="FirstPageAddAnimal" component={FirstPageAddAnimalScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
    </>
  );
};

export default AuthStack;