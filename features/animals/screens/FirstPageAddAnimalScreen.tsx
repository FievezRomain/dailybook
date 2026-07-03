import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import Button from '../../../shared/components/ui/AppButton';
import ModalAnimal from '../components/ModalAnimal';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { AuthStackScreenProps } from '../../../navigation/types';
import { useTranslation } from 'react-i18next';

const wallpaper = require('../../../assets/wallpaper_first_add_animal.jpg');

export default function FirstPageAddAnimalScreen({ navigation }: AuthStackScreenProps<'FirstPageAddAnimal'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('animals');
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const [modalAnimalVisible, setModalAnimalVisible] = useState(false);

  const handleCreatedAnimal = () => {
    navigation.navigate('App', { screen: 'Tab', params: { screen: 'Accueil' } });
  };

  const styles = {
    image: {
      flex: 1,
      height: '100%',
      width: '100%',
      resizeMode: 'cover',
      position: 'absolute',
      justifyContent: 'center',
      backgroundColor: colors.secondary,
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  } as const;

  return (
    <>
      <Image style={styles.image} source={wallpaper} />
      <ModalAnimal
        actionType="create"
        isVisible={modalAnimalVisible}
        setVisible={setModalAnimalVisible}
        onModify={handleCreatedAnimal}
      />
      <View style={{ width: '100%', height: '100%', alignItems: 'center' }}>
        <View style={{ width: '80%', marginTop: 200, marginBottom: 50 }}>
          <Text style={[{ fontSize: 20, textAlign: 'center' }, styles.textFontRegular]}>
            {t('welcomeVasco', { name: firebaseUser?.displayName ?? '' })}
          </Text>
        </View>
        <View style={{ width: '60%' }}>
          <Button size="m" type="primary" onPress={() => setModalAnimalVisible(true)}>
            <Text style={styles.textFontMedium}>{t('registerFirst')}</Text>
          </Button>
        </View>
      </View>
    </>
  );
}
