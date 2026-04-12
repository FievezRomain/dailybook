import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ToggleSwitchProps {
  isActive: boolean;
  onToggle?: (value: boolean) => void;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ isActive, onToggle }) => {
  const { colors } = useAppTheme();

  const toggleSwitch = () => {
    onToggle && onToggle(!isActive);
  };

  const styles = StyleSheet.create({
    container: {
      width: 40,
      height: 24,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: colors.quaternary,
      justifyContent: 'center',
      marginLeft: 10,
    },
    toggle: {
      width: 20,
      height: 20,
      borderRadius: 10,
      backgroundColor: colors.background,
    },
    active: { backgroundColor: colors.text, marginLeft: 20 },
    inactive: { backgroundColor: colors.quaternary, marginLeft: 0 },
  });

  return (
    <TouchableOpacity
      onPress={toggleSwitch}
      style={[styles.container, isActive ? { backgroundColor: colors.tertiary } : null]}
    >
      <View style={[styles.toggle, isActive ? styles.active : styles.inactive]} />
    </TouchableOpacity>
  );
};

export default ToggleSwitch;
