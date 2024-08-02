import { View } from "moti"
import { TouchableOpacity, Text, StyleSheet } from "react-native"
import variables from "./styles/Variables";
import { useState } from "react";

const StatePicker = ({ firstState, secondState, handleChange, defaultState=undefined }) => {
    const [currentState, setCurrentState] = useState(defaultState);

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

const styles = StyleSheet.create({
    container:{
        with: "100%",
        display: "flex",
        flexDirection: "row",
        borderBlockColor: "black",
        borderWidth: 0.4,
        backgroundColor: variables.default,
        borderRadius: 5
    },
    textContainer:{
        paddingHorizontal: 20,
        paddingVertical: 10,
        width: "50%",
        alignItems: "center"
    },
    textContainerSelectedLeft:{
        backgroundColor: variables.alezan,
        borderBottomStartRadius: 5,
        borderTopStartRadius: 5
    },
    textContainerSelectedRight:{
        backgroundColor: variables.alezan,
        borderBottomEndRadius: 5,
        borderTopEndRadius: 5
    },
    textSelected:{
        color: variables.blanc
    },
    textFontRegular:{
        fontFamily: variables.fontRegular
    },
});

export default StatePicker;