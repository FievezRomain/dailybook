import { View, Text } from "react-native";
import Variables from "../components/styles/Variables";

const ActionScreen = () => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Variables.fond }}>
        <Text>Action!</Text>
      </View>
    );
}

module.exports = ActionScreen;