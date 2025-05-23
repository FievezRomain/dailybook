import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome6, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import CompletionBar from './CompletionBar';
import EventCard from './cards/EventCard';
import ModalDefaultNoValue from './Modals/ModalDefaultNoValue';
import { useTheme } from 'react-native-paper';

const EventsBloc = ({ navigation, events, handleEventsChange }) => {
    const { colors, fonts } = useTheme();
    const [eventsToday, setEventsToday] = useState([]);
    const [eventsUpcoming, setEventsUpcoming] = useState([]);
    const [eventsExceeded, setEventsExceeded] = useState([]);
    const [percentEventsDone, setPercentEventsDone] = useState(0);

    useEffect(() => {
        filterByPeriod();
    }, [events]);

    useEffect(() => {
        definePercentDone();
    }, [eventsToday, eventsUpcoming, eventsExceeded]);

    const calculateOverdueDays = (event) => {
        var eventDate = new Date(event.dateevent).setHours(0, 0, 0, 0);
        var currentDate = new Date().setHours(0, 0, 0, 0);

        // Calcul de la différence en millisecondes
        const differenceInMilliseconds = Math.abs(currentDate - eventDate);

        // Convertir la différence en jours
        const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        return differenceInDays;

    }

    const filterByPeriod = () => {
        var todayArray = [];
        var upcomingArray = [];
        var exceededArray = [];

        events.sort((a, b) => {
            return new Date(a.dateevent) - new Date(b.dateevent);
        })
  
        events.map((event) => {
          var currentDate = new Date(event.dateevent).setHours(0, 0, 0, 0);
  
          if(currentDate === new Date().setHours(0, 0, 0, 0)){
            todayArray.push(event);
          }
          if(event.state === "À faire" && currentDate < new Date().setHours(0, 0, 0, 0)){
            exceededArray.push(event);
          }
          if(currentDate > new Date().setHours(0, 0, 0, 0)){
            upcomingArray.push(event);
          }
        })
  
        setEventsToday(todayArray);
        setEventsUpcoming(upcomingArray.slice(0,5));
        setEventsExceeded(exceededArray);
  
    }

    const defineSummary = () => {
        if(eventsUpcoming.length === 0){
            setSummary("Vous n'avez pas d'événement(s) à venir");
        }
        if(eventsUpcoming.length !== 0){
            setSummary("Vous avez " + eventsUpcoming.length + " événement(s) à venir");
        }
        if((eventsToday.length === 0 && eventsExceeded.length === 0)){
            setSummary("Vous n'avez pas d'événement(s) pour aujourd'hui");
        }
        if((eventsToday.length !== 0 || eventsExceeded.length !== 0)){
            setSummary("Vous avez " + (eventsToday.length + eventsExceeded.length) +" événement(s) aujourd'hui");
        }
    }

    const definePercentDone = () => {
        var total = 0;
        var done = 0;

        total = eventsToday.length + eventsExceeded.length;
        done = eventsToday.filter((event) => event.state === "Terminé").length + eventsExceeded.filter((event) => event.state === "Terminé").length;
        
        setPercentEventsDone(done === 0 ? 0 : ((done / total) * 100).toFixed(0));
    }

    const styles = StyleSheet.create({
        container:{
            width: "100%",
            alignItems: "center",
        },
        eventTodayContainer:{
            width: "100%",
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 20,
            borderRadius: 5,
            paddingBottom: 20
        },
        eventUpcomingContainer:{
            width: "100%",
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 10,
            borderRadius: 5,
            paddingBottom: 20
        },
        headerContainer:{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 20
        },
        title:{
            color: colors.default_dark,
            fontSize: 16,
        },
        icon:{
            marginRight: 10,
        },
        containerCompletionBar:{
            paddingBottom: 30,
        },
        eventContainer:{
            display: "flex",
            flexDirection: "row",
            width: "100%"
        },
        stateContainer:{
            width: "10%", 
            justifyContent: "center", 
            alignItems: "center", 
            marginBottom: 10
        },
        inputStateContainer:{
            alignItems: "center", 
            justifyContent: "center", 
            width: 25, 
            height: 25,  
            borderRadius: 60, 
            borderBlockColor: colors.default_dark, 
            borderWidth: 0.2
        },
        dateContainer:{
            width: "10%", 
            justifyContent: "center", 
            alignItems: "center", 
            marginBottom: 10
        },
        inputDateContainer:{
            alignItems: "center", 
            justifyContent: "center",
        },
        cardEventContainer:{
            width: "100%"
        },
        overdueIndicatorContainer:{
            backgroundColor: colors.background, 
            alignSelf: "flex-end",
            top: -20, 
            width: "40%", 
            padding: 5, 
            borderRadius: 60, 
            marginRight: 10, 
            borderColor: colors.default_dark,
            borderWidth: 0.2,
            alignItems: "center",
            shadowColor: "black",
            shadowOpacity: 0.1,
            elevation: 1,
            shadowRadius: 5,
            shadowOffset: {width: 0, height: 2}
        },
        overdueIndicator:{
            color: colors.default_dark, 
            fontSize: 12,
        },
        inputStateContainerDefault:{
            backgroundColor: colors.background,
        },
        inputStateContainerSelected:{
            backgroundColor: colors.default_dark,
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
        <View style={styles.container}>
            <View style={styles.eventTodayContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='check-circle' size={20} color={colors.default_dark} style={styles.icon} />
                    <Text style={[styles.title, styles.textFontBold]}>Tâches</Text>
                </View>
                <View>
                    {(eventsExceeded.length !== 0 || eventsToday !== 0) &&
                        <>
                            <View style={styles.containerCompletionBar}>
                                <CompletionBar
                                    percentage={percentEventsDone}
                                />
                            </View>
                        </>
                    }
                </View>
                <View>
                    <View>
                        <FlatList
                            data={eventsExceeded}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <TouchableOpacity>
                                    <View style={styles.eventContainer}>
                                        <EventCard
                                            eventInfos={item}
                                            withSubMenu={true}
                                            withState={true}
                                            handleEventsChange={handleEventsChange}
                                            typeEvent={"exceeded"}
                                        />
                                    </View>
                                    <View style={styles.overdueIndicatorContainer}>
                                        <Text style={[styles.overdueIndicator, styles.textFontRegular]}>{calculateOverdueDays(item)} jour(s) de retard</Text>
                                    </View>
                                </TouchableOpacity>
                            )}
                        />
                    </View>
                    <FlatList
                        data={eventsToday}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <ModalDefaultNoValue
                                text={"Vous n'avez aucun événement aujourd'hui"}
                            />
                        }
                        renderItem={({ item }) => (
                            <TouchableOpacity>
                                <View style={styles.eventContainer}>
                                    <EventCard
                                        eventInfos={item}
                                        withSubMenu={true}
                                        withState={true}
                                        typeEvent={"today"}
                                        handleEventsChange={handleEventsChange}
                                    />
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>
                
            </View>

            <View style={styles.eventUpcomingContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='calendar' size={20} color={colors.default_dark} style={styles.icon}/>
                    <Text style={[styles.title, styles.textFontBold]}>Événements à venir</Text>
                </View>
                <View>
                    <FlatList
                        data={eventsUpcoming}
                        keyExtractor={(item) => item.id.toString()}
                        scrollEnabled={false}
                        ListEmptyComponent={
                            <ModalDefaultNoValue
                                text={"Vous n'avez aucun événement à venir"}
                            />
                        }
                        renderItem={({ item }) => (
                            <View style={styles.eventContainer}>
                                <View style={[styles.cardEventContainer]}>
                                    <EventCard
                                        eventInfos={item}
                                        withSubMenu={true}
                                        withDate={true}
                                        handleEventsChange={handleEventsChange}
                                    />
                                </View>
                            </View>
                        )}
                    />
                    
                </View>
            </View>
        </View>
            
        </>
    )
}

export default EventsBloc;