import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import StatePicker from './StatePicker';
import EventService from '../services/EventService';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import EventCard from './cards/EventCard';

const MedicalBook = ({ animal }) => {
    const [typeEvent, setTypeEvent] = useState("Rendez-vous");
    const [eventsSoins, setEventsSoins] = useState([]);
    const [eventsRdv, setEventsRdv] = useState([]);
    const { user } = useContext(AuthenticatedUserContext);
    const eventService = new EventService();

    useEffect(() =>{
        getEvents();
    }, [animal]);

    const getEvents = async () =>{
        try {
            var result = await eventService.getEvents(user.id);
            result = await result.filter((event) => event.animaux.includes(animal.id));

            var arrayEventsSoins = [];
            var arrayEventsRdv = [];

            arrayEventsSoins = await result.filter((event) => event.eventtype === "soins");
            arrayEventsRdv = await result.filter((event) => event.eventtype === "rdv");

            setEventsRdv(arrayEventsRdv);
            setEventsSoins(arrayEventsSoins);
          } catch (error) {
            console.error("Error fetching events:", error);
          }
    }

    const handleStateChange = () =>{
        setTypeEvent(typeEvent === "Soins" ? "Rendez-vous" : "Soins");
    }
    return(
        <>
            <View style={{width: "95%", alignSelf: "center"}}>
                <View style={{marginBottom: 10}}>
                    <StatePicker
                        firstState={"Rendez-vous"}
                        secondState={"Soins"}
                        handleChange={handleStateChange}
                        defaultState={typeEvent === undefined ? "Rendez-vous" : typeEvent}
                    />
                </View>
                
                <ScrollView contentContainerStyle={{minHeight: "80%"}}>
                    {typeEvent === "Rendez-vous" ? 
                        eventsRdv.map((eventItem, index) => (
                            <View style={styles.eventContainer} key={eventItem.id}>
                                <EventCard
                                    eventInfos={eventItem}
                                    withSubMenu={true}
                                    withDate={true}
                                />
                            </View>
                        ))
                    :
                        eventsSoins.map((eventItem, index) => (
                            <View style={styles.eventContainer} key={eventItem.id}>
                                <EventCard
                                    eventInfos={eventItem}
                                    withSubMenu={true}
                                    withDate={true}
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
});

export default MedicalBook;