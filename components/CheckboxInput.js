import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Assurez-vous d'avoir installé et importé les icônes appropriées

const CheckboxInput = ({ isChecked, onChange }) => {
  const [checked, setChecked] = useState(isChecked);

  const toggleCheckbox = () => {
    const newValue = !checked;
    setChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <TouchableOpacity onPress={toggleCheckbox} style={styles.container}>
      <MaterialIcons
        name={checked ? 'check-box' : 'check-box-outline-blank'}
        size={24}
        color={checked ? '#0066FF' : 'grey'}
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
