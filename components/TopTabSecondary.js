import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6, FontAwesome, Ionicons, Entypo, Feather } from '@expo/vector-icons';
import Back from "./Back";

const TopTabSecondary = ({message1, message2}) => {
    const navigation = useNavigation();
    const styles = StyleSheet.create({
        topTabContainer:{
            paddingTop: Constants.statusBarHeight + 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 30,
            paddingBottom: 10,
            backgroundColor: Variables.default
        },
        textContainer:{
            flex: 1,
            marginLeft: 20,
        },
        image:{
            height: 25,
            width: 25,
        },
        name:{
            fontSize: 18
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 50,
            borderWidth: 0.7,
            borderColor: Variables.alezan,
            backgroundColor: Variables.alezan
        },
        text:{
            color: Variables.alezan,
        },
        textFontRegular:{
            fontFamily: Variables.fontRegular
        },
        textFontBold:{
            fontFamily: Variables.fontBold
        }
    });

    return(
        <View style={styles.topTabContainer}>
            <Back />
            <View style={styles.textContainer}>
                <Text style={[styles.text, styles.textFontRegular]}>{message1}</Text>
                <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
            </View>
        </View>
    );
}

export default TopTabSecondary;