import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import variables from './styles/Variables';

const CheckboxInput = ({ isChecked, onChange, objet }) => {
  const [checked, setChecked] = useState(isChecked);

  const toggleCheckbox = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onChange) {
      onChange(newValue, objet);
    }
  };

  return (
    <TouchableOpacity onPress={toggleCheckbox} style={styles.container}>
      <MaterialIcons
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={checked ? variables.bai : variables.bai_brun }
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CheckboxInput;
