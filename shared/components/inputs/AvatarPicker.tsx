import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import ModalSubMenuAvatarPickerActions from '../modals/common/ModalSubMenuAvatarPicker';
import ImageUtils from '../../utils/ImageUtils';
import { useAppTheme } from '../../../theme/useAppTheme';
import LoggerService from '../../../services/logs/LoggerService';

interface AvatarPickerProps {
  onChange: (uri: string) => void;
  backgroundColor?: string | null;
  ButtonComponent?: React.FC<{ onPress: () => void }>;
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({
  onChange,
  backgroundColor = null,
  ButtonComponent,
}) => {
  const { colors, fonts } = useAppTheme();
  const [modalVisibleSubMenu, setModalVisibleSubMenu] = useState(false);
  const imageUtils = new ImageUtils();

  const pickImageAsync = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert("Désolé, nous avons besoin des permissions d'accès à la librairie photo!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const uriImageCompressed = await imageUtils.compressImage(result.assets[0].uri);
        onChange(uriImageCompressed);
      }

      setModalVisibleSubMenu(false);
    } catch (error: unknown) {
      LoggerService.log(
        "Erreur lors de la sélection d'une image depuis la librairie : " +
          (error as Error).message,
      );
    }
  };

  const takePhotoAsync = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Désolé, nous avons besoin des permissions de caméra pour faire cela!');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const uriImageCompressed = await imageUtils.compressImage(result.assets[0].uri);
        onChange(uriImageCompressed);
      }

      setModalVisibleSubMenu(false);
    } catch (error: unknown) {
      LoggerService.log(
        "Erreur lors de la sélection d'une image depuis la caméra : " + (error as Error).message,
      );
    }
  };

  const styles = StyleSheet.create({
    textInput: {
      alignSelf: 'flex-start',
      marginBottom: 5,
      width: '100%',
    },
    buttonContainer: {
      backgroundColor: backgroundColor === null ? colors.quaternary : backgroundColor,
      borderRadius: 5,
      padding: 10,
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  });

  return (
    <>
      <ModalSubMenuAvatarPickerActions
        handleCameraPick={takePhotoAsync}
        handleLibraryPick={pickImageAsync}
        modalVisible={modalVisibleSubMenu}
        setModalVisible={setModalVisibleSubMenu}
      />
      <View>
        {ButtonComponent ? (
          <ButtonComponent onPress={() => setModalVisibleSubMenu(true)} />
        ) : (
          <TouchableOpacity style={styles.textInput} onPress={() => setModalVisibleSubMenu(true)}>
            <View style={styles.buttonContainer}>
              <Text style={[styles.textFontRegular, { color: colors.secondary }]}>
                Sélectionner une image
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </>
  );
};

export default AvatarPicker;
