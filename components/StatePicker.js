import { View } from "moti"
import { TouchableOpacity, Text, StyleSheet, SafeAreaView } from "react-native"
import { useState } from "react";
import { useTheme, SegmentedButtons } from 'react-native-paper';

const StatePicker = ({ arrayState, handleChange, defaultState=undefined }) => {
    const { colors, fonts } = useTheme();

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          alignItems: 'center',
        },
        input:{
            color: colors.primary
        }
    });

    return(
        <>
            <SafeAreaView style={styles.container}>
                <SegmentedButtons
                    value={defaultState}
                    onValueChange={handleChange}
                    buttons={arrayState}
                    style={styles.input}
                />
            </SafeAreaView>
        </>
    )
}

export default StatePicker;