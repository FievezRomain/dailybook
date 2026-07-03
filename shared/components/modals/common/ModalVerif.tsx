import React from 'react';
import { StyleSheet, Modal, View, Text, TouchableOpacity } from 'react-native';
import Button from '../../ui/AppButton';
import { useAppTheme } from '../../../../theme/useAppTheme';

interface ModalVerifProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  message: string;
  event: () => void;
}

const ModalVerif = ({ modalVisible, setModalVisible, message, event }: ModalVerifProps) => {
  const { colors, fonts } = useAppTheme();

  const eventToCall = () => {
    event();
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      padding: 30,
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
    },
    background: {
      justifyContent: 'flex-end',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    emptyBackground: { height: '80%' },
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginTop: 5,
    },
    message: {
      alignSelf: 'center',
      color: colors.default_dark,
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.background}>
          <TouchableOpacity style={styles.emptyBackground} onPress={() => setModalVisible(!modalVisible)} />
          <View style={styles.card}>
            <Text style={[styles.message, styles.textFontRegular]}>{message}</Text>
            <View style={styles.buttonContainer}>
              <Button onPress={() => { setModalVisible(!modalVisible); eventToCall(); }} size="l">
                <Text style={styles.textFontMedium}>Oui</Text>
              </Button>
              <Button onPress={() => setModalVisible(!modalVisible)} size="l">
                <Text style={styles.textFontMedium}>Non</Text>
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ModalVerif;
