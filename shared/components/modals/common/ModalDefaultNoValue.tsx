import React from 'react';
import { View, Text } from 'react-native';
import { useAppTheme } from '../../../../theme/useAppTheme';

const ModalDefaultNoValue = ({ text }: { text: string }) => {
  const { colors, fonts } = useAppTheme();

  return (
    <View style={{
      backgroundColor: colors.background,
      width: '100%',
      paddingHorizontal: 20,
      paddingVertical: 25,
      borderRadius: 5,
      shadowColor: colors.default_dark,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
    }}>
      <Text style={{ fontFamily: fonts.default.fontFamily, color: colors.default_dark }}>{text}</Text>
    </View>
  );
};

export default ModalDefaultNoValue;
