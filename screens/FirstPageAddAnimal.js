import React, { useState, useContext, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, ScrollView } from "react-native";
import variables from '../components/styles/Variables';
import Button from '../components/Button';
import ModalAnimal from '../components/Modals/ModalAnimal';
import wallpaper_first_add from "../assets/wallpaper_first_add_animal.jpg";
import { useAuth } from "../providers/AuthenticatedUserProvider";

const FirstPageAddAnimalScreen = ({ navigation })=> {
    const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
    const { currentUser } = useAuth();

    const handleCreatedAnimal = () =>{
        navigation.navigate("App");
    }

    return(
        <>
            <Image style={styles.image} source={wallpaper_first_add} />
            <ModalAnimal
                actionType={"create"}
                isVisible={modalAnimalVisible}
                setVisible={setModalAnimalVisible}
                onModify={handleCreatedAnimal }
            />
            <View style={{width: "100%", height: "100%", alignItems: "center"}}>
                <View style={{width: "80%", marginTop: 200, marginBottom: 50}}>
                    <Text style={[{fontSize: 20, textAlign: "center"}, styles.textFontRegular]}>Bienvenue {currentUser !== null && currentUser !== undefined ? currentUser.displayName : ""}, moi c'est Vasco et pour commencer l'aventure, je te propose d'ajouter un animal.</Text>
                </View>
                <View style={{width: "60%"}}>
                    <Button
                        size={"m"}
                        type={"primary"}
                        onPress={() => setModalAnimalVisible(true)}
                    >
                        <Text style={styles.textFontMedium}>J'enregistre un animal</Text>
                    </Button>
                </View>
                
            </View>
        </>
    )
};

const styles = StyleSheet.create({
    image: {
        flex: 1,
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        position: "absolute",
        justifyContent: "center",
        backgroundColor: variables.gris,
    },
    textFontRegular:{
        fontFamily: variables.fontRegular
    },
    textFontMedium:{
        fontFamily: variables.fontMedium
    }
});

module.exports = FirstPageAddAnimalScreen;