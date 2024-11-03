// ...rest of the import statements remain unchanged
import * as ImagePicker from 'expo-image-picker';
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import ModalSubMenuAvatarPickerActions from './Modals/ModalSubMenuAvatarPicker';
import { useState } from 'react';
import ImageUtils from "../utils/ImageUtils";
import { useTheme } from 'react-native-paper';

const AvatarPicker = ({ setImage, setValue, backgroundColor=null }) => {
  const { colors, fonts } = useTheme();
  const [modalVisibleSubMenu, setModalVisibleSubMenu] = useState(false);
  const imageUtils = new ImageUtils();

  const pickImageAsync = async () => {
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
      setImage(uriImageCompressed);
      setValue("image", uriImageCompressed);
      //setValue("image", result.assets[0].base64);
    }

    setModalVisibleSubMenu(false);
  };

  // Fonction pour ouvrir l'appareil photo
  const takePhotoAsync = async () => {
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
      setImage(uriImageCompressed);
      setValue("image", uriImageCompressed);
      // setValue("image", result.assets[0].base64); // Si vous avez besoin de stocker l'image en base64
    }

    setModalVisibleSubMenu(false);
  };

  const styles = StyleSheet.create({
    textInput:{
      alignSelf: "flex-start",
      marginBottom: 5,
      width: "100%",
    },
    buttonContainer:{
      backgroundColor: backgroundColor === null ? colors.quaternary : backgroundColor,
      borderRadius: 5,
      padding: 10,
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
      <ModalSubMenuAvatarPickerActions
          handleCameraPick={takePhotoAsync}
          handleLibraryPick={pickImageAsync}
          modalVisible={modalVisibleSubMenu}
          setModalVisible={setModalVisibleSubMenu}
      />
      <View>
        <TouchableOpacity 
          style={styles.textInput} 
          onPress={() => setModalVisibleSubMenu(true)} 
        >
          <View style={styles.buttonContainer}>
            <Text style={styles.textFontRegular}>Sélectionner une image</Text>
          </View>
        </TouchableOpacity>
    </View>
    </>
  );
}

export default AvatarPicker;
