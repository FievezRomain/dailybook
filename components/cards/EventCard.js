import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Entypo, MaterialIcons, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import BaladeCard from './eventCards/BaladeCard';
import SoinsCard from './eventCards/SoinsCard';
import AutreCard from './eventCards/AutreCard';
import EntrainementCard from './eventCards/EntrainementCard';
import ConcoursCard from './eventCards/ConcoursCard';
import RdvCard from './eventCards/RdvCard';
import ModalEvents from "../Modals/ModalEvents";
import DepenseCard from "./eventCards/DepenseCard";
import React, { useEffect, useState, useContext } from 'react';
import ModalSubMenuEventActions from "../Modals/ModalSubMenuEventActions";
import { useAnimaux } from "../../providers/AnimauxProvider";
import { useAuth } from '../../providers/AuthenticatedUserProvider';
import ModalEventDetails from "../Modals/ModalEventDetails";
import eventsServiceInstance from "../../services/EventService";
import LoggerService from '../../services/LoggerService';
import Toast from "react-native-toast-message";
import { useTheme } from 'react-native-paper';
import ModalValidation from "../Modals/ModalValidation";
import Feather from '@expo/vector-icons/Feather';
import SvgComponent from "../SvgComponent";

const EventCard = ({eventInfos, handleEventsChange, withSubMenu=true, withDate=false, withState=false, typeEvent=undefined}) => {
    const { colors, fonts } = useTheme();
    const { currentUser } = useAuth();
    const [modalModificationVisible, setModalModificationVisible] = useState(false);
    const [modalSubMenuEventVisible, setModalSubMenuEventVisible] = useState(false);
    const [modalEventDetailsVisible, setModalEventDetailsVisible] = useState(false);
    const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);
    const [modalValidationDeleteAllVisible, setModalValidationDeleteAllVisible] = useState(false);
    const { animaux } = useAnimaux();

