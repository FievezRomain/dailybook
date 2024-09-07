import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import variables from './styles/Variables';
import { TouchableOpacity } from 'react-native';

const TimePickerCustom = ({setValue, valueName, defaultValue}) => {
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
    setValue(valueName, date.getHours() + "h" + date.getMinutes());
    hideDatePicker();
  };

  return (
    <>
      <TouchableOpacity onPress={showDatePicker} style={{backgroundColor: variables.rouan, alignSelf: "flex-start", padding: 10, borderRadius: 5, width: "100%"}}>
        {selectedDate ?
            <Text style={{fontFamily: variables.fontRegular}}>{selectedDate.getHours()}h{selectedDate.getMinutes()}</Text>
          :
            <Text style={{fontFamily: variables.fontRegular}}>Sélectionner une heure</Text>
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
        buttonTextColorIOS={variables.bai}
      />
    </>
  );
};

export default TimePickerCustom;
