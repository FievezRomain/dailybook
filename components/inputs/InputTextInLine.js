import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TextInput } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const InputTextInLine = ({ inputTextLabel, value, isEditable=true, isPassword=false, isNumeric=false, onChangeText }) => {
    const { colors, fonts } = useTheme();
    const textInputRef = useRef(null);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const handleClicModifyValue = () =>{
        if (textInputRef.current) {
            textInputRef.current.focus();
        }
    }

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const styles = StyleSheet.create({
      touchableOpacity: {
        width: "100%",
        display: "flex",
        borderRadius: 5,
        height: 35,
        alignItems: "center",
      },
      row: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        height: "100%",
        alignItems: "center",
        paddingHorizontal: 10,
      },
      textLabel: {
        fontWeight: "bold",
      },
      valueContainer: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1, // Make the container take the remaining space
        justifyContent: 'flex-end',
        marginLeft: 10
      },
      valueText: {
        flexShrink: 1, // Allow the text to shrink if necessary
        marginRight: 5, // Add some margin to separate text from the icon
      },
      icon: {
        width: 20, // Fixed width for the icon
      },
      textFontRegular:{
          fontFamily: fonts.default.fontFamily
      },
      textFontMedium:{
          fontFamily: fonts.bodyMedium.fontFamily
      },
      textFontBold:{
          fontFamily: fonts.bodyLarge.fontFamily
      }
    })

    return (
        <TouchableOpacity style={[styles.touchableOpacity, { backgroundColor: colors.background }]} onPress={handleClicModifyValue} >
          <View style={styles.row}>
            <Text style={[styles.textFontBold]}>{inputTextLabel}</Text>
            <View style={styles.valueContainer}>
                <TextInput
                    placeholder={value}
                    defaultValue={isPassword ? "                  " : null}
                    style={[styles.valueText, styles.textFontRegular]} 
                    placeholderTextColor={colors.quaternary}
                    editable={true}
                    secureTextEntry={isPassword && !isPasswordVisible}
                    keyboardType={isNumeric ? "numeric" : "default"}
                    ref={textInputRef}
                    onChangeText={(text) => onChangeText(text)}
                />
                {isPassword && 
                    <TouchableOpacity onPress={togglePasswordVisibility}>
                        <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} style={[styles.icon, {marginRight: 5}]} />
                    </TouchableOpacity>
                }
              {isEditable && <MaterialIcons name='edit' size={20} style={styles.icon} />}
            </View>
          </View>
        </TouchableOpacity>
      );
};

export default InputTextInLine;