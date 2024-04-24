import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome5, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import variables from './styles/Variables';
import CompletionBar from './CompletionBar';
import EventCard from './cards/EventCard';
import StatePicker from './StatePicker';
import EventService from '../services/EventService';
import { Toast } from "react-native-toast-message/lib/src/Toast";

const EventsBloc = ({ navigation, events, setSummary }) => {
    const [periodView, setPeriodView] = useState("Aujourd'hui");
    const [eventsToday, setEventsToday] = useState([]);
    const [eventsUpcoming, setEventsUpcoming] = useState([]);
    const [eventsExceeded, setEventsExceeded] = useState([]);
    const [percentEventsDone, setPercentEventsDone] = useState(0);
    const eventService = new EventService();

    useEffect(() => {
        filterByPeriod();
    }, [events]);

    useEffect(() => {
        defineSummary();
        definePercentDone();
    }, [periodView, eventsToday, eventsUpcoming, eventsExceeded]);


    const handleChangeState = (objet, type) =>{
        let updatedEvents = [];

        switch(objet.state){
            case "À faire":
                objet.state = "Terminé";
                break;
            case "Terminé":
                objet.state = "À faire";
                break;
        }

        if(type === "exceeded"){
            updatedEvents = [... eventsExceeded];
            var indice = updatedEvents.findIndex((a) => a.id == objet.id);
            updatedEvents[indice] = objet;
            setEventsExceeded(updatedEvents);
        }
        if(type === "upcoming"){
            updatedEvents = [... eventsUpcoming];
            var indice = updatedEvents.findIndex((a) => a.id == objet.id);
            updatedEvents[indice] = objet;
            setEventsUpcoming(updatedEvents);
        }
        if(type === "today"){
            updatedEvents = [... eventsToday];
            var indice = updatedEvents.findIndex((a) => a.id == objet.id);
            updatedEvents[indice] = objet;
            setEventsToday(updatedEvents);
        }

        updateEvent(objet);
    }

    const calculateOverdueDays = (event) => {
        var eventDate = new Date(event.dateevent).setHours(0, 0, 0, 0);
        var currentDate = new Date().setHours(0, 0, 0, 0);

        // Calcul de la différence en millisecondes
        const differenceInMilliseconds = Math.abs(currentDate - eventDate);

        // Convertir la différence en jours
        const differenceInDays = Math.ceil(differenceInMilliseconds / (1000 * 60 * 60 * 24));

        return differenceInDays;

    }

    const handlePeriodViewChange = (period) =>{
        setPeriodView(period);
    }

    const filterByPeriod = () => {
        var todayArray = [];
        var upcomingArray = [];
        var exceededArray = [];
  
        events.filter((event) => {
          var currentDate = new Date(event.dateevent).setHours(0, 0, 0, 0);
  
          if(currentDate === new Date().setHours(0, 0, 0, 0)){
            todayArray.push(event);
          }
          if(event.state === "À faire" && currentDate < new Date().setHours(0, 0, 0, 0)){
            exceededArray.push(event);
          }
          if(currentDate > new Date().setHours(0, 0, 0, 0) && currentDate <= currentDate.setDate(currentDate.getDate() + 7)){
            upcomingArray.push(event);
          }
        })
  
        setEventsToday(todayArray);
        setEventsUpcoming(upcomingArray);
        setEventsExceeded(exceededArray);
  
    }

    const defineSummary = () => {
        if(periodView === "À venir" && eventsUpcoming.length === 0){
            setSummary("Vous n'avez pas d'événement(s) à venir");
        }
        if(periodView === "À venir" && eventsUpcoming.length !== 0){
            setSummary("Vous avez " + eventsUpcoming.length + " événement(s) à venir");
        }
        if(periodView !== "À venir" && (eventsToday.length === 0 && eventsExceeded.length === 0)){
            setSummary("Vous n'avez pas d'événement(s) pour aujourd'hui");
        }
        if(periodView !== "À venir" && (eventsToday.length !== 0 || eventsExceeded.length !== 0)){
            setSummary("Vous avez " + (eventsToday.length + eventsExceeded.length) +" événement(s) aujourd'hui");
        }
    }

    const definePercentDone = () => {
        var total = 0;
        var done = 0;

        if(periodView !== "À venir"){
            total = eventsToday.length + eventsExceeded.length;
            done = eventsToday.filter((event) => event.state === "Terminé").length + eventsExceeded.filter((event) => event.state === "Terminé").length;
        }
        if(periodView === "À venir"){
            total = eventsUpcoming.length;
            done = eventsUpcoming.filter((event) => event.state === "Terminé").length;
        }
        
        setPercentEventsDone(done === 0 ? 0 : ((done / total) * 100).toFixed(2));
    }

    const updateEvent = async (objet) => {
        let data = {};
        data["id"] = objet.id;
        data["state"] = objet.state;

        eventService.updateState(data)
            .then((reponse) => {

            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
            })
    }
    return(
        <>
        <View style={styles.container}>
            <View style={styles.eventTodayContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='check-circle' size={20} color={variables.alezan} style={styles.icon} />
                    <Text style={styles.title}>Tâches</Text>
                </View>
                <View style={{width: "90%", alignSelf: "center", marginBottom: 30}}>
                    <StatePicker
                        firstState={"Aujourd'hui"}
                        secondState={"À venir"}
                        handleChange={handlePeriodViewChange}
                        defaultState={periodView}
                    />
                </View>
                <View>
                    {periodView === "Aujourd'hui" && (
                        <>
                            {eventsExceeded.map((eventItem, index) => (
                                <TouchableOpacity key={eventItem.id} onPress={() => handleChangeState(eventItem, "exceeded")}>
                                    <View style={styles.eventContainer}>
                                        <View style={styles.stateContainer}>
                                            <View style={[styles.inputStateContainer, eventItem.state === "À faire" ? styles.inputStateContainerDefault : styles.inputStateContainerSelected]}>
                                                <MaterialIcons name="check" size={20} color={eventItem.state === "À faire" ? variables.rouan : variables.blanc} />
                                            </View>
                                        </View>
                                        <View style={styles.cardEventContainer}>
                                            <EventCard
                                                eventInfos={eventItem}
                                                withSubMenu={true}
                                            />
                                        </View>
                                    </View>
                                    <View style={styles.overdueIndicatorContainer}>
                                        <Text style={styles.overdueIndicator}>{calculateOverdueDays(eventItem)} jour(s) retard</Text>
                                    </View>
                                </TouchableOpacity>
                                
                            ))}
                            {eventsToday.map((eventItem, index) => (
                                <TouchableOpacity key={eventItem.id} onPress={() => handleChangeState(eventItem, "today")}>
                                    <View style={styles.stateContainer}>
                                        <View style={styles.inputStateContainer}>
                                            <MaterialIcons name="check" size={20} color={eventItem.state === "À faire" ? variables.rouan : variables.alezan} />
                                        </View>
                                    </View>
                                    <View style={styles.cardEventContainer}>
                                        <EventCard
                                            eventInfos={eventItem}
                                            withSubMenu={true}
                                        />
                                    </View>
                                    
                                </TouchableOpacity>
                                
                            ))}
                        </>
                        
                    )}
                    {periodView === "À venir" && eventsUpcoming.map((eventItem, index) => (
                        <TouchableOpacity key={eventItem.id} onPress={() => handleChangeState(eventItem, "upcoming")}>
                            <View style={styles.stateContainer}>
                                <View style={styles.inputStateContainer}>
                                    <MaterialIcons name="check" size={20} color={eventItem.state === "À faire" ? variables.rouan : variables.alezan} />
                                </View>
                            </View>
                            <View style={styles.cardEventContainer}>
                                <EventCard
                                    eventInfos={eventItem}
                                    withSubMenu={true}
                                />
                            </View>
                            
                        </TouchableOpacity>
                        
                    ))}
                </View>
                <View>
                    <Text style={styles.title}>Progression :</Text>
                    <View style={styles.containerCompletionBar}>
                        <CompletionBar
                            percentage={percentEventsDone}
                        />
                    </View>
                </View>
            </View>

            <View style={styles.card}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='calendar' size={20} color={variables.alezan} style={styles.icon}/>
                    <Text style={styles.title}>Évenements à venir</Text>
                </View>
                <View>
                    {/** Liste des tâches à venir */ }
                </View>
            </View>
        </View>
            
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        width: "100%",
        alignItems: "center",
    },
    card:{
        width: "90%",
        padding: 20,
        borderRadius: 5,
        backgroundColor: variables.blanc,
        marginBottom: 10,
        shadowColor: "black",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 2}
    },
    eventTodayContainer:{
        width: "100%",
        padding: 20,
        borderRadius: 5,
        marginBottom: 10,
    },
    headerContainer:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    title:{
        color: variables.alezan
    },
    icon:{
        marginRight: 10,
    },
    containerCompletionBar:{
        padding: 10,
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
        borderBlockColor: variables.alezan, 
        borderWidth: 0.2
    },
    cardEventContainer:{
        width: "90%"
    },
    overdueIndicatorContainer:{
        backgroundColor: "white", 
        top: -20, 
        width: "40%", 
        padding: 5, 
        borderRadius: 60, 
        marginLeft: 50, 
        alignItems: "center",
        shadowColor: "black",
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: {width: 0, height: 2}
    },
    overdueIndicator:{
        color: "black", 
        fontSize: 12,
    },
    inputStateContainerDefault:{
        backgroundColor: variables.blanc,
    },
    inputStateContainerSelected:{
        backgroundColor: variables.alezan,
    },

});

export default EventsBloc;