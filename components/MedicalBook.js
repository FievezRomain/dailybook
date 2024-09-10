import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import StatePicker from './StatePicker';
import EventService from '../services/EventService';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import Toast from "react-native-toast-message";
import variables from './styles/Variables';
import LoggerService from '../services/LoggerService';
import EventCard from "./cards/EventCard";
import ModalDefaultNoValue from './Modals/ModalDefaultNoValue';

const MedicalBook = ({ animal }) => {
    const [typeEvent, setTypeEvent] = useState("Rendez-vous");
    const [eventsSoins, setEventsSoins] = useState([]);
    const [eventsRdv, setEventsRdv] = useState([]);
    const { currentUser } = useAuth();
    const eventService = new EventService();

    useEffect(() =>{
        getEvents();
    }, [animal]);

    const getEvents = async () =>{
        try {
            var result = await eventService.getEvents(currentUser.email);
            result = await result.filter((event) => event.animaux.includes(animal.id));

            var arrayEventsSoins = [];
            var arrayEventsRdv = [];

            arrayEventsSoins = await result.filter((event) => event.eventtype === "soins");
            arrayEventsSoins.sort(compareDates);
            arrayEventsRdv = await result.filter((event) => event.eventtype === "rdv");
            arrayEventsRdv.sort(compareDates);

            await setEventsRdv(arrayEventsRdv);
            await setEventsSoins(arrayEventsSoins);
          } catch (error) {
            console.error("Error fetching events:", error);
          }
    }

    const compareDates = (a, b) => {
        return new Date(a.dateevent) - new Date(b.dateevent);
    }

    const handleStateChange = () =>{
        setTypeEvent(typeEvent === "Soins" ? "Rendez-vous" : "Soins");
    }

    const onDeleteEvent = (infosEvent) => {
        eventService.delete(infosEvent)
            .then((reponse) =>{

                Toast.show({
                type: "success",
                position: "top",
                text1: "Suppression d'un événement réussi"
                });

                getEvents();

            })
            .catch((err) =>{
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log( "Erreur lors de la suppression d'un event : " + err.message );
            });
    }

    const onModifyEvent = (idEventModified, response) => {
        getEvents();
        
    }

    return(
        <>
            <View style={{width: "100%", alignSelf: "center", flex: 1}}>
                <Text style={[{textAlign: "center", color: variables.bai, fontSize: 16, paddingVertical: 15}, styles.textFontBold]}>Dossier médical</Text>
                <View style={{marginBottom: 10, paddingLeft: 20, paddingRight: 20}}>
                    <StatePicker
                        firstState={"Rendez-vous"}
                        secondState={"Soins"}
                        handleChange={handleStateChange}
                        defaultState={typeEvent === undefined ? "Rendez-vous" : typeEvent}
                    />
                </View>
                
                <ScrollView contentContainerStyle={{ paddingBottom: 20, paddingTop:10, paddingLeft: 20, paddingRight: 20}}>
                    {typeEvent === "Rendez-vous" ? 
                        eventsRdv.length === 0 ?
                            <ModalDefaultNoValue
                                text={"Aucun rendez-vous pour cet animal"}
                            />
                        :
                        eventsRdv.map((eventItem, index) => (
                            <View style={styles.eventContainer} key={eventItem.id}>
                                <EventCard
                                    eventInfos={eventItem}
                                    withSubMenu={true}
                                    withDate={true}
                                    deleteFunction={onDeleteEvent}
                                    updateFunction={onModifyEvent}
                                />
                            </View>
                        ))
                    :
                        eventsRdv.length === 0 ?
                            <ModalDefaultNoValue
                                text={"Aucun soin pour cet animal"}
                            />
                        :
                        eventsSoins.map((eventItem, index) => (
                            <View style={styles.eventContainer} key={eventItem.id}>
                                <EventCard
                                    eventInfos={eventItem}
                                    withSubMenu={true}
                                    withDate={true}
                                    deleteFunction={onDeleteEvent}
                                    updateFunction={onModifyEvent}
                                />
                            </View>
                        ))
                    }
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    eventContainer:{
        display: "flex",
        flexDirection: "row",
        width: "100%"
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

export default MedicalBook;