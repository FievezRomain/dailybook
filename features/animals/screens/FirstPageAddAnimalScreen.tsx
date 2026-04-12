import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useTheme } from 'react-native-paper';
import Button from '../../../shared/components/inputs/Button';
import ModalAnimal from '../components/ModalAnimal';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { AuthStackScreenProps } from '../../../navigation/types';

const wallpaper = require('../../../assets/wallpaper_first_add_animal.jpg');

export default function FirstPageAddAnimalScreen({ navigation }: AuthStackScreenProps<'FirstPageAddAnimal'>) {
  const { colors, fonts } = useTheme();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const [modalAnimalVisible, setModalAnimalVisible] = useState(false);

  const handleCreatedAnimal = () => {
    navigation.navigate('App', { screen: 'Tab', params: { screen: 'Accueil' } });
  };

  const styles = StyleSheet.create({
    image: {
      flex: 1,
      height: '100%',
      width: '100%',
      resizeMode: 'cover',
      position: 'absolute',
      justifyContent: 'center',
      backgroundColor: colors.secondary,
    },
    textFontRegular: { fontFamily: (fonts as any).default.fontFamily },
    textFontMedium: { fontFamily: (fonts as any).bodyMedium.fontFamily },
  });

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
            Bienvenue {firebaseUser?.displayName ?? ''}, moi c'est Vasco et pour commencer l'aventure,
            je te propose d'ajouter un animal.
          </Text>
        </View>
        <View style={{ width: '60%' }}>
          <Button size="m" type="primary" onPress={() => setModalAnimalVisible(true)}>
            <Text style={styles.textFontMedium}>J'enregistre un animal</Text>
          </Button>
        </View>
      </View>
    </>
  );
}
