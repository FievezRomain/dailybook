// ...rest of the import statements remain unchanged
import * as ImagePicker from 'expo-image-picker'; 
import Button from './Button';
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Variables from './styles/Variables';
import ModalSubMenuAvatarPickerActions from './Modals/ModalSubMenuAvatarPicker';
import { useState } from 'react';

const AvatarPicker = ({ setImage, setValue, backgroundColor=Variables.rouan }) => {
  const [modalVisibleSubMenu, setModalVisibleSubMenu] = useState(false);

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
      setImage(result.assets[0].uri);
      setValue("image", result.assets[0].uri);
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
      setImage(result.assets[0].uri);
      setValue("image", result.assets[0].uri);
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
      backgroundColor: backgroundColor,
      borderRadius: 5,
      padding: 10,
    },
    textFontRegular:{
        fontFamily: Variables.fontRegular
    },
    textFontMedium:{
        fontFamily: Variables.fontMedium
    },
    textFontBold:{
        fontFamily: Variables.fontBold
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
