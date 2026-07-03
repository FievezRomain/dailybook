import React, { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import { View, Text, StyleSheet, TouchableOpacity, Keyboard } from 'react-native';
import Toast from 'react-native-toast-message';
import { AppDivider } from '../ui';
import { Entypo, FontAwesome } from '@expo/vector-icons';
import validateFile from '../../utils/validateFile';
import ImageUtils from '../../utils/ImageUtils';
import LoggerService from '../../../services/logs/LoggerService';
import ModalEditGeneric from '../modals/common/ModalEditGeneric';
import * as ImagePicker from 'expo-image-picker';
import { useAppTheme } from '../../../theme/useAppTheme';

const MAX_FILES = 3;

interface FileItem {
  uri: string;
  name: string;
  mimeType?: string;
  isNew?: boolean;
  toDelete?: boolean;
}

interface ModalSubMenuProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  handleLibraryPick: () => void;
  handleCameraPick: () => void;
  handleDocumentPick: () => void;
}

const ModalSubMenuDocumentPicker: React.FC<ModalSubMenuProps> = ({
  modalVisible,
  setModalVisible,
  handleLibraryPick,
  handleCameraPick,
  handleDocumentPick,
}) => {
  const { colors, fonts } = useAppTheme();

  const onAction = (event: () => void) => {
    event();
  };

  const styles = StyleSheet.create({
    textActionButton: { marginLeft: 15 },
    informationsActionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButtonContainer: {
      width: '90%',
      borderRadius: 5,
      marginTop: 15,
      backgroundColor: colors.quaternary,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
    },
    actionButton: { padding: 20 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={['35%']}>
      <View style={styles.card}>
        <Text style={styles.textFontRegular}>Mode de sélection</Text>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onAction(handleLibraryPick)}
          >
            <View style={styles.informationsActionButton}>
              <Entypo name="folder-images" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>
                Choisir une photo de la librairie
              </Text>
            </View>
          </TouchableOpacity>
          <AppDivider />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onAction(handleDocumentPick)}
          >
            <View style={styles.informationsActionButton}>
              <FontAwesome name="file" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>
                Choisir un fichier
              </Text>
            </View>
          </TouchableOpacity>
          <AppDivider />
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => onAction(handleCameraPick)}
          >
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

interface DocumentPickerComponentProps {
  onChange: (files: FileItem[]) => void;
  value?: FileItem[];
  backgroundColor?: string | null;
  ButtonComponent?: React.FC<{ onPress: () => void; disabled: boolean }>;
  accountType?: string;
}

const DocumentPickerComponent: React.FC<DocumentPickerComponentProps> = ({
  onChange,
  value = [],
  backgroundColor = null,
  ButtonComponent,
  accountType = 'Free',
}) => {
  const { colors, fonts } = useAppTheme();
  const [modalSubMenuVisible, setModalSubMenuVisible] = useState(false);
  const imageUtils = new ImageUtils();
  const isPremium = accountType === 'Premium';

  const pickImageAsync = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'info', position: 'top', text1: "Accès à la librairie requis", text2: "Veuillez autoriser l'accès à la librairie photo dans les réglages." });
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: false,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const totalFiles = value.length + 1;
        if (totalFiles > MAX_FILES) {
          Toast.show({
            type: 'info',
            position: 'top',
            text1: 'Limite atteinte',
            text2: value.length > 0
              ? `Maximum ${MAX_FILES} fichiers. Vous en avez déjà ${value.length}.`
              : `Maximum ${MAX_FILES} fichiers autorisés.`,
          });
          return;
        }
        const uriImageCompressed = await imageUtils.compressImage(result.assets[0].uri);
        onChange([
          ...value,
          {
            uri: uriImageCompressed,
            name: result.assets[0].fileName ?? '',
            mimeType: result.assets[0].mimeType,
            isNew: true,
          },
        ]);
      }

      setModalSubMenuVisible(false);
    } catch (error) {
      LoggerService.log(
        "Erreur lors de la sélection d'une image depuis la librairie : " + (error as Error).message,
      );
    }
  };

  const takePhotoAsync = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Toast.show({ type: 'info', position: 'top', text1: "Accès à la caméra requis", text2: "Veuillez autoriser l'accès à la caméra dans les réglages." });
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 1,
        base64: true,
      });

      if (!result.canceled) {
        const totalFiles = value.length + 1;
        if (totalFiles > MAX_FILES) {
          Toast.show({
            type: 'info',
            position: 'top',
            text1: 'Limite atteinte',
            text2: value.length > 0
              ? `Maximum ${MAX_FILES} fichiers. Vous en avez déjà ${value.length}.`
              : `Maximum ${MAX_FILES} fichiers autorisés.`,
          });
          return;
        }
        const uriImageCompressed = await imageUtils.compressImage(result.assets[0].uri);
        onChange([
          ...value,
          {
            uri: uriImageCompressed,
            name: result.assets[0].fileName ?? '',
            mimeType: result.assets[0].mimeType,
            isNew: true,
          },
        ]);
      }

      setModalSubMenuVisible(false);
    } catch (error) {
      LoggerService.log(
        "Erreur lors de la sélection d'une image depuis la caméra : " + (error as Error).message,
      );
    }
  };

  const pickDocumentAsync = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: true,
      });

      if (result.canceled) return;

      const selectedFiles = result.assets;
      const totalFiles = value.length + selectedFiles.length;

      if (totalFiles > MAX_FILES) {
        Toast.show({
          type: 'info',
          position: 'top',
          text1: 'Limite atteinte',
          text2: value.length > 0
            ? `Maximum ${MAX_FILES} fichiers. Vous en avez déjà ${value.length}.`
            : `Maximum ${MAX_FILES} fichiers autorisés.`,
        });
        return;
      }

      const validatedAndProcessedFiles: FileItem[] = [];

      for (const file of selectedFiles) {
        const validation = validateFile({ name: file.name, size: file.size ?? 0, mimeType: file.mimeType });
        if (!validation.valid) {
          Toast.show({ type: 'error', position: 'top', text1: 'Fichier invalide', text2: validation.message });
          continue;
        }
        const processedFile: FileItem = { uri: file.uri, name: file.name, mimeType: file.mimeType, isNew: true };
        if (file.mimeType?.startsWith('image/')) {
          const compressedUri = await imageUtils.compressImage(file.uri);
          validatedAndProcessedFiles.push({ ...processedFile, uri: compressedUri });
        } else {
          validatedAndProcessedFiles.push(processedFile);
        }
      }

      if (validatedAndProcessedFiles.length === 0) return;

      onChange([...value, ...validatedAndProcessedFiles]);
    } catch (error) {
      LoggerService.log(
        'Erreur lors de la sélection de document :' + (error as Error).message,
      );
    }
  };

  const styles = StyleSheet.create({
    container: { width: '100%', marginBottom: 10 },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, width: '100%' },
    buttonContainer: {
      backgroundColor: backgroundColor === null ? colors.quaternary : backgroundColor,
      borderRadius: 5,
      padding: 10,
    },
    premiumOverlay: {
      position: 'absolute',
      top: 5,
      right: 5,
      backgroundColor: colors.primary,
      borderRadius: 4,
      paddingHorizontal: 6,
      paddingVertical: 2,
      zIndex: 2,
    },
    premiumText: { fontSize: 10, color: colors.background, fontFamily: fonts.bodySmall.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    buttonText: { color: colors.secondary },
  });

  return (
    <>
      <ModalSubMenuDocumentPicker
        modalVisible={modalSubMenuVisible}
        setModalVisible={setModalSubMenuVisible}
        handleDocumentPick={pickDocumentAsync}
        handleCameraPick={takePhotoAsync}
        handleLibraryPick={pickImageAsync}
      />
      <View style={styles.container}>
        <View style={styles.textInput}>
          {!isPremium && (
            <View style={styles.premiumOverlay}>
              <Text style={styles.premiumText}>Premium</Text>
            </View>
          )}
          {ButtonComponent ? (
            <ButtonComponent
              onPress={() => {
                Keyboard.dismiss();
                setModalSubMenuVisible(true);
              }}
              disabled={!isPremium}
            />
          ) : (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => {
                Keyboard.dismiss();
                setModalSubMenuVisible(true);
              }}
              disabled={!isPremium}
            >
              <Text style={[styles.buttonText, styles.textFontRegular]}>
                Sélectionner un ou plusieurs documents
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </>
  );
};

export default DocumentPickerComponent;
