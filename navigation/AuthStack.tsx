import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import type { AuthStackParamList } from './types';
import HomeScreen from '../features/auth/screens/HomeScreen';
import SignInScreen from '../features/auth/screens/SignInScreen';
import SignUpScreen from '../features/auth/screens/SignUpScreen';
import LoadingScreen from '../features/auth/screens/LoadingScreen';
import VerifyEmailScreen from '../features/auth/screens/VerifyEmailScreen';
import FirstPageAddAnimalScreen from '../features/animals/screens/FirstPageAddAnimalScreen';
import { AppStack } from './AppStack';
//import { HomeScreen, SignInScreen, SignUpScreen, LoadingScreen, VerifyEmailScreen, FirstPageAddAnimalScreen } from './screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <>
      <Stack.Navigator initialRouteName="Loading">
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
        <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="App" component={AppStack} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={SignInScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={SignUpScreen} options={{ headerShown: false }} />
        <Stack.Screen name="FirstPageAddAnimal" component={FirstPageAddAnimalScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
      <Toast />
    </>
  );
}
export default AuthStack;