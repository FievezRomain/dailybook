import { View, StyleSheet, Text } from "react-native";

const WelcomeScreen = ({ navigation })=> {
    return (
        <View style={styles.container}>
            <Text>
                Welcome screen
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    }
});

export default WelcomeScreen;