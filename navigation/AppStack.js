import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import { WelcomeScreen } from '../screens';

const Stack = createNativeStackNavigator();

export const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Welcome' component={WelcomeScreen} />
    </Stack.Navigator>
  );
};