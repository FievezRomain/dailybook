import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Entypo } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface TimePickerCustomProps {
  setValue: (name: string, value: string | undefined) => void;
  valueName: string;
  defaultValue?: Date | null;
}

const TimePickerCustom: React.FC<TimePickerCustomProps> = ({
  setValue,
  valueName,
  defaultValue,
}) => {
  const { colors, fonts } = useAppTheme();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null | undefined>(defaultValue);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    setValue(
      valueName,
      String(date.getHours()).padStart(2, '0') + 'h' + String(date.getMinutes()).padStart(2, '0'),
    );
    hideDatePicker();
  };

  return (
    <>
      <TouchableOpacity
        onPress={showDatePicker}
        style={{
          backgroundColor: colors.quaternary,
          alignSelf: 'flex-start',
          padding: 10,
          borderRadius: 5,
          width: '100%',
        }}
      >
        {selectedDate ? (
          <View
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={{ fontFamily: fonts.default.fontFamily }}>
              {String(selectedDate.getHours()).padStart(2, '0')}h
              {String(selectedDate.getMinutes()).padStart(2, '0')}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setValue(valueName, undefined);
                setSelectedDate(null);
              }}
            >
              <Entypo name="circle-with-cross" size={15} color={colors.default_dark} />
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={{ fontFamily: fonts.default.fontFamily, color: colors.secondary }}>
            Sélectionner une heure
          </Text>
        )}
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        locale="fr"
        confirmTextIOS="Valider"
        cancelTextIOS="Annuler"
        buttonTextColorIOS={colors.accent}
        themeVariant="light"
        date={selectedDate ?? new Date()}
      />
    </>
  );
};

export default TimePickerCustom;
