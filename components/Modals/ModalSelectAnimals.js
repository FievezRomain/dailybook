import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Button from "../Button";
import { useNavigation } from "@react-navigation/native";
import AnimalsPicker from "../AnimalsPicker";
import { useTheme } from 'react-native-paper';

const ModalAnimals = ({ modalVisible, setModalVisible, setAnimaux, animaux, selected, setSelected, setValue, valueName }) => {
  const { colors, fonts } = useTheme();
  
  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
      height: "30%",
      justifyContent: "center",
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
      marginTop: 5,
      marginBottom: 20
    },
    message:{
      alignSelf: "center",
      color: "white"
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 50,
      borderWidth: 2,
      zIndex: 1,
      },
      defaultAvatar:{
          backgroundColor: "white",
          borderColor: 'white',
      },
      selectedAvatar:{
          backgroundColor: colors.accent,
          borderColor: colors.accent,
      },
      containerAnimaux:{
          display: "flex",
          flexDirection: "row",
          height: "100%",
  
      },
      containerAvatar:{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          alignSelf: "center",
          marginLeft: 5,
          marginRight: 20
      },
      defaultText:{
          color: "white"
      },
      selectedText:{
          color: colors.accent
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.background}>
          <TouchableOpacity
            style={styles.emptyBackground}
          ></TouchableOpacity>
          <View style={styles.card}>
            <AnimalsPicker
                setAnimaux={setAnimaux}
                animaux={animaux}
                mode="multiple"
                selected={selected}
                setSelected={setSelected}
                setValue={setValue}
                valueName={valueName}
            />
            <View style={styles.buttonContainer}>
                <Button
                disabled={false}
                size={"l"}
                type={"primary"}
                onPress={() => {
                    setModalVisible(!modalVisible)
                }}
                >
                <Text style={styles.textFontMedium}>OK</Text>
                </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ModalAnimals;
