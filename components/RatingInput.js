import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import variables from './styles/Variables';

const RatingInput = ({ onRatingChange, defaultRating }) => {
  const [rating, setRating] = useState(defaultRating == undefined || defaultRating == null ? 0 : defaultRating);

  const handleRating = (value) => {
    const newRating = value === rating ? 0 : value; // Si l'utilisateur sélectionne à nouveau la même note, réinitialiser à zéro
    setRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity key={index} onPress={() => handleRating(index)} style={styles.star}>
            <FontAwesome name={index <= rating ? 'star' : 'star-o'} size={40} color={variables.isabelle} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  star: {
    marginRight: 5,
  },
  ratingText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default RatingInput;
