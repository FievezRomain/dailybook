import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "./Button";
import Variables from "./styles/Variables";

const ModalDropdwn = ({ modalVisible, setModalVisible, list, setState, state }) => {

    const checkState = (value) =>{
        if (value == state){
            return true;
        }
        return false;
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
            ></TouchableOpacity>
            <View style={styles.card}>
                <View style={styles.itemContainer}>
                    {list.map((item, index) => {
                        return(
                            <TouchableOpacity key={item.id} onPress={() => { setState(item) }} style={[styles.item, checkState(item.title) ? styles.selected : null]}>
                                <Text style={styles.title}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    {/* <FlatList
                        data={list}
                        renderItem={({item}) => <Item title={item.title} event={setChoice} />}
                        keyExtractor={item => item.id}
                    /> */}
                </View>
                <View style={styles.buttonContainer}>
                    <Button
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
    backgroundColor: Variables.fond,
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
  itemContainer:{
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center"
  },
  item:{
    backgroundColor: Variables.bouton,
    borderRadius: 5,
    margin: 5,
    padding: 10,
  },
  selected:{
    backgroundColor: Variables.texte,
  },
  title:{
    color: "white"
  },
});

export default ModalDropdwn;
