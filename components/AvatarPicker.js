// ...rest of the import statements remain unchanged
import * as ImagePicker from 'expo-image-picker'; 
import Button from './Button';
import { Text, StyleSheet, View, TouchableOpacity } from "react-native";
import Variables from './styles/Variables';

const AvatarPicker = ({ setImage, setValue }) => {
  const pickImageAsync = async () => {
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
  };

  return (
      <TouchableOpacity 
        style={styles.textInput} 
        onPress={pickImageAsync} 
      >
        <View style={styles.buttonContainer}>
              <Text>Sélectionner une image</Text>
        </View>
      </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  textInput:{
    alignSelf: "flex-start",
    marginBottom: 5,
    width: "100%",
  },
  buttonContainer:{
    backgroundColor: Variables.rouan,
    borderRadius: 5,
    padding: 10,
  }
});

export default AvatarPicker;
