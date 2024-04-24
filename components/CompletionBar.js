import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import variables from './styles/Variables';

const CompletionBar = ({ percentage=0 }) => {
  const [animatedPercentage] = useState(new Animated.Value(0));
  const isCompleted = percentage === 100;

  useEffect(() => {
    Animated.timing(animatedPercentage, {
      toValue: percentage,
      duration: 250, // Durée de l'animation en millisecondes
      easing: Easing.linear, // Type d'animation (facultatif)
      useNativeDriver: false // Nécessaire pour les propriétés non supportées par le moteur natif
    }).start();
  }, [percentage]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bar,
          { width: animatedPercentage.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            }),
            backgroundColor: isCompleted ? variables.isabelle : variables.alezan
          }
        ]}
      />
      <Text style={[styles.percentageText, { color: isCompleted ? variables.blanc : variables.rouan }]}>
        {percentage}%
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 20,
    backgroundColor: variables.blanc,
    borderRadius: 10,
    overflow: 'hidden',
    position: 'relative', // Ajout d'une position relative
  },
  bar: {
    height: '100%',
    borderRadius: 10,
    position: 'absolute', // Ajout d'une position absolue
    top: 0,
    left: 0,
  },
  percentageText: {
    position: 'absolute', // Ajout d'une position absolue
    zIndex: 1, // Assure que le texte est au-dessus de la barre de progression
    marginLeft: 5,
    fontSize: 13,
  },
});

export default CompletionBar;
