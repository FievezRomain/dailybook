import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5, FontAwesome, MaterialIcons, Entypo, Feather } from '@expo/vector-icons';

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
            backgroundColor: "transparent"
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
    });

    return(
        <View style={styles.topTabContainer}>
            <View style={styles.textContainer}>
                <Text>{message1}</Text>
                <Text style={styles.name}>{message2}</Text>
            </View>
            <View style={styles.imageContainer}>
                <TouchableOpacity>
                    <MaterialIcons name="notifications-none" size={25} color={Variables.alezan} />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>navigation.navigate("Settings")}>
                    <Image style={styles.avatar} source={require("../assets/wallpaper_login.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default TopTab;