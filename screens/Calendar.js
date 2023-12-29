import { View, Text, StyleSheet, Image } from "react-native";
import Variables from "../components/styles/Variables";
import TopTab from '../components/TopTab';
import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import { Calendar, CalendarUtils, LocaleConfig } from 'react-native-calendars';
import variables from "../components/styles/Variables";
import { ScrollView } from "react-native";
import moment from "moment";
import { FontAwesome5 } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";

const CalendarScreen = ({ navigation }) => {
  const [messages, setMessages] = useState({message1: "Mon", message2: "calendrier"});

  const getDate = (count) => {
    const date = new Date(INITIAL_DATE);
    const newDate = date.setDate(date.getDate() + count);
    return CalendarUtils.getCalendarDateString(newDate);
  };

  const INITIAL_DATE = new Date().toISOString().split('T')[0];
  const [selected, setSelected] = useState(INITIAL_DATE);

  LocaleConfig.locales['fr'] = {
    monthNames: [
      'Janvier',
      'Février',
      'Mars',
      'Avril',
      'Mai',
      'Juin',
      'Juillet',
      'Août',
      'Septembre',
      'Octobre',
      'Novembre',
      'Décembre'
    ],
    monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
    dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
    dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
    today: "Aujourd'hui"
  };
  LocaleConfig.defaultLocale = 'fr';

  const marked = useMemo(() => {
    return {
      [getDate(-1)]: {
        dotColor: variables.aubere,
        marked: true
      },
      [selected]: {
        selected: true,
        disableTouchEvent: true,
        selectedColor: variables.alezan,
        selectedTextColor: "white"
      }
    };
  }, [selected]);

  const onDayPress = useCallback((day) => {
    setSelected(day.dateString);
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      setMessages({message1: "Mon", message2: "calendrier"});
    });
    return unsubscribe;
  }, [navigation]);


  const convertDateToText = () =>{
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateFormat = "YYYY-MM-DD";
    dateValid = moment(selected, dateFormat, true).isValid();
    if (dateValid == false){
      return "Date invalide";
    }
    let [year, month, day] = selected.split('-')
    dateObject  = new Date(year, month-1, day);
    dateText = String(dateObject.toLocaleDateString("fr-FR", options));
    dateText = dateText.charAt(0).toUpperCase() + dateText.slice(1);
    return dateText;
  }

  return (
    <>
      <Image style={styles.image} source={require("../assets/wallpaper_addEvent.jpg")} />
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View style={styles.calendarContainer}>
        <Calendar
          style={styles.calendar}
          theme={{
            arrowColor:variables.isabelle,
            todayTextColor: variables.aubere,
            selectedDayTextColor: "white",
            selectedDayBackgroundColor: variables.alezan
          }}
          enableSwipeMonths={true}
          onDayPress={onDayPress}
          markedDates={marked}
        />
      </View>
      <View style={styles.infosContainer}>
          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedDateText}>{convertDateToText()}</Text>
          </View>
          <ScrollView style={{width:"100%"}}>
            <View style={styles.listEventContainer}>
              <View style={styles.eventContainer}>
                <View style={styles.eventTextContainer}>
                  <Text style={styles.eventTitle}>Titre</Text>
                  <Text style={styles.eventCommentaire}>BLABLA</Text>
                </View>
                <View style={styles.actionEventContainer}>
                  <TouchableOpacity><FontAwesome5 name="pencil-alt" size={18} style={{marginBottom: 15}}/></TouchableOpacity>
                  <TouchableOpacity><FontAwesome5 name="trash-alt" size={18}/></TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
      </View>
    </>
    );
}

const styles = StyleSheet.create({
  actionEventContainer:{
    width: "20%",
    alignItems: "flex-end",
  },
  eventTextContainer:{
    display: "flex",
    flexDirection: "column",
    width: "80%",
  },
  eventTitle:{
    fontWeight: "bold",
    marginBottom: 10,
  },
  eventCommentaire:{

  },
  eventContainer:{
    backgroundColor: variables.rouan,
    borderRadius: 5,
    width: "100%",
    display: "flex",
    flexDirection: "row",
    padding: 10,
  },
  listEventContainer:{
    display: "flex",
    justifyContent: "center",
    width: "100%",
  },
  selectedDateContainer:{
    padding: 2,
    width: "100%",
  },
  selectedDateText:{
    textAlign: "center",
    color: variables.alezan
  },
  infosContainer:{
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
  calendarContainer:{
    marginTop: 20,
    width: "80%",
    display: "flex",
    alignSelf: "center"
  },
  calendar:{
    borderRadius: 5,
  }, 
  imagePrez:{
    height: "90%",
    width: "100%",
    marginTop: 10
  },
  screenContainer:{
    backgroundColor: Variables.fond,
  },
  contentContainer:{
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
    backgroundColor:  Variables.fond
  },
})

module.exports = CalendarScreen;