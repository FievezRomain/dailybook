import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native";
import { FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { Image } from "expo-image";
import { Divider, useTheme } from 'react-native-paper';

const TopTab = ({message1, message2, withBackground=false}) => {
    const { colors, fonts } = useTheme();
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
            alignSelf: "flex-start",
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
        },
        text:{
            color: withBackground == false ? colors.accent : colors.background,
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return(
        <View>
            <View style={styles.topTabContainer}>
                <View style={styles.textContainer}>
                    {withBackground ?
                        <View style={{marginTop: -5}}>
                            <Text style={[styles.text, styles.textFontRegular]}>{message1}</Text>
                            <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
                        </View>
                    :
                        <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
                    }
                    
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
                                <FontAwesome5 size={20} color={colors.background} name="user-alt" />
                            :

                                <FontAwesome5 size={20} color={colors.secondaryContainer} name="user-alt" />
                        }
                        
                    </TouchableOpacity>
                </View>
            </View>
            {!withBackground &&
                <Divider />
            }
        </View>
    );
}

export default TopTab;