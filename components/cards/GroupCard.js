import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { IconButton, Text, useTheme } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, FontAwesome, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

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
    containerCard: {
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
    arrow:{
      color: colors.accent,
      paddingRight: 10
    },
    icon:{
      color: colors.default_dark, 
      marginLeft: 10
    }
  });

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <View>
          <View style={styles.containerCard}>
            <View style={{width:"50%"}}>
              <Text style={[styles.textFontMedium, { color: colors.default_dark }]}>{group.name}</Text>
            </View>
            <View style={{width:"30%", flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={[styles.textFontMedium, { color: colors.default_dark }]}>{group.nb_animaux}</Text>
                <MaterialCommunityIcons name={"paw"} size={16} style={styles.icon} />
              </View>
              <View style={{flexDirection: "row", alignItems: "center"}}>
                <Text style={[styles.textFontMedium, { color: colors.default_dark }]}>{group.nb_members}</Text>
                <Ionicons name="person" size={14} style={styles.icon}/>
              </View>
            </View>
            <View style={{width:"20%", alignItems: "flex-end"}}>
              <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.arrow}/>
            </View>
            
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default GroupCard;
