import { View, Text, StyleSheet } from "react-native";
import Back from "../components/Back";

const SettingsScreen = ({ navigation }) => {
    return (
        <>
            <Back/>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Settings!</Text>
            </View>
        </>
      );
};

module.exports = SettingsScreen;