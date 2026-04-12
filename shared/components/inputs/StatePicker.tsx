import React from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import { SegmentedButtons } from 'react-native-paper';

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
  const { colors, fonts } = useAppTheme();

  const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center' },
  });

  return (
    <SafeAreaView style={styles.container}>
      <SegmentedButtons
        value={defaultState ?? ''}
        onValueChange={handleChange}
        buttons={arrayState}
        theme={{
          colors: { secondaryContainer: color ?? colors.quaternary },
          fonts: { labelLarge: fonts.labelMedium },
        }}
      />
    </SafeAreaView>
  );
};

export default StatePicker;
