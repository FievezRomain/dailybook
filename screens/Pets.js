import { View, Text } from "react-native";
import Variables from "../components/styles/Variables";

const PetsScreen = ({ navigation }) => {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Variables.fond }}>
        <Text>Pets!</Text>
      </View>
    );
};

module.exports = PetsScreen;