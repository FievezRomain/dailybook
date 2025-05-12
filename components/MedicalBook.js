import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, FlatList } from 'react-native';
import StatePicker from './inputs/StatePicker';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import EventCard from "./cards/EventCard";
import ModalDefaultNoValue from './modals/common/ModalDefaultNoValue';
import { useTheme } from 'react-native-paper';
import { useEvents } from '../providers/EventsProvider';
import Toast from "react-native-toast-message";

const MedicalBook = ({ animal, navigation }) => {
    const { colors, fonts } = useTheme();
    const [typeEvent, setTypeEvent] = useState("Rendez-vous");
    const [eventsSoins, setEventsSoins] = useState([]);
    const [eventsRdv, setEventsRdv] = useState([]);
    const { currentUser } = useAuth();
    const arrayState = [
        {value: 'Rendez-vous', label: 'Rendez-vous', checkedColor: colors.default_dark, uncheckedColor: colors.quaternary, style: {borderRadius: 5}, rippleColor: "transparent"},
        {value: 'Soins', label: 'Soins', checkedColor: colors.default_dark, uncheckedColor: colors.quaternary, style: {borderRadius: 5}, rippleColor: "transparent"},
      ];
    const { events } = useEvents();

    useEffect(() =>{
        getEvents();
    }, [animal, events]);
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
        return new Date(b.dateevent) - new Date(a.dateevent);
    }

    const handleStateChange = () =>{
        setTypeEvent(typeEvent === "Soins" ? "Rendez-vous" : "Soins");
    }

    const handleEventChange = async () => {
        getEvents();
        setTimeout(() => Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'un événement"
        }), 350);
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
                
                <FlatList
                    data={typeEvent === "Rendez-vous" ? eventsRdv : eventsSoins}
                    keyExtractor={(item) => item.id.toString()}
                    ListEmptyComponent={
                        <ModalDefaultNoValue
                            text={typeEvent === "Rendez-vous" ? "Aucun rendez-vous pour cet animal" : "Aucun soin pour cet animal"}
                        />
                    }
                    renderItem={({ item }) => (
                        <View style={styles.eventContainer}>
                            <EventCard
                                eventInfos={item}
                                withSubMenu={true}
                                withDate={true}
                                handleEventsChange={handleEventChange}
                            />
                        </View>
                    )}
                    contentContainerStyle={{ paddingBottom: 20, paddingTop:10, paddingLeft: 20, paddingRight: 20 }}
                />
            </View>
        </>
    );
};

export default MedicalBook;