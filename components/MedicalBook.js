import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image } from 'react-native';
import StatePicker from './StatePicker';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import EventCard from "./cards/EventCard";
import ModalDefaultNoValue from './Modals/ModalDefaultNoValue';
import { useTheme } from 'react-native-paper';
import { useEvents } from '../providers/EventsProvider';

const MedicalBook = ({ animal, navigation }) => {
    const { colors, fonts } = useTheme();
    const [typeEvent, setTypeEvent] = useState("Rendez-vous");
    const [eventsSoins, setEventsSoins] = useState([]);
    const [eventsRdv, setEventsRdv] = useState([]);
    const { currentUser } = useAuth();
    const arrayState = [
        {value: 'Rendez-vous', label: 'Rendez-vous', checkedColor: colors.background, uncheckedColor: colors.default_dark, style: {borderRadius: 5}, rippleColor: "transparent"},
        {value: 'Soins', label: 'Soins', checkedColor: colors.background, uncheckedColor: colors.default_dark, style: {borderRadius: 5}, rippleColor: "transparent"},
      ];
    const { events } = useEvents();

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
            //var result = await eventService.getEvents(currentUser.email);
            filter();
            
          } catch (error) {
            console.error("Error fetching events:", error);
          }
    }

    const filter = async () => {
        var result = events.filter((event) => event.animaux.includes(animal.id));

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

    const styles = StyleSheet.create({
        eventContainer:{
            display: "flex",
            flexDirection: "row",
            width: "100%"
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return(
        <>
            <View style={{width: "100%", alignSelf: "center", flex: 1}}>
                {/* <Text style={[{textAlign: "center", color: colors.default_dark, fontSize: 16, paddingVertical: 15}, styles.textFontBold]}>Dossier médical</Text> */}
                <View style={{marginBottom: 10, paddingLeft: 20, paddingRight: 20, display: "flex", flexDirection: "row"}}>
                    <StatePicker
                        arrayState={arrayState}
                        handleChange={handleStateChange}
                        defaultState={typeEvent === undefined ? "Rendez-vous" : typeEvent}
                        color={colors.quantenary}
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

export default MedicalBook;