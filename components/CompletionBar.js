import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useTheme } from 'react-native-paper';

const CompletionBar = ({ percentage=0 }) => {
  const { colors, fonts } = useTheme();
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

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      height: 20,
      backgroundColor: colors.background,
      borderRadius: 60,
      shadowColor: "black",
      shadowOpacity: 0.1,
      elevation: 1,
      shadowRadius: 1,
      shadowOffset: {width: 0, height: 1},
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
    textFontRegular:{
      fontFamily: fonts.default.fontFamily
    },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bar,
          { width: animatedPercentage.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%']
            }),
            backgroundColor: isCompleted ? colors.quaternary : colors.quaternary
          }
        ]}
      />
      <Text style={[styles.percentageText, styles.textFontRegular, { color: isCompleted ? colors.default_dark : colors.default_dark }]}>
        {percentage}%
      </Text>
    </View>
  );
};

export default CompletionBar;
