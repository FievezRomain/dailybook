import React, { useEffect } from 'react';
import { Modal, StyleSheet, View, TouchableOpacity, Text, TextInput } from "react-native";
import variables from "../styles/Variables";
import { Entypo, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import Button from "../Button";
import RatingInput from '../RatingInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import EventService from '../../services/EventService';
import Toast from "react-native-toast-message";
import LoggerService from '../../services/LoggerService';
import FileStorageService from "../../services/FileStorageService";
import { Image } from "expo-image";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import DateUtils from '../../utils/DateUtils';

const ModalEventDetails = ({ event = undefined, isVisible, setVisible, animaux, handleEventsChange }) => {
    const { currentUser } = useAuth();
    const eventService = new EventService();
    var eventBeforeEditCommentaire;
    var eventBeforeEditRessenti;
    var eventBeforeEditState;
    const fileStorageService = new FileStorageService();
    const dateUtils = new DateUtils();

    useEffect(() => {
        eventBeforeEditCommentaire = event.commentaire;
        eventBeforeEditRessenti = event.note;
        eventBeforeEditState = event.state;
    }, [isVisible])

    const closeModal = () => {
        event.commentaire = eventBeforeEditCommentaire;
        event.note = eventBeforeEditRessenti;
        event.state = eventBeforeEditState;
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
            return variables.rouan;
        }
        if( event.eventtype === "balade" ){
            return variables.bai;
        }
        if( event.eventtype === "soins" ){
            return variables.isabelle;
        }
        if( event.eventtype === "concours" ){
            return variables.alezan;
        }
        if( event.eventtype === "entrainement" ){
            return variables.aubere;
        }
        if( event.eventtype === "autre" ){
            return variables.bai_cerise;
        }
        if( event.eventtype === "rdv" ){
            return variables.bai_brun;
        }
    }

    const getTextEventType = () =>{
        if( event === undefined ){
            return;
        }
        if( event.eventtype === "depense" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextBlack}, styles.textFontBold]}>Dépense</Text>
                    <Text style={[{color: styles.colorTextBlack}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, variables.bai)}
                </>
            
            );
        }
        if( event.eventtype === "balade" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>Balade</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, variables.blanc)}
                </>
            );
        }
        if( event.eventtype === "soins" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>Soins</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, variables.blanc)}
                </>
            );
        }
        if( event.eventtype === "concours" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>Concours</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, variables.blanc)}
                </>
            );
        }
        if( event.eventtype === "entrainement" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextBlack}, styles.textFontBold]}>Entrainement</Text>
                    <Text style={[{color: styles.colorTextBlack}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, variables.bai)}
                </>
            
            );
        }
        if( event.eventtype === "autre" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>Autre</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, variables.blanc)}
                </>
            );
        }
        if( event.eventtype === "rdv" ){
            return (
                <>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontBold]}>Rendez-vous</Text>
                    <Text style={[{color: styles.colorTextWhite}, styles.textFontRegular]}>{convertDateToText(event.dateevent)}</Text>
                    {checkOverdueEvent(event, variables.blanc)}
                </>
            );
        }
    }

    const getIconEventType = () =>{
        if( event === undefined ){
            return;
        }
        if( event.eventtype === "depense" ){
            return (<FontAwesome6 name="money-bill-wave" size={40} color={variables.blanc}/>);
        }
        if( event.eventtype === "balade" ){
            return (<Entypo name="compass" size={40} color={variables.blanc} />);
        }
        if( event.eventtype === "soins" ){
            return (<FontAwesome6 name="hand-holding-medical" size={40} color={variables.blanc}/>);
        }
        if( event.eventtype === "concours" ){
            return (<FontAwesome name="trophy" size={40} color={variables.blanc}/>);
        }
        if( event.eventtype === "entrainement" ){
            return (<Entypo name="traffic-cone" size={40} color={variables.blanc}/>);
        }
        if( event.eventtype === "autre" ){
            return (<FontAwesome6 name="check-circle" size={40} color={variables.blanc} />);
        }
        if( event.eventtype === "rdv" ){
            return (<FontAwesome name="stethoscope" size={40} color={variables.blanc}/>);
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
        let data = {};
        data["id"] = event.id;
        data["commentaire"] = event.commentaire;
        data["animaux"] = event.animaux;
        data["note"] = event.note;
        data["email"] = currentUser.email;

        eventService.updateCommentaireNote(data)
            .then((reponse) => {
                handleEventsChange();
                setVisible(false);
            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la MAJ du commentaire et la note d'un event : " + err.message );
            })

    }

    const isWithRating = () => {
        return event.eventtype != "depense" && event.eventtype != "rdv" && event.eventtype != "soins";
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
            backgroundColor: variables.default,
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
            backgroundColor: variables.default,
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
            borderTopColor: variables.default,
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
            backgroundColor: variables.bai,
        },
        autre: {
            backgroundColor: variables.bai_cerise,
        },
        rdv: {
            backgroundColor: variables.bai_brun,
        },
        soins: {
            backgroundColor: variables.isabelle,
        },
        entrainement: {
            backgroundColor: variables.aubere,
        },
        concours: {
            backgroundColor: variables.alezan,
        },
        depense: {
            backgroundColor: variables.rouan,
        },
        tableauIcon: {
            height: isWithRating() ? "45%" : "55%",
            justifyContent: "center",
            borderTopStartRadius: 10,
            borderTopEndRadius: 10,
        },
        tableauPrimaryInfos: {
            height: isWithRating() ? "35%" : "45%",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between"
        },
        tableauSecondaryInfo:{
            height: "20%",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            marginBottom: 15
        },
        tableauInfos:{
            marginLeft: 30
        },
        colorTextBlack:{
            color: variables.bai,
        },
        colorTextWhite:{
            color: variables.blanc,
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
            height: isWithRating() ? "40%" : "30%",
            marginBottom: 15
        },
        textFontRegular:{
            fontFamily: variables.fontRegular
        },
        textFontMedium:{
            fontFamily: variables.fontMedium
        },
        textFontBold:{
            fontFamily: variables.fontBold
        }
        
    });

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.background}>
                <TouchableOpacity
                    style={styles.emptyBackground}
                    onPress={() => closeModal()}
                ></TouchableOpacity>
                
                <View style={styles.card}>
                    <KeyboardAwareScrollView>
                        <View style={{height: 500}}>
                            
                            <View style={styles.tableauxContainer}>
                                <View style={[styles.tableauIcon, {backgroundColor: hexToRgba(getColorEventType(), 1)}]}>
                                    
                                    <View style={{ alignItems: "center", opacity: 0.6}}>
                                        {getIconEventType()}
                                    </View>

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
                                                    <View style={{height: 25, width: 25, backgroundColor: variables.bai, borderRadius: 15, justifyContent: "center"}}>
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
                                        />
                                    </View>
                                }
                            </View>
                            <View style={styles.tableauInfos}>
                                <Text style={[{marginBottom: 10}, styles.textFontBold]}>{event.nom}</Text>
                                {isValidString(event.heuredebutevent) &&
                                    <Text style={styles.textFontRegular}>Heure : {event.heuredebutevent}</Text>
                                }
                                {isValidString(event.discipline) &&
                                    <Text style={styles.textFontRegular}>Discipline : {event.discipline}</Text>
                                }
                                {isValidString(event.lieu) &&
                                    <Text style={styles.textFontRegular}>Lieu : {event.lieu}</Text>
                                }
                                {isValidString(event.datefinbalade) &&
                                    <Text style={styles.textFontRegular}>Date de fin de balade : {event.datefinbalade.includes("-") ? dateUtils.dateFormatter(event.datefinbalade, "yyyy-mm-dd", "-") : event.datefinbalade}</Text>
                                }
                                {isValidString(event.heurefinbalade) &&
                                    <Text style={styles.textFontRegular}>Heure de fin de balade : {event.heurefinbalade}</Text>
                                }
                                {isValidString(event.epreuve) &&
                                    <Text style={styles.textFontRegular}>Note : {event.epreuve}</Text>
                                }
                                {isValidString(event.dossart) &&
                                    <Text style={styles.textFontRegular}>Dossart : {event.dossart}</Text>
                                }
                                {event.placement != null && event.placement != undefined &&
                                    <Text style={styles.textFontRegular}>Classement : {event.placement}</Text>
                                }
                                {isValidString(event.specialiste) &&
                                    <Text style={styles.textFontRegular}>Spécialiste : {event.specialiste}</Text>
                                }
                                {isValidString(event.depense) &&
                                    <Text style={styles.textFontRegular}>Dépense : {event.depense}</Text>
                                }
                                {isValidString(event.traitement) &&
                                    <Text style={styles.textFontRegular}>Traitement : {event.traitement}</Text>
                                }
                                {isValidString(event.datefinsoins) &&
                                    <Text style={styles.textFontRegular}>Date de fin du soin : {event.datefinsoins.includes("-") ? dateUtils.dateFormatter(event.datefinsoins, "yyyy-mm-dd", "-") : event.datefinsoins}</Text>
                                }
                                <View style={{width: "90%"}}>
                                    <Text style={[{marginBottom: 5}, styles.textFontRegular]}>Commentaire :</Text>
                                    <TextInput
                                        style={[{backgroundColor: variables.rouan, padding: 10, borderRadius: 5, height: 200}, styles.textFontRegular]}
                                        multiline={true}
                                        numberOfLines={4}
                                        maxLength={2000}
                                        placeholder="Exemple : Ça s'est très bien passé"
                                        onChangeText={(text) => event.commentaire = text}
                                        defaultValue={event.commentaire}
                                    />
                                </View>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                    <View style={styles.footer}>
                        <View style={styles.footerActions}>
                            <Button
                                size={"m"}
                                type={"primary"}
                                isLong={true}
                                onPress={() => closeModal()}
                            >
                                <Text style={styles.textFontMedium}>Annuler</Text>
                            </Button>

                            <Button
                                size={"m"}
                                type={"tertiary"}
                                isLong={true}
                                onPress={() => handleModifyEvent()}
                            >
                                <Text style={styles.textFontMedium}>Enregistrer</Text>
                            </Button>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default ModalEventDetails;
