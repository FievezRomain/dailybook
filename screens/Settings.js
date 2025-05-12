import { View, Text, StyleSheet, Linking } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from "expo-image";
import { ThemeContext } from '../providers/ThemeProvider';
import { Divider, IconButton, useTheme } from 'react-native-paper';
import { LinearGradient } from "expo-linear-gradient";
import ModalValidation from "../components/modals/common/ModalValidation";
import ModalSubMenuAvatarPickerActions from "../components/modals/common/ModalSubMenuAvatarPicker";
import * as ImagePicker from 'expo-image-picker';
import ImageUtils from "../utils/ImageUtils";
import AuthService from "../services/AuthService";
import LoggerService from "../services/LoggerService";
import Toast from "react-native-toast-message";
import FileStorageService from "../services/FileStorageService";
import ModalModificationName from "../components/modals/user/ModalModificationName";
import ModalModificationPassword from "../components/modals/user/ModalModificationPassword";
import TopTabSecondary from "../components/TopTabSecondary";

const SettingsScreen = ({ }) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState({message1: "Mon", message2: "Profil"});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVerifDeleteAccountVisible, setModalVerifDeleteAccountVisible] = useState(false);
    const [modalSubMenuAvatarPickerVisible, setModalSubMenuAvatarPickerVisible] = useState(false);
    const [modalModificationPasswordVisible, setModalModificationPasswordVisible] = useState(false);
    const [modalModificationNameVisible, setModalModificationNameVisible] = useState(false);
    const { currentUser, abonnement, deleteAccount, logout, updatePhotoURL } = useAuth();
    const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
    const { colors, fonts } = useTheme();
    const imageUtils = new ImageUtils();
    var previousImage = currentUser.photoURL;
    const authService = new AuthService();
    const fileStorageService = new FileStorageService();

    const getExitIcon = () => {
        return (
            <IconButton
                icon="logout"
                iconColor={colors.accent}
                size={30}
            />
        )
    }

    const sendEmail = () => {
        const url = `mailto:contact.vascoandco@gmail.com`;
        Linking.openURL(url).catch(err => LoggerService.log('Error opening email app', err.message));
    };

    const disconnect = async () => {
        navigation.navigate("Loading");
        await logout();
    };

    // Fonction pour ouvrir l'appareil photo
    const takePhotoAsync = async () => {
        // Demande la permission d'utiliser l'appareil photo
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
            alert('Désolé, nous avons besoin des permissions de caméra pour faire cela!');
            return;
        }

        let result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
            base64: true
        });

        Toast.show({
            type: "info",
            position: "top",
            text1: "Modification en cours..."
        });

        if (!result.canceled) {
            var uriImageCompressed = await imageUtils.compressImage( result.assets[0].uri );

            if( uriImageCompressed !== previousImage ){
                await saveNewPhoto(uriImageCompressed);
                handleUserModified();
            }
            
        }

        setModalSubMenuAvatarPickerVisible(false);
    };

    const pickImageAsync = async () => {
        // Demande la permission d'utiliser la lib photo
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert("Désolé, nous avons besoin des permissions d'accès à la librairie photo!");
          return;
        }
    
        let result = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          quality: 1,
          base64: true
        });

        Toast.show({
            type: "info",
            position: "top",
            text1: "Modification en cours..."
        });

        if (!result.canceled) {
            var uriImageCompressed = await imageUtils.compressImage( result.assets[0].uri );

            if( uriImageCompressed !== previousImage ){
                await saveNewPhoto(uriImageCompressed);
                handleUserModified();
            }
        }

        setModalSubMenuAvatarPickerVisible(false);
    };

    const saveNewPhoto = async (uriImage) => {
        var filename = uriImage.split("/");
        filename = filename[filename.length-1];
        var fileURL = await fileStorageService.uploadFile(uriImage, filename, "image/jpeg", currentUser.uid);

        await updatePhotoURL(fileURL);
    }

    const handleUserModified = () => {
        setTimeout(() =>Toast.show({
            type: "success",
            position: "top",
            text1: "Modification de vos informations réussie"
        }), 350); 
    }


    const styles = StyleSheet.create({
        card:{
            paddingBottom: 30,
            alignItems: "center",
            backgroundColor: colors.background,
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
            display: "flex",
            flexDirection: "column",
        },
        title:{
            fontSize: 25,
        },
        button2:{
            marginTop: 10,
        },
        avatar: {
            width: 100,
            height: 100,
            borderRadius: 50,
            borderWidth: 3,
            borderColor: colors.background,
            alignSelf: 'center',
            top: 25,
            zIndex: 1,
            backgroundColor: colors.background,
        },
        button: {
            width: "70%",
            alignItems: "center",
            marginBottom: 10,
            padding: 10,
            borderRadius: 5
        },
        buttonNormal: {
            backgroundColor: colors.onSurface,
        },
        buttonPremium:{
            backgroundColor: colors.error,
        },
        buttonDisconnect:{
            backgroundColor: colors.tertiary,
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        },
        informationsUserContainer:{
            alignItems: "center"
        },
        buttonEditUserImage:{
            height: 30, 
            width: 30, 
            backgroundColor: colors.accent, 
            zIndex:1, 
            alignItems: "center", 
            justifyContent: "center", 
            borderRadius: 30, 
            marginLeft: 70
        },
        titleContainer:{
            color: colors.quaternary,
            marginLeft: 20, 
            fontFamily: fonts.labelMedium.fontFamily, 
            fontSize: 16, 
            paddingVertical: 10
        },
        abonnementContainer:{
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderRadius: 15,
            backgroundColor: colors.accent,
            marginTop: 10,
            marginBottom: 20
        }
    });

    return (
        <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
            <TopTabSecondary
                message1={"Mon"}
                message2={"Compte"}
            />
            <View style={styles.contentContainer}>
                <View>
                    <ModalValidation
                        displayedText={"Êtes-vous sûr de vouloir vous déconnecter ?"}
                        title={"Demande de déconnexion"}
                        visible={modalVisible}
                        setVisible={setModalVisible}
                        onConfirm={disconnect}
                    />
                    <ModalValidation
                        displayedText={"Êtes-vous sûr de vouloir supprimer votre compte ?"}
                        title={"Demande de suppression de compte"}
                        visible={modalVerifDeleteAccountVisible}
                        onConfirm={() => deleteAccount(navigation)}
                        setVisible={setModalVerifDeleteAccountVisible}
                    />
                   <ModalSubMenuAvatarPickerActions
                        modalVisible={modalSubMenuAvatarPickerVisible}
                        setModalVisible={setModalSubMenuAvatarPickerVisible}
                        handleCameraPick={takePhotoAsync}
                        handleLibraryPick={pickImageAsync}
                   />
                   <ModalModificationName
                        isVisible={modalModificationNameVisible}
                        setVisible={setModalModificationNameVisible}
                        onModify={handleUserModified}
                   />
                   <ModalModificationPassword
                        isVisible={modalModificationPasswordVisible}
                        setVisible={setModalModificationPasswordVisible}
                        onModify={handleUserModified}
                   />
                    <View style={styles.settings}>
                        <View style={styles.informationsUserContainer}>
                            {currentUser && currentUser.photoURL !== undefined && currentUser.photoURL !== null ?
                                <Image style={styles.avatar} source={{uri: `${currentUser.photoURL}`}} cachePolicy="disk" />
                            :
                                <View style={[styles.avatar, {alignItems: "center", justifyContent: "center"}]}>
                                    <FontAwesome5 size={40}  name="user-alt" />
                                </View>
                                
                            }
                            <TouchableOpacity style={styles.buttonEditUserImage} onPress={() => setModalSubMenuAvatarPickerVisible(!modalSubMenuAvatarPickerVisible)}>
                                <IconButton
                                    icon="pencil"
                                    size={20}
                                    iconColor={colors.background}
                                />
                            </TouchableOpacity>
                            
                            <Text style={[styles.title, styles.textFontBold, {color:colors.default_dark}]}>{currentUser.displayName != null && currentUser.displayName != undefined ? currentUser.displayName.slice(0,17) : currentUser.displayName}</Text>
                            <Text style={[styles.email, styles.textFontRegular, {color:colors.default_dark}]}>{currentUser.email}</Text>
                            <View style={styles.abonnementContainer}>
                                <Text style={[styles.textFontRegular, {color: colors.background}]}>{abonnement.libelle}</Text>
                            </View>
                        </View>
                        
                        <View>
                            <Text style={styles.titleContainer}>Paramètres</Text>
                            <View style={{backgroundColor: colors.background}}>
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => setModalModificationPasswordVisible(!modalModificationPasswordVisible)}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="key" iconColor={colors.accent} size={20} />
                                        <Text style={[styles.textFontMedium, {fontSize: 16, color:colors.default_dark}]}>Changer mon mot de passe</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.accent} size={20} />
                                    </View>
                                </TouchableOpacity>
                                <Divider />
                                {/* <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="email" iconColor={colors.defaultDark} size={20} />
                                        <Text>Changer mon mail</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.defaultDark} size={20} />
                                    </View>
                                </TouchableOpacity>
                                <Divider /> */}
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => setModalModificationNameVisible(!modalModificationNameVisible)}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="card-account-details" iconColor={colors.accent} size={20} />
                                        <Text style={[styles.textFontMedium, {fontSize: 16, color:colors.default_dark}]}>Changer mon nom</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.accent} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.titleContainer}>Informations</Text>
                            <View style={{backgroundColor: colors.background}}>
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => navigation.navigate("DiscoverPremium")}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="cellphone" iconColor={colors.accent} size={20} />
                                        <Text style={[styles.textFontMedium, {fontSize: 16, color:colors.default_dark}]}>Gérer mon abonnement</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.accent} size={20} />
                                    </View>
                                </TouchableOpacity>
                                <Divider />
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => sendEmail()}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="help-circle" iconColor={colors.accent} size={20} />
                                        <Text style={[styles.textFontMedium, {fontSize: 16, color:colors.default_dark}]}>Support utilisateur</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.accent} size={20} />
                                    </View>
                                </TouchableOpacity>
                                <Divider />
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={toggleTheme}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="invert-colors" iconColor={colors.accent} size={20} />
                                        <Text style={[styles.textFontMedium, {fontSize: 16, color:colors.default_dark}]}>Passer en mode {isDarkTheme ? 'clair' : 'sombre'}</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.accent} size={20} />
                                    </View>
                                </TouchableOpacity>
                                <Divider />
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => setModalVerifDeleteAccountVisible(!modalVerifDeleteAccountVisible)}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="account-remove" iconColor={colors.accent} size={20} />
                                        <Text style={[styles.textFontMedium, {fontSize: 16, color:colors.default_dark}]}>Supprimer mon compte</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.accent} size={20} />
                                    </View>
                                </TouchableOpacity>
                                <Divider />
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => setModalVisible(!modalVisible)}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="logout" iconColor={colors.accent} size={20} />
                                        <Text style={[styles.textFontMedium, {fontSize: 16, color:colors.default_dark}]}>Déconnexion</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.accent} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* <View style={styles.card}>
                            
                            
                            <TouchableOpacity style={[styles.button, styles.buttonNormal]} onPress={() => navigation.navigate("Account")}>
                                <Text style={styles.textFontMedium}>Mon compte</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={[styles.button, styles.buttonNormal]} onPress={toggleTheme}>
                                <Text style={[styles.textFontMedium]}>Passer en mode {isDarkTheme ? 'clair' : 'sombre'}</Text>
                            </TouchableOpacity> 
                             <TouchableOpacity style={[styles.button, styles.buttonNormal]}>
                                <Text style={[{color: colors.quaternary}, styles.textFontMedium]}>Ma structure</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.buttonNormal]}>
                                <Text style={[{color: colors.quaternary}, styles.textFontMedium]}>Thèmes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.buttonPremium]} onPress={() => navigation.navigate("DiscoverPremium")}>
                                <Text style={[{color: colors.background}, styles.textFontMedium]}>Découvrir l'offre premium</Text>
                            </TouchableOpacity> 
                            <TouchableOpacity style={[styles.button, styles.buttonDisconnect]} onPress={() => setModalVisible(!modalVisible)}>
                                <Text style={styles.textFontMedium}>Déconnexion</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, styles.buttonPremium]} onPress={() => setModalVerifDeleteAccountVisible(!modalVerifDeleteAccountVisible)}>
                                <Text style={styles.textFontMedium}>Supprimer mon compte</Text>
                            </TouchableOpacity>
                        </View> */}
                    </View>
                </View>
            </View>
        </LinearGradient>
      );
};

module.exports = SettingsScreen;