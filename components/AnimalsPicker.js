import { StyleSheet, View, Text, TouchableOpacity, ScrollView, FlatList } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from "expo-image";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import FileStorageService from "../services/FileStorageService";
import { useTheme } from 'react-native-paper';
import { PanGestureHandler } from "react-native-gesture-handler";
import React, { useRef } from "react";
import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const AnimalsPicker = ({ animaux, setSelected, selected, mode, buttonAdd=false, setValue=undefined, setDate=undefined, valueName=undefined, inModal=false, selectAll=false }) => {
    const fileStorageService = new FileStorageService();
    const { currentUser } = useAuth();
    const { colors, fonts } = useTheme();
    const flatListRef = useRef();


    const changeSelectedAnimals = (animal) => {
        if( animal.id === "select_all"){
            if( selected.length === animaux.length ){
                setValue(valueName, undefined);
                setSelected([]);
            } else{
                setValue(valueName, animaux.map(e => e.id));
                setSelected(animaux);
            }
            return;
        }

        const found = animaux.find(e => e.id === animal.id);
        if(found){
            if(mode === "single"){
                setSelected(animaux.filter((a) => a.id === animal.id));
                if(setValue !== undefined){
                    if(animal.id !== null ? setValue("id", animal.id) : null);
                    if(animal.nom !== null ? setValue("nom", animal.nom) : null);
                    if(animal.espace !== null ? setValue("espece", animal.espece) : null);
                    if(animal.datenaissance !== null ? setValue("datenaissance", animal.datenaissance) : null);
                    if(animal.race !== null ? setValue("race", animal.race) : null );
                    if(animal.taille !== null ? setValue("taille", String(animal.taille)) : null);
                    if(animal.poids !== null ? setValue("poids", String(animal.poids)) : null);
                    if(animal.sexe !== null ? setValue("sexe", animal.sexe) : null);
                    if(animal.couleur !== null ? setValue("couleur", animal.couleur) : null);
                    if(animal.nomPere !== null ? setValue("nomPere", animal.nomPere) : null);
                    if(animal.nomMere !== null ? setValue("nomMere", animal.nomMere) : null);
                    if(animal.datenaissance != null ? setDate(animal.datenaissance) : setDate(null));
                }
                
            }
            if(mode === "multiple"){
                const foundSelected = selected.find(e => e.id === animal.id);
                if (foundSelected){
                    setValue(valueName, selected.filter(e => e.id !== animal.id).map(e => e.id));
                    setSelected(selected.filter((a) => a.id !== animal.id));
                } else{
                    if(selected.length === 0){
                        setValue(valueName, animaux.filter(e => e.id === animal.id).map(e => e.id));
                        setSelected(animaux.filter((a) => a.id === animal.id));
                    } else{
                        setValue(valueName, selected.concat(animaux.filter(e => e.id === animal.id)).map(e => e.id));
                        setSelected(selected.concat(animaux.filter((a) => a.id === animal.id)));
                    }
                }
            }
        } 
    }

    const checkSelected = (animal) => {
        if(selected.length > 0){
            const found = selected.some(e => e.id == animal.id);
            return found;
        }
    }

    const reset = () =>{
        setSelected([]);
        setValue("id", null);
        setValue("nom", null);
        setValue("espece", null);
        setValue("datenaissance", null);
        setValue("race", null);
        setValue("taille", null);
        setValue("poids", null);
        setValue("sexe", null);
        setValue("couleur", null);
        setValue("nomPere", null);
        setValue("nomMere", null);
        today = new Date();
        jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
        mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
        annee = today.getFullYear();
        setDate(String(jour + "/" + mois + "/" + annee));
    }

    const truncateAnimalName = (name) => {
        if (name.length <= 15) {
            return name; // Le nom est déjà court
        }
    
        // Tronquer à 10 caractères
        const truncated = name.slice(0, 15);
    
        // Vérifier s'il y a un espace dans les 10 premiers caractères
        const lastSpaceIndex = truncated.indexOf(" ");
        if (lastSpaceIndex !== -1) {
            return truncated.slice(0, lastSpaceIndex); // Tronquer au dernier espace
        }
    
        return truncated + "..."; // Ajouter "..." après 10 caractères
    };

    const displayedAnimaux = selectAll
        ? [{ id: 'select_all', nom: 'Tous', image: null }, ...animaux]
        : animaux;

    const styles = StyleSheet.create({
        add:{
            width: 60,
            height: 60,
            zIndex: 1
        },
        avatar: {
            width: 60,
            height: 60,
            borderRadius: 50,
            zIndex: 1,
            justifyContent: "center"
        },
        avatarText: {
            textAlign: "center", 
            color: colors.background, 
            fontSize: 30
        },
        defaultAvatar:{
            backgroundColor: colors.quaternary,
            borderColor: colors.quaternary,
            borderWidth: 0.5,
        },
        selectedAvatar:{
            backgroundColor: colors.default_dark,
            borderColor: colors.default_dark,
            borderWidth: 3,
        },
        containerAnimaux:{
            display: "flex",
            flexDirection: "row",
            height: "100%",
    
        },
        containerAvatar:{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            alignSelf: "center",
            marginLeft: 5,
        },
        defaultText:{
            color: colors.quaternary
        },
        selectedText:{
            color: colors.accent
        },
        containerAvatarWithoutImage:{
            height: 65, 
            width: 65, 
            borderRadius: 50, 
            justifyContent: "center", 
            alignItems: "center"
        },
        containerWithGradient:{
            width: 70, 
            height: 70, 
            borderRadius: 50, 
            alignItems: "center", 
            justifyContent: "center"
        },
        containerAvatarWithImage:{
            width: 65, 
            height: 65, 
            borderRadius: 50, 
            alignItems: "center", 
            justifyContent: "center"
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
    });

    const ListComponent = inModal ? BottomSheetFlatList : FlatList;

    return(
        <ListComponent
            data={displayedAnimaux}
            ref={flatListRef}
            key={(item) => item.id.toString()}
            horizontal
            nestedScrollEnabled={true} // Permet le scroll imbriqué
            showsHorizontalScrollIndicator={false} // Masque la barre de scroll
            keyboardShouldPersistTaps="handled" // Gère les taps quand le clavier est actif
            contentContainerStyle={{ flexGrow: 1 }}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.containerAvatar} onPress={()=>changeSelectedAnimals(item)} key={item.id} onTouchStart={(e) => e.stopPropagation()}>
                    <View style={styles.containerAvatar}>
                        { item.image !== null ? 
                        <LinearGradient
                            colors={checkSelected(item) ? [colors.accent, colors.tertiary] : ['transparent', 'transparent']}
                            style={styles.containerWithGradient}
                            start={{ x: 0.2, y: 0 }} // Dégradé commence à gauche
                        >
                            <View style={[styles.containerAvatarWithImage, checkSelected(item) ? {backgroundColor: colors.background} : {backgroundColor: "transparent"}]}>
                                <Image style={[styles.avatar]} source={{uri:  fileStorageService.getFileUrl( item.image, currentUser.uid ) }} cachePolicy="disk" />
                            </View>
                        </LinearGradient>
                        :
                        <LinearGradient
                            colors={checkSelected(item) ? [colors.accent, colors.quaternary] : ['transparent', 'transparent']}
                            style={styles.containerWithGradient}
                            start={{ x: 0.2, y: 0 }} // Dégradé commence à gauche
                        >
                            <View style={[styles.containerAvatarWithoutImage, checkSelected(item) ? {backgroundColor: colors.background} : {backgroundColor: "transparent"}]}>
                                <View style={[styles.avatar, checkSelected(item) ? {backgroundColor: colors.default_dark} : {backgroundColor: colors.quaternary}]}>
                                    <Text style={[styles.avatarText, styles.textFontRegular]}>{ item.id === "select_all" ? "+" : item.nom[0]}</Text>
                                </View>
                            </View>
                        </LinearGradient>
                        }
                        <Text style={[(checkSelected(item) ? styles.selectedText : styles.defaultText), styles.textFontRegular]}>{truncateAnimalName(item.nom)}</Text>
                    </View>
                </TouchableOpacity>
            )}
        />
    );
    
}

export default AnimalsPicker;