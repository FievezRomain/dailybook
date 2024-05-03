import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, KeyboardAvoidingView } from "react-native";
import React, { useState, useContext, useEffect } from "react";
import Variables from "../styles/Variables";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useForm } from "react-hook-form";
import AvatarPicker from "../AvatarPicker";
import { Entypo } from '@expo/vector-icons';
import variables from "../styles/Variables";
import { FontAwesome } from '@expo/vector-icons';
import WishService from "../../services/WishService";
import { AuthenticatedUserContext } from '../../providers/AuthenticatedUserProvider';
import { getImagePath } from '../../services/Config';

const ModalWish = ({isVisible, setVisible, actionType, wish={}, onModify=undefined}) => {
    const { user } = useContext(AuthenticatedUserContext);
    const wishService = new WishService();
    const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
    const [image, setImage] = useState(null);

    useEffect(() => {
        if(wish !== null){
            initValues();
        }
    }, [isVisible, wish]);

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
            setImage(`${getImagePath()}${wish.image}`);
        } else{
            setImage(null);
        }
        setValue("image", wish.image);
        setValue("previousimage", wish.image);
    };

    const resetValues = () =>{
        setImage(null);
        setValue("nom", undefined);
        setValue("url", undefined);
        setValue("prix", undefined);
        setValue("destinataire", undefined);
        setValue("image", undefined);
    };

    const deleteImage = () => {
        if(actionType === "modify"){
            setValue("image", "todelete");
        }
        setImage(null);
    };

    const submitRegister = async(data) =>{
        data["idproprietaire"] =  user.id;

        let formData = data;
        if (data.image != undefined){
            if(actionType !== "modify" || data["previousimage"] !== data["image"]){
                formData = new FormData();
                if(image != null){
                    filename = data.image.split("/");
                    filename = filename[filename.length-1].split(".")[0] + user.id;
                    formData.append("picture", {
                    name: filename,
                    type: "image/jpeg",
                    uri: data.image
                    });
                } else{
                    formData.append("files", "empty");
                }
                data = { ...data, image: data.image };
                formData.append("recipe", JSON.stringify(data));
            }
        }

        if(actionType === "modify"){
            wishService.update(formData)
                .then((reponse) =>{
                    resetValues();
                    closeModal();
                    onModify(reponse);
                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                });
        }
        else{
            wishService.create(formData)
                .then((reponse) =>{
                    resetValues();
                    closeModal();
                    onModify(reponse);
                })
                .catch((err) =>{
                    Toast.show({
                        type: "error",
                        position: "top",
                        text1: err.message
                    });
                });
        }
    }

    return(
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={isVisible}
                onRequestClose={closeModal}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.form}>
                        <View style={styles.toastContainer}>
                            <Toast />
                        </View>
                        <View style={styles.containerActionsButtons}>

                            <TouchableOpacity onPress={closeModal}>
                                <Text style={{color: Variables.aubere}}>Annuler</Text>
                            </TouchableOpacity>
                            { actionType === "modify" && 
                                <Text style={{fontWeight: "bold"}}>Modifier un souhait</Text>
                            }
                            { actionType === "create" && 
                                <Text style={{fontWeight: "bold"}}>Créer un souhait</Text>
                            }
                            <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                                { actionType === "modify" && 
                                <Text style={{color: Variables.alezan}}>Modifier</Text>
                                }
                                { actionType === "create" && 
                                <Text style={{color: Variables.alezan}}>Créer</Text>
                                }
                            </TouchableOpacity>
                        </View>
                        <View style={styles.bottomBar} />
                        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="height">
                            <ScrollView style={{ width: "100%", maxHeight: "100%" }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: Variables.isabelle }}>
                                <View style={styles.formContainer}>
                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Nom : <Text style={{color: "red"}}>*</Text></Text>
                                        {errors.title && <Text style={styles.errorInput}>Nom obligatoire</Text>}
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : Selle western"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("nom", text)}
                                            defaultValue={getValues("nom")}
                                            {...register("nom", { required: true })}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>URL : </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Exemple : https://vascoandco.fr"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("url", text)}
                                            defaultValue={getValues("url")}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Image :</Text>
                                        <AvatarPicker
                                            setImage={setImage}
                                            setValue={setValue}
                                        />
                                        {image &&
                                            <View style={styles.imageContainer}>
                                                <Image source={{uri: image}} style={styles.avatar}/>
                                                <TouchableOpacity onPress={() => deleteImage()}>
                                                    <Entypo name="circle-with-cross" size={25} color={variables.alezan}/>
                                                </TouchableOpacity>
                                            </View>
                                        }
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Prix : </Text>
                                        <TextInput
                                            style={styles.input}
                                            keyboardType="numeric"
                                            placeholder="Exemple : 20"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("prix", text)}
                                            defaultValue={getValues("prix")}
                                        />
                                    </View>

                                    <View style={styles.inputContainer}>
                                        <Text style={styles.textInput}>Destinataire : </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Par défaut, pour vous"
                                            placeholderTextColor={Variables.texte}
                                            onChangeText={(text) => setValue("destinataire", text)}
                                            defaultValue={getValues("destinataire")}
                                        />
                                    </View>
                                    <View  style={{flexDirection:"row", justifyContent:"flex-end", marginTop: 150, alignItems: "flex-end"}}  >
                                        <View style={styles.iconContainer}>
                                            <FontAwesome name="heart" size={60} color={Variables.blanc} style={{marginTop: 5}}/>
                                        </View>
                                    </View>
                                </View>
                            </ScrollView>
                        </KeyboardAvoidingView>
                    </View>
                </View>
            </Modal>
        </>
    )
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
        backgroundColor: "rgba(255, 255, 255, 1)",
        width: "100%",
        marginLeft: "auto",
        marginRight: "auto",
        borderRadius: 10,
        height: "90%",
        paddingBottom: 10,
        paddingTop: 10,
    },
    toastContainer: {
        zIndex: 9999, 
    },
    containerActionsButtons: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignItems: "center"
    },
    bottomBar: {
        width: '100%',
        marginBottom: 10,
        marginTop: 10,
        height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
        backgroundColor: Variables.souris,
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
        alignItems: "center",
        width: "100%"
    },
    textInput:{
        alignSelf: "flex-start",
        marginBottom: 5
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
        backgroundColor: Variables.rouan,
        color: "black",
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
        borderColor: variables.alezan,
    },
    iconContainer:{
        backgroundColor: Variables.alezan,
        padding: 10,
        borderRadius: 60,
        height: 110,
        width: 110,
        justifyContent: "center",
        alignItems: "center",
    },
})

export default ModalWish;

