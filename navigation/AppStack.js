import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabStack from "./TabStack";
import { SettingsScreen, NoteScreen, WishScreen, DiscoverPremiumScreen, AccountScreen, ContactScreen } from "../screens";
import { FAB, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { CalendarProvider } from "../providers/CalendarProvider";
import AddingButton from "../components/AddingButton";

const Stack = createNativeStackNavigator();

const AppStack = ({ navigation }) => {

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
        </Stack.Navigator>

        <AddingButton navigation={navigation}/>
      </CalendarProvider>
    </>
  );
}

export default AppStack;