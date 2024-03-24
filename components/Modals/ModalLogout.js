import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import Button from "../Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Variables from "../styles/Variables";
import { useNavigation } from "@react-navigation/native";
import AuthService from "../../services/AuthService";

const LogoutModal = ({ modalVisible, setModalVisible }) => {
  const navigation = useNavigation();
  const authService = new AuthService;

  const disconnect = async () => {
    AsyncStorage.removeItem("auth");
    await authService.updateAxiosAuthorization();
    navigation.navigate("Login");
  };

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
            onPress={() => setModalVisible(!modalVisible)}
          ></TouchableOpacity>
          <View style={styles.card}>
            <Text style={styles.message}>Êtes-vous sûr de vouloir vous déconnecter ?</Text>
            <View style={styles.buttonContainer}>
                <Button
                onPress={() => {
                    setModalVisible(!modalVisible)
                    disconnect()
                }}
                size={"m"}
                >
                Oui
                </Button>
                <Button
                onPress={() => {
                    setModalVisible(!modalVisible)
                }}
                size={"m"}
                >
                Non
                </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Variables.blanc,
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
    color: "black",
    marginBottom: 20,
  }
});

export default LogoutModal;
