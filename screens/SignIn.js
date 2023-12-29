import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import wallpaper_login from "../assets/wallpaper_login.png";
import variables from "../components/styles/Variables";
import { useState, useContext, useEffect } from "react";
import AuthService from "../services/AuthService";
import Toast from "react-native-toast-message";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../components/Button";
import * as Notifications from 'expo-notifications';

const SignInScreen = ({ navigation })=> {
    const [loadingLogin, setLoadingLogin] = useState(false);
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
    const authService = new AuthService;
    const { setUser } = useContext(AuthenticatedUserContext);

    useEffect(() => {
        const { status } = Notifications.requestPermissionsAsync();
        if (status !== "granted"){
            return;
        }
    }, [navigation]);

    const submitLogin = async(data) =>{
        setLoadingLogin(true);
        const { data: token } = await Notifications.getExpoPushTokenAsync();
        data = { ...data, expotoken: token };
        authService.loginUser(data)
        .then((user) =>{
            if(user.accessToken){
                setLoadingLogin(false);
                setUser(user);
                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Connexion réussie"
                });
                navigation.navigate("App");
            }
        })
        .catch((err) =>{
            setLoadingLogin(false);
            Toast.show({
                type: "error",
                position: "top",
                text1: "Email ou mot de passe incorrect"
            });
        });
    };

    return (
        <>
        {loadingLogin && (
        <View style={styles.loadingLogin}>
            <Image
            style={styles.loaderLogin}
            source={require("../assets/loader.gif")}
            />
        </View>
        )}
        <Image style={styles.image} source={wallpaper_login} />
        <KeyboardAwareScrollView contentContainerStyle={styles.login}>
            <Text style={styles.title}>Connexion</Text>
            <View style={styles.form}>
                {errors.email && <Text style={styles.errorInput}>Email obligatoire</Text>}
                <TextInput
                style={styles.input}
                placeholder="Email"
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
                    <Button
                        onPress={handleSubmit(submitLogin)}
                        type="primary"
                    >
                        <Text style={styles.textButton}>Se connecter</Text>
                    </Button>
                </View>
                <View style={styles.forgetPassword}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate("Home")}
                    >
                        <Text style={styles.clickableText}>Mot de passe oublié ?</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.registerButton}>
                    <Button
                        onPress={() => navigation.navigate("Register")}
                        type="primary"
                    >
                        <Text style={styles.textButton}>Créer un compte</Text>
                    </Button>
                </View>
            </View>
        </KeyboardAwareScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        position: "absolute",
        justifyContent: "center",
        backgroundColor: variables.fond
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
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        justifyContent: "center",
        width: "90%",
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
    },
    title: {
        color: variables.texte,
        fontSize: 30,
        letterSpacing: 2,
        marginBottom:20,
        fontWeight: "bold"
    },
    input: {
        height: 40,
        width: "80%",
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 15,
        backgroundColor: variables.fond_secondary,
        opacity: 0.6,
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