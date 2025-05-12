import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Button from "../../inputs/Button";
import AnimalsPicker from "../../AnimalsPicker";
import { useTheme } from 'react-native-paper';
import ModalEditGeneric from "../common/ModalEditGeneric";

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
      color: colors.background,
    },
    avatar: {
      width: 60,
      height: 60,
      borderRadius: 50,
      borderWidth: 2,
      zIndex: 1,
      },
      defaultAvatar:{
          backgroundColor: colors.background,
          borderColor: colors.background,
      },
      selectedAvatar:{
          backgroundColor: colors.default_dark,
          borderColor: colors.default_dark,
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
          color: colors.background,
      },
      selectedText:{
          color: colors.default_dark
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
        scrollInside={false}
        arrayHeight={["25%"]}
      >
        <View style={{paddingVertical: 5}}>
          <AnimalsPicker
            setAnimaux={setAnimaux}
            animaux={animaux}
            mode="multiple"
            selected={selected}
            setSelected={setSelected}
            setValue={setValue}
            valueName={valueName}
          />
        </View>
          
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
      </ModalEditGeneric>
    </>
  );
};

export default ModalAnimals;
