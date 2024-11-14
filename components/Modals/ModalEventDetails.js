import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text, TextInput, ActivityIndicator } from "react-native";
import { Entypo, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import RatingInput from '../RatingInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EventService from '../../services/EventService';
import Toast from "react-native-toast-message";
import LoggerService from '../../services/LoggerService';
import FileStorageService from "../../services/FileStorageService";
import { Image } from "expo-image";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import DateUtils from '../../utils/DateUtils';
import { useTheme } from 'react-native-paper';
import ModalEditGeneric from './ModalEditGeneric';

const ModalEventDetails = ({ event = undefined, isVisible, setVisible, animaux, handleEventsChange }) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const eventService = new EventService();
    var eventBeforeEditCommentaire;
    var eventBeforeEditRessenti;
    var eventBeforeEditState;
    var eventBeforeEditDepense;
    const fileStorageService = new FileStorageService();
    const dateUtils = new DateUtils();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        eventBeforeEditCommentaire = event.commentaire;
        eventBeforeEditRessenti = event.note;
        eventBeforeEditState = event.state;
        eventBeforeEditDepense = event.depense;
    }, [isVisible])

    const closeModal = () => {
        event.commentaire = eventBeforeEditCommentaire;
        event.note = eventBeforeEditRessenti;
        event.state = eventBeforeEditState;
        event.depense = eventBeforeEditDepense;
        setVisible(false);
    };

    const handleRatingChange = (value) =>{
        event.note = value;
    }

    const getColorEventType = () =>{
        if( event === undefined ){
            return;
        }
        if( event.eventtype === "depense" ){
            return colors.quaternary;
        }
        if( event.eventtype === "balade" ){
            return colors.accent;
        }
        if( event.eventtype === "soins" ){
            return colors.neutral;
        }
        if( event.eventtype === "concours" ){
            return colors.primary;
        }
        if( event.eventtype === "entrainement" ){
            return colors.tertiary;
        }
        if( event.eventtype === "autre" ){
            return colors.error;
        }
        if( event.eventtype === "rdv" ){
            return colors.text;
        }
    }

    const getTitleEventType = () =>{
        if( event === undefined ){
            return;
        }
        if( event.eventtype === "depense" ){
            return "Dépense";
        }
        if( event.eventtype === "balade" ){
            return "Balade";
        }
        if( event.eventtype === "soins" ){
            return "Soin";
        }
        if( event.eventtype === "concours" ){
            return "Concours";
        }
        if( event.eventtype === "entrainement" ){
            return "Entrainement";
        }
        if( event.eventtype === "autre" ){
            return "Autre";
        }
        if( event.eventtype === "rdv" ){
            return "Rendez-vous";
        }
    }

    const getTextEventType = () =>{
        if( event === undefined ){
            return;
        }
        if( event.eventtype === "depense" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextBlack}, styles.textFontBold]}>{event.nom}</Text>
                    <Text style={[{color: styles.colorTextBlack}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, colors.accent)}
                </>
            
            );
        }
        if( event.eventtype === "balade" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>{event.nom}</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, colors.background)}
                </>
            );
        }
        if( event.eventtype === "soins" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>{event.nom}</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, colors.background)}
                </>
            );
        }
        if( event.eventtype === "concours" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>{event.nom}</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, colors.background)}
                </>
            );
        }
        if( event.eventtype === "entrainement" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextBlack}, styles.textFontBold]}>{event.nom}</Text>
                    <Text style={[{color: styles.colorTextBlack}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, colors.accent)}
                </>
            
            );
        }
        if( event.eventtype === "autre" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>{event.nom}</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, colors.background)}
                </>
            );
        }
        if( event.eventtype === "rdv" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>{event.nom}</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, colors.background)}
                </>
            );
        }
    }

    const getIconEventType = () =>{
        if( event === undefined ){
            return;
        }
        if( event.eventtype === "depense" ){
            return (<FontAwesome6 name="money-bill-wave" size={40} color={colors.background}/>);
        }
        if( event.eventtype === "balade" ){
            return (<Entypo name="compass" size={40} color={colors.background} />);
        }
        if( event.eventtype === "soins" ){
            return (<FontAwesome6 name="hand-holding-medical" size={40} color={colors.background}/>);
        }
        if( event.eventtype === "concours" ){
            return (<FontAwesome name="trophy" size={40} color={colors.background}/>);
        }
        if( event.eventtype === "entrainement" ){
            return (<Entypo name="traffic-cone" size={40} color={colors.background}/>);
        }
        if( event.eventtype === "autre" ){
            return (<FontAwesome6 name="check-circle" size={40} color={colors.background} />);
        }
        if( event.eventtype === "rdv" ){
            return (<FontAwesome name="stethoscope" size={40} color={colors.background}/>);
        }
    }

    // Fonction pour convertir la couleur hexadécimale en RGBA
    function hexToRgba(hex, opacity) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` : null;
    }

    const convertDateToText = (date) =>{
        if(date == undefined){
          return "";
        }
        options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateObject  = new Date(date);
        let dateString = dateObject.toLocaleDateString("fr-FR", options);
        dateString = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        return dateString;
    }

    const getAnimalById = (idAnimal) =>{
        var animal = animaux.filter((animal) => animal.id === idAnimal)[0];

        return animal;
    }

    function isValidString(str) {
        return str !== null && str !== undefined && str.trim() !== "";
    }

    const checkOverdueEvent = (event, color) =>{
        var dateEvent = new Date(event.dateevent).setHours(0, 0, 0, 0);
        var currentDate = new Date().setHours(0, 0, 0, 0);

        if( (dateEvent < currentDate) && event.state !== "Terminé" ){
            // Calcul de la différence en millisecondes
            const differenceInMilliseconds = Math.abs(currentDate - dateEvent);

            // Convertir la différence en jours
            const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));
            return(
                <Text style={{color: color}}>{differenceInDays} jour(s) de retard</Text>
            )
        }
    }

    const handleModifyEvent = () =>{
        if(loading || !checkNumericFormat()){
            return;
        }
        setLoading(true);

        let data = {};
        data["id"] = event.id;
        data["commentaire"] = event.commentaire;
        data["depense"] = event.depense;
        data["animaux"] = event.animaux;
        data["note"] = event.note;
        data["email"] = currentUser.email;

        eventService.updateCommentaireNote(data)
            .then((reponse) => {
                handleEventsChange();
                setVisible(false);
                setLoading(false);
            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la MAJ du commentaire et la note d'un event : " + err.message );
                setLoading(false);
            })

    }

    const isWithRating = () => {
        return event.eventtype != "depense" && event.eventtype != "rdv" && event.eventtype != "soins";
    }

    const checkNumericFormat = () => {
        if( event.depense != undefined )
        {
            const numericValue = parseFloat(event.depense.replace(',', '.').replace(" ", ""));
            if (isNaN(numericValue)) {
                Toast.show({
                    position: "top",
                    type: "error",
                    text1: "Problème de format sur la valeur de dépense",
                    text2: "Seul les chiffres, virgule et point sont acceptés"
                });
                return false;
            } else{
                event.depense = numericValue;
            }
        }
        return true;
      }

    const styles = StyleSheet.create({
        background: {
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: "flex-end",
            height: "100%",
        },
        emptyBackground: {
            height: "80%",
        },
        card: {
            backgroundColor: colors.onSurface,
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
            height: "80%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
        },
        enteteActions: {
            flexDirection: "row",
            justifyContent: "flex-end",
            padding: 10
        },
        closeButton: {
            backgroundColor: colors.onSurface,
            paddingHorizontal: 3,
            paddingVertical: 5,
            borderRadius: 15,
            shadowColor: "black",
            shadowOpacity: 0.1,
            elevation: 1,
            shadowOffset: {
                width: 0,
                height: 1
            }
        },
        footer: {
            height: "15%",
        },
        footerActions: {
            flexDirection: "row",
            justifyContent: "space-around",
        },
        separator: {
            borderTopWidth: 0.2,
            borderTopColor: colors.onSurface,
            shadowColor: "black",
            shadowOpacity: 1,
            elevation: 5,
            shadowOffset: {
                width: 0,
                height: -15
            },
            shadowRadius: 2,
            height: 10
        },
        balade: {
            backgroundColor: colors.accent,
        },
        autre: {
            backgroundColor: colors.error,
        },
        rdv: {
            backgroundColor: colors.text,
        },
        soins: {
            backgroundColor: colors.neutral,
        },
        entrainement: {
            backgroundColor: colors.tertiary,
        },
        concours: {
            backgroundColor: colors.primary,
        },
        depense: {
            backgroundColor: colors.quaternary,
        },
        tableauIcon: {
            justifyContent: "center",
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
        },
        tableauPrimaryInfos: {
            paddingVertical: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
        },
        tableauSecondaryInfo:{
            paddingVertical: 10,
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
        },
        tableauInfos:{
            marginLeft: 30,
            marginTop: 10
        },
        colorTextBlack:{
            color: colors.accent,
        },
        colorTextWhite:{
            color: colors.background,
        },
        animauxPicturesContainer:{
            marginRight: 10,
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "flex-end",
        },
        avatarText: {
            color: "white",
            textAlign: "center"
        },
        avatar: {
            width: 25,
            height: 25,
            borderRadius: 15,
            zIndex: 1,
            justifyContent: "center"
        },
        tableauxContainer:{
            marginBottom: 15
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
            paddingBottom: 15,
            backgroundColor: getColorEventType()
        },
        handleStyleModal:{
            backgroundColor: getColorEventType(),
            borderTopEndRadius: 15,
            borderTopStartRadius: 15
          },
          handleIndicatorStyle:{
            backgroundColor: colors.background
          }
    });

    return (
        <ModalEditGeneric
            isVisible={isVisible}
            setVisible={setVisible}
            arrayHeight={["90%"]}
            handleStyle={styles.handleStyleModal}
            handleIndicatorStyle={styles.handleIndicatorStyle}
        >
                    
                            
            <View style={styles.containerActionsButtons}>
                <TouchableOpacity onPress={closeModal} style={{width:"33,33%", alignItems: "center"}}>
                    <Text style={[{color: colors.background}, styles.textFontRegular]}>Annuler</Text>
                </TouchableOpacity>
                <View style={{width:"33,33%", alignItems: "center"}}>
                        <Text style={[styles.textFontBold, {color: colors.background}]}>{getTitleEventType()}</Text>
                </View>
                <TouchableOpacity onPress={() => handleModifyEvent()} style={{width:"33,33%", alignItems: "center"}}>
                    { loading ? 
                            <ActivityIndicator size={10} color={colors.accent} />
                        :
                            <Text style={[{color: colors.background}, styles.textFontRegular]}>Enregistrer</Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={[styles.tableauPrimaryInfos, {backgroundColor: hexToRgba(getColorEventType(), 0.5)}]}>
                            
                <View style={{ justifyContent: "center", marginLeft: 20}}>
                    {getTextEventType()}
                </View>
                <View style={styles.animauxPicturesContainer}>
                    {event !== undefined && animaux.length !== 0 && event.animaux.map((eventAnimal, index) => {
                        var animal = getAnimalById(eventAnimal);
                        return(
                            <View key={animal.id} style={{marginRight: -3}}>
                                <View style={{height: 25, width: 25, backgroundColor: colors.accent, borderRadius: 15, justifyContent: "center"}}>
                                    { animal.image !== null ? 
                                        <Image style={[styles.avatar]} source={{uri: fileStorageService.getFileUrl( animal.image, currentUser.uid ) }} cachePolicy="disk" />
                                        :
                                        <Text style={[styles.avatarText, styles.textFontRegular]}>{animal.nom[0]}</Text>
                                    }
                                </View>
                            </View>
                        )
                    })}
                </View>

            </View>
            {isWithRating() &&
                <View style={[styles.tableauSecondaryInfo, {backgroundColor: hexToRgba(getColorEventType(), 0.2)}]}>
                    <RatingInput
                        onRatingChange={handleRatingChange}
                        defaultRating={event.note !== undefined && event.note !== null ? event.note : 0}
                        margin={0}
                        size={25}
                        color={getColorEventType()}
                    />
                </View>
            }
            <KeyboardAwareScrollView>
                <View style={styles.tableauInfos}>
                    {isValidString(event.heuredebutevent) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Heure : {event.heuredebutevent}</Text>
                        </View>
                    }
                    {isValidString(event.discipline) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Discipline : {event.discipline}</Text>
                        </View>
                    }
                    {isValidString(event.lieu) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Lieu : {event.lieu}</Text>
                        </View>
                    }
                    {isValidString(event.datefinbalade) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Date de fin de balade : {event.datefinbalade.includes("-") ? dateUtils.dateFormatter(event.datefinbalade, "yyyy-mm-dd", "-") : event.datefinbalade}</Text>
                        </View>
                    }
                    {isValidString(event.heurefinbalade) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Heure de fin de balade : {event.heurefinbalade}</Text>
                        </View>
                    }
                    {isValidString(event.epreuve) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Épreuve : {event.epreuve}</Text>
                        </View>
                    }
                    {isValidString(event.dossart) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Dossart : {event.dossart}</Text>
                        </View>
                    }
                    {event.placement != null && event.placement != undefined &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Classement : {event.placement}</Text>
                        </View>
                    }
                    {isValidString(event.specialiste) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Spécialiste : {event.specialiste}</Text>
                        </View>
                    }
                    <View style={{marginBottom: 5, width: "90%"}}>
                        <Text style={[styles.textFontRegular, {marginBottom: 5}]}>Dépense : {event.depense}</Text>
                        <TextInput
                            style={[{backgroundColor: colors.quaternary, padding: 10, borderRadius: 5,}, styles.textFontRegular]}
                            placeholder="Exemple : 1"
                            keyboardType="decimal-pad"
                            inputMode="decimal"
                            onChangeText={(text) => event.depense = text}
                            defaultValue={event.depense}
                        />
                    </View>
                    {isValidString(event.traitement) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Traitement : {event.traitement}</Text>
                        </View>
                    }
                    {isValidString(event.datefinsoins) &&
                        <View style={{marginBottom: 5}}>
                            <Text style={styles.textFontRegular}>Date de fin du soin : {event.datefinsoins.includes("-") ? dateUtils.dateFormatter(event.datefinsoins, "yyyy-mm-dd", "-") : event.datefinsoins}</Text>
                        </View>
                    }
                    <View style={{width: "90%"}}>
                        <Text style={[{marginBottom: 5}, styles.textFontRegular]}>Commentaire :</Text>
                        <TextInput
                            style={[{backgroundColor: colors.quaternary, padding: 10, borderRadius: 5, height: 200}, styles.textFontRegular]}
                            multiline={true}
                            numberOfLines={4}
                            maxLength={2000}
                            placeholder="Exemple : Ça s'est très bien passé"
                            onChangeText={(text) => event.commentaire = text}
                            defaultValue={event.commentaire}
                        />
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </ModalEditGeneric>
    );
};

export default ModalEventDetails;
