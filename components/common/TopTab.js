import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import Constants from 'expo-constants';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useAuth } from "../../contexts/AuthenticatedUserProvider";
import { Image } from "expo-image";
import { Badge, Divider, useTheme } from 'react-native-paper';
import { useCallback, useEffect, useState } from "react";
import notificationServiceInstance from "../../services/api/NotificationService";

const TopTab = ({message1, message2, withBackground=false, withLogo=false}) => {
    const { colors, fonts } = useTheme();
    const navigation = useNavigation();
    const { currentUser } = useAuth();
    const [ nbNotifications, setNbNotifications ] = useState(0);

    useFocusEffect(
        useCallback(() => {
          getNotificationsNumber();
        }, [])
    );

    const getNotificationsNumber = async () => {
        const response = await notificationServiceInstance.getNotifications();
        setNbNotifications(response.data.unreadCount);
    }

    const styles = StyleSheet.create({
        topTabContainer:{
            paddingTop: Constants.platform.ios ? Constants.statusBarHeight + 10 : Constants.statusBarHeight + 10,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            paddingLeft: withLogo ? 10 : 30,
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
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center"
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
            borderRadius: 30,
            borderColor: colors.accent,
            borderWidth: 0.5
        },
        text:{
            color: withBackground || withLogo == false ? colors.default_dark : colors.background,
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        }
    });

    return(
        <View>
            <View style={styles.topTabContainer}>
                <View style={styles.textContainer}>
                    {withBackground || withLogo ?
                        withBackground ?
                            <View style={{marginTop: -5}}>
                                <Text style={[styles.text, styles.textFontRegular]}>{message1}</Text>
                                <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
                            </View>
                        :
                            <View style={{flexDirection: "row", alignItems: "center", marginTop: -5}}>
                                <Image source={require("../../assets/logo.png")} style={{height: 45, width: 45}}/>
                                <Text style={[styles.textFontMedium, {color: colors.accent, fontSize: 25}]}>VASCO</Text>
                            </View>
                    :
                        <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
                    }
                    
                </View>
                <View style={styles.imageContainer}>
                    <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
                        <Ionicons name="notifications" size={25} color={colors.default_dark} />
                        { nbNotifications > 0 && 
                            <Badge style={{position: "absolute", left: 15, bottom: 10}} size={20} visible>{nbNotifications}</Badge>
                        }
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>navigation.navigate("Settings")}>
                        {currentUser && currentUser.photoURL !== undefined && currentUser.photoURL !== null ?
                            <Image style={styles.avatar} source={{uri: `${currentUser.photoURL}`}} cachePolicy="disk"/>
                        : 
                            withBackground || withLogo ?
                                <View style={{paddingVertical: 10}}>
                                    <FontAwesome5 size={20} color={colors.default_dark} name="user-alt" />
                                </View>
                            :

                            <View style={{paddingVertical: 10}}>
                                <FontAwesome5 size={20} color={colors.default_dark} name="user-alt" />
                            </View>
                        }
                        
                    </TouchableOpacity>
                </View>
            </View>
            {!withBackground && 
                <Divider style={{height: 0.4, backgroundColor: colors.quaternary}}/>
            }
        </View>
    );
}

export default TopTab;