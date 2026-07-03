import React from 'react';
import { Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ButtonLongProps {
  children: React.ReactNode;
  type?: string;
  onPress?: () => void;
}

const ButtonLong: React.FC<ButtonLongProps> = ({ children, type, onPress }) => {
  const { colors } = useAppTheme();

  let backgroundColor: string = colors.background;
  let color: string = colors.default_dark;

  if (type === 'primary') {
    backgroundColor = colors.primary;
    color = colors.default_dark;
  } else if (type === 'secondary') {
    backgroundColor = colors.background;
    color = colors.secondary;
  } else if (type === 'disconnect') {
    backgroundColor = colors.tertiary;
    color = colors.background;
  }

  const styles = StyleSheet.create({
    button: {
      backgroundColor,
      width: 200,
      paddingBottom: 15,
      paddingTop: 15,
      borderRadius: 5,
      marginBottom: 5,
    },
    buttonText: {
      color,
      textAlign: 'center',
      fontSize: 14,
      textTransform: 'uppercase',
    },
  });

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonText}>{children}</Text>
    </TouchableOpacity>
  );
};

export default ButtonLong;
