import React, { useState, useRef } from 'react';
import { TouchableOpacity, Text, StyleSheet, View, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface InputTextInLineProps {
  inputTextLabel: string;
  value?: string;
  isEditable?: boolean;
  isPassword?: boolean;
  isNumeric?: boolean;
  onChangeText: (text: string) => void;
}

const InputTextInLine: React.FC<InputTextInLineProps> = ({
  inputTextLabel,
  value,
  isEditable = true,
  isPassword = false,
  isNumeric = false,
  onChangeText,
}) => {
  const { colors, fonts } = useAppTheme();
  const textInputRef = useRef<TextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleClicModifyValue = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const styles = StyleSheet.create({
    touchableOpacity: {
      width: '100%',
      display: 'flex',
      borderRadius: 5,
      height: 35,
      alignItems: 'center',
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      height: '100%',
      alignItems: 'center',
      paddingHorizontal: 10,
    },
    valueContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
      justifyContent: 'flex-end',
      marginLeft: 10,
    },
    valueText: { flexShrink: 1, marginRight: 5 },
    icon: { width: 20 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <TouchableOpacity
      style={[styles.touchableOpacity, { backgroundColor: colors.background }]}
      onPress={handleClicModifyValue}
    >
      <View style={styles.row}>
        <Text style={styles.textFontBold}>{inputTextLabel}</Text>
        <View style={styles.valueContainer}>
          <TextInput
            placeholder={value}
            defaultValue={isPassword ? '                  ' : undefined}
            style={[styles.valueText, styles.textFontRegular]}
            placeholderTextColor={colors.quaternary}
            editable={true}
            secureTextEntry={isPassword && !isPasswordVisible}
            keyboardType={isNumeric ? 'numeric' : 'default'}
            ref={textInputRef}
            onChangeText={(text) => onChangeText(text)}
          />
          {isPassword && (
            <TouchableOpacity onPress={togglePasswordVisibility}>
              <MaterialIcons
                name={isPasswordVisible ? 'visibility' : 'visibility-off'}
                size={22}
                style={[styles.icon, { marginRight: 5 }]}
              />
            </TouchableOpacity>
          )}
          {isEditable && <MaterialIcons name="edit" size={20} style={styles.icon} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default InputTextInLine;
