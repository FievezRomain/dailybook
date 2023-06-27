import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";
import Constants from 'expo-constants';
import { useState } from "react";

const TopTab = ({message1, message2}) => {
    const styles = StyleSheet.create({
        topTabContainer:{
            paddingTop: Constants.statusBarHeight + 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 30,
            paddingRight: 30,
            backgroundColor: Variables.fond
        },
        textContainer:{
            flex: 1,
        },
        imageContainer:{
            flex: 1,
            gap: 20,
            direction: "ltr",
            justifyContent: "flex-end",
            flexDirection: "row"
        },
        image:{
            height: 25,
            width: 25,
        },
        name:{
            fontWeight: "bold",
            fontSize: 18
        }
    });

    return(
        <View style={styles.topTabContainer}>
            <View style={styles.textContainer}>
                <Text>{message1}</Text>
                <Text style={styles.name}>{message2}</Text>
            </View>
            <View style={styles.imageContainer}>
                <TouchableOpacity>
                    <Image style={styles.image} source={require("../assets/heart.png")}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={styles.image} source={require("../assets/notifications.png")}/>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Image style={styles.image} source={require("../assets/settings.png")}/>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default TopTab;