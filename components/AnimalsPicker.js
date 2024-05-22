import Variables from "./styles/Variables";
import { getImagePath } from '../services/Config';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import plus from '../assets/plus.png'
import variables from "./styles/Variables";
import { LinearGradient } from 'expo-linear-gradient';

const AnimalsPicker = ({ animaux, setSelected, selected, mode, buttonAdd=false, setValue=undefined, setDate=undefined, valueName=undefined }) => {

    const changeSelectedAnimals = (animal) => {
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
    return(
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} indicatorStyle="white" contentContainerStyle={styles.containerAnimaux}>
            {animaux.map((animal, index) => {
                return (
                    <TouchableOpacity style={styles.containerAvatar} onPress={()=>changeSelectedAnimals(animal)} key={animal.id}>
                        <View style={styles.containerAvatar}>
                            { animal.image !== null ? 
                            <LinearGradient
                                colors={checkSelected(animal) ? [variables.alezan, variables.isabelle, variables.aubere] : ['transparent', 'transparent']}
                                style={styles.containerWithGradient}
                                start={{ x: 0.2, y: 0 }} // Dégradé commence à gauche
                            >
                                <View style={[styles.containerAvatarWithImage, checkSelected(animal) ? {backgroundColor: variables.blanc} : {backgroundColor: "transparent"}]}>
                                    <Image style={[styles.avatar]} source={{uri: `${getImagePath()}${animal.image}`}} />
                                </View>
                            </LinearGradient>
                            :
                            <LinearGradient
                                colors={checkSelected(animal) ? [variables.alezan, variables.isabelle, variables.aubere] : ['transparent', 'transparent']}
                                style={styles.containerWithGradient}
                                start={{ x: 0.2, y: 0 }} // Dégradé commence à gauche
                            >
                                <View style={[styles.containerAvatarWithoutImage, checkSelected(animal) ? {backgroundColor: variables.blanc} : {backgroundColor: "transparent"}]}>
                                    <View style={[styles.avatar, checkSelected(animal) ? {backgroundColor: variables.alezan} : {backgroundColor: variables.isabelle}]}>
                                        <Text style={styles.avatarText}>{animal.nom[0]}</Text>
                                    </View>
                                </View>
                            </LinearGradient>
                            }
                            <Text style={checkSelected(animal) ? styles.selectedText : styles.defaultText}>{animal.nom}</Text>
                        </View>
                    </TouchableOpacity>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    add:{
        width: 60,
        height: 60,
        tintColor: Variables.bouton,
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
        color: "white", 
        fontSize: 30
    },
    defaultAvatar:{
        backgroundColor: Variables.isabelle,
        borderColor: Variables.isabelle,
        borderWidth: 0.5,
    },
    selectedAvatar:{
        backgroundColor: Variables.bai,
        borderColor: Variables.bai,
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
        color: Variables.isabelle
    },
    selectedText:{
        color: Variables.alezan
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
});

export default AnimalsPicker;