import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import Button from "../Button";
import Variables from "../styles/Variables";
import { useAuth } from "../../providers/AuthenticatedUserProvider";

const LogoutModal = ({ modalVisible, setModalVisible, navigation }) => {
  const { logout } = useAuth();

  const disconnect = async () => {
    navigation.navigate("Loading");
    await logout();
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
