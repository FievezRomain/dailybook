import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigationState, type NavigationState, type PartialState } from '@react-navigation/native';
import type { AppStackParamList } from './types';
import TabStack from './TabStack';
import {
  SettingsScreen,
  NoteScreen,
  WishScreen,
  DiscoverPremiumScreen,
  AccountScreen,
  ContactScreen,
  GroupListScreen,
  GroupDetailScreen,
  NotificationScreen,
  AnimalDetailScreen,
  AnimalAddWizardScreen,
  EventEntryScreen,
  EventAIScreen,
  EventTypeScreen,
  EventFormScreen,
  EventAnimalsScreen,
  EventOptionsScreen,
  NoteAIScreen,
  ObjectifListScreen,
  ObjectifAddScreen,
} from './screens';
import AddingButton from '../shared/components/inputs/AddingButton';

const Stack = createNativeStackNavigator<AppStackParamList>();

const HIDDEN_FAB_ROUTES = ['Settings', 'Account', 'DiscoverPremium'];

function getActiveRouteName(state: NavigationState | PartialState<NavigationState>): string | null {
  if (!state?.routes?.length) return null;
  const route = state.routes[state.index ?? 0];
  if (route.state) return getActiveRouteName(route.state as NavigationState);
  return route.name;
}

export function AppStack({ navigation }: { navigation?: any }) {
  const currentRouteName = useNavigationState((state) => getActiveRouteName(state));
  const showFAB = !HIDDEN_FAB_ROUTES.includes(currentRouteName ?? '');

  return (
    <>
      <Stack.Navigator>
        <Stack.Screen name="Tab" component={TabStack} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Note" component={NoteScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Contact" component={ContactScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Wish" component={WishScreen} options={{ headerShown: false }} />
        <Stack.Screen name="DiscoverPremium" component={DiscoverPremiumScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Account" component={AccountScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GroupList" component={GroupListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="GroupDetail" component={GroupDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AnimalDetail" component={AnimalDetailScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AnimalAddWizard" component={AnimalAddWizardScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventEntry" component={EventEntryScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventAI" component={EventAIScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventWizardType" component={EventTypeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventWizardForm" component={EventFormScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventWizardAnimals" component={EventAnimalsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="EventWizardOptions" component={EventOptionsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="NoteAI" component={NoteAIScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ObjectifList" component={ObjectifListScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ObjectifAdd" component={ObjectifAddScreen} options={{ headerShown: false }} />
      </Stack.Navigator>

      {showFAB && <AddingButton navigation={navigation} />}
    </>
  );
}

export default AppStack;
