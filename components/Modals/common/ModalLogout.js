import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import Button from "../../inputs/Button";
import { useAuth } from "../../../providers/AuthenticatedUserProvider";
import { useTheme } from 'react-native-paper';
import ModalEditGeneric from "../inputs/ModalEditGeneric";


const LogoutModal = ({ modalVisible, setModalVisible, navigation }) => {
  const { colors, fonts } = useTheme();
  const { logout } = useAuth();

  const disconnect = async () => {
    navigation.navigate("Loading");
    await logout();
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      padding: 30,
      height: "20%",
      flexDirection: "row wrap",
      borderTopStartRadius: 10,
      borderTopEndRadius: 10,
    },
    background: {
      justifyContent: "flex-end",
      height: "100%",
      backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    emptyBackground: {
      height: "80%",
    },
    buttonContainer:{
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-around",
      marginTop: 5
    },
    message:{
      alignSelf: "center",
      color: colors.default_dark,
      marginBottom: 20,
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
        arrayHeight={["20%"]}
      >
            <Text style={[styles.message, styles.textFontRegular]}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
            <View style={styles.buttonContainer}>
                <Button
                onPress={() => {
                    setModalVisible(!modalVisible)
                    disconnect()
                }}
                size={"l"}
                >
                  <Text style={styles.textFontMedium}>Oui</Text>
                </Button>
                <Button
                onPress={() => {
                    setModalVisible(!modalVisible)
                }}
                size={"l"}
                >
                  <Text style={styles.textFontMedium}>Non</Text>
                </Button>
            </View>
      </ModalEditGeneric>
    </>
  );
};

export default LogoutModal;
