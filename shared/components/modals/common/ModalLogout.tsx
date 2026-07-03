import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import Button from '../../ui/AppButton';
import { useAuthStore } from '../../../../stores/useAuthStore';
import { useAppTheme } from '../../../../theme/useAppTheme';
import ModalEditGeneric from './ModalEditGeneric';

interface ModalLogoutProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
}

const ModalLogout = ({ modalVisible, setModalVisible }: ModalLogoutProps) => {
  const { colors, fonts } = useAppTheme();
  const { signOutUser } = useAuthStore();

  const disconnect = async () => {
    await signOutUser();
  };

  const styles = StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 5,
    },
    message: {
      alignSelf: 'center',
      color: colors.default_dark,
      marginBottom: 20,
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={['20%']}>
      <Text style={[styles.message, styles.textFontRegular]}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={() => { setModalVisible(!modalVisible); disconnect(); }} size="l">
          <Text style={styles.textFontMedium}>Oui</Text>
        </Button>
        <Button onPress={() => setModalVisible(!modalVisible)} size="l">
          <Text style={styles.textFontMedium}>Non</Text>
        </Button>
      </View>
    </ModalEditGeneric>
  );
};

export default ModalLogout;
