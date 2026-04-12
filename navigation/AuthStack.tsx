import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Portal } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import type { AuthStackParamList } from './types';
import { HomeScreen, SignInScreen, SignUpScreen, LoadingScreen, VerifyEmailScreen, FirstPageAddAnimalScreen } from './screens';
import AppStack from './AppStack';

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
      <Portal><Toast /></Portal>
    </>
  );
}

export default AuthStack;
