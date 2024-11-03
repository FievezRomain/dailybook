import { View } from "moti"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import { useState } from "react";
import { useTheme } from 'react-native-paper';

const StatePicker = ({ firstState, secondState, handleChange, defaultState=undefined }) => {
    const [currentState, setCurrentState] = useState(defaultState);
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
            width: "50%",
            alignItems: "center"
        },
        textContainerSelectedLeft:{
            backgroundColor: colors.accent,
            borderBottomStartRadius: 5,
            borderTopStartRadius: 5
        },
        textContainerSelectedRight:{
            backgroundColor: colors.accent,
            borderBottomEndRadius: 5,
            borderTopEndRadius: 5
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
                <TouchableOpacity onPress={() => handleChange(firstState)} style={[styles.textContainer, defaultState === firstState || defaultState === undefined ? styles.textContainerSelectedLeft : null]}>
                    <Text style={[(defaultState === firstState || defaultState === undefined ? styles.textSelected : null), styles.textFontRegular]}>{firstState}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleChange(secondState)} style={[styles.textContainer, defaultState === secondState ? styles.textContainerSelectedRight : null]}>
                    <Text style={[(defaultState === secondState  ? styles.textSelected : null), styles.textFontRegular]}>{secondState}</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}

export default StatePicker;