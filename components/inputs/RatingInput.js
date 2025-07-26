import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';

const RatingInput = ({ onRatingChange, defaultRating, margin=20, size=40, color=undefined }) => {
  const { colors, fonts } = useTheme();
  const [rating, setRating] = useState(defaultRating == undefined || defaultRating == null ? 0 : defaultRating);

  const handleRating = (value) => {
    const newRating = value === rating ? 0 : value; // Si l'utilisateur sélectionne à nouveau la même note, réinitialiser à zéro
    setRating(newRating);
    onRatingChange(newRating);
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: margin,
    },
    label: {
      fontSize: 18,
      marginBottom: margin /2,
    },
    starsContainer: {
      flexDirection: 'row',
      marginBottom: margin /2,
    },
    star: {
      marginRight: 5,
    },
    ratingText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity key={index} onPress={() => handleRating(index)} style={styles.star}>
            <FontAwesome name={index <= rating ? 'star' : 'star-o'} size={size} color={color ? color : colors.quaternary} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RatingInput;
