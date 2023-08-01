import { View, Text, StyleSheet, ImageBackground, TouchableOpacity } from "react-native";
import wallpaper_accueil from "../assets/wallpaper_accueil.jpg";
import variables from "../components/styles/Variables";
import { Image } from "react-native";

const HomeScreen = ({ navigation })=> {
    return (
        <>
          <Image source={wallpaper_accueil} style={styles.image}/>
            <View style={styles.partieInf}>
                    <TouchableOpacity onPress={()=>navigation.navigate("Login")} style={styles.button}>
                        <Text style={styles.text}>Vivre l'aventure</Text>
                    </TouchableOpacity>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
      partieInf: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "flex-end",
        alignItems: "center"
      },
      image: {
        flex: 1,
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        position: "absolute",
        justifyContent: "center",
        backgroundColor: variables.fond
      },
      text: {
        color: "black",
        textAlign: "center",
        fontSize: 16
      },
      button: {
        backgroundColor: "white",
        paddingLeft: 70,
        paddingRight: 70,
        paddingBottom: 15,
        paddingTop: 15,
        borderRadius: 50,
        marginBottom: 30
      }
    
});

module.exports = HomeScreen;