import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';

interface CompletionBarProps {
  percentage?: number;
}

const CompletionBar: React.FC<CompletionBarProps> = ({ percentage = 0 }) => {
  const { colors, fonts } = useAppTheme();
  const [animatedPercentage] = useState(new Animated.Value(0));
  const isCompleted = percentage === 100;

  useEffect(() => {
    Animated.timing(animatedPercentage, {
      toValue: percentage,
      duration: 250,
      easing: Easing.linear,
      useNativeDriver: false,
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
      shadowColor: colors.default_dark,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowRadius: 1,
      shadowOffset: { width: 0, height: 1 },
      position: 'relative',
    },
    bar: { height: '100%', borderRadius: 10, position: 'absolute', top: 0, left: 0 },
    percentageText: { position: 'absolute', zIndex: 1, marginLeft: 5, fontSize: 13 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.bar,
          {
            width: animatedPercentage.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
            backgroundColor: colors.quaternary,
          },
        ]}
      />
      <Text
        style={[
          styles.percentageText,
          styles.textFontRegular,
          { color: colors.default_dark },
        ]}
      >
        {percentage}%
      </Text>
    </View>
  );
};

export default CompletionBar;
