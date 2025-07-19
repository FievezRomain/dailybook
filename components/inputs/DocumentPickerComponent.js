import * as DocumentPicker from 'expo-document-picker';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Divider, useTheme } from 'react-native-paper';
import { FontAwesome6, Octicons, SimpleLineIcons, Entypo, FontAwesome } from '@expo/vector-icons';
import validateFile from '../../utils/validateFile';
import ImageUtils from "../../utils/ImageUtils";
import LoggerService from '../../services/logs/LoggerService';
import ModalEditGeneric from '../modals/common/ModalEditGeneric';
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';

const MAX_FILES = 3;

const ModalSubMenuDocumentPicker = ({ modalVisible, setModalVisible, handleLibraryPick, handleCameraPick, handleDocumentPick }) => {
  const { colors, fonts } = useTheme();
  const onAction = (event) =>{
    event();
  }

  const styles = StyleSheet.create({
    textActionButton:{
        marginLeft: 15
    },
    informationsActionButton:{
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10
    },
    bottomBar: {
        width: '100%',
        height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
        backgroundColor: colors.text,
    },
    actionButtonContainer:{
        width: "90%",
        borderRadius: 5,
        marginTop: 15,
        backgroundColor: colors.quaternary,
        flexDirection: "column",
        justifyContent: "space-evenly"
    },
    actionButton:{
        padding: 20,
    },
    card: {
        justifyContent: "space-evenly",
        alignItems: "center"
        //flexDirection: "row wrap"
    },
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: "flex-end",
        height: "100%",
    },
    emptyBackground: {
        height: "80%",
    },
    buttonContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 35,
        marginBottom: 20
    },
    itemContainer:{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        marginTop: 20,
        justifyContent: "center"
    },
    item:{
        backgroundColor: colors.default_dark,
        borderRadius: 5,
        margin: 5,
        padding: 10,
    },
    selected:{
        backgroundColor: colors.default_dark,
    },
    title:{
        color: colors.background,
    },
    textFontRegular:{
        fontFamily: fonts.default.fontFamily
    },
    textFontMedium:{
        fontFamily: fonts.bodyMedium.fontFamily
    },
    textFontBold:{
        fontFamily: fonts.bodyLarge.fontFamily
    }
  });

  return (
    <>
      <ModalEditGeneric
          isVisible={modalVisible}
          setVisible={setModalVisible}
          arrayHeight={["35%"]}
      >
              <View style={styles.card}>
                  <Text style={styles.textFontRegular}>Mode de sélection</Text>
                  <View style={styles.actionButtonContainer}>
                      <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleLibraryPick)}>
                          <View style={styles.informationsActionButton}>
                              <Entypo name="folder-images" size={20}/>
                              <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                  Choisir une photo de la librairie
                              </Text>
                          </View>
                      </TouchableOpacity>
                      <Divider style={{height: 1}}/>
                      <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDocumentPick)}>
                          <View style={styles.informationsActionButton}>
                              <FontAwesome name="file" size={20}/>
                              <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                  Choisir un fichier
                              </Text>
                          </View>
                      </TouchableOpacity>
                      <Divider style={{height: 1}}/>
                      <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleCameraPick)}>
                          <View style={styles.informationsActionButton}>
                              <Entypo name="camera" size={20}/>
                              <Text style={[styles.textActionButton, styles.textFontMedium]}>
                                  Prendre une photo
                              </Text>
                          </View>
                      </TouchableOpacity>
                  </View>
              </View>
      </ModalEditGeneric>
    </>
  );
}

const DocumentPickerComponent = ({ onChange, value = [], backgroundColor = null, ButtonComponent = undefined, accountType = 'Free' }) => {
  const { colors, fonts } = useTheme();
  const [ modalSubMenuVisible, setModalSubMenuVisible ] = useState(false);
  const imageUtils = new ImageUtils();
  const isPremium = accountType === 'Premium';

  const pickImageAsync = async () => {
    try{
      // Demande la permission d'utiliser la lib photo
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert("Désolé, nous avons besoin des permissions d'accès à la librairie photo!");
        return;
      }

      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        base64: true
      });

      if (!result.canceled) {
        var uriImageCompressed = await imageUtils.compressImage( result.assets[0].uri );
        console.log({ uri:uriImageCompressed, name: result.assets[0].fileName, mimeType: result.assets[0].mimeType, isNew: true });
        onChange([...value, { uri:uriImageCompressed, name: result.assets[0].fileName, mimeType: result.assets[0].mimeType, isNew: true }]);
      }

      setModalSubMenuVisible(false);
    }catch(error){
      LoggerService.log("Erreur lors de la sélection d'une image depuis la librairie : " + error.message);
    }
  };

  // Fonction pour ouvrir l'appareil photo
  const takePhotoAsync = async () => {
    try{
      // Demande la permission d'utiliser l'appareil photo
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        alert('Désolé, nous avons besoin des permissions de caméra pour faire cela!');
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        quality: 1,
        base64: true
      });

      if (!result.canceled) {
        var uriImageCompressed = await imageUtils.compressImage( result.assets[0].uri );
        onChange([...value, { uri:uriImageCompressed, name: result.assets[0].fileName, mimeType: result.assets[0].mimeType, isNew: true }]);
        // setValue("image", result.assets[0].base64); // Si vous avez besoin de stocker l'image en base64
      }

      setModalSubMenuVisible(false);
    }catch(error){
      LoggerService.log("Erreur lors de la sélection d'une image depuis la caméra : " + error.message);
    }
  };

  const pickDocumentAsync = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
        multiple: true
      });

      if (result.canceled) return;

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
              <Text style={styles.premiumText}>Premium uniquement</Text>
            </View>
          )}
          {ButtonComponent ? (
            <ButtonComponent onPress={() => setModalSubMenuVisible(true)} disabled={!isPremium} />
          ) : (
            <TouchableOpacity
              style={styles.buttonContainer}
              onPress={() => setModalSubMenuVisible(true)}
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
