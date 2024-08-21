import React, { useState, useEffect, useContext } from 'react';
import { FontAwesome6, FontAwesome, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import variables from './styles/Variables';
import CompletionBar from './CompletionBar';
import EventCard from './cards/EventCard';
import EventService from '../services/EventService';
import { Toast } from "react-native-toast-message/lib/src/Toast";
import LoggerService from '../services/LoggerService';

const EventsBloc = ({ navigation, events, handleModifiedEvent, handleDeletedEvent }) => {
    const [eventsToday, setEventsToday] = useState([]);
    const [eventsUpcoming, setEventsUpcoming] = useState([]);
    const [eventsExceeded, setEventsExceeded] = useState([]);
    const [percentEventsDone, setPercentEventsDone] = useState(0);
    const eventService = new EventService();

    useEffect(() => {
        filterByPeriod();
    }, [events]);

    useEffect(() => {
        definePercentDone();
    }, [eventsToday, eventsUpcoming, eventsExceeded]);


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

    const updateEvent = async (objet) => {
        let data = {};
        data["id"] = objet.id;
        data["state"] = objet.state;
        data["animaux"] = objet.animaux;

        eventService.updateState(data)
            .then((reponse) => {
                handleModifiedEvent(objet);
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

    const handleModifyEvent = (idEventModified, response) => {
        var arrayTempArray = events;
        var index = arrayTempArray.findIndex(objet => objet.id === idEventModified);

        if(index !== -1){
            arrayTempArray[index] = response;
        }

        events = arrayTempArray;

        Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'un événement réussi"
          });

        handleModifiedEvent(response);
    }

    const handleDeleteEvent = (infosEvent) => {
        eventService.delete(infosEvent)
            .then((reponse) =>{
    
              Toast.show({
                type: "success",
                position: "top",
                text1: "Suppression d'un événement réussi"
              });
    
              handleDeletedEvent(infosEvent);

              Toast.show({
                type: "success",
                position: "top",
                text1: "Suppression d'un événement réussi"
              });
    
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

    return(
        <>
        <View style={styles.container}>
            <View style={styles.eventTodayContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='check-circle' size={20} color={variables.alezan} style={styles.icon} />
                    <Text style={[styles.title, styles.textFontBold]}>Tâches</Text>
                </View>
                {eventsExceeded.length !== 0 || eventsToday.length !== 0 ?
                    <>
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
                            {eventsExceeded.map((eventItem, index) => (
                                <TouchableOpacity key={eventItem.id} onPress={() => handleChangeState(eventItem, "exceeded")}>
                                    <View style={styles.eventContainer}>
                                        <EventCard
                                            eventInfos={eventItem}
                                            withSubMenu={true}
                                            withState={true}
                                            handleStateChange={handleChangeState}
                                            typeEvent={"exceeded"}
                                            updateFunction={handleModifiedEvent}
                                            deleteFunction={handleDeleteEvent}
                                        />
                                    </View>
                                    <View style={styles.overdueIndicatorContainer}>
                                        <Text style={[styles.overdueIndicator, styles.textFontRegular]}>{calculateOverdueDays(eventItem)} jour(s) retard</Text>
                                    </View>
                                </TouchableOpacity>
                                
                            ))}
                            {eventsToday.map((eventItem, index) => (
                                <TouchableOpacity key={eventItem.id} onPress={() => handleChangeState(eventItem, "today")}>
                                    <View style={styles.eventContainer}>
                                        <EventCard
                                            eventInfos={eventItem}
                                            withSubMenu={true}
                                            withState={true}
                                            handleStateChange={handleChangeState}
                                            typeEvent={"today"}
                                            deleteFunction={handleDeleteEvent}
                                            updateFunction={handleModifiedEvent}
                                        />
                                    </View>
                                </TouchableOpacity>
                                
                            ))}
                        </View>
                    </>
                :
                    <View>
                        <Text style={[{color: "gray"}, styles.textFontRegular]}>Vous n'avez aucun événement aujourd'hui</Text>
                    </View>
                }
                
            </View>

            <View style={styles.eventUpcomingContainer}>
                <View style={styles.headerContainer}>
                    <FontAwesome name='calendar' size={20} color={variables.alezan} style={styles.icon}/>
                    <Text style={[styles.title, styles.textFontBold]}>Événements à venir</Text>
                </View>
                <View>
                    {eventsUpcoming.length !== 0 ?
                        eventsUpcoming.map((eventItem, index) => (
                            <View style={styles.eventContainer} key={eventItem.id}>
                                <View style={[styles.cardEventContainer]}>
                                    <EventCard
                                        eventInfos={eventItem}
                                        withSubMenu={true}
                                        withDate={true}
                                        deleteFunction={handleDeleteEvent}
                                        handleStateChange={handleChangeState}
                                        updateFunction={handleModifiedEvent}
                                    />
                                </View>
                            </View>
                        ))
                    :    
                        <View>
                            <Text style={[{color: "gray"}, styles.textFontRegular]}>Vous n'avez aucun événement à venir</Text>
                        </View>
                    }
                    
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
    eventTodayContainer:{
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        borderRadius: 5,
    },
    eventUpcomingContainer:{
        width: "100%",
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 20,
        borderRadius: 5,
    },
    headerContainer:{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10
    },
    title:{
        color: variables.alezan,
        fontSize: 15
    },
    icon:{
        marginRight: 10,
    },
    containerCompletionBar:{
        paddingBottom: 20,
        paddingTop: 10
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
        backgroundColor: "white", 
        alignSelf: "flex-end",
        top: -20, 
        width: "40%", 
        padding: 5, 
        borderRadius: 60, 
        marginRight: 10, 
        borderColor: variables.bai,
        borderWidth: 0.2,
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

export default EventsBloc;