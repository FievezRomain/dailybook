import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import wallpaper_accueil from "../assets/wallpaper_accueil.png";
import variables from "../components/styles/Variables";

const HomeScreen = ({ navigation })=> {
    return (
        <View style={styles.home}>
        <ImageBackground
          source={wallpaper_accueil}
          resizeMode="cover"
          style={styles.image}
        >
            <View style={styles.partieInf}>
                <View style={styles.test}>
                    <TouchableOpacity onPress={()=>navigation.navigate("Login")} style={styles.button}>
                        <Text style={styles.text}>Vivre l'aventure</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
        </View>
    );
}

const styles = StyleSheet.create({
      partieInf: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        right: 0,
        left: 0,
        bottom: 15
      },
      home: {
        flex: 1,
        backgroundColor: variables.fond,
      },
      image: {
        flex: 1,
        justifyContent: "center",
      },
      text: {
        color: "black",
        textAlign: "center",
        fontSize: 16
      },
      button: {
        backgroundColor: "white",
        paddingLeft: 90,
        paddingRight: 90,
        paddingBottom: 15,
        paddingTop: 15,
        borderRadius: 50
      }
    
});

module.exports = HomeScreen;