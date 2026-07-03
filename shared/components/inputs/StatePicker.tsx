import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';

interface StateOption {
  value: string;
  label: string;
  [key: string]: unknown;
}

interface StatePickerProps {
  arrayState: StateOption[];
  handleChange: (value: string) => void;
  defaultState?: string;
  color?: string;
}

const StatePicker: React.FC<StatePickerProps> = ({
  arrayState,
  handleChange,
  defaultState,
  color,
}) => {
  const { colors, fonts, tokens } = useAppTheme();
  const activeColor = color ?? colors.primary;

  return (
    <SafeAreaView style={styles.container}>
      <View style={[styles.row, { borderColor: activeColor }]}>
        {arrayState.map((option, index) => {
          const isSelected = option.value === defaultState;
          const isFirst = index === 0;
          const isLast = index === arrayState.length - 1;
          return (
            <TouchableOpacity
              key={option.value}
              onPress={() => handleChange(option.value)}
              style={[
                styles.segment,
                {
                  backgroundColor: isSelected ? activeColor : 'transparent',
                  borderRightWidth: isLast ? 0 : 0.5,
                  borderRightColor: activeColor,
                  borderTopLeftRadius: isFirst ? 8 : 0,
                  borderBottomLeftRadius: isFirst ? 8 : 0,
                  borderTopRightRadius: isLast ? 8 : 0,
                  borderBottomRightRadius: isLast ? 8 : 0,
                },
              ]}
            >
              <Text
                style={{
                  fontFamily: fonts.bodyMedium.fontFamily,
                  fontSize: 13,
                  color: isSelected ? colors.background : activeColor,
                }}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  row: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  segment: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default StatePicker;
