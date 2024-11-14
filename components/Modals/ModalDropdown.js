import { StyleSheet, Modal, View, Text, TouchableOpacity, ScrollView, Image, FlatList } from "react-native";
import Button from "../Button";
import { useTheme } from 'react-native-paper';
import ModalEditGeneric from "./ModalEditGeneric";

const ModalDropdwn = ({ modalVisible, setModalVisible, list, setState, state, setValue, valueName}) => {
  const { colors, fonts } = useTheme();
  
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
        backgroundColor: colors.accent,
        borderRadius: 5,
        margin: 5,
        padding: 10,
      },
      selected:{
        backgroundColor: colors.text,
      },
      title:{
        color: "white"
      },
      textFontRegular:{
          fontFamily: fonts.default.fontFamily
      },
      textFontMedium:{
          fontFamily: fonts.bodyMedium.fontFamily
      },
      textFontBold:{
          fontFamily: fonts.bodyLarge.fontFamily
      },
      disabled:{
        backgroundColor: colors.onSurface
      },
      disabledText:{
        color: colors.quaternary
      }
    });

    return (
        <>
          <ModalEditGeneric
              isVisible={modalVisible}
              setVisible={setModalVisible}
              arrayHeight={["40%"]}
          >
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
          </ModalEditGeneric>
        </>
    );
};

export default ModalDropdwn;
