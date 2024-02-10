import React, { useState } from 'react';
import { View, Button, Text } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const DateTimePickerCustom = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  return (
    <View>
      <Button title="Sélectionner une date" onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale="fr"
        confirmText="Valider" // Libellé du bouton de confirmation
        cancelText="Annuler"   // Libellé du bouton d'annulation
      />
      {selectedDate && (
        <Text>Date sélectionnée : {selectedDate.toString()}</Text>
      )}
    </View>
  );
};

export default DateTimePickerCustom;
