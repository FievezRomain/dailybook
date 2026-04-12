import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface RatingInputProps {
  onRatingChange: (rating: number) => void;
  defaultRating?: number | null;
  margin?: number;
  size?: number;
  color?: string;
}

const RatingInput: React.FC<RatingInputProps> = ({
  onRatingChange,
  defaultRating,
  margin = 20,
  size = 40,
  color,
}) => {
  const { colors } = useAppTheme();
  const [rating, setRating] = useState(
    defaultRating == null ? 0 : defaultRating,
  );

  const handleRating = (value: number) => {
    const newRating = value === rating ? 0 : value;
    setRating(newRating);
    onRatingChange(newRating);
  };

  const styles = StyleSheet.create({
    container: { alignItems: 'center', marginBottom: margin },
    starsContainer: { flexDirection: 'row', marginBottom: margin / 2 },
    star: { marginRight: 5 },
  });

  return (
    <View style={styles.container}>
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((index) => (
          <TouchableOpacity key={index} onPress={() => handleRating(index)} style={styles.star}>
            <FontAwesome
              name={index <= rating ? 'star' : 'star-o'}
              size={size}
              color={color ?? colors.quaternary}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default RatingInput;
