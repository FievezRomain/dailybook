import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import variables from './styles/Variables';

const ToggleSwitch = ({ isActive, onToggle }) => {
  const toggleSwitch = () => {
    onToggle && onToggle(!isActive);
  }; 

  return (
    <>
      <TouchableOpacity
        onPress={toggleSwitch}
        style={[
          styles.container,
          isActive ? { backgroundColor: variables.aubere } : null
        ]}
      >
        <View
          style={[styles.toggle, isActive ? styles.active : styles.inactive]}
        />
      </TouchableOpacity>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: variables.rouan,
    justifyContent: 'center',
    marginLeft: 10
  },
  toggle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  active: {
    backgroundColor: variables.bai_brun,
    marginLeft: 20,
  },
  inactive: {
    backgroundColor: variables.rouan,
    marginLeft: 0,
  },
});

export default ToggleSwitch;
