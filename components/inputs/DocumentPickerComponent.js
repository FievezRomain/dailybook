import * as DocumentPicker from 'expo-document-picker';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';
import validateFile from '../../utils/validateFile';
import ImageUtils from "../../utils/ImageUtils";
import LoggerService from '../../services/LoggerService';

const MAX_FILES = 3;

const DocumentPickerComponent = ({ onChange, value = [], backgroundColor = null, ButtonComponent = undefined, accountType = 'Free' }) => {
  const { colors, fonts } = useTheme();
  const imageUtils = new ImageUtils();
  const isPremium = accountType === 'Premium';

  const pickDocuments = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: true
      });

      if (result.type === 'cancel') return;

      const selectedFiles = Array.isArray(result.assets) ? result.assets : [result];
      const totalFiles = value.length + selectedFiles.length;

      if (totalFiles > MAX_FILES) {
        if(value.length > 0){
            Alert.alert(
                'Limite atteinte',
                `Vous ne pouvez sélectionner que ${MAX_FILES} fichiers maximum. Vous avez déjà sélectionné ${value.length} fichier(s).`,
              );
        } else{
            Alert.alert(
                'Limite atteinte',
                `Vous ne pouvez sélectionner que ${MAX_FILES} fichiers maximum.`,
              );
        }
        
        return;
      }

      const validatedAndProcessedFiles = [];

      for (const file of selectedFiles) {
        const validation = validateFile(file);
        if (!validation.valid) {
          alert("Fichier non valide", validation.message);
          continue;
        }
        
        file.isNew = true;
        if (file.mimeType?.startsWith("image/")) {
          const compressedUri = await imageUtils.compressImage(file.uri);
          validatedAndProcessedFiles.push({ ...file, uri: compressedUri });
        } else {
          validatedAndProcessedFiles.push(file);
        }
      }

      if (validatedAndProcessedFiles.length === 0) return;

      const allFiles = [...value, ...validatedAndProcessedFiles];
      onChange(allFiles);

    } catch (error) {
      LoggerService.log("Erreur lors de la sélection de document :" + error.message);
    }
  };

  const styles = StyleSheet.create({
    textInput: {
      alignSelf: "flex-start",
      marginBottom: 5,
      width: "100%",
    },
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
      zIndex: 2
    },
    premiumText: {
      fontSize: 10,
      color: colors.background,
      fontFamily: fonts.bodySmall.fontFamily
    },
    textFontRegular: {
      fontFamily: fonts.default.fontFamily
    },
    buttonText: {
      color: colors.secondary
    },
    container: {
      width: "100%",
      marginBottom: 10,
    }
  });

  return (
    <View style={styles.container}>
      <View style={styles.textInput}>
        {!isPremium && (
          <View style={styles.premiumOverlay}>
            <Text style={styles.premiumText}>Premium uniquement</Text>
          </View>
        )}
        {ButtonComponent ? (
          <ButtonComponent onPress={pickDocuments} disabled={!isPremium} />
        ) : (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={pickDocuments}
            disabled={!isPremium}
          >
            <Text style={[styles.buttonText, styles.textFontRegular]}>
              Sélectionner un ou plusieurs documents
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default DocumentPickerComponent;
