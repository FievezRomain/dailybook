import * as React from 'react';
import { createStackNavigator } from '@react-navigation/native';

import { SignInScreen, SignUpScreen } from '../screens';

const Stack = createStackNavigator();

export const AuthStack = () => {
  
  return (
    <Stack.Navigator
      initialRouteName='SignIn'
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name='SignIn' component={SignInScreen} />
      <Stack.Screen name='SignUp' component={SignUpScreen} />
    </Stack.Navigator>
  );
};