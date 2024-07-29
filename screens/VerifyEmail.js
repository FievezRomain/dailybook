import { View, Text, StyleSheet, Image, TextInput, ActivityIndicator } from "react-native";
import wallpaper_login from "../assets/wallpaper_login.png";
import variables from "../components/styles/Variables";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Button from "../components/Button";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { sendEmailVerification } from "firebase/auth";
import Constants from 'expo-constants';
import Toast from "react-native-toast-message";
import { useState, useEffect } from "react";


const VerifyEmailScreen = ({ navigation })=> {
    const { currentUser } = useAuth();
    const [canResend, setCanResend] = useState(true);
    const [timer, setTimer] = useState(0);

    const handleResendVerificationEmail = async () => {
        if (currentUser && canResend) {
            await sendEmailVerification(currentUser);
            setCanResend(false);
            setTimer(120);
            Toast.show({
                type: "success",
                position: "top",
                text1: "Un email vient de vous être envoyé"
            });
        }
    };

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);

            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    return (
        <>
            <Image style={styles.image} source={wallpaper_login} />
            <View style={{height: "100%", width: "100%", paddingTop: Constants.statusBarHeight + 10,}}>
                <KeyboardAwareScrollView contentContainerStyle={styles.register}>
                    <View style={{padding: 40, marginBottom: 30}}>
                        <Text style={[{textAlign: "center", textTransform: "uppercase", fontSize: 16}, styles.textFontMedium]}>Veuillez valider votre adresse email pour continuer</Text>
                    </View>
                    <View style={{width: "70%", alignSelf: "center"}}>
                        <View style={{shadowColor: variables.bai, shadowOpacity: 0.5, shadowRadius: 1, shadowOffset: {width: 0, height: 1}}}>
                            {!canResend ?
                                <Button
                                    size={"m"}
                                    type={"secondary"}
                                >
                                    <Text style={styles.textFontMedium}>Renvoyer l'email de validation dans {timer}</Text>
                                </Button>
                            :
                                <Button
                                    onPress={() => handleResendVerificationEmail()}
                                    size={"m"}
                                    type={"primary"}
                                >
                                    <Text style={styles.textFontMedium}>Envoyer l'email de validation</Text>
                                </Button>
                            }
                        </View>
                        <View style={{marginTop: 10, shadowColor: variables.bai, shadowOpacity: 0.5, shadowRadius: 1, shadowOffset: {width: 0, height: 1}}}>
                            <Button
                                onPress={() => navigation.navigate("Login")}
                                size={"m"}
                                type={"quaternary"}
                            >
                                <Text style={styles.textFontMedium}>Je me connecte</Text>
                            </Button>
                        </View>
                        
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </>
    );
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
        backgroundColor: variables.fond
    },
    register: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        paddingHorizontal: 10,
        paddingVertical: 80
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
        marginTop: 100,
        padding: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "90%",
        borderRadius: 10,
        marginLeft: "auto",
        marginRight: "auto",
    },
    title: {
        top: - (Constants.statusBarHeight + 10),
        color: variables.texte,
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
  

module.exports = VerifyEmailScreen;