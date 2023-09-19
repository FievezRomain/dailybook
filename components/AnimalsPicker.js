import Variables from "./styles/Variables";
import { getImagePath } from '../services/Config';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import plus from '../assets/plus.png'

const AnimalsPicker = ({ animaux, setSelected, selected, mode, buttonAdd=false, setValue=undefined, setDate=undefined }) => {

    const changeSelectedAnimals = (animal) => {
        const found = animaux.find(e => e.nom === animal.nom);
        if(found){
            if(mode === "single"){
                setSelected(animaux.filter((a) => a.id === animal.id));
                if(animal.id !== null ? setValue("id", animal.id) : null);
                if(animal.nom !== null ? setValue("nom", animal.nom) : null);
                if(animal.espace !== null ? setValue("espece", animal.espece) : null);
                if(animal.datenaissance !== null ? setValue("date", animal.datenaissance) : null);
                if(animal.race !== null ? setValue("race", animal.race) : null );
                if(animal.taille !== null ? setValue("taille", String(animal.taille)) : null);
                if(animal.poids !== null ? setValue("poids", String(animal.poids)) : null);
                if(animal.sexe !== null ? setValue("sexe", animal.sexe) : null);
                if(animal.couleur !== null ? setValue("couleur", animal.couleur) : null);
                if(animal.nomPere !== null ? setValue("nomPere", animal.nomPere) : null);
                if(animal.nomMere !== null ? setValue("nomMere", animal.nomMere) : null);
                if(animal.datenaissance != null ? setDate(new Date(animal.datenaissance)) : setDate(new Date(new Date().getTime())));
            }
            if(mode === "multiple"){
                setSelected([...selected, animaux.filter((a) => a.nom != animal.nom)]);
            }
        } 
    }

    const checkSelected = (animal) => {
        if(selected.length > 0){
            const found = selected.some(e => e.id === animal.id);
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
        setDate(new Date(new Date().getTime()));
    }
    return(
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} indicatorStyle="white" contentContainerStyle={styles.containerAnimaux}>
            {buttonAdd && 
            <TouchableOpacity style={styles.containerAvatar} onPress={()=>reset()}>
                <View style={styles.containerAvatar}>
                    <Image source={plus} style={styles.add}/>
                    <Text>Ajouter</Text>
                </View>
            </TouchableOpacity>
            }
            {animaux.map((animal, index) => {
                return (
                    <TouchableOpacity style={styles.containerAvatar} onPress={()=>changeSelectedAnimals(animal)} key={animal.id}>
                        <View style={styles.containerAvatar}>
                            { animal.image !== null ? 
                            <Image style={[styles.avatar, checkSelected(animal) ? styles.selectedAvatar : styles.defaultAvatar]} source={{uri: `${getImagePath()}${animal.image}`}} />
                            :
                            <View style={[styles.avatar, checkSelected(animal) ? styles.selectedAvatar : styles.defaultAvatar]}>
                                <Text style={styles.avatarText}>{animal.nom[0]}</Text>
                            </View>
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
        borderWidth: 2,
        zIndex: 1,
        justifyContent: "center"
    },
    avatarText: {
        textAlign: "center", 
        color: "white", 
        fontSize: 30
    },
    defaultAvatar:{
        backgroundColor: Variables.bouton,
        borderColor: Variables.bouton,
    },
    selectedAvatar:{
        backgroundColor: Variables.fond,
        borderColor: Variables.fond,
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
        marginRight: 20
    },
    defaultText:{
        color: Variables.bouton
    },
    selectedText:{
        color: Variables.fond
    },
});

export default AnimalsPicker;