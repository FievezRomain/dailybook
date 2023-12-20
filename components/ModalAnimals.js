import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import Button from "./Button";
import Variables from "./styles/Variables";
import { useNavigation } from "@react-navigation/native";
import AnimalsPicker from "./AnimalsPicker";

const ModalAnimals = ({ modalVisible, setModalVisible, setAnimaux, animaux, selected, setSelected, setValue, valueName }) => {

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
                OK
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
    backgroundColor: Variables.rouan,
    height: "30%",
    justifyContent: "center",
    //flexDirection: "row wrap"
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
        backgroundColor: Variables.bai,
        borderColor: Variables.bai,
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
        color: Variables.bai
    },
});

export default ModalAnimals;
