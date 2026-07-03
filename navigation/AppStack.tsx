import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

function withFab<P extends object>(Screen: React.ComponentType<P>, showFab = true) {
  return function ScreenWithFab(props: P) {
    return (
      <>
        <Screen {...props} />
        {showFab && <AddingButton />}
      </>
    );
  };
}

const TabWithFab = withFab(TabStack);
const SettingsWithoutFab = withFab(SettingsScreen, false);
const NoteWithFab = withFab(NoteScreen);
const ContactWithFab = withFab(ContactScreen);
const WishWithFab = withFab(WishScreen);
const DiscoverPremiumWithoutFab = withFab(DiscoverPremiumScreen, false);
const AccountWithoutFab = withFab(AccountScreen, false);
const GroupListWithFab = withFab(GroupListScreen);
const GroupDetailWithFab = withFab(GroupDetailScreen);
const NotificationWithFab = withFab(NotificationScreen);
const AnimalDetailWithFab = withFab(AnimalDetailScreen);
const AnimalAddWizardWithFab = withFab(AnimalAddWizardScreen);
const EventEntryWithFab = withFab(EventEntryScreen);
const EventAIWithFab = withFab(EventAIScreen);
const EventTypeWithFab = withFab(EventTypeScreen);
const EventFormWithFab = withFab(EventFormScreen);
const EventAnimalsWithFab = withFab(EventAnimalsScreen);
const EventOptionsWithFab = withFab(EventOptionsScreen);
const NoteAIWithFab = withFab(NoteAIScreen);
const ObjectifListWithFab = withFab(ObjectifListScreen);
const ObjectifAddWithFab = withFab(ObjectifAddScreen);

export function AppStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Tab" component={TabWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="Settings" component={SettingsWithoutFab} options={{ headerShown: false }} />
      <Stack.Screen name="Note" component={NoteWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="Contact" component={ContactWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="Wish" component={WishWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="DiscoverPremium" component={DiscoverPremiumWithoutFab} options={{ headerShown: false }} />
      <Stack.Screen name="Account" component={AccountWithoutFab} options={{ headerShown: false }} />
      <Stack.Screen name="GroupList" component={GroupListWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="GroupDetail" component={GroupDetailWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="Notification" component={NotificationWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="AnimalDetail" component={AnimalDetailWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="AnimalAddWizard" component={AnimalAddWizardWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="EventEntry" component={EventEntryWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="EventAI" component={EventAIWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="EventWizardType" component={EventTypeWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="EventWizardForm" component={EventFormWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="EventWizardAnimals" component={EventAnimalsWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="EventWizardOptions" component={EventOptionsWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="NoteAI" component={NoteAIWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="ObjectifList" component={ObjectifListWithFab} options={{ headerShown: false }} />
      <Stack.Screen name="ObjectifAdd" component={ObjectifAddWithFab} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}

export default AppStack;
