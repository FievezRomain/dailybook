import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import Variables from './styles/Variables';

const DatePickerComponent = ({ setValue }) => {

    const [date, setDate] = useState(new Date(new Date().getTime()));

    const onChange = (event, selectedDate) => {
        setValue("date", selectedDate.getDate() + "/" + parseInt(selectedDate.getMonth()+1) + "/" + selectedDate.getFullYear());
        setDate(selectedDate);
    };

    return(
        <SafeAreaView>
            <DateTimePicker
                testID="dateTimePicker"
                value={date}
                mode="date"
                is24Hour={true}
                onChange={onChange}
                accentColor={Variables.bouton}
            />
            
        </SafeAreaView>
    );
};



export default DatePickerComponent;

