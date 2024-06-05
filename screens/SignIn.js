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
import Toast from "react-native-toast-message";

const SignInScreen = ({ navigation })=> {
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
    const auth = getFirebaseAuth();
    const [loading, setLoading] = useState(false);

    const submitLogin = async(data) =>{
        try {
            setLoading(true);

            await signInWithEmailAndPassword(auth, data.email, data.password);
    
            setLoading(false);
            navigation.navigate("Loading");
            
          } catch (error) {
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
            await sendPasswordResetEmail(auth, getValues("email"));
            Toast.show({
                type: "success",
                position: "top",
                text1: "Un e-mail vous a été envoyé"
            });
        } catch (error) {
            Toast.show({
                type: "error",
                position: "top",
                text1: handleFirebaseError(error)
            });
        }
    };

    return (
        <>
        <Image style={styles.image} source={wallpaper_login} />
        <KeyboardAwareScrollView contentContainerStyle={styles.login}>
            <Text style={styles.title}>Connexion</Text>
            <View style={styles.form}>
                {errors.email && <Text style={styles.errorInput}>Identifiant obligatoire</Text>}
                <Text style={styles.textInput}>Identifiant :</Text>
                <TextInput
                    style={styles.input}
                    placeholder="email"
                    placeholderTextColor={variables.texte}
                    onChangeText={(text) => setValue("email", text)}
                    {...register("email", { 
                        required: true,
                        pattern: {
                            value: /\S+@\S+\.\S+/,
                            message: "Email invalide",
                        },
                    })}
                />
                {errors.password && <Text style={styles.errorInput}>Mot de passe obligatoire</Text>}
                <Text style={styles.textInput}>Mot de passe :</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Mot de passe"
                    placeholderTextColor={variables.texte}
                    secureTextEntry={true}
                    onChangeText={(text) => setValue("password", text)}
                    defaultValue={getValues("password")}
                    {...register("password", { required: true })}
                />
                <View style={styles.loginButton}>
                    {!loading ?
                        <Button
                            onPress={handleSubmit(submitLogin)}
                            type="quaternary"
                            size={"l"}
                        >
                            <Text style={styles.textButton}>Je me connecte</Text>
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
                        <Text style={styles.clickableText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.registerButton}>
                    <Button
                        onPress={() => navigation.navigate("Register")}
                        type="primary"
                        size={"m"}
                    >
                        <Text style={styles.textButton}>Pas de compte ? S'inscrire</Text>
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
        fontWeight: "300"
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
        color: variables.texte,
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
        backgroundColor: variables.texte,
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
      }
    
});

module.exports = SignInScreen;