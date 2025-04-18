import { View, StyleSheet, Text, Image, TouchableOpacity } from "react-native";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome6, FontAwesome, Ionicons, Entypo, Feather } from '@expo/vector-icons';
import Back from "./Back";
import { useTheme, Divider } from 'react-native-paper';

const TopTabSecondary = ({message1, message2}) => {
    const { colors, fonts } = useTheme();
    const navigation = useNavigation();
    const styles = StyleSheet.create({
        topTabContainer:{
            paddingTop: Constants.platform.ios ? Constants.statusBarHeight + 10 : Constants.statusBarHeight + 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingRight: 30,
            paddingBottom: 20,
        },
        textContainer:{
            flex: 1,
            marginLeft: 10,
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
            borderColor: colors.default_dark,
            backgroundColor: colors.default_dark
        },
        text:{
            color: colors.default_dark,
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return(
        <>
        <View style={styles.topTabContainer}>
            <Back />
            <View style={styles.textContainer}>
                {/* <Text style={[styles.text, styles.textFontRegular]}>{message1}</Text> */}
                <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
            </View>
        </View>
        <Divider style={{height: 0.4, backgroundColor: colors.quaternary}}/>
        </>
    );
}

export default TopTabSecondary;