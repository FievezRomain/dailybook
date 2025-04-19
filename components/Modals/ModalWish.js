import { View, Text, StyleSheet, TextInput, Modal, TouchableOpacity } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Toast from "react-native-toast-message";
import { useForm } from "react-hook-form";
import AvatarPicker from "../AvatarPicker";
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import wishsServiceInstance from "../../services/WishService";
import { useAuth } from '../../providers/AuthenticatedUserProvider';
import { Image } from "expo-image";
import { ActivityIndicator } from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoggerService from "../../services/LoggerService";
import FileStorageService from "../../services/FileStorageService";
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";

const ModalWish = ({isVisible, setVisible, actionType, wish={}, onModify=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const fileStorageService = new FileStorageService();

    useEffect(() => {
        if(wish !== null){
            initValues();
        }
    }, [isVisible]);

    const closeModal = () => {
        setVisible(false);
    };

    const initValues = () =>{
        setValue("id", wish.id);
        setValue("nom", wish.nom);
        setValue("url", wish.url);
        setValue("prix", wish.prix);
        setValue("destinataire", wish.destinataire);
        if(wish.image !== null && wish.image !== undefined){
            setImage( fileStorageService.getFileUrl( wish.image, currentUser.uid ));
        } else{
            setImage(null);
        }
        setValue("image", wish.image);
        setValue("previousimage", wish.image);
        setValue("acquis", wish.acquis);
    };

    const resetValues = () =>{
        setImage(null);
        setValue("nom", undefined);
        setValue("url", undefined);
        setValue("prix", undefined);
        setValue("destinataire", undefined);
        setValue("image", undefined);
        setValue("acquis", undefined);
    };

    const deleteImage = () => {
        if(actionType === "modify"){
            setValue("image", "todelete");
        }
        setImage(null);
    };

    const submitRegister = async(data) =>{
        if(loading){
            return;
        }
        setLoading(true);

        // Vérification de la valeur des entiers/décimal
        if( !checkNumericFormat(data, "prix") ){
            setLoading(false);
            return;
        }

        data["email"] =  currentUser.email;

        if (data.image != undefined){
            if(actionType !== "modify" || data["previousimage"] !== data["image"]){
                var filename = data.image.split("/");
                filename = filename[filename.length-1];

                await fileStorageService.uploadFile(image, filename, "image/jpeg", currentUser.uid);

                data.image = filename;
            }
        }

        if(actionType === "modify"){
            wishsServiceInstance.update(data)
                .then((reponse) =>{
                    resetValues();
                    closeModal();
                    onModify(reponse);
                    setLoading(false);

                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    LoggerService.log( "Erreur lors de la MAJ d'un wish : " + err.message );
                    setLoading(false);
                });
        }
        else{
            wishsServiceInstance.create(data)
                .then((reponse) =>{
                    resetValues();
                    closeModal();
                    onModify();
                    setLoading(false);

                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                    LoggerService.log( "Erreur lors de la création d'un wish : " + err.message );
                    setLoading(false);
                });
        }
    }

    const checkNumericFormat = (data, attribute) => {
        if( data[attribute] != undefined && data[attribute] != undefined )
        {
            const numericValue = parseFloat(data[attribute].replace(',', '.').replace(" ", ""));
            if (isNaN(numericValue)) {
                Toast.show({
                    position: "top",
                    type: "error",
                    text1: "Problème de format sur l'attribut " + attribute,
                    text2: "Seul les chiffres, virgule et point sont acceptés"
                });
                return false;
            } else{
                data[attribute] = numericValue;
            }
        }
        return true;
    }

    const styles = StyleSheet.create({
        loadingEvent: {
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9,
            width: "100%",
            height: "100%",
            backgroundColor: "#000000b8",
            paddingTop: 50
        },
        loaderEvent: {
            width: 200,
            height: 200
        },
        modalContainer: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            height: "100%",
            justifyContent: "flex-end",
        },
        form: {
            width: "100%",
            paddingBottom: 40
        },
        toastContainer: {
            zIndex: 9999, 
        },
        containerActionsButtons: {
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            paddingBottom: 15,
            paddingTop: 5
        },
        bottomBar: {
            width: '100%',
            marginBottom: 10,
            marginTop: 10,
            height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
            backgroundColor: colors.text,
        },
        keyboardAvoidingContainer: {
            flex: 1,
        },
        formContainer:{
            paddingLeft: 30,
            paddingRight: 30,
            paddingTop: 10,
            marginBottom: 10,
            height: "100%"
        },
        inputContainer:{
            width: "100%"
        },
        textInput:{
            alignSelf: "flex-start",
            marginBottom: 5,
            color : colors.default_dark
        },
        errorInput: {
            color: "red"
        },
        input: {
            height: 40,
            width: "100%",
            marginBottom: 15,
            borderRadius: 5,
            paddingLeft: 15,
            backgroundColor: colors.quaternary,
            color: colors.default_dark,
            alignSelf: "baseline"
        },
        imageContainer:{
            flexDirection: "row",
            alignSelf: "flex-start",
            marginTop: 5,
            marginBottom: 5
        },
        avatar: {
            width: 200,
            height: 200,
            borderWidth: 0.5,
            borderRadius: 5,
            zIndex: 1,
            borderColor: colors.default_dark,
        },
        iconContainer:{
            backgroundColor: colors.default_dark,
            padding: 10,
            borderRadius: 60,
            height: 110,
            width: 110,
            justifyContent: "center",
            alignItems: "center",
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
    })

    return(
        <>
            <ModalEditGeneric
                isVisible={isVisible}
                setVisible={setVisible}
                arrayHeight={["90%"]}
            >
                <View style={styles.form}>
                    <View style={styles.containerActionsButtons}>

                        <TouchableOpacity onPress={closeModal} style={{width:"33.33%", alignItems: "center"}}>
                            <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                        </TouchableOpacity>
                        <View style={{width:"33.33%", alignItems: "center"}}>
                            <Text style={[styles.textFontBold, {fontSize: 16, color:colors.default_dark}]}>Souhait</Text>
                        </View>
                        <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{width:"33.33%", alignItems: "center"}}>
                            { loading ? 
                                <ActivityIndicator size={10} color={colors.default_dark} />
                            :
                                actionType === "modify" ?
                                <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Modifier</Text>
                                :
                                <Text style={[{color: colors.default_dark}, styles.textFontRegular]}>Créer</Text>
                            }
                        </TouchableOpacity>
                    </View>
                    <Divider />
                    <KeyboardAwareScrollView>
                        <View style={styles.formContainer}>
                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Nom : <Text style={{color: "red"}}>*</Text></Text>
                                {errors.title && <Text style={[styles.errorInput, styles.textFontRegular]}>Nom obligatoire</Text>}
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Exemple : Selle western"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("nom", text)}
                                    defaultValue={getValues("nom")}
                                    {...register("nom", { required: true })}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>URL : </Text>
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Exemple : https://vascoandco.fr"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("url", text)}
                                    defaultValue={getValues("url")}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Image :</Text>
                                <AvatarPicker
                                    setImage={setImage}
                                    setValue={setValue}
                                />
                                {image &&
                                    <View style={styles.imageContainer}>
                                        <Image source={{uri: image}} style={styles.avatar} cachePolicy="disk"/>
                                        <TouchableOpacity onPress={() => deleteImage()}>
                                            <Entypo name="circle-with-cross" size={25} color={colors.default_dark}/>
                                        </TouchableOpacity>
                                    </View>
                                }
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Prix : </Text>
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    keyboardType="decimal-pad"
                                    inputMode="decimal"
                                    placeholder="Exemple : 20"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("prix", text)}
                                    defaultValue={getValues("prix")}
                                />
                            </View>

                            <View style={styles.inputContainer}>
                                <Text style={[styles.textInput, styles.textFontRegular]}>Destinataire : </Text>
                                <TextInput
                                    style={[styles.input, styles.textFontRegular]}
                                    placeholder="Par défaut, pour vous"
                                    placeholderTextColor={colors.secondary}
                                    onChangeText={(text) => setValue("destinataire", text)}
                                    defaultValue={getValues("destinataire")}
                                />
                            </View>
                           {/*  <View  style={{flexDirection:"row", justifyContent:"flex-end", marginTop: 150, alignItems: "flex-end"}}  >
                                <View style={styles.iconContainer}>
                                    <FontAwesome name="heart" size={60} color={colors.background} style={{marginTop: 5}}/>
                                </View>
                            </View> */}
                        </View>
                    </KeyboardAwareScrollView>
                </View>
            </ModalEditGeneric>
        </>
    )
}

export default ModalWish;

