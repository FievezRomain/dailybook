import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "../Button";
import DateTimePicker from "react-native-modal-datetime-picker";
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const ModalNotifications = ({notifications, setNotifications, modalVisible, setModalVisible, eventType}) =>{
    const { colors, fonts } = useTheme();
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [currentKey, setCurrentKey] = useState();
    const [currentTime, setCurrentTime] = useState(new Date());

    const handleAddingNotification = () => {
        var key = 1;
        if(notifications.length > 0){
            var key = notifications.reduce((max, p) => p.key > max ? p.key : max, notifications[0].key) + 1;
        }
        const newNotification = {
            key: key,
            value: new Date(),
            reccurence: null,
        };
        setNotifications(v => [...v, newNotification]);
        setCurrentKey(key);
        setCurrentTime(newNotification.value);
        setDatePickerVisibility(true);
    }

    const NotificationManagementLine = ({notification}) => {
        /* return(
            <RNDateTimePicker mode="date" display="spinner" value={notification.value} onChange={handleChangeValue}>

            </RNDateTimePicker>
        ) */
        return(
                <View style={styles.containerBadgeNotif}>
                    <View key={notification.key} style={styles.containerNotifIcon}>
                        <TouchableOpacity onPress={() => {
                            handleModifNotif(notification);
                        }}>
                            <Text style={styles.badgeNotif}>{notification.value.getHours() + 'h' + notification.value.getMinutes()}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            handleDeleteNotif(notification);
                        }}>
                            <AntDesign name="delete" size={22} color={colors.default_dark}/>
                        </TouchableOpacity>
                        
                    </View>
                </View>
        )
    }

    const handleConfirmPicker = (time) => {
        indice = notifications.findIndex((a) => a.key == currentKey);
        notifications[indice].value = time;
        setNotifications(notifications);
        setDatePickerVisibility(false);
        console.log(time);
    }

    const handleCancelPicker = () => {
        setDatePickerVisibility(false);
    }

    const handleDeleteNotif = (notification) => {
        setNotifications(notifications.filter((a) => a.key !== notification.key));
    }

    const handleModifNotif = (notification) => {
        setCurrentKey(notification.key);
        setCurrentTime(notification.value);
        setDatePickerVisibility(true);
    }

    const handleReinitialiserNotifs = () =>{
        setNotifications([]);
    }

    const styles = StyleSheet.create({
        card: {
          backgroundColor: "whitesmoke",
          height: "90%",
          //flexDirection: "row wrap"
        },
        background: {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: "flex-end",
          height: "100%",
        },
        buttonContainer:{
          display: "flex",
          flexDirection: "column",
          alignSelf: "center",
          width: "70%",
          justifyContent: "space-around",
          marginTop: 5,
          marginBottom: 10
        },
        titleContainer:{
            marginLeft: 20,
            width: "100%"
        },
        title:{
            fontSize: 18,
            paddingBottom: 5,
            color: colors.default_dark,
        },
        closeButton:{
            paddingTop: 5,
            paddingRight: 10,
            textAlign: "right"
        },
        badgeNotif: {
            padding: 8,
            textAlign: "center",
            paddingLeft: 40,
            paddingRight: 40,
            borderRadius: 5,
            backgroundColor: colors.quaternary,
        },
        containerBadgeNotif: {
            width: "50%",
            margin: 5,
            alignSelf: "center",
        },
        containerNotifIcon: {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-around"
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return (
        <>
            <DateTimePicker
                isVisible={isDatePickerVisible}
                mode="time"
                themeVariant="light"
                onCancel={handleCancelPicker}
                onConfirm={handleConfirmPicker}
                date={currentTime}
                display="spinner"
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.background}>
                    <View style={styles.card}>
                        <TouchableOpacity onPress={() => {
                                    setModalVisible(!modalVisible)
                                }}>
                            <AntDesign name="close" size={22} color={colors.default_dark} style={styles.closeButton}/>
                        </TouchableOpacity>
                        <View style={styles.titleContainer}>
                            <Text style={[styles.title, styles.textFontBold]}>Notifications</Text>
                        </View>
                        <ScrollView showsVerticalScrollIndicator={true} indicatorStyle="white" contentContainerStyle={styles.contentContainer}>
                            <View style={styles.notificationsContainer}>
                                {notifications.map((v) => <NotificationManagementLine key={v.key} notification={v} />)}
                            </View>
                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <Button
                                type={"tertiary"}
                                size={"m"}
                                onPress={() => {
                                    handleAddingNotification(handleAddingNotification)
                                }}
                            >
                                <Text style={styles.textFontMedium}>Ajouter</Text>
                            </Button>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                type={"tertiary"}
                                size={"m"}
                                onPress={() => {
                                    setModalVisible(!modalVisible)
                                }}
                            >
                                <Text style={styles.textFontMedium}>Valider</Text>
                            </Button>
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button
                                type={"tertiary"}
                                size={"m"}
                                disabled={notifications.length > 0 ? false : true}
                                onPress={() => {
                                    handleReinitialiserNotifs()
                                }}
                            >
                                <Text style={styles.textFontMedium}>Réinitialiser</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
};

export default ModalNotifications;