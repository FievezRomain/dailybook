import React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import WavyHeader from '../../../shared/components/common/WavyHeader';
import { useTranslation } from 'react-i18next';
import type { AuthStackScreenProps } from '../../../navigation/types';

const wallpaper_accueil = require('../../../assets/wallpaper_login.png');
const logo = require('../../../assets/logo.png');

export default function HomeScreen({ navigation }: AuthStackScreenProps<'Home'>) {

  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('auth');

  const styles = {
    svgCurve: {
      position: 'absolute',
      bottom: 0,
      width: Dimensions.get('window').width,
    },
    container: {
      flexDirection: 'column',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    image: {
      flex: 1,
      height: '100%',
      width: '100%',
      resizeMode: 'cover',
      position: 'absolute',
      justifyContent: 'center',
    },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    text: {
      color: colors.background,
      textAlign: 'center',
      fontSize: 16,
      textTransform: 'uppercase',
    },
    button: {
      backgroundColor: colors.primary,
      width: '100%',
      paddingLeft: 20,
      paddingRight: 20,
      paddingBottom: 15,
      paddingTop: 15,
      borderRadius: 50,
      marginBottom: 50,
    },
  } as const;

  return (
    <>
      <Image source={wallpaper_accueil} style={styles.image} />
      <WavyHeader
        customBgColor={colors.surfaceVariant}
        customHeight={140}
        customTop={-80}
        customWavePattern="M0,64L60,80C120,96,240,128,360,138.7C480,149,600,139,720,149.3C840,160,960,192,1080,176C1200,160,1320,96,1380,64L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
        customStyles={styles.svgCurve}
      />
      <View style={styles.container}>
        <Image source={logo} style={{ height: 120, width: 120, marginTop: 100 }} />
        <View style={{ width: '60%', alignItems: 'center' }}>
          <Text style={[styles.textFontMedium, { color: colors.primary, textAlign: 'center', marginBottom: 15, fontSize: 12 }]}>
            {t('tagline')}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} style={[styles.button, { justifyContent: 'flex-end' }]}>
            <Text style={[styles.text, styles.textFontMedium]}>{t('adventure')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
