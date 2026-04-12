import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import Button from '../../inputs/Button';
import { useAppTheme } from '../../../../theme/useAppTheme';
import instanceDateUtils from '../../../utils/DateUtils';

LocaleConfig.locales['fr'] = {
  monthNames: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
  monthNamesShort: ['Janv.', 'Févr.', 'Mars', 'Avril', 'Mai', 'Juin', 'Juil.', 'Août', 'Sept.', 'Oct.', 'Nov.', 'Déc.'],
  dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
  dayNamesShort: ['Dim.', 'Lun.', 'Mar.', 'Mer.', 'Jeu.', 'Ven.', 'Sam.'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';

interface CalendarPickerProps {
  onDayChange: (propertyName: string, date: string) => void;
  propertyName: string;
  defaultDate?: string;
}

const CalendarPicker = ({ onDayChange, propertyName, defaultDate }: CalendarPickerProps) => {
  const { colors, fonts } = useAppTheme();
  const [selectedDate, setSelectedDate] = useState(defaultDate ?? new Date().toISOString().split('T')[0]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
  };

  const closeModal = () => {
    setModalVisible(false);
    if (selectedDate) {
      onDayChange(propertyName, selectedDate);
    }
  };

  const styles = StyleSheet.create({
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
    modalContent: { backgroundColor: colors.background, padding: 20, borderRadius: 10, width: '80%' },
    dateContainer: { borderRadius: 5, backgroundColor: colors.quaternary },
    date: { padding: 10 },
    closeButtonContainer: { marginTop: 20 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <View>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View style={styles.dateContainer}>
          <Text style={[styles.date, styles.textFontRegular]}>{instanceDateUtils.dateFormatter(selectedDate, 'yyyy-mm-dd', '-')}</Text>
        </View>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalContent}>
                <Calendar
                  onDayPress={handleDayPress}
                  firstDay={1}
                  monthFormat="MMMM yyyy"
                  markedDates={selectedDate ? { [selectedDate]: { selected: true } } : {}}
                  theme={{
                    arrowColor: colors.neutral,
                    todayTextColor: colors.tertiary,
                    selectedDayTextColor: colors.background,
                    selectedDayBackgroundColor: colors.accent,
                  }}
                  enableSwipeMonths={false}
                />
                <View style={styles.closeButtonContainer}>
                  <Button onPress={closeModal}>
                    <Text style={styles.textFontMedium}>Fermer</Text>
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

export default CalendarPicker;
