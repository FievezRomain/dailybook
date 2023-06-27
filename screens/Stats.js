import { View, Text } from "react-native";
import Variables from "../components/styles/Variables";

const StatsScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Variables.fond }}>
        <Text>Statistic!</Text>
      </View>
    );
}

module.exports = StatsScreen;