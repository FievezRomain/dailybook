import { StyleSheet, Modal, View, Text, TouchableOpacity } from "react-native";
import Button from "../Button";
import Variables from "../styles/Variables";

const ModalVerif = ({ modalVisible, setModalVisible, message, event }) => {
 
  const eventToCall = () =>{
    event();
  }

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
            <Text style={styles.message}>{message}</Text>
            <View style={styles.buttonContainer}>
                <Button
                onPress={() => {
                    setModalVisible(!modalVisible)
                    eventToCall()
                }}
                >
                Oui
                </Button>
                <Button
                onPress={() => {
                    setModalVisible(!modalVisible)
                }}
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
    backgroundColor: Variables.texte,
    padding: 30,
    height: "20%",
    justifyContent: "center",
    flexDirection: "row wrap"
  },
  background: {
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
    marginTop: 5
  },
  message:{
    alignSelf: "center",
    color: "white"
  }
});

export default ModalVerif;
