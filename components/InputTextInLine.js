import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TextInput } from "react-native";
import variables from "./styles/Variables";
import { MaterialIcons } from '@expo/vector-icons';
import { Keyboard } from 'react-native';

const InputTextInLine = ({ inputTextLabel, value, isEditable=true, isPassword=false, isNumeric=false, onChangeText }) => {
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

    return (
        <TouchableOpacity style={[styles.touchableOpacity, { backgroundColor: variables.blanc }]} onPress={handleClicModifyValue} >
          <View style={styles.row}>
            <Text style={[styles.textLabel, styles.textFont]}>{inputTextLabel}</Text>
            <View style={styles.valueContainer}>
                <TextInput
                    placeholder={value}
                    defaultValue={isPassword ? "                  " : null}
                    style={[styles.valueText, styles.textFont]} 
                    placeholderTextColor={"gray"}
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
      textFont: {
        fontFamily: "Quicksand"
      },
    })

export default InputTextInLine;