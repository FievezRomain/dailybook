import { View, Text } from "react-native";
import Variables from "../components/styles/Variables";

const WelcomeScreen = ({ navigation })=> {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Variables.fond }}>
          <Text>Welcome!</Text>
        </View>
      );
}

module.exports = WelcomeScreen;