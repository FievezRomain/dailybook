import { View, Text, StyleSheet, Linking } from "react-native";
import React, { useContext, useEffect, useState } from 'react';
import Back from "../components/Back";
import LogoutModal from "../components/Modals/ModalLogout";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Constants from 'expo-constants';
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { FontAwesome5 } from '@expo/vector-icons';
import { Image } from "expo-image";
import ModalVerif from "../components/Modals/ModalVerif";
import { ThemeContext } from '../providers/ThemeProvider';
import { Divider, IconButton, useTheme } from 'react-native-paper';
import TopTab from "../components/TopTab";
import { LinearGradient } from "expo-linear-gradient";
import ModalValidation from "../components/Modals/ModalValidation";
import ModalSubMenuAvatarPickerActions from "../components/Modals/ModalSubMenuAvatarPicker";
import * as ImagePicker from 'expo-image-picker';
import ImageUtils from "../utils/ImageUtils";
import AuthService from "../services/AuthService";
import LoggerService from "../services/LoggerService";
import Toast from "react-native-toast-message";
import FileStorageService from "../services/FileStorageService";
import ModalModificationName from "../components/Modals/User/ModalModificationName";
import ModalModificationPassword from "../components/Modals/User/ModalModificationPassword";

const SettingsScreen = ({ }) => {
    const navigation = useNavigation();
    const [messages, setMessages] = useState({message1: "Mon", message2: "Profil"});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVerifDeleteAccountVisible, setModalVerifDeleteAccountVisible] = useState(false);
    const [modalSubMenuAvatarPickerVisible, setModalSubMenuAvatarPickerVisible] = useState(false);
    const [modalModificationPasswordVisible, setModalModificationPasswordVisible] = useState(false);
    const [modalModificationNameVisible, setModalModificationNameVisible] = useState(false);
    const { currentUser, deleteAccount, logout, updatePhotoURL } = useAuth();
    const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
    const { colors, fonts } = useTheme();
    const imageUtils = new ImageUtils();
    var previousImage = currentUser.photoURL;
    const authService = new AuthService();
    const fileStorageService = new FileStorageService();

    const getExitIcon = () => {
        return (
            <IconButton
                onPress={() => setModalVisible(!modalVisible)}
                icon="logout"
                iconColor={colors.background}
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
        }
    });

    return (
        <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
            <View style={{height: Constants.statusBarHeight + 40, justifyContent:"flex-end", backgroundColor: colors.accent}}>
                <Back 
                    arrowColor={colors.background}
                    buttonOptional={getExitIcon()}
                />
            </View>
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
                            
                            <Text style={[styles.title, styles.textFontBold]}>{currentUser.displayName != null && currentUser.displayName != undefined ? currentUser.displayName.slice(0,17) : currentUser.displayName}</Text>
                            <Text style={[styles.email, styles.textFontRegular]}>{currentUser.email}</Text>
                        </View>
                        
                        <View>
                            <Text style={styles.titleContainer}>Paramètres</Text>
                            <View style={{backgroundColor: colors.background}}>
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => setModalModificationPasswordVisible(!modalModificationPasswordVisible)}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="key" iconColor={colors.defaultDark} size={20} />
                                        <Text>Changer mon mot de passe</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.defaultDark} size={20} />
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
                                        <IconButton icon="card-account-details" iconColor={colors.defaultDark} size={20} />
                                        <Text>Changer mon nom</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.defaultDark} size={20} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.titleContainer}>Informations</Text>
                            <View style={{backgroundColor: colors.background}}>
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => navigation.navigate("DiscoverPremium")}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="cellphone" iconColor={colors.defaultDark} size={20} />
                                        <Text>Gérer mon abonnement</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.defaultDark} size={20} />
                                    </View>
                                </TouchableOpacity>
                                <Divider />
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => sendEmail()}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="help-circle" iconColor={colors.defaultDark} size={20} />
                                        <Text>Support utilisateur</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.defaultDark} size={20} />
                                    </View>
                                </TouchableOpacity>
                                <Divider />
                                <TouchableOpacity style={{paddingHorizontal: 10, flexDirection: "row", justifyContent: "space-between"}} onPress={() => setModalVerifDeleteAccountVisible(!modalVerifDeleteAccountVisible)}>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="account-remove" iconColor={colors.defaultDark} size={20} />
                                        <Text>Supprimer mon compte</Text>
                                    </View>
                                    <View style={{flexDirection: "row", alignItems: "center"}}>
                                        <IconButton icon="chevron-right" iconColor={colors.defaultDark} size={20} />
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