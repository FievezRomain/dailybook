import React, { useState } from 'react';
import { TextInput } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';

interface DateFieldProps {
  setValue: (name: string, value: string) => void;
  date: string;
  setDate: (date: string) => void;
  valueName: string;
  style?: object;
  defaultValue?: string;
}

const DateField: React.FC<DateFieldProps> = ({ setValue, date, setDate, valueName, style }) => {
  const { colors } = useAppTheme();

  const onChangeDate = (selectedDate: string) => {
    const nbOccur = (String(selectedDate).match(/\//g) || []).length;
    const oldNbOccur = (String(date).match(/\//g) || []).length;
    if (String(selectedDate).length === 2) {
      if (nbOccur === 0 && oldNbOccur === 0) {
        selectedDate = selectedDate + '/';
        setValue(valueName, selectedDate);
        setDate(selectedDate);
      }
    } else if (String(selectedDate).length === 5) {
      if (nbOccur === 1 && oldNbOccur === 1) {
        selectedDate = selectedDate + '/';
        setValue(valueName, selectedDate);
        setDate(selectedDate);
      }
    } else if (String(selectedDate).length === 9) {
      const firstDatePart = String(selectedDate).split('/')[0];
      if (String(firstDatePart).length === 1) {
        selectedDate = '0' + selectedDate;
        setValue(valueName, selectedDate);
        setDate(selectedDate);
      }
    }
    setValue(valueName, selectedDate);
    setDate(selectedDate);
  };

  return (
    <TextInput
      style={style}
      placeholder="Exemple : 01/01/1900"
      keyboardType="numeric"
      inputMode="numeric"
      maxLength={10}
      placeholderTextColor={colors.secondary}
      onChangeText={(text) => onChangeDate(text)}
      value={date}
    />
  );
};

export default DateField;
