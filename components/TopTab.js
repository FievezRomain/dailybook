import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Variables from "./styles/Variables";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { Image } from "expo-image";

const TopTab = ({message1, message2, withBackground=false}) => {
    const navigation = useNavigation();
    const { currentUser } = useAuth();
    const styles = StyleSheet.create({
        topTabContainer:{
            paddingTop: Constants.platform.ios ? Constants.statusBarHeight + 10 : Constants.statusBarHeight + 10,
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
            fontSize: 18
        },
        avatar: {
            width: 40,
            height: 40,
            borderRadius: 50,
            borderWidth: 0.7,
            borderColor: withBackground == false ? Variables.bai : Variables.blanc,
            backgroundColor: withBackground == false ? Variables.bai : Variables.blanc,
        },
        text:{
            color: withBackground == false ? Variables.bai : Variables.blanc,
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
            <View style={styles.textContainer}>
                <Text style={[styles.text, styles.textFontRegular]}>{message1}</Text>
                <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
            </View>
            <View style={styles.imageContainer}>
                {/* <TouchableOpacity>
                    <Ionicons name="notifications" size={25} color={withBackground == false ? Variables.bai : Variables.blanc} />
                </TouchableOpacity> */}
                <TouchableOpacity onPress={()=>navigation.navigate("Settings")}>
                    {currentUser && currentUser.photoURL !== undefined && currentUser.photoURL !== null ?
                        <Image style={styles.avatar} source={{uri: `${currentUser.photoURL}`}} cachePolicy="disk"/>
                    : 
                        withBackground ?
                            <FontAwesome5 size={20} color={Variables.blanc} name="user-alt" />
                        :

                            <FontAwesome5 size={20} color={Variables.bai} name="user-alt" />
                    }
                    
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default TopTab;