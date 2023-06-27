import { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput } from "react-native";
import { useForm } from "react-hook-form";
import wallpaper_login from "../assets/wallpaper_login.png";
import variables from "../components/styles/Variables";
import AuthService from "../services/AuthService";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../components/Button";
import Back from "../components/Back";

const SignUpScreen = ({ navigation })=> {
    const [loadingRegister, setLoadingRegister] = useState(false);
    const [evenPassword, setEvenPassword] = useState(true);
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
    const authService = new AuthService;

    const submitRegister = async(data) =>{
        setLoadingRegister(true);
        if(data.password !== data.password_confirm){
            setEvenPassword(false);
            setLoadingRegister(false);
        } else{
            setEvenPassword(true);

            authService.register(data)
            .then((res) =>{
                setLoadingRegister(false);
                navigation.navigate("Login");
                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Enregistrement réussie"
                });
                
            })
            .catch((err) =>{
                console.log(err);
                setLoadingRegister(false);
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: "Email déjà utilisée"
                });
            });
        }
    };

    return (
        <>
        {loadingRegister && (
        <View style={styles.loadingRegister}>
            <Image
            style={styles.loaderRegister}
            source={require("../assets/loader.gif")}
            />
        </View>
        )}
        <Image style={styles.image} source={wallpaper_login} />
        <Back/>
        <KeyboardAwareScrollView contentContainerStyle={styles.register}>
        <Text style={styles.title}>S'inscrire</Text>
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
                {errors.prenom && <Text style={styles.errorInput}>Prenom obligatoire</Text>}
                <TextInput
                style={styles.input}
                placeholder="Votre prenom"
                placeholderTextColor={variables.texte}
                onChangeText={(text) => setValue("prenom", text)}
                defaultValue={getValues("prenom")}
                {...register("prenom", { required: true })}
                />
                {errors.password && <Text style={styles.errorInput}>Le mot de passe doit contenir au moins 6 caractères</Text>}
                <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                placeholderTextColor={variables.texte}
                secureTextEntry={true}
                onChangeText={(text) => setValue("password", text)}
                defaultValue={getValues("password")}
                {...register("password", { required: true, minLength: 6 })}
                />
                {errors.password_confirm && <Text style={styles.errorInput}>Confirmation du mot de passe obligatoire</Text>}
                {!evenPassword && <Text style={styles.errorInput}>Mots de passe différents</Text>}
                <TextInput
                style={styles.input}
                placeholder="Confirmation mot de passe"
                placeholderTextColor={variables.texte}
                secureTextEntry={true}
                onChangeText={(text) => setValue("password_confirm", text)}
                defaultValue={getValues("password_confirm")}
                {...register("password_confirm", { required: true })}
                />
                <View style={styles.registerButton}>
                    <Button
                        onPress={handleSubmit(submitRegister)}
                        type="primary"
                    >
                        <Text style={styles.textButton}>S'enregister</Text>
                    </Button>
                </View>
            </View>
        </KeyboardAwareScrollView>
        </>
    );
};

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
    register: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    loaderRegister: {
        width: 200,
        height: 200
    },
    loadingRegister: {
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
    account: {
        color: "white",
        justifyContent: "center",
        textAlignVertical: "center",
        alignItems: "center",
    },
    registerButton: {
        marginBottom: 20,
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
  

module.exports = SignUpScreen;