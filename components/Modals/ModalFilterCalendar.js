import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import AnimalsPicker from "../AnimalsPicker";
import { CalendarFilter } from "../../business/models/CalendarFilter";
import { useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";
import { useAnimaux } from "../../providers/AnimauxProvider";

const ModalFilterCalendar = ({modalVisible, setModalVisible, setFilter, filter}) =>{
    const { colors, fonts } = useTheme();
    const { animaux } = useAnimaux();
    const [selectedAnimals, setSelectedAnimals] = useState([]);
    const { register, handleSubmit, formState: { errors }, setValue, setError, getValues, watch } = useForm();
    const { currentUser } = useAuth();
    const [selectedType, setSelectedType] = useState([]);
    const list = [
        {title: "Balade", id: "balade"},
        {title: "Entraînement", id: "entrainement"},
        {title: "Concours", id: "concours"},
        {title: "Rendez-vous", id: "rdv"},
        {title: "Soins", id: "soins"},
        {title: "Autre", id: "autre"},
        {title: "Depense", id: "depense"},
    ];

    useEffect(() => {
        if(modalVisible){
          //getAnimals();
        }
    }, [modalVisible]);

    /* const getAnimals = async () => {
  
        // Si aucun animal est déjà présent dans la liste, alors
        if(animaux.length == 0){
          // On récupère les animaux de l'utilisateur courant
          var result = await animalsService.getAnimals(currentUser.email);
          // Si l'utilisateur a des animaux, alors
          if(result.length !== 0){
            // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
            setAnimaux(result);
            
          }
        }
      
    }; */

    const sendFilter = () => {
        if( selectedAnimals.length > 0 || selectedType.length > 0 ){
            if( filter ){
                filter = new CalendarFilter(filter.date, selectedAnimals, selectedType, filter.text);
            } else{
                filter = new CalendarFilter(null, selectedAnimals, selectedType, null);
            }

            setFilter(filter);
        }
        setModalVisible(false);
    }

    const reset = () => {
        setFilter(null);
        setSelectedAnimals([]);
        setSelectedType([])
    }

    const checkState = (item) =>{
        var found = selectedType.some(e => e.id == item.id);
        return found;
    }

    const handleSelected = (item) =>{
        const foundSelected = selectedType.find(e => e.id === item.id);

        if (foundSelected){
            setSelectedType(selectedType.filter((a) => a.id !== item.id));
        } else{
            if(selectedType.length === 0){
                setSelectedType(list.filter((a) => a.id === item.id));
            } else{
                setSelectedType(selectedType.concat(list.filter((a) => a.id === item.id)));
            }
        }
    }

    const styles = StyleSheet.create({
        textActionButton:{
            marginLeft: 15
        },
        informationsActionButton:{
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 10
        },
        bottomBar: {
            width: '100%',
            height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
            backgroundColor: colors.text,
            marginTop: 10,
        },
        filtersContainer:{
            height: "70%",
            width: "100%",
            borderRadius: 5,
            flexDirection: "column",
            justifyContent: "space-evenly"
        },
        actionButton:{
            padding: 10,
        },
        card: {
            backgroundColor: colors.background,
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
            height: "50%",
            //flexDirection: "row wrap"
        },
        background: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: "flex-end",
            height: "100%",
        },
        emptyBackground: {
            height: "80%",
        },
        buttonContainer:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
            marginTop: 35,
            marginBottom: 20
        },
        item:{
            backgroundColor: colors.neutral,
            borderRadius: 5,
            margin: 5,
            padding: 10,
        },
        selected:{
            backgroundColor: colors.accent,
        },
        title:{
            color: "white"
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        },
        containerActionsButtons: {
            flexDirection: "row",
            justifyContent: "space-around",
            alignItems: "center",
            width: "100%",
            marginTop: 10,
        },
        contentCard:{
            justifyContent: "space-evenly",
            alignItems: "center"
        },
        itemContainer:{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center"
        },
    });

    return(
        <>
            <ModalEditGeneric
                isVisible={modalVisible}
                setVisible={setModalVisible}
                arrayHeight={["50%"]}
            >
                <View style={styles.containerActionsButtons}>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                        <Text style={[{color: colors.tertiary}, styles.textFontRegular]}>Annuler</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => reset()}>
                        <Text style={[{color: colors.neutral}, styles.textFontRegular]}>Réinitialiser</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={sendFilter}>
                        <Text style={[{color: colors.accent}, styles.textFontRegular]}>Appliquer</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.bottomBar} />
                <View style={styles.contentCard}>
                    <Text style={styles.textFontBold}>Filtrer les événements</Text>
                    <View style={styles.filtersContainer}>
                        <View>
                            <Text style={[styles.textFontRegular, {paddingLeft: 10}]}>Animaux :</Text>
                            <AnimalsPicker
                                animaux={animaux}
                                mode="multiple"
                                selected={selectedAnimals}
                                setSelected={setSelectedAnimals}
                                setValue={setValue}
                                valueName={"animaux"}
                            />
                        </View>

                        <View>
                            <Text style={[styles.textFontRegular, {paddingLeft: 10, marginTop: 20}]}>Types d'événement :</Text>
                            <View style={styles.itemContainer}>
                                {list.map((item, index) => {
                                    return(
                                        <TouchableOpacity key={item.id} onPress={() => { handleSelected(item) }} style={[styles.item, checkState(item) ? styles.selected : null]}>
                                            <Text style={[styles.title, styles.textFontRegular]}>{item.title}</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </View>
            </ModalEditGeneric>
        </>
    );
}

export default ModalFilterCalendar;