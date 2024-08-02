import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native";
import React from 'react';
import variables from "../components/styles/Variables";
import TopTabSecondary from "../components/TopTabSecondary";
import InputTextInLine from "../components/InputTextInLine";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import Button from "../components/Button";
import { useState } from "react";
import AvatarPicker from "../components/AvatarPicker";
import AuthService from "../services/AuthService";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const AccountScreen = ({ navigation }) => {
    const { currentUser, updateDisplayName, updateEmailForUser, updatePasswordForUser, updatePhotoURL } = useAuth();
    const [password, setPassword] = useState("");
    const [passwordRepeat, setPasswordRepeat] = useState("");
    const [displayName, setDisplayName] = useState(currentUser.displayName);
    const [email, setEmail] = useState(currentUser.email);
    var previousImage = currentUser.photoURL;
    var previousDisplayName = currentUser.displayName;
    var previousEmail = currentUser.email;
    const [image, setImage] = useState(currentUser.photoURL);
    const authService = new AuthService();
    const [loading, setLoading] = useState(false);
    

    const submitModifications = async () => {
        setLoading(true);
        await modificationBaseVasco();
        await modificationFirebase();
        setLoading(false);
    }

    const modificationFirebase = async () => {
        // Partie modification Firebase
        try{
            if(previousDisplayName != displayName){
                await updateDisplayName(displayName);
            }
            if(previousImage != image){
                filename = image.split("/");
                filename = filename[filename.length-1].split(".")[0] + currentUser.uid;
                await updatePhotoURL(filename);
            }
            if(previousEmail != email){
                await updateEmailForUser(email);
            }
            if( password != "" ){
                await updatePasswordForUser(password);
            }

        }catch(error){
            console.error("Erreur lors de la MAJ du user sur Firebase : " + error);
        }
    }

    const modificationBaseVasco = () =>{
        // Partie modification en base Vasco
        let data = {};

        data.email = currentUser.email;
        data.newEmail = email;
        data.image = image;

        let formData = data;
        if (data.image != undefined && image !== previousImage){
            formData = new FormData();
            if(image != null && image != undefined){
                filename = data.image.split("/");
                filename = filename[filename.length-1].split(".")[0] + currentUser.uid;
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

        authService.modifyUser(formData)
        .then((response) =>{
            Toast.show({
                type: "success",
                position: "top",
                text1: "Modification de l'utilisateur"
            }); 
        }).catch((err) =>{
            Toast.show({
                type: "error",
                position: "top",
                text1: err.message
            });
        });
    }

    const setValue = (key, value) => {
    }

    return(
        <View style={{backgroundColor: variables.default, height: "100%", justifyContent: "space-between"}}>
            <View>
                <TopTabSecondary
                    message1={"Mon"}
                    message2={"Compte"}
                />
                {image &&
                    <View style={{flexDirection: "row",
                    alignSelf: "flex-start",
                    marginTop: 30,
                    marginBottom: 5, alignSelf: "center"}}>
                        <Image source={{uri: image}} style={{width: 100,height: 100,borderRadius: 50,borderWidth: 2,zIndex: 1}}/>
                    </View>
                }
                <View style={{width: "90%", display: "flex", flexDirection: "column", alignSelf: "center", marginTop: 20}}>
                    <AvatarPicker
                        backgroundColor={variables.blanc}
                        setImage={setImage}
                        setValue={setValue}
                    />
                </View>
                <View style={{width: "90%", display: "flex", flexDirection: "column", alignSelf: "center", marginTop: 10}}>
                    <InputTextInLine
                        inputTextLabel={"Email"}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={{width: "90%", display: "flex", flexDirection: "column", alignSelf: "center", marginTop: 10}}>
                    <InputTextInLine
                        inputTextLabel={"Nom"}
                        value={displayName}
                        onChangeText={setDisplayName}
                    />
                </View>

                <View style={{width: "90%", display: "flex", flexDirection: "column", alignSelf: "center", marginTop: 10}}>
                    <InputTextInLine
                        inputTextLabel={"Mot de passe"}
                        isPassword={true}
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
                {password != "" &&
                    <View style={{width: "90%", display: "flex", flexDirection: "column", alignSelf: "center", marginTop: 10}}>
                        <InputTextInLine
                            inputTextLabel={"Confirmer le mot de passe"}
                            isPassword={true}
                            value={passwordRepeat}
                            onChangeText={setPasswordRepeat}
                        />
                    </View>
                }
            </View>

            <View style={{width: "70%", alignSelf: "center", marginBottom: 50}}>
                { loading ? 
                    <ActivityIndicator size={30} color={variables.bai} />
                :
                    <Button
                        isLong={true}
                        type={"primary"}
                        size={"m"}
                        onPress={() => submitModifications()}
                    >
                        <Text style={styles.textFontMedium}>Enregistrer</Text>
                    </Button>
                }
            </View>
            
            
        </View>
    );
}

const styles = StyleSheet.create({
    textFontMedium:{
        fontFamily: variables.fontMedium
    }
})

module.exports = AccountScreen;