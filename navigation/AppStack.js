import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabStack from "./TabStack";
import { SettingsScreen } from "../screens";
import Variables from "../components/styles/Variables";

const Stack = createNativeStackNavigator();

const AppStack = () => {
  return (
    <Stack.Navigator screenOptions={{
      contentStyle: { backgroundColor: Variables.fond}
    }}>
        <Stack.Screen name="Tab" component={TabStack} options={{ headerShown: false }}/>
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

export default AppStack;