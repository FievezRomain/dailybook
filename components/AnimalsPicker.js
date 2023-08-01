import Variables from "./styles/Variables";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import plus from '../assets/plus.png'

const AnimalsPicker = ({ setAnimaux, animaux, setSelected, selected, mode, buttonAdd=false, setAddingForm=undefined }) => {

    const changeSelectedAnimals = (nom) => {
        const found = animaux.find(e => e.nom === nom);
        if(found){
            setAnimaux(animaux.filter((animal) => animal.nom != "Vasco"));
            classAvatar = styles.defaultAvatar;
            classText = styles.defaultText;
        } else{
            if(mode === "single"){
                setAnimaux([{nom: "Vasco"}]);
            }
            if(mode === "multiple"){
                setAnimaux(animaux.push({nom: "Vasco"}));
            }
            classAvatar = styles.selectedAvatar;
            classText = styles.selectedAvatar;
        }    
    }

    const checkSelected = (id) => {
        const found = animaux.find(e => e.id === id);
        return found;
    }
    return(
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={true} indicatorStyle="white" contentContainerStyle={styles.containerAnimaux}>
            {buttonAdd && 
            <TouchableOpacity style={styles.containerAvatar} onPress={()=>setSelected(null)}>
                <View style={styles.containerAvatar}>
                    <Image source={plus} style={styles.add}/>
                    <Text>Ajouter</Text>
                </View>
            </TouchableOpacity>
            }
            {animaux.map((animal, index) => {
                return (
                    <TouchableOpacity style={styles.containerAvatar} onPress={()=>changeSelectedAnimals(animal.nom)}>
                        <View style={styles.containerAvatar}>
                            <Image style={[styles.avatar, checkSelected(animal.id) ? styles.selectedAvatar : styles.defaultAvatar]} source={animal.image} />
                            <Text style={checkSelected(animal.id) ? styles.selectedText : styles.defaultText}>{animal.nom}</Text>
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
    },
    defaultAvatar:{
        backgroundColor: "white",
        borderColor: 'white',
    },
    selectedAvatar:{
        backgroundColor: Variables.bouton,
        borderColor: Variables.bouton,
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
        color: "white"
    },
    selectedText:{
        color: Variables.bouton
    },
});

export default AnimalsPicker;