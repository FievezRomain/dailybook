import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigationState } from '@react-navigation/native';
import TabStack from "./TabStack";
import { SettingsScreen, NoteScreen, WishScreen, DiscoverPremiumScreen, AccountScreen, ContactScreen, GroupListScreen } from "../screens";
import { FAB, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { CalendarProvider } from "../providers/CalendarProvider";
import AddingButton from "../components/AddingButton";

const Stack = createNativeStackNavigator();

const AppStack = ({ navigation }) => {

  const getActiveRouteName = (state) => {
    if (!state || !state.routes || state.routes.length === 0) {
      return null;
    }
    const route = state.routes[state.index]; // Route active au niveau actuel
    if (route.state) {
      // Si la route contient un état imbriqué, on continue de descendre
      return getActiveRouteName(route.state);
    }
    return route.name; // Nom de la route actuelle
  };

  const currentRouteName = useNavigationState((state) => getActiveRouteName(state));

  return (
    <>
      <CalendarProvider>
        <Stack.Navigator>
            <Stack.Screen name="Tab" component={TabStack} options={{ headerShown: false }}/>
            <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Note" component={NoteScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Wish" component={WishScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="DiscoverPremium" component={DiscoverPremiumScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="GroupList" component={GroupListScreen} options={{ headerShown: false }}/>
        </Stack.Navigator>
        
        {currentRouteName !== "Settings" && currentRouteName !== "Account" && currentRouteName !== "DiscoverPremium" && <AddingButton navigation={navigation}/>}
      </CalendarProvider>
    </>
  );
}

export default AppStack;