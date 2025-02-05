import { View } from "moti"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useState } from "react";
import { useTheme } from 'react-native-paper';

const TemporalityPicker = ({ arrayState, handleChange, defaultState=undefined }) => {
    const { colors, fonts } = useTheme();

    const styles = StyleSheet.create({
        container:{
            with: "100%",
            display: "flex",
            flexDirection: "row",
            borderBlockColor: "black",
            borderWidth: 0.4,
            backgroundColor: colors.onSurface,
            borderRadius: 5
        },
        textContainer:{
            paddingHorizontal: 20,
            paddingVertical: 10,
            alignItems: "center"
        },
        textContainerSelectedLeft:{
            borderBottomStartRadius: 5,
            borderTopStartRadius: 5,
            borderRightWidth: 0.2
        },
        textContainerSelectedRight:{
            borderBottomEndRadius: 5,
            borderTopEndRadius: 5,
            borderLeftWidth: 0.2
        },
        textContainerSelect:{
            backgroundColor: colors.default_dark,
        },
        textSelected:{
            color: colors.background
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
    });

    return(
        <>
            <View style={styles.container}>
            {arrayState.map((state, index) => (
                <TouchableOpacity key={index} onPress={() => handleChange(state)} style={[styles.textContainer, {width: (100 / arrayState.length) + "%"}, index === 0 ? styles.textContainerSelectedLeft : null, index === arrayState.length -1 ? styles.textContainerSelectedRight : null, defaultState.id === state.id || defaultState === undefined ? styles.textContainerSelect : null]}>
                    <Text style={[(defaultState.id === state.id || defaultState.id === undefined ? styles.textSelected : null), styles.textFontRegular]}>{state.title}</Text>
                </TouchableOpacity>
            ))}
            </View>
        </>
    )
}

export default TemporalityPicker;