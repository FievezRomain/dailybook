import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const CheckboxInput = ({ isChecked, onChange, objet }) => {
  const { colors, fonts } = useTheme();
  const [checked, setChecked] = useState(isChecked);

  const toggleCheckbox = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onChange) {
      onChange(newValue, objet);
    }
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

  return (
    <TouchableOpacity onPress={toggleCheckbox} style={styles.container}>
      <MaterialIcons
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={checked ? colors.accent : colors.text }
      />
    </TouchableOpacity>
  );
};

export default CheckboxInput;
