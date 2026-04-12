import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface BackProps {
  isWithBackground?: boolean;
  arrowColor?: string;
  buttonOptional?: React.ReactNode;
}

const Back: React.FC<BackProps> = ({
  isWithBackground = false,
  arrowColor,
  buttonOptional,
}) => {
  const { colors } = useAppTheme();
  const navigation = useNavigation();

  const styles = StyleSheet.create({
    backButton: { marginLeft: 20 },
  });

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        {isWithBackground ? (
          <View
            style={[
              {
                backgroundColor: colors.accent,
                borderRadius: 30,
                width: 40,
                height: 40,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              },
              styles.backButton,
            ]}
          >
            <Ionicons name="chevron-back" size={30} color={colors.background} />
          </View>
        ) : arrowColor ? (
          <Ionicons name="chevron-back" style={styles.backButton} size={30} color={arrowColor} />
        ) : (
          <Ionicons
            name="chevron-back"
            style={styles.backButton}
            size={30}
            color={colors.default_dark}
          />
        )}
      </TouchableOpacity>
      {buttonOptional && buttonOptional}
    </View>
  );
};

export default Back;
