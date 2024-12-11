import { View, Text, StyleSheet, Image, FlatList } from "react-native";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { Calendar, CalendarUtils, LocaleConfig } from 'react-native-calendars';
import { ScrollView } from "react-native";
import moment from "moment";
import EventCard from "../components/cards/EventCard";
import DateUtils from "../utils/DateUtils";
import Toast from "react-native-toast-message";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { AntDesign, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { TextInput } from "react-native";
import { TouchableOpacity } from "react-native";
import LoggerService from "../services/LoggerService";
import { LinearGradient } from "expo-linear-gradient";
import ModalDefaultNoValue from "../components/Modals/ModalDefaultNoValue";
import ModalFilterCalendar from "../components/Modals/ModalFilterCalendar";
import { CalendarFilter } from "../business/models/CalendarFilter";
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from "@react-navigation/native";
import { useCalendar } from "../providers/CalendarProvider";
import { useEvents } from "../providers/EventsProvider";

const CalendarScreen = ({ navigation }) => {
  const { colors, fonts } = useTheme();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState({ message1: "Mon", message2: "calendrier" });
  const dateUtils = new DateUtils();
  const { events, setEvents } = useEvents();
  const [eventsCurrentDateSelected, setEventsCurrentDateSelected] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [marked, setMarked] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [modalFilterVisible, setModalFilterVisible] = useState(false);
  const [filter, setFilter] = useState(null);
  const { setDate } = useCalendar();

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

  useFocusEffect(
    useCallback(() => {
      setMessages({ message1: "Mon", message2: "Calendrier" });
      //getEventsForUser();
    }, [])
  );

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setDate(null);
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    setupMarkedDates(true);
    changeEventsCurrentDateSelected(selectedDate);
  }, [events]);

  useEffect(() => {
    applyFilter();
  }, [filter, events]);

  const applyFilter = () =>{
    if( filter ){
      var result = filter.filter(events);
      
      setFilteredEvents(result);
    }
  }

  /* const getEventsForUser = async () => {
    if (events.length === 0) {
      try {
        const result = await eventService.getEvents(currentUser.email);
        setEvents(result);
      } catch (error) {
        LoggerService.log( "Erreur lors de la récupération des events : " + error.message );
        console.error("Error fetching events:", error);
      }
    }
  } */

  const setupMarkedDates = (isInit) => {
    //const newMarked = { ...marked };
    const newMarked = { };
  
    const getDate = (count) => {
      const date = new Date(INITIAL_DATE);
      date.setDate(date.getDate() + count);
      return CalendarUtils.getCalendarDateString(date);
    };

    const treatmentItem = (item, dateString) =>{
      const existingObj = newMarked[dateString];
  
      if (existingObj) {
        if (!existingObj.dots.some(dot => dot.color === getEventTypeDot(item.eventtype).color)) {
          existingObj.dots.push(getEventTypeDot(item.eventtype));
        }
      } else {
        newMarked[dateString] = {
          selected: false,
          disableTouchEvent: false,
          selectedColor: colors.accent,
          selectedTextColor: colors.background,
          dots: [getEventTypeDot(item.eventtype)]
        };
      }
    };
    
    events.forEach((item) => {
      const dateString = item.dateevent;
      treatmentItem(item, dateString);

      /* if(item.datefinsoins !== null){
        let currentDate = new Date(item.dateevent);
        let endDate = new Date(dateUtils.dateFormatter(item.datefinsoins, "dd/MM/yyyy", "/"));
        while (currentDate <= endDate) {
          treatmentItem(item, currentDate.toISOString().split("T")[0]);

          currentDate.setDate(currentDate.getDate() + 1);
        } 
      }*/ 
    });
    
    if(isInit){
      // Setup default selected date
      const defaultDateString = selectedDate;

      if (!newMarked[defaultDateString]) {
        newMarked[defaultDateString] = {
          selected: true,
          disableTouchEvent: false,
          selectedColor: colors.accent,
          selectedTextColor: colors.background,
          dots: []
        };
      } else{
        const existingObj = newMarked[defaultDateString];

        existingObj.selected = true;
      }
    }
  
    setMarked(newMarked);
  };
  
  

  const getEventTypeDot = (eventType) => {
    switch (eventType) {
      case "balade":
        return { color: colors.accent };
      case "entrainement":
        return { color: colors.tertiary };
      case "concours":
        return { color: colors.primary };
      case "rdv":
        return { color: colors.text };
      case "soins":
        return { color: colors.neutral };
      case "autre":
        return { color: colors.error };
      case "depense":
        return { color: colors.quaternary };
      default:
        return { color: colors.onSurfaceDotColor };
    }
  }

  const changeEventsCurrentDateSelected = (date) => {
    const arrayFiltered = events.filter(item => item.dateevent === date /* || (item.datefinsoins !== null && new Date(date) >= new Date(item.dateevent) && new Date(date) <= new Date(dateUtils.dateFormatter(item.datefinsoins, "dd/MM/yyyy", "/"))) */);
    setEventsCurrentDateSelected(arrayFiltered);
  }

  const convertDateToText = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateFormat = "YYYY-MM-DD";
    const dateValid = moment(date, dateFormat, true).isValid();
    if (!dateValid) {
      return "Date invalide";
    }
    const dateObject = new Date(date);
    let dateText = String(dateObject.toLocaleDateString("fr-FR", options));
    dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
    return dateText;
  }

  const onDayPress = (day) => {
    // Mise à jour des hooks de l'écran
    setFilter(null);
    setSelectedDate(day);
    setSearchQuery("");

    // Mise à jour du context de l'application
    setDate(day);

    Object.entries(marked).forEach(([key, value]) => value.selected = false);
    const existingObj = marked[day];

    if(existingObj){
      existingObj.selected = true;
      marked[day] = existingObj;
    } else{
      var obj = {
        selected : true,
        disableTouchEvent : false,
        selectedColor : colors.accent,
        selectedTextColor: colors.background,
        dots: []
      }
      marked[day] = obj;
    }
    setMarked(marked);

    changeEventsCurrentDateSelected(day);
  };

  const handleEventsChange = async () => {

    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Modification d'un événement"
    }), 350);

    //setEvents(await eventService.getEvents(currentUser.email));

  }

  const handleSearch = (query) => {
    if( filter )
    {
        setFilter(new CalendarFilter(filter.date, filter.animals, filter.eventType, query));
    } else{
        setFilter(new CalendarFilter(null, null, null, query));
    }
  }

  const deleteSearchText = () => {
    if( !filter.date && !filter.animals && !filter.eventType ){
      setFilter(null);
    } else{
      setFilter(new CalendarFilter(filter.date, filter.animals, filter.eventType, null));
    }
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
      alignSelf: "center",
      width: "90%",
    },
    selectedDateContainer: {
      marginTop: 10,
      padding: 2,
      width: "100%",
      marginBottom: 10,
    },
    selectedDateText: {
      textAlign: "center",
      color: colors.accent
    },
    infosContainer: {
      display: "flex",
      flexDirection: "column",
      alignSelf: "center",
      borderRadius: 5,
      width: "90%",
    },
    calendarContainer: {
      marginTop: 10,
      width: "90%",
      display: "flex",
      alignSelf: "center",
      borderRadius: 5,
    },
    calendar: {
      borderRadius: 5,
      shadowColor: "black",
      shadowOpacity: 0.1,
      elevation: 1,
      shadowRadius:5,
      shadowOffset:{width:0, height:2}
    },
    imagePrez: {
      height: "90%",
      width: "100%",
      marginTop: 10
    },
    screenContainer: {
      backgroundColor: colors.quaternary,
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
      backgroundColor: colors.onSurface
    },
    textFontRegular: {
      fontFamily: fonts.default.fontFamily
    },
    textFontMedium: {
      fontFamily: fonts.bodyMedium.fontFamily,
    },
    textFontBold:{
      fontFamily: fonts.bodyLarge.fontFamily,
    }
  });

  return (
    <>
      <ModalFilterCalendar
        modalVisible={modalFilterVisible}
        setModalVisible={setModalFilterVisible}
        setFilter={setFilter}
        filter={filter}
      />
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
        <TopTab message1={messages.message1} message2={messages.message2} />
        <View style={{flexDirection: "row", alignContent: "center", alignItems: "center", backgroundColor: colors.background, alignSelf: "center", width: "90%", justifyContent:"space-between", padding: 10, borderRadius: 5, shadowColor: "black",elevation: 1, shadowOpacity: 0.1, shadowRadius:5, shadowOffset:{width:0, height:2}, marginTop: 20}}>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            <AntDesign name="search1" size={16} color={colors.accent}/>

            <TextInput
              placeholder="Recherche"
              style={[{marginLeft: 5, width: "80%"}, styles.textFontRegular]}
              value={filter ? filter.text : null}
              onChangeText={handleSearch}
            />
            {filter && filter.text && 
              <TouchableOpacity
                onPress={() => deleteSearchText()}
              >
                <AntDesign name="close" size={16} color={colors.accent}/>
              </TouchableOpacity>
            }
            
          </View>
          <View style={{flexDirection: "row", alignItems: "center"}}>
            
            <TouchableOpacity onPress={() => setModalFilterVisible(true)}>
              {filter ? 
                <MaterialCommunityIcons name="filter-variant-plus" size={21} color={colors.accent}/>
              :
                <Ionicons name="filter" size={20} color={colors.accent}/>
              }
            </TouchableOpacity>
          </View>
          
        </View>
        <View style={styles.calendarContainer}>
          <Calendar
            style={[styles.calendar, styles.textFontRegular]}
            firstDay={1}
            theme={{
              arrowColor: colors.quaternary,
              todayTextColor: colors.tertiary,
              selectedDayTextColor: "white",
              selectedDayBackgroundColor: colors.text,
              calendarBackground: colors.background,
              dayTextColor: colors.text,
              textDayHeaderTextColor: colors.text,
              textSectionTitleColor: colors.text
            }}
            enableSwipeMonths={true}
            onDayPress={(day) => onDayPress(day.dateString)}
            markingType={'multi-dot'}
            markedDates={marked}
          />
        </View>
        <View style={styles.selectedDateContainer}>
          {filter ?
            <Text style={[styles.selectedDateText, styles.textFontMedium]}>Résultats du filtre</Text>
          : 
            <Text style={[styles.selectedDateText, styles.textFontMedium]}>{convertDateToText(selectedDate)}</Text>
          }
        </View>
            
          <FlatList
            data={filter ? filteredEvents : eventsCurrentDateSelected}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <EventCard
                eventInfos={item}
                handleEventsChange={handleEventsChange}
                withDate={filter ? true : false}
              />
            )}
            ListEmptyComponent={filter ? <ModalDefaultNoValue text={"Aucun événement correspond à ce filtre"}/> : <ModalDefaultNoValue text={"Vous n'avez aucun événement pour cette date"}/>}
            contentContainerStyle={styles.listEventContainer}
        />
      </LinearGradient>
    </>
  );
}

export default CalendarScreen;
