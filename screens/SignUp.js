import { useState } from "react";
import { View, Text, StyleSheet, Image, TextInput, ActivityIndicator, TouchableOpacity } from "react-native";
import { useForm } from "react-hook-form";
import wallpaper_login from "../assets/wallpaper_login.png";
import AuthService from "../services/AuthService";
import Toast from "react-native-toast-message";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../components/Button";
import Back from "../components/Back";
import { getFirebaseAuth } from "../firebase";
import { MaterialIcons } from '@expo/vector-icons';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import Constants from 'expo-constants';
import LoggerService from "../services/LoggerService";
import { useTheme } from 'react-native-paper';


const SignUpScreen = ({ navigation })=> {
    const { colors, fonts } = useTheme();
    const [evenPassword, setEvenPassword] = useState(true);
    const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
    const authService = new AuthService;
    const auth = getFirebaseAuth();
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const submitRegister = async(data) =>{
        if(!loading){
            try{
                await setLoading(true);
                if(data.password !== data.password_confirm){
                    setEvenPassword(false);
                } else{
                    setEvenPassword(true);
    
                    const userCredential = await createUserWithEmailAndPassword(auth, data.email.trim(), data.password);
                    const user = userCredential.user;
                    await updateProfile(user, {
                        displayName: `${data.prenom}`,
                    });

                    await sendEmailVerification(user);
    
                    authService.register(data)
                    .then((res) =>{
                        navigation.navigate("VerifyEmail");
                        Toast.show({
                            type: "success",
                            position: "top",
                            text1: "Enregistrement réussie"
                        });
                        
                    })
                    .catch((err) =>{
                        Toast.show({
                            type: "error",
                            position: "top",
                            text1: "Erreur :" + err
                        });
                        LoggerService.log( "Erreur lors de l'enregistrement d'un utilisateur en BDD : " + err.message );
                    });
                }
            }
            catch(err){
                LoggerService.log( "Erreur lors de l'enregistrement d'un utilisateur sur Firebase : " + err.message );
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: handleFirebaseError(err)
                });
            }
            setLoading(false);
        }
    };

    const handleFirebaseError = (error) => {
        switch (error.code) {
            case 'auth/email-already-in-use':
                return 'Cette adresse e-mail est déjà utilisée.';
            case 'auth/invalid-email':
                return 'Adresse e-mail invalide.';
            case 'auth/operation-not-allowed':
                return "L'inscription par e-mail et mot de passe est désactivée.";
            case 'auth/weak-password':
                return 'Le mot de passe est trop faible.';
            default:
                return "Une erreur inconnue s'est produite. Veuillez réessayer.";
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

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
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            justifyContent: "center",
            width: "90%",
            top: - (Constants.statusBarHeight + 10),
            borderRadius: 10,
            marginLeft: "auto",
            marginRight: "auto",
        },
        title: {
            top: - (Constants.statusBarHeight + 10),
            color: colors.text,
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
            backgroundColor: colors.quaternary,
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
            borderRadius: 10
        },
        textButton:{
            color: "white"
        },
        errorInput: {
            color: "red"
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontLight:{
            fontFamily: fonts.bodySmall.fontFamily
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        }
        
    });

    return (
        <>
            <Image style={styles.image} source={wallpaper_login} />
            <View style={{height: "100%", width: "100%", paddingTop: Constants.statusBarHeight + 10,}}>
                <Back
                    isWithBackground={true}   
                />
                <KeyboardAwareScrollView contentContainerStyle={styles.register}>
                    <Text style={[styles.title, styles.textFontRegular]}>S'inscrire</Text>
                    <View style={styles.form}>
                        
                        {errors.email && <Text style={[styles.errorInput, styles.textFontRegular]}>Email obligatoire</Text>}
                        <Text style={[styles.textInput, styles.textFontRegular]}>Email :</Text>
                        <TextInput
                            style={[styles.input, styles.textFontRegular]}
                            placeholder="Email"
                            placeholderTextColor={colors.secondary}
                            onChangeText={(text) => setValue("email", text)}
                            {...register("email", { 
                                required: true,
                                pattern: {
                                    value: /\S+@\S+\.\S+/,
                                    message: "Email invalide",
                                },
                            })}
                        />
                        {errors.prenom && <Text style={[styles.errorInput, styles.textFontRegular]}>Prenom obligatoire</Text>}
                        <Text style={[styles.textInput, styles.textFontRegular]}>Prénom :</Text>
                        <TextInput
                            style={[styles.input, , styles.textFontRegular]}
                            placeholder="Votre prenom"
                            placeholderTextColor={colors.secondary}
                            onChangeText={(text) => setValue("prenom", text)}
                            defaultValue={getValues("prenom")}
                            {...register("prenom", { required: true })}
                        />
                        {errors.password && <Text style={[styles.errorInput, styles.textFontRegular]}>Le mot de passe doit contenir au moins 6 caractères</Text>}
                        <Text style={[styles.textInput, styles.textFontRegular]}>Mot de passe :</Text>
                        <View style={[{flexDirection: "row", justifyContent: "space-between", paddingRight: 10}, styles.input]}>
                            <TextInput
                                style={[styles.textFontRegular, {width: "90%"}]}
                                placeholder="Mot de passe"
                                placeholderTextColor={colors.secondary}
                                secureTextEntry={!isPasswordVisible}
                                onChangeText={(text) => setValue("password", text)}
                                defaultValue={getValues("password")}
                                {...register("password", { required: true, minLength: 6 })}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={{alignSelf: "center"}}>
                                <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} />
                            </TouchableOpacity>
                        </View>
                        
                        {errors.password_confirm && <Text style={[styles.errorInput, styles.textFontRegular]}>Confirmation du mot de passe obligatoire</Text>}
                        {!evenPassword && <Text style={[styles.errorInput, styles.textFontRegular]}>Mots de passe différents</Text>}
                        <Text style={[styles.textInput, styles.textFontRegular]}>Confirmation du mot de passe :</Text>
                        <View style={[{flexDirection: "row", justifyContent: "space-between", paddingRight: 10}, styles.input]}>
                            <TextInput
                                style={[styles.textFontRegular, {width: "90%"}]}
                                placeholder="Confirmation mot de passe"
                                placeholderTextColor={colors.secondary}
                                secureTextEntry={!isPasswordVisible}
                                onChangeText={(text) => setValue("password_confirm", text)}
                                defaultValue={getValues("password_confirm")}
                                {...register("password_confirm", { required: true })}
                            />
                            <TouchableOpacity onPress={togglePasswordVisibility} style={{alignSelf: "center"}}>
                                <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} />
                            </TouchableOpacity>
                        </View>
                        
                        <View style={styles.registerButton}>
                                {!loading ?
                                    <Button
                                        onPress={handleSubmit(submitRegister)}
                                        type="primary"
                                        size={"m"}
                                    >
                                        <Text style={[styles.textButton, styles.textFontMedium]}>S'enregister</Text>
                                    </Button>
                                :
                                    <Button
                                        type="quaternary"
                                        size={"m"}
                                    >
                                        <ActivityIndicator size="large" color={colors.background} />
                                    </Button>
                                }
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </>
    );
};
  

module.exports = SignUpScreen;