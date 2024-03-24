import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, FontAwesome, Ionicons, Entypo, Feather } from '@expo/vector-icons';

const TopTab = ({message1, message2}) => {
    const navigation = useNavigation();
    const styles = StyleSheet.create({
        topTabContainer:{
            paddingTop: Constants.statusBarHeight + 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 30,
            paddingRight: 30,
            paddingBottom: 10,
            backgroundColor: Variables.isabelle,
        },
        textContainer:{
            flex: 1,
        },
        imageContainer:{
            flex: 1,
            gap: 20,
            direction: "ltr",
            justifyContent: "flex-end",
            alignItems: "center",
            flexDirection: "row"
        },
        image:{
            height: 25,
            width: 25,
        },
        name:{
            fontWeight: "bold",
            fontSize: 18
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 50,
            borderWidth: 0.7,
            borderColor: "white",
            backgroundColor: "white"
        },
        text:{
            color: Variables.blanc,
        }
    });

    return(
        <View style={styles.topTabContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{message1}</Text>
                <Text style={[styles.name, styles.text]}>{message2}</Text>
            </View>
            <View style={styles.imageContainer}>
                <TouchableOpacity>
                    <Ionicons name="notifications" size={25} color={Variables.blanc} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Settings")}>
                    <Image style={styles.avatar} source={require("../assets/wallpaper_login.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default TopTab;