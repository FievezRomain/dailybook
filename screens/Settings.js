import { View, Text, StyleSheet, Image } from "react-native";
import React, { useContext, useState } from 'react';
import Back from "../components/Back";
import ButtonLong from "../components/ButtonLong";
import Variables from "../components/styles/Variables";
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import LogoutModal from "../components/ModalLogout";

const SettingsScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { user } = useContext(AuthenticatedUserContext);
    const styles = StyleSheet.create({
        card:{
            paddingTop: 30,
            paddingBottom: 30,
            alignItems: "center",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            justifyContent: "center",
            width: "90%",
            borderRadius: 10,
            marginLeft: "auto",
            marginRight: "auto",
        },
        settings:{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginTop: 80
        },
        title:{
            color: Variables.bouton_secondary,
            fontSize: 25,
            fontWeight: "bold",
            marginTop: 30,
        },
        email:{
            marginBottom: 20
        },
        button2:{
            marginTop: 10,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 0.7,
            borderColor: 'white',
            position: 'absolute',
            alignSelf: 'center',
            marginTop: 80,
            zIndex: 1,
            backgroundColor: "white"
        },
    });

    return (
        <>
            <LogoutModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
            />
            <Back/>
            <Image style={styles.avatar} source={require("../assets/wallpaper_login.png")} />
            <View style={styles.settings}>
                <View style={styles.card}>
                    <Text style={styles.title}>{user.prenom}</Text>
                    <Text style={styles.email}>{user.email}</Text>
                    <ButtonLong style={styles.button}>
                        <Text>Mon compte</Text>
                    </ButtonLong>
                    <ButtonLong style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
                        <Text>Ma whishlist</Text>
                    </ButtonLong>
                    <ButtonLong style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
                        <Text>Mes contacts</Text>
                    </ButtonLong>
                    <ButtonLong style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
                        <Text>Mes notes</Text>
                    </ButtonLong>
                    <ButtonLong style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
                        <Text>Ma structure</Text>
                    </ButtonLong>
                    <ButtonLong style={styles.button} onPress={() => setModalVisible(!modalVisible)}>
                        <Text>Thèmes</Text>
                    </ButtonLong>
                    <ButtonLong style={styles.button} type={"disconnect"} onPress={() => setModalVisible(!modalVisible)}>
                        <Text>Déconnexion</Text>
                    </ButtonLong>
                </View>
            </View>
        </>
      );
};

module.exports = SettingsScreen;