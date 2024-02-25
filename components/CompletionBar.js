import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import variables from './styles/Variables';

const CompletionBar = ({ percentage }) => {
  const isCompleted = percentage === 100;

  return (
    <View style={styles.container}>
      <View style={[styles.bar, { width: `${percentage}%`, backgroundColor: isCompleted ? variables.isabelle : variables.alezan }]} />
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
    backgroundColor: '#f0f0f0',
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
