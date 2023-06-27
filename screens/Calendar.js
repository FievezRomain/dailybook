import { View, Text } from "react-native";
import Variables from "../components/styles/Variables";

const CalendarScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Variables.fond }}>
        <Text>Calendar!</Text>
      </View>
    );
}

module.exports = CalendarScreen;