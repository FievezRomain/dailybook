import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabStack from "./TabStack";
import { SettingsScreen, NoteScreen, WishScreen, DiscoverPremiumScreen, AccountScreen, ContactScreen, ActionScreen } from "../screens";
import { FAB, useTheme } from 'react-native-paper';
import { StyleSheet } from 'react-native';
import React, { useState } from 'react';

const Stack = createNativeStackNavigator();

const AppStack = ({ navigation }) => {
  const { colors } = useTheme();
  const [previousScreen, setPreviousScreen] = useState(null);
  const [isActionScreenOpen, setIsActionScreenOpen] = useState(false);

  const styles = StyleSheet.create({
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 90,
      backgroundColor: colors.primary,
      borderRadius: 50,
    },
  });

  const handleFabPress = () => {
    if (!isActionScreenOpen) {
      // Ouvrir ActionScreen et stocker l'écran actuel
      setPreviousScreen(navigation.getState().routes[navigation.getState().index].name);
      navigation.navigate('Action');
    } else {
        navigation.navigate('Tab');
    }
    setIsActionScreenOpen(!isActionScreenOpen);
  };

  return (
    <>
      <Stack.Navigator>
          <Stack.Screen name="Tab" component={TabStack} options={{ headerShown: false }}/>
          <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Note" component={NoteScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Wish" component={WishScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="DiscoverPremium" component={DiscoverPremiumScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Action" component={ActionScreen} options={{ headerShown: false }}/>
      </Stack.Navigator>

      <FAB
        icon={isActionScreenOpen ? "close" : "plus"}
        style={styles.fab}
        color={colors.background}
        onPress={handleFabPress}
        size="medium"
      />
    </>
  );
}

export default AppStack;