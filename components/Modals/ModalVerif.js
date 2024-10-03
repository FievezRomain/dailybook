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
            <Text style={[styles.message, styles.textFontRegular]}>{message}</Text>
            <View style={styles.buttonContainer}>
                <Button
                  onPress={() => {
                      setModalVisible(!modalVisible)
                      eventToCall()
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
    color: "black"
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

export default ModalVerif;
