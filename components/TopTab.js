import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from "../providers/AuthenticatedUserProvider";

const TopTab = ({message1, message2, withBackground=false}) => {
    const navigation = useNavigation();
    const { currentUser } = useAuth();
    const styles = StyleSheet.create({
        topTabContainer:{
            paddingTop: Constants.statusBarHeight + 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: 30,
            paddingRight: 30,
            paddingBottom: 10,
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
            borderColor: withBackground == false ? Variables.alezan : Variables.blanc,
            backgroundColor: withBackground == false ? Variables.alezan : Variables.blanc,
        },
        text:{
            color: withBackground == false ? Variables.alezan : Variables.blanc,
            fontFamily: 'Quicksand-Medium',
        }
    });

    return(
        <View style={styles.topTabContainer}>
            <View style={styles.textContainer}>
                <Text style={styles.text}>{message1}</Text>
                <Text style={[styles.name, styles.text]}>{message2}</Text>
            </View>
            <View style={styles.imageContainer}>
                {/* <TouchableOpacity>
                    <Ionicons name="notifications" size={25} color={withBackground == false ? Variables.alezan : Variables.blanc} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={()=>navigation.navigate("Settings")}>
                    {currentUser && currentUser.photoURL !== undefined && currentUser.photoURL !== null ?
                        <Image style={styles.avatar} source={{uri: `${currentUser.photoURL}`}}/>
                    : 
                        <FontAwesome5 size={20} name="user-alt" />
                    }
                    
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default TopTab;