/*     useEffect(() => {
        getAnimaux();
    }, [eventInfos])

    const getAnimaux = async () => {
        var result = await animalsServiceInstance.getAnimals(currentUser.email);

        setAnimaux(result);
    } */

    const getColorEventType = () =>{
        if( eventInfos === undefined ){
            return;
        }
        if( eventInfos.eventtype === "depense" ){
            return colors.quaternary;
        }
        if( eventInfos.eventtype === "balade" ){
            return colors.accent;
        }
        if( eventInfos.eventtype === "soins" ){
            return colors.neutral;
        }
        if( eventInfos.eventtype === "concours" ){
            return colors.primary;
        }
        if( eventInfos.eventtype === "entrainement" ){
            return colors.tertiary;
        }
        if( eventInfos.eventtype === "autre" ){
            return colors.error;
        }
        if( eventInfos.eventtype === "rdv" ){
            return colors.text;
        }
    }

    const getIconEventType = () => {
        if( eventInfos === undefined ){
            return;
        }
        if( eventInfos.eventtype === "depense" ){
            return <FontAwesome6 name="money-bill-wave" size={20} color={getColorEventType()} style={{marginRight: 10, marginLeft: 5}}/>;
        }
        if( eventInfos.eventtype === "balade" ){
            return <Entypo name="compass" size={20} color={getColorEventType()} style={{marginRight: 10, marginLeft: 5}}/>;
        }
        if( eventInfos.eventtype === "soins" ){
            return <FontAwesome6 name="hand-holding-medical" size={20} color={getColorEventType()} style={{marginRight: 10, marginLeft: 5}}/>;
        }
        if( eventInfos.eventtype === "concours" ){
            return <FontAwesome name="trophy" size={20} color={getColorEventType()} style={{marginRight: 10, marginLeft: 5}}/>;
        }
        if( eventInfos.eventtype === "entrainement" ){
            return <Entypo name="traffic-cone" size={20} color={getColorEventType()} style={{marginRight: 10, marginLeft: 5}}/>;
        }
        if( eventInfos.eventtype === "autre" ){
            return <FontAwesome6 name="check-circle" size={20} color={getColorEventType()} style={{marginRight: 10, marginLeft: 5}}/>;
        }
        if( eventInfos.eventtype === "rdv" ){
            return <FontAwesome name="stethoscope" size={20} color={getColorEventType()} style={{marginRight: 10, marginLeft: 5}}/>;
        }
    }

    const getTitleEventType = () => {
        if( eventInfos === undefined ){
            return;
        }
        if( eventInfos.eventtype === "depense" ){
            return "Dépense";
        }
        if( eventInfos.eventtype === "balade" ){
            return "Balade";
        }
        if( eventInfos.eventtype === "soins" ){
            return "Soin";
        }
        if( eventInfos.eventtype === "concours" ){
            return "Concours";
        }
        if( eventInfos.eventtype === "entrainement" ){
            return "Entraînement";
        }
        if( eventInfos.eventtype === "autre" ){
            return "Autre";
        }
        if( eventInfos.eventtype === "rdv" ){
            return "Rendez-vous médical";
        }
    }

    const getCardComponentEventType = () => {
        if( eventInfos === undefined ){
            return;
        }
        if( eventInfos.eventtype === "depense" ){
            return <DepenseCard
                        eventInfos={eventInfos}
                        animaux={animaux}
                        setSubMenu={setModalSubMenuEventVisible}
                    />;
        }
        if( eventInfos.eventtype === "balade" ){
            return <BaladeCard
                        eventInfos={eventInfos}
                        animaux={animaux}
                        setSubMenu={setModalSubMenuEventVisible}
                    />;
        }
        if( eventInfos.eventtype === "soins" ){
            return <SoinsCard
                        eventInfos={eventInfos}
                        animaux={animaux}
                        setSubMenu={setModalSubMenuEventVisible}
                    />;
        }
        if( eventInfos.eventtype === "concours" ){
            return <ConcoursCard
                        eventInfos={eventInfos}
                        animaux={animaux}
                        setSubMenu={setModalSubMenuEventVisible}
                    />;
        }
        if( eventInfos.eventtype === "entrainement" ){
            return <EntrainementCard
                        eventInfos={eventInfos}
                        animaux={animaux}
                        setSubMenu={setModalSubMenuEventVisible}
                    />;
        }
        if( eventInfos.eventtype === "autre" ){
            return <AutreCard
                        eventInfos={eventInfos}
                        animaux={animaux}
                        setSubMenu={setModalSubMenuEventVisible}
                    />;
        }
        if( eventInfos.eventtype === "rdv" ){
            return <RdvCard
                        eventInfos={eventInfos}
                        animaux={animaux}
                        setSubMenu={setModalSubMenuEventVisible}
                    />;
        }
    }

    const styles = StyleSheet.create({
        actionEventContainer:{
            marginRight: 10
        },
        eventContainer:{
            backgroundColor: colors.background,
            borderRadius: 5,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            marginBottom: 10,
            shadowColor: "black",
            shadowOpacity: 0.1,
            elevation: 1,
            shadowOffset: {
              width: 0,
              height: 1
            },
        },
        eventTypeContainer:{
            backgroundColor: hexToRgba(getColorEventType(), 0.3),
        },
        typeEventIndicator:{
            width: "100%", 
            borderTopStartRadius: 5,
            borderTopEndRadius: 5,
        },
        cardEventContainer:{
            paddingVertical: 10,
            display: "flex", 
            flexDirection: "row",  
            justifyContent: "space-between"
        },
        cardEventContainerWithIndicator:{
            width: "80%",
        },
        cardEventContainerWithoutIndicator:{
            width: "100%",
            paddingRight: 10,
            paddingLeft: 10
        },
        headerEventContainer:{
            display: "flex", 
            flexDirection: "row"
        },
        headerEvent:{
            flexDirection: "row", 
            justifyContent: "space-between"
        },
        titleTypeEventContainer:{
            flexDirection: "row", 
            alignItems: "center",
            paddingLeft: 10
        },
        contentEventContainer:{
            display: "flex", 
            flexDirection: "row"
        },
        indicatorEventContainer:{
            justifyContent: "center", 
            padding: 10, 
            marginRight: 10, 
            borderRightWidth: 0.3, 
            borderColor: colors.default_dark
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
        subMenuContainer:{
            paddingVertical: 10,
            paddingLeft: 20,
            paddingRight: 10
        }
    });

    function hexToRgba(hex, opacity) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` : null;
    }

    const handleDelete = () =>{
        setModalValidationDeleteVisible(true);
    }

    const confirmDelete = () =>{
        eventInfos.email = currentUser.email;
        
        eventsServiceInstance.delete(eventInfos)
            .then((reponse) =>{
    
              Toast.show({
                type: "success",
                position: "top",
                text1: "Suppression d'un événement réussi"
              });
    
              //handleEventsChange();
    
            })
            .catch((err) =>{
              Toast.show({
                  type: "error",
                  position: "top",
                  text1: err.message
              });
              LoggerService.log( "Erreur lors de suppression d'un event : " + err.message );
            });
    }

    const handleDeleteAll = () =>{
        setModalValidationDeleteAllVisible(true);
    }

    const confirmDeleteAll = () =>{
        let data = {};
        data.id = eventInfos.idparent === null ? eventInfos.id : eventInfos.idparent;
        data.email = currentUser.email;

        eventsServiceInstance.delete(data)
            .then((reponse) =>{
    
              Toast.show({
                type: "success",
                position: "top",
                text1: "Suppression d'un événement réussi"
              });
    
              handleEventsChange();
    
            })
            .catch((err) =>{
              Toast.show({
                  type: "error",
                  position: "top",
                  text1: err.message
              });
              LoggerService.log( "Erreur lors de suppression d'un event : " + err.message );
            });
    }

    const handleStateChange = async () => {
        switch(eventInfos.state){
            case "À faire":
                eventInfos.state = "Terminé";
                break;
            case "Terminé":
                eventInfos.state = "À faire";
                break;
        }

        let data = {};
        data["id"] = eventInfos.id;
        data["state"] = eventInfos.state;
        data["animaux"] = eventInfos.animaux;
        data["email"] = currentUser.email;

        eventsServiceInstance.updateState(data)
            .then((reponse) => {

                handleEventsChange();
            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la MAJ du statut d'un event : " + err.message );
            })
    }

    const handleModify = () =>{
        setModalModificationVisible(true);
    }

    const getDateText = (date) =>{
        var dateObjet = new Date(date);
        var jour = ('0' + dateObjet.getDate()).slice(-2); 
        var mois = ('0' + (dateObjet.getMonth() + 1)).slice(-2);
        const dateFormatee = jour + '/' + mois;
        return dateFormatee;
    }

    const getYearText = (date) =>{
        var dateObjet = new Date(date);
        var annee = dateObjet.getFullYear();
        return annee;
    }

    const getDayText = (date) =>{
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        var dateObject  = new Date(date);
        var dateText = String(dateObject.toLocaleDateString("fr-FR", options));
        dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
        return dateText.slice(0,3);
    }
    
    return(
        <>
            <ModalEvents 
                event={eventInfos}
                isVisible={modalModificationVisible}
                setVisible={setModalModificationVisible}
                actionType={"modify"}
                onModify={handleEventsChange}
            />
            <ModalSubMenuEventActions
                event={eventInfos}
                handleDelete={handleDelete}
                handleModify={handleModify}
                modalVisible={modalSubMenuEventVisible}
                setModalVisible={setModalSubMenuEventVisible}
                handleDeleteAll={handleDeleteAll}
            />
            <ModalEventDetails
                isVisible={modalEventDetailsVisible}
                setVisible={setModalEventDetailsVisible}
                event={eventInfos}
                animaux={animaux}
                handleEventsChange={handleEventsChange}
            />
            <ModalValidation
                displayedText={"Êtes-vous sûr de vouloir supprimer l'événement ?"}
                onConfirm={confirmDelete}
                setVisible={setModalValidationDeleteVisible}
                visible={modalValidationDeleteVisible}
                title={"Suppression d'un événement"}
            />
            <ModalValidation
                displayedText={"Êtes-vous sûr de vouloir supprimer l'événement ?"}
                onConfirm={confirmDeleteAll}
                setVisible={setModalValidationDeleteAllVisible}
                visible={modalValidationDeleteAllVisible}
                title={"Suppression d'un événement"}
            />
            <View style={[styles.eventContainer]}>
                <View style={styles.headerEventContainer}>
                    <TouchableOpacity style={[styles.eventTypeContainer, styles.typeEventIndicator, styles.headerEvent]} onPress={() => setModalEventDetailsVisible(true)}>
                        <View style={styles.titleTypeEventContainer}>
                            {getIconEventType()}
                            <Text style={[{color: getColorEventType(), fontSize: 14}, styles.textFontBold]}>{getTitleEventType()}</Text>
                        </View>
                        <View>
                            <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                                <Entypo name='dots-three-horizontal' size={20} color={getColorEventType()} />
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.contentEventContainer}>
                    { withState === true &&
                        <TouchableOpacity onPress={()=>handleStateChange()} style={styles.indicatorEventContainer}>
                            {eventInfos.state === "À faire" && 
                                <Feather name="square" size={25} color={colors.default_dark} />
                                ||
                                <Feather name="x-square" size={25} color={colors.default_dark} />
                            }
                        </TouchableOpacity>
                    }
                    { withDate === true &&
                        <View style={[styles.indicatorEventContainer, {alignItems: "center"}]}>
                            <Text style={styles.textFontRegular}>{getDayText(eventInfos.dateevent)}.</Text>
                            <Text style={[{fontSize: 11}, styles.textFontRegular]}>{getDateText(eventInfos.dateevent)}</Text>
                            <Text style={[{fontSize: 9}, styles.textFontRegular]}>{getYearText(eventInfos.dateevent)}</Text>
                        </View>
                    }
                    <TouchableOpacity style={[styles.cardEventContainer, withDate === false && withState === false ? styles.cardEventContainerWithoutIndicator : styles.cardEventContainerWithIndicator]} onPress={() => setModalEventDetailsVisible(true)}>
                        {getCardComponentEventType()}
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}

export default EventCard;