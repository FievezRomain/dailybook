import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "../Button";
import Variables from "../styles/Variables";

const ModalDropdwn = ({ modalVisible, setModalVisible, list, setState, state, setValue, valueName}) => {

    const checkState = (value) =>{
      if(state !== false){
        if (value.title === state.title){
          return true;
        }
      }
      return false;
    }

    const handleSelected = (item) =>{
      if(state !== false){
        if(state.title === item.title){
          setState(false);
          setValue(valueName, item.id);
        } else{
          setState(item);
          setValue(valueName, item.id);
        }
      } else{
        setState(item);
        setValue(valueName, item.id);
      }
      
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
                onPress={() => setModalVisible(false)}
            ></TouchableOpacity>
            <View style={styles.card}>
                <View style={styles.itemContainer}>
                    {list.map((item, index) => {
                        return(
                            <TouchableOpacity key={item.id} onPress={() => { handleSelected(item) }} style={[styles.item, checkState(item) ? styles.selected : null]}>
                                <Text style={[styles.title, styles.textFontRegular]}>{item.title}</Text>
                            </TouchableOpacity>
                        );
                    })}
                    <TouchableOpacity style={[styles.item, styles.disabled]} disabled={true}>
                      <Text style={[styles.title, styles.textFontRegular, styles.disabledText]}>Bientôt personnalisable...</Text>
                    </TouchableOpacity>
                    {/* <FlatList
                        data={list}
                        renderItem={({item}) => <Item title={item.title} event={setChoice} />}
                        keyExtractor={item => item.id}
                    /> */}
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
            </View>
            </View>
        </Modal>
        </>
    );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Variables.blanc,
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
    marginTop: 20,
    marginBottom: 20
  },
  itemContainer:{
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20,
    justifyContent: "center"
  },
  item:{
    backgroundColor: Variables.bai,
    borderRadius: 5,
    margin: 5,
    padding: 10,
  },
  selected:{
    backgroundColor: Variables.bai_brun,
  },
  title:{
    color: "white"
  },
  textFontRegular:{
      fontFamily: Variables.fontRegular
  },
  textFontMedium:{
      fontFamily: Variables.fontMedium
  },
  textFontBold:{
      fontFamily: Variables.fontBold
  },
  disabled:{
    backgroundColor: Variables.default
  },
  disabledText:{
    color: Variables.rouan
  }
});

export default ModalDropdwn;
