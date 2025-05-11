import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const GroupCard = ({ group }) => {
  const { colors, fonts } = useTheme();
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('GroupDetail', { group: group });
  };

  const styles = StyleSheet.create({
    card: {
      marginBottom: 12,
      borderRadius: 5,
      elevation: 2,
      backgroundColor: colors.background,
      shadowColor: colors.default_dark,
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: {width: 0, height: 1},
      elevation: 2,
      padding: 15
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    textFontBold:{
      fontFamily: fonts.bodyLarge.fontFamily
    },
    textFontMedium:{
      fontFamily: fonts.bodyMedium.fontFamily
    },
    iconAction:{
      color: colors.accent,
      paddingRight: 10
    },
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View>
          <View style={styles.header}>
            <Text style={[styles.textFontMedium, { color: colors.default_dark }]}>{group.name}</Text>
            <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupCard;
