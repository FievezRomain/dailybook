import { TextInput } from "react-native";
import React, { useEffect, useState } from 'react';
import { useTheme } from 'react-native-paper';

const DateField = ({ setValue, date, setDate, valueName, style, defaultValue }) => {
    const { colors, fonts } = useTheme();
    //const [date, setDate] = useState(defaultValue(valueName));

    const onChangeDate = (selectedDate) => {
        nbOccur = (String(selectedDate).match(/\//g) || []).length;
        oldNbOccur = (String(date).match(/\//g) || []).length;
        if(String(selectedDate).length === 2){
            if(nbOccur === 0 && oldNbOccur === 0){
                selectedDate = selectedDate + "/";
                console.log(selectedDate);
                setValue(valueName, selectedDate);
                setDate(selectedDate);
            }
        } else if(String(selectedDate).length === 5){
            if(nbOccur === 1 && oldNbOccur === 1){
                selectedDate = selectedDate + "/";
                setValue(valueName, selectedDate);
                setDate(selectedDate);
            }
        } else if(String(selectedDate).length === 9){
            firstDatePart = String(selectedDate).split("/")[0];
            if(String(firstDatePart).length === 1){
                selectedDate = "0" + selectedDate;
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
  