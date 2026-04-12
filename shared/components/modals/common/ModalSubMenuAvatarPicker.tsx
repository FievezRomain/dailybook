import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from './ModalEditGeneric';

interface ModalSubMenuAvatarPickerProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  handleLibraryPick: () => void;
  handleCameraPick: () => void;
}

const ModalSubMenuAvatarPicker = ({
  modalVisible,
  setModalVisible,
  handleLibraryPick,
  handleCameraPick,
}: ModalSubMenuAvatarPickerProps) => {
  const { colors, fonts } = useTheme();

  const onAction = (action: () => void) => {
    action();
  };

  const styles = StyleSheet.create({
    textActionButton: { marginLeft: 15 },
    informationsActionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButtonContainer: {
      width: '90%',
      borderRadius: 5,
      marginTop: 15,
      backgroundColor: (colors as any).quaternary,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    actionButton: { padding: 20 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={['25%']}>
      <View style={styles.card}>
        <Text style={styles.textFontRegular}>Mode de sélection d'image</Text>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleLibraryPick)}>
            <View style={styles.informationsActionButton}>
              <Entypo name="folder-images" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>Choisir une photo de la librairie</Text>
            </View>
          </TouchableOpacity>
          <Divider style={{ height: 1 }} />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleCameraPick)}>
            <View style={styles.informationsActionButton}>
              <Entypo name="camera" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>Prendre une photo</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ModalEditGeneric>
  );
};

export default ModalSubMenuAvatarPicker;
