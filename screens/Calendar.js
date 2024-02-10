import { View, Text, StyleSheet, Image } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Calendar, CalendarUtils, LocaleConfig } from 'react-native-calendars';
import variables from "../components/styles/Variables";
import { ScrollView } from "react-native";
import moment from "moment";
import EventCard from "../components/cards/EventCard";
import EventService from "../services/EventService";
import DateUtils from "../utils/DateUtils";

const CalendarScreen = ({ navigation }) => {
  const { user } = useContext(AuthenticatedUserContext);
  const [messages, setMessages] = useState({ message1: "Mon", message2: "calendrier" });
  const eventService = new EventService();
  const dateUtils = new DateUtils();
  const [eventArray, setEventArray] = useState([]);
  const [eventArrayCurrentDateSelected, setEventArrayCurrentDateSelected] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [marked, setMarked] = useState({});

  const INITIAL_DATE = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(INITIAL_DATE);

  LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
  };
  LocaleConfig.defaultLocale = 'fr';

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMessages({ message1: "Mon", message2: "calendrier" });
      getEventsForUser();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setupMarkedDates();
    changeEventsCurrentDateSelected(selectedDate);
  }, [eventArray]);

  const getEventsForUser = async () => {
    if (eventArray.length === 0) {
      setLoadingEvent(true);
      try {
        const result = await eventService.getEvents(user.id);
        if (result.length !== 0) {
          setEventArray(result);
          setLoadingEvent(false);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setLoadingEvent(false);
      }
    }
  }

  const setupMarkedDates = () => {
    const newMarked = { ...marked };
  
    const getDate = (count) => {
      const date = new Date(INITIAL_DATE);
      date.setDate(date.getDate() + count);
      return CalendarUtils.getCalendarDateString(date);
    };
  
    eventArray.forEach((item) => {
      const dateString = dateUtils.dateFormatter(item.dateevent, "dd/MM/yyyy", "/");
      const existingObj = newMarked[dateString];
  
      if (existingObj) {
        if (!existingObj.dots.some(dot => dot.color === getEventTypeDot(item.eventtype).color)) {
          existingObj.dots.push(getEventTypeDot(item.eventtype));
        }
      } else {
        newMarked[dateString] = {
          selected: false,
          disableTouchEvent: false,
          selectedColor: variables.alezan,
          selectedTextColor: variables.blanc,
          dots: [getEventTypeDot(item.eventtype)]
        };
      }
    });
  
    // Setup default selected date
    const defaultDateString = getDate(0);
    if (!newMarked[defaultDateString]) {
      newMarked[defaultDateString] = {
        selected: true,
        disableTouchEvent: false,
        selectedColor: variables.alezan,
        selectedTextColor: variables.blanc,
        dots: []
      };
    }
  
    setMarked(newMarked);
  };
  
  

  const getEventTypeDot = (eventType) => {
    switch (eventType) {
      case "balade":
        return { color: variables.alezan };
      case "entrainement":
        return { color: variables.aubere };
      case "concours":
        return { color: variables.bai };
      case "rdv":
        return { color: variables.souris };
      case "soins":
        return { color: variables.isabelle };
      case "autre":
        return { color: variables.rouan };
      default:
        return { color: variables.defaultDotColor };
    }
  }

  const changeEventsCurrentDateSelected = (date) => {
    const arrayFiltered = eventArray.filter(item => dateUtils.dateFormatter(item.dateevent, "dd/MM/yyyy", "/") === date);
    setEventArrayCurrentDateSelected(arrayFiltered);
  }

  const convertDateToText = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormat = "YYYY-MM-DD";
    const dateValid = moment(date, dateFormat, true).isValid();
    if (!dateValid) {
      return "Date invalide";
    }
    const [year, month, day] = date.split('-');
    const dateObject = new Date(year, month - 1, day);
    let dateText = String(dateObject.toLocaleDateString("fr-FR", options));
    dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
    return dateText;
  }

  const onDayPress = (day) => {
    setSelectedDate(day.dateString);

    Object.entries(marked).forEach(([key, value]) => value.selected = false);
    const existingObj = marked[day.dateString];
    if(existingObj){
      existingObj.selected = true;
      marked[day.dateString] = existingObj;
    } else{
      var obj = {
        selected : true,
        disableTouchEvent : false,
        selectedColor : variables.alezan,
        selectedTextColor: variables.blanc,
        dots: []
      }
      marked[day.dateString] = obj;
    }
    setMarked(marked);

    changeEventsCurrentDateSelected(day.dateString);
  };

  return (
    <>
      {loadingEvent && (
        <View style={styles.loadingEvent}>
          <Image
            style={styles.loaderEvent}
            source={require("../assets/loader.gif")}
          />
        </View>
      )}
      <Image style={styles.image} source={require("../assets/wallpaper_addEvent.jpg")} />
      <TopTab message1={messages.message1} message2={messages.message2} />
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          theme={{
            arrowColor: variables.isabelle,
            todayTextColor: variables.aubere,
            selectedDayTextColor: "white",
            selectedDayBackgroundColor: variables.alezan
          }}
          enableSwipeMonths={true}
          onDayPress={onDayPress}
          markingType={'multi-dot'}
          markedDates={marked}
        />
      </View>
      <View style={styles.infosContainer}>
        <View style={styles.selectedDateContainer}>
          <Text style={styles.selectedDateText}>{convertDateToText(selectedDate)}</Text>
        </View>
        <ScrollView style={{ width: "100%" }}>
          <View style={styles.listEventContainer}>
            {eventArrayCurrentDateSelected.length == 0 &&
              <Text>Vous n'avez aucun événement pour cette date</Text>
            }
            {eventArrayCurrentDateSelected.map((eventItem, index) => (
              <EventCard
                eventInfos={eventItem}
                key={eventItem.id}
              />
            ))}
          </View>
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  loaderEvent: {
    width: 200,
    height: 200
  },
  loadingEvent: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9,
    width: "100%",
    height: "100%",
    backgroundColor: "#000000b8",
    paddingTop: 50
  },
  listEventContainer: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  selectedDateContainer: {
    padding: 2,
    width: "100%",
  },
  selectedDateText: {
    textAlign: "center",
    color: variables.alezan
  },
  infosContainer: {
    backgroundColor: variables.blanc,
    marginTop: 10,
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    borderRadius: 5,
    padding: 10,
    width: "80%",
    height: "30%"
  },
  calendarContainer: {
    marginTop: 20,
    width: "80%",
    display: "flex",
    alignSelf: "center"
  },
  calendar: {
    borderRadius: 5,
  },
  imagePrez: {
    height: "90%",
    width: "100%",
    marginTop: 10
  },
  screenContainer: {
    backgroundColor: Variables.fond,
  },
  contentContainer: {
    display: "flex",
    height: "90%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    position: "absolute",
    justifyContent: "center",
    backgroundColor: Variables.fond
  },
});

export default CalendarScreen;
