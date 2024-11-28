import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';

const TimePickerCustom = ({setValue, valueName, defaultValue}) => {
  const { colors, fonts } = useTheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultValue);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    setValue(valueName, String(date.getHours()).padStart(2, '0') + "h" + String(date.getMinutes()).padStart(2, '0'));
    hideDatePicker();
  };

  return (
    <>
      <TouchableOpacity onPress={showDatePicker} style={{backgroundColor: colors.quaternary, alignSelf: "flex-start", padding: 10, borderRadius: 5, width: "100%"}}>
        {selectedDate ?
            <Text style={{fontFamily: fonts.default.fontFamily}}>{String(selectedDate.getHours()).padStart(2, '0')}h{String(selectedDate.getMinutes()).padStart(2, '0')}</Text>
          :
            <Text style={{fontFamily: fonts.default.fontFamily}}>Sélectionner une heure</Text>
        }
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale="fr"
        confirmTextIOS='Valider'
        cancelTextIOS='Annuler'
        buttonTextColorIOS={colors.accent}
        themeVariant="light"
      />
    </>
  );
};

export default TimePickerCustom;
