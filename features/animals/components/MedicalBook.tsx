import React, { useEffect, useState, useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, FlatList } from 'react-native';
import StatePicker from '../../../shared/components/inputs/StatePicker';
import EventCard from '../../../shared/components/cards/EventCard';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import Toast from "react-native-toast-message";

const MedicalBook = ({ animal, navigation }: any) => {
    const { colors, fonts } = useAppTheme();
    const [typeEvent, setTypeEvent] = useState("Rendez-vous");
    const [eventsSoins, setEventsSoins] = useState<any[]>([]);
    const [eventsRdv, setEventsRdv] = useState<any[]>([]);
    const arrayState = [
        {value: 'Rendez-vous', label: 'Rendez-vous', checkedColor: colors.textPrimary, uncheckedColor: colors.surfaceVariant, style: {borderRadius: 5}, rippleColor: "transparent"},
        {value: 'Soins', label: 'Soins', checkedColor: colors.textPrimary, uncheckedColor: colors.surfaceVariant, style: {borderRadius: 5}, rippleColor: "transparent"},
      ];
    const { data: events = [] } = useEventsQuery();

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
            filter();
            
          } catch (error) {
            console.error("Error fetching events:", error);
          }
    }

    const filter = async () => {
        var result = events.filter((event: any) => event.animaux.includes(animal.id));

        var arrayEventsSoins: any[] = [];
        var arrayEventsRdv: any[] = [];

        arrayEventsSoins = result.filter((event: any) => event.eventtype === "soins");
        arrayEventsSoins.sort(compareDates);
        arrayEventsRdv = result.filter((event: any) => event.eventtype === "rdv");
        arrayEventsRdv.sort(compareDates);

        setEventsRdv(arrayEventsRdv);
        setEventsSoins(arrayEventsSoins);
    }

    const compareDates = (a: any, b: any) => {
        return new Date(b.dateevent).getTime() - new Date(a.dateevent).getTime();
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

    const styles = {
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
    } as const;

    return(
        <>
            <View style={{width: "100%", alignSelf: "center", flex: 1}}>
                <View style={{marginBottom: 10, paddingLeft: 20, paddingRight: 20, display: "flex", flexDirection: "row"}}>
                    <StatePicker
                        arrayState={arrayState}
                        handleChange={handleStateChange}
                        defaultState={typeEvent === undefined ? "Rendez-vous" : typeEvent}
                        color={colors.surfaceVariant}
                    />
                </View>
                
                <FlatList
                    data={typeEvent === "Rendez-vous" ? eventsRdv : eventsSoins}
                    keyExtractor={(item) => item.id.toString()}
                    scrollEnabled={false}
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
                    contentContainerStyle={{ paddingBottom: 20, paddingTop:10 }}
                    style={{paddingLeft: 20, paddingRight: 20}}
                />
            </View>
        </>
    );
};

export default MedicalBook;
