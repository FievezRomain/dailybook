import { View, Text, StyleSheet } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import Back from "../components/Back";
import Variables from "../components/styles/Variables";
import LogoutModal from "../components/Modals/ModalLogout";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import variables from "../components/styles/Variables";
import ModalVerif from "../components/Modals/ModalVerif";

const SettingsScreen = ({ }) => {
    const navigation = useNavigation();
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVerifDeleteAccountVisible, setModalVerifDeleteAccountVisible] = useState(false);
    const { currentUser, deleteAccount } = useAuth();

    const styles = StyleSheet.create({
        card:{
            paddingBottom: 30,
            alignItems: "center",
            backgroundColor: Variables.blanc,
            justifyContent: "center",
            width: "90%",
            borderRadius: 10,
            marginLeft: "auto",
            marginRight: "auto",
            shadowColor: "black",
            shadowOpacity: "0.1",
            elevation: 1,
            shadowRadius: 5,
            shadowOffset: {width: 0, height: 2}
        },
        settings:{
            backgroundColor: Variables.default,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
        },
        title:{
            fontSize: 25,
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
            borderWidth: 3,
            borderColor: 'white',
            alignSelf: 'center',
            top: 25,
            zIndex: 1,
            backgroundColor: "white"
        },
        contentContainer: {
            height: "100%",
            marginTop: Constants.statusBarHeight + 10,
        },
        button: {
            width: "70%",
            alignItems: "center",
            marginBottom: 10,
            padding: 10,
            borderRadius: 5
        },
        buttonNormal: {
            backgroundColor: Variables.default,
        },
        buttonPremium:{
            backgroundColor: Variables.bai_cerise,
        },
        buttonDisconnect:{
            backgroundColor: Variables.aubere,
        },
        textFontMedium:{
            fontFamily: Variables.fontMedium
        },
        textFontRegular:{
            fontFamily: Variables.fontRegular
        },
        textFontBold:{
            fontFamily: Variables.fontBold
        }
    });

    return (
        <View style={{backgroundColor: Variables.default,}}>
            <View style={styles.contentContainer}>
                <LogoutModal
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}
                    navigation={navigation}
                />
                <ModalVerif
                    event={() =>deleteAccount(navigation)}
                    message={"Êtes-vous sûr de vouloir supprimer votre compte ?"}
                    modalVisible={modalVerifDeleteAccountVisible}
                    setModalVisible={setModalVerifDeleteAccountVisible}
                />
                <Back/>
                <View style={styles.settings}>
                    {currentUser && currentUser.photoURL !== undefined && currentUser.photoURL !== null ?
                        <Image style={styles.avatar} source={{uri: `${currentUser.photoURL}`}} cachePolicy="disk" />
                    :
                        <View style={[styles.avatar, {alignItems: "center", justifyContent: "center"}]}>
                            <FontAwesome5 size={40}  name="user-alt" />
                        </View>
                        
                    }
                    
                    <View style={styles.card}>
                        <Text style={[styles.title, styles.textFontBold]}>{currentUser.displayName != null && currentUser.displayName != undefined ? currentUser.displayName.slice(0,17) : currentUser.displayName}</Text>
                        <Text style={[styles.email, styles.textFontRegular]}>{currentUser.email}</Text>
                        <TouchableOpacity style={[styles.button, styles.buttonNormal]} onPress={() => navigation.navigate("Account")}>
                            <Text style={styles.textFontMedium}>Mon compte</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonNormal]} onPress={() => navigation.navigate("Wish")} >
                            <Text style={styles.textFontMedium}>Ma whishlist</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonNormal]} onPress={() => navigation.navigate("Contact")}>
                            <Text style={[styles.textFontMedium]}>Mes contacts</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonNormal]} onPress={() => navigation.navigate("Note")} >
                            <Text style={[styles.textFontMedium]}>Mes notes</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity style={[styles.button, styles.buttonNormal]}>
                            <Text style={[{color: Variables.rouan}, styles.textFontMedium]}>Ma structure</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonNormal]}>
                            <Text style={[{color: Variables.rouan}, styles.textFontMedium]}>Thèmes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonPremium]} onPress={() => navigation.navigate("DiscoverPremium")}>
                            <Text style={[{color: Variables.blanc}, styles.textFontMedium]}>Découvrir l'offre premium</Text>
                        </TouchableOpacity> */}
                        <TouchableOpacity style={[styles.button, styles.buttonDisconnect]} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.textFontMedium}>Déconnexion</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonPremium]} onPress={() => setModalVerifDeleteAccountVisible(!modalVerifDeleteAccountVisible)}>
                            <Text style={styles.textFontMedium}>Supprimer mon compte</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
      );
};

module.exports = SettingsScreen;