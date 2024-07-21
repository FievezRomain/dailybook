import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateUtils from "../../utils/DateUtils";
import variables from "../styles/Variables";
import Button from "../Button";

const CalendarPicker = ({onDayChange, propertyName, defaultDate = undefined}) => {
  const [selectedDate, setSelectedDate] = useState(defaultDate == undefined ? new Date().toISOString().split('T')[0] : defaultDate);
  const [modalVisible, setModalVisible] = useState(false);
  const dateUtils = new DateUtils();

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

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  const closeModal = () => {
    setModalVisible(false);
    // Valider la sélection si une date est sélectionnée
    if (selectedDate) {
      // Ajoutez ici votre logique pour valider la sélection du calendrier
      onDayChange(propertyName, selectedDate);
    }
  };

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)} >
        <View style={styles.dateContainer}>
          <Text style={styles.date}>{dateUtils.dateFormatter(selectedDate, "yyyy-mm-dd", "-")}</Text>
        </View>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal} // Gère le clic sur le bouton "Retour" ou le bouton de retour physique
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Calendar
                  onDayPress={handleDayPress}
                  firstDay={1}
                  markedDates={selectedDate ? { [selectedDate]: { selected: true } } : {}}
                  theme={{
                    arrowColor: variables.isabelle,
                    todayTextColor: variables.aubere,
                    selectedDayTextColor: "white",
                    selectedDayBackgroundColor: variables.alezan
                  }}
                  enableSwipeMonths={false} // Active le swipe de mois
                />
                <View style={styles.closeButtonContainer}>
                  <Button onPress={closeModal}>
                    <Text>Fermer</Text>
                  </Button>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  dateContainer: {
    borderRadius: 5,
    backgroundColor: variables.rouan,
    marginBottom: 15,
  },
  date:{
    padding: 10,
  },
  closeButtonContainer:{
    marginTop: 20,
  }
});

export default CalendarPicker;
