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

const MedicalBook = ({ animal, navigation }) => {
    const [typeEvent, setTypeEvent] = useState("Rendez-vous");
    const [eventsSoins, setEventsSoins] = useState([]);
    const [eventsRdv, setEventsRdv] = useState([]);
    const { currentUser } = useAuth();
    const eventService = new EventService();

    useEffect(() =>{
        getEvents();
    }, [animal]);
    useEffect(() =>{
        const unsubscribe = navigation.addListener("focus", () => {
            getEvents();
        });
        return unsubscribe;
    }, [navigation]);

    const getEvents = async () =>{
        try {
            var result = await eventService.getEvents(currentUser.email);
            filter(result);
            
          } catch (error) {
            console.error("Error fetching events:", error);
          }
    }

    const filter = async (result) => {
        result = result.filter((event) => event.animaux.includes(animal.id));

        var arrayEventsSoins = [];
        var arrayEventsRdv = [];

        arrayEventsSoins = result.filter((event) => event.eventtype === "soins");
        arrayEventsSoins.sort(compareDates);
        arrayEventsRdv = result.filter((event) => event.eventtype === "rdv");
        arrayEventsRdv.sort(compareDates);

        setEventsRdv(arrayEventsRdv);
        setEventsSoins(arrayEventsSoins);
    }

    const compareDates = (a, b) => {
        return new Date(a.dateevent) - new Date(b.dateevent);
    }

    const handleStateChange = () =>{
        setTypeEvent(typeEvent === "Soins" ? "Rendez-vous" : "Soins");
    }

    const handleEventChange = async () => {
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
                                    handleEventsChange={handleEventChange}
                                />
                            </View>
                        ))
                    :
                        eventsSoins.length === 0 ?
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
                                    handleEventsChange={handleEventChange}
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