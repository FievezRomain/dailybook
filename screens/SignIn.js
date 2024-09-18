import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { useForm } from "react-hook-form";
import wallpaper_login from "../assets/wallpaper_login.png";
import variables from "../components/styles/Variables";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../components/Button";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { getFirebaseAuth } from "../firebase";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { useState } from "react";
import { MaterialIcons } from '@expo/vector-icons';
import Toast from "react-native-toast-message";
import LoggerService from "../services/LoggerService";

const SignInScreen = ({ navigation })=> {
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
    const auth = getFirebaseAuth();
    const { currentUser, reloadUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const submitLogin = async(data) =>{
        try {
            setLoading(true);

            await signInWithEmailAndPassword(auth, data.email.trim(), data.password);

            currentUser ? await reloadUser(currentUser) : null;
    
            setLoading(false);
            navigation.navigate("Loading");
            
          } catch (error) {
            LoggerService.log( "Erreur lors de la connexion de l'utilisateur avec email et password avec Firebase : " + error.message );
            setLoading(false);
            Toast.show({
                type: "error",
                position: "top",
                text1: handleFirebaseError(error)
            });
          }
    };

    const handleFirebaseError = (error) => {
        switch (error.code) {
            case 'auth/invalid-email':
                return 'Adresse e-mail invalide.';
            case 'auth/user-disabled':
                return "Ce compte a été désactivé.";
            case 'auth/user-not-found':
                return "Aucun compte trouvé avec cet e-mail.";
            case 'auth/wrong-password':
                return "Mot de passe incorrect.";
            default:
                return "Une erreur inconnue s'est produite. Veuillez réessayer.";
        }
    };

    const handlePasswordReset = async () => {
        try {
            if(getValues("email") === undefined){
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: "Veuillez saisir votre adresse e-mail"
                });
                return;
            }
            await sendPasswordResetEmail(auth, getValues("email").trim());
            Toast.show({
                type: "success",
                position: "top",
                text1: "Un e-mail vous a été envoyé"
            });
        } catch (error) {
            LoggerService.log( "Erreur lors de la tentative de reset le password avec Firebase : " + error.message );
            Toast.show({
                type: "error",
                position: "top",
                text1: handleFirebaseError(error)
            });
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    return (
        <>
        <Image style={styles.image} source={wallpaper_login} />
        <KeyboardAwareScrollView contentContainerStyle={styles.login}>
            <Text style={[styles.title, styles.textFontRegular]}>Connexion</Text>
            <View style={styles.form}>
                {errors.email && <Text style={[styles.errorInput, styles.textFontRegular]}>Identifiant obligatoire</Text>}
                <Text style={[styles.textInput, styles.textFontRegular]}>Identifiant :</Text>
                <TextInput
                    style={[styles.input, styles.textFontRegular]}
                    placeholder="Email"
                    placeholderTextColor={variables.gris}
                    onChangeText={(text) => setValue("email", text)}
                    {...register("email", { 
                        required: true,
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Email invalide",
                        },
                    })}
                />
                {errors.password && <Text style={[styles.errorInput, styles.textFontRegular]}>Mot de passe obligatoire</Text>}
                <Text style={[styles.textInput, styles.textFontRegular]}>Mot de passe :</Text>
                <View style={[{flexDirection: "row", justifyContent: "space-between", paddingRight: 10}, styles.input]}>
                    <TextInput
                        style={[styles.textFontRegular, {width: "90%"}]}
                        placeholder="Mot de passe"
                        placeholderTextColor={variables.gris}
                        secureTextEntry={!isPasswordVisible}
                        onChangeText={(text) => setValue("password", text)}
                        defaultValue={getValues("password")}
                        {...register("password", { required: true })}
                    />
                    <TouchableOpacity onPress={togglePasswordVisibility} style={{alignSelf: "center"}}>
                        <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.loginButton}>
                    {!loading ?
                        <Button
                            onPress={handleSubmit(submitLogin)}
                            type="quaternary"
                            size={"l"}
                        >
                            <Text style={[styles.textButton, styles.textFontMedium]}>Je me connecte</Text>
                        </Button>
                    :
                        <Button
                            type="quaternary"
                            size={"m"}
                        >
                            <ActivityIndicator size="large" color={variables.blanc} />
                        </Button>
                    }
                    
                </View>
                <View style={styles.forgetPassword}>
                    <TouchableOpacity
                        onPress={() => handlePasswordReset()}
                    >
                        <Text style={[styles.clickableText, styles.textFontMedium]}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.registerButton}>
                    <Button
                        onPress={() => navigation.navigate("Register")}
                        type="primary"
                        size={"m"}
                    >
                        <Text style={[styles.textButton, styles.textFontMedium]}>Pas de compte ? S'inscrire</Text>
                    </Button>
                </View>
            </View>
        </KeyboardAwareScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    textInput:{
        alignSelf: "flex-start",
        marginLeft: 35,
        marginBottom: 10
    },
    image: {
        flex: 1,
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        position: "absolute",
        justifyContent: "center",
        backgroundColor: variables.default
    },
    login: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    loaderLogin: {
        width: 200,
        height: 200
    },
    loadingLogin: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9,
        width: "100%",
        height: "100%",
        backgroundColor: "#000000b8",
        paddingTop: 50
    },
    form: {
        paddingTop: 50,
        alignItems: "center",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        justifyContent: "center",
        width: "90%",
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
    },
    title: {
        fontSize: 30,
        letterSpacing: 2,
        marginBottom:20,
    },
    input: {
        height: 40,
        width: "80%",
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 15,
        backgroundColor: variables.rouan,
        color: "black",
    },
    clickableText: {
        marginLeft: 5,
        color: variables.gris,
        alignSelf: "flex-end",
        justifyContent: "flex-end",
    },
    forgetPassword: {
        flexDirection: "row",
        marginBottom: 50
    },
    account: {
        color: "white",
        justifyContent: "center",
        textAlignVertical: "center",
        alignItems: "center",
    },
    loginButton: {
        marginBottom: 20,
        marginTop: 10,
        backgroundColor: variables.gris,
        borderRadius: 10
    },
    registerButton: {
        marginBottom: 30,
        marginTop: 10,
        backgroundColor: variables.bouton,
        borderRadius: 10
    },
    textButton:{
        color: "white"
    },
    errorInput: {
        color: "red"
    },
    textFontMedium:{
        fontFamily: variables.fontMedium
    },
    textFontLight:{
        fontFamily: variables.fontLight
    },
    textFontRegular:{
        fontFamily: variables.fontRegular
    }
    
});

module.exports = SignInScreen;