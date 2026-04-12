import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Constants from 'expo-constants';
import { Divider } from 'react-native-paper';
import Back from './Back';
import { useAppTheme } from '../../../theme/useAppTheme';

interface TopTabSecondaryProps {
  message1?: string;
  message2?: string;
  btnList?: React.ReactNode[];
}

const TopTabSecondary: React.FC<TopTabSecondaryProps> = ({ message1, message2, btnList }) => {
  const { colors, fonts } = useAppTheme();

  const styles = StyleSheet.create({
    topTabContainer: {
      paddingTop:
        Constants.platform?.ios
          ? (Constants.statusBarHeight ?? 0) + 10
          : (Constants.statusBarHeight ?? 0) + 10,
      paddingBottom: 20,
      paddingRight: 20,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    textContainer: { width: '60%', marginLeft: 10 },
    name: { fontSize: 18 },
    text: { color: colors.default_dark },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <>
      <View style={styles.topTabContainer}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Back />
          <View style={styles.textContainer}>
            <Text style={[styles.name, styles.text, styles.textFontBold]}>{message2}</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {btnList?.map((Composant, index) => (
            <View key={index} style={{ marginLeft: 15 }}>
              {Composant}
            </View>
          ))}
        </View>
      </View>
      <Divider style={{ height: 0.4, backgroundColor: colors.quaternary }} />
    </>
  );
};

export default TopTabSecondary;
