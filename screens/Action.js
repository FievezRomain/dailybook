import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState, useContext } from "react";
import TopTab from '../components/TopTab';
import { FontAwesome6, FontAwesome, MaterialIcons, Entypo, SimpleLineIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalEvents from "../components/Modals/ModalEvents";
import ModalObjectif from "../components/Modals/ModalObjectif";
import ModalWish from "../components/Modals/ModalWish";
import ModalContact from "../components/Modals/ModalContact";
import ModalNote from "../components/Modals/ModalNote";
import ModalAnimal from "../components/Modals/ModalAnimal";
import Toast from "react-native-toast-message";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { useTheme, Divider } from 'react-native-paper';

const ActionScreen = ({ navigation }) => {
  const { colors, fonts } = useTheme();
  const [messages, setMessages] = useState({message1: "Ajouter un", message2: "élément"})
  const { currentUser } = useAuth();
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [isObjectifModalVisible, setObjectifModalVisible] = useState(false);
  const [isWishModalVisible, setWishModalVisible] = useState(false);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [isAnimalModalVisible, setAnimalModalVisible] = useState(false);
  const [event, setEvent] = useState({});
  const list = [
    {title: "Balade", id: "balade"},
    {title: "Entrainement", id: "entrainement"},
    {title: "Concours", id: "concours"},
    {title: "Rendez-vous", id: "rdv"},
    {title: "Soins", id: "soins"},
    {title: "Autre", id: "autre"},
  ];

  const openModalEvent = (typeEvent) =>{
    var eventTemp = {'eventtype': typeEvent};
    setEvent(eventTemp);
    setEventModalVisible(true);
  }

  const handleCreateContact = () =>{
    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'un contact réussi"
    }), 300);
  }

  const handleCreateNote = () =>{
    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'une note réussi"
    }), 300);
  }

  const handleCreateWish = () =>{
    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'un souhait réussi"
    }), 300);
  }

  const handleCreateAnimal = () =>{
    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'un animal réussi"
    }), 300);
  }

  const handleCreateEvent = () =>{
    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'un événement réussi"
    }), 300);
  }

  const handleCreateObjectif = () =>{
    setTimeout(() => Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'un objectif réussi"
    }), 300);
  }

  const styles = StyleSheet.create({
    textDesactivated:{
      color: colors.neutral,
    },
    iconAction:{
      color: colors.accent,
      paddingRight: 10
    },
    iconButton:{
      marginRight: 20,
      color: colors.accent,
    },
    informationsButtonContainer:{
      flexDirection: "row",
      alignItems: "center",
      paddingLeft: 30
    },
    actionButtonContainer:{
      flexDirection: "row",
      alignItems: "center",
    },
    touchableOpacityButtonContent:{
      display: "flex",
      flexDirection: "row",
      width: "100%",
      justifyContent: "space-between",
      paddingBottom: 10,
      paddingTop: 10
    },
    formContainer:{
      paddingTop: 10,
      paddingBottom: 10,
    },
    form: {
      alignItems: "center",
      justifyContent: "center",
      marginLeft: "auto",
      marginRight: "auto",
      borderRadius: 10,
      paddingTop: 10,
      shadowColor: "black",
      shadowOpacity: 0.1,
      marginTop: 50,
      elevation: 1,
      shadowRadius:5,
      shadowOffset:{width:0, height:2}
    },
  loaderEvent: {
      width: 200,
      height: 200
  },
  loadingEvent: {
      position: "absolute",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9,
      width: "100%",
      height: "100%",
      backgroundColor: "#000000b8",
      paddingTop: 50
    },
    triangle: {
      display:"flex",
      alignSelf: "center",
      backgroundColor: 'transparent',
      borderStyle: 'solid',
    },
    arrowUp: {
      borderTopWidth: 30,
      borderRightWidth: 30,
      borderBottomWidth: 0,
      borderLeftWidth: 30,
      borderTopColor: colors.background,
      borderRightColor: 'transparent',
      borderBottomColor: "transparent",
      borderLeftColor: 'transparent',
    },
    textFontRegular:{
      fontFamily: fonts.default.fontFamily
    },
    toastContainer: {
      zIndex: 9999, 
    },
    groupButton:{
      backgroundColor: colors.background,
      marginBottom: 10,
    },
  });

  return (
    <>
      <ModalEvents
        actionType={"create"}
        isVisible={isEventModalVisible}
        setVisible={setEventModalVisible}
        event={event}
        onModify={handleCreateEvent}
      />
      <ModalObjectif
        actionType={"create"}
        isVisible={isObjectifModalVisible}
        setVisible={setObjectifModalVisible}
        onModify={handleCreateObjectif}
      />
      <ModalWish
        actionType={"create"}
        isVisible={isWishModalVisible}
        setVisible={setWishModalVisible}
        onModify={handleCreateWish}
      />
      <ModalContact
        actionType={"create"}
        isVisible={isContactModalVisible}
        setVisible={setContactModalVisible}
        onModify={handleCreateContact}
      />
      <ModalNote
        actionType={"create"}
        isVisible={isNoteModalVisible}
        setVisible={setNoteModalVisible}
        onModify={handleCreateNote}
      />
      <ModalAnimal
        actionType={"create"}
        isVisible={isAnimalModalVisible}
        setVisible={setAnimalModalVisible}
        onModify={handleCreateAnimal}
      />
      <View style={styles.toastContainer}>
          <Toast />
      </View>
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
      <View style={{display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center"}}>
        <View style={styles.form}>
          <ScrollView style={{width:"100%"}} persistentScrollbar={true}>
            <View style={styles.formContainer}>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setAnimalModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="paw" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Animal</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openModalEvent("balade")}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <Entypo name="compass" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Balade</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openModalEvent("entrainement")}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <Entypo name="traffic-cone" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Entraînement</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openModalEvent("concours")}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="trophy" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Concours</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openModalEvent("rdv")}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="stethoscope" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Rendez-vous médical</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openModalEvent("soins")}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome6 name="hand-holding-medical" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Soin</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openModalEvent("depense")}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome6 name="money-bill-wave" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Dépense</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openModalEvent("autre")}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome6 name="check-circle" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Autre</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setObjectifModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <SimpleLineIcons name="target" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Objectif</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setWishModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="heart" size={20} style={styles.iconButton}/>
                        <Text style={styles.textFontRegular}>Souhait</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setContactModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <AntDesign name="contacts" size={20} style={styles.iconButton}/>
                        <Text style={[styles.textFontRegular]}>Contact</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>

                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setNoteModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <SimpleLineIcons name="note" size={20} style={styles.iconButton}/>
                        <Text style={[styles.textFontRegular]}>Note</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
              </View>

              {/* <TouchableOpacity disabled={true} style={styles.button}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome name="group" size={20} style={styles.iconButton}/>
                    <Text style={[{color: colors.quaternary}, styles.textFontRegular]}>Groupe</Text>
                  </View>
                  <View style={styles.actionButtonContainer}>
                    <Entypo name="lock" size={20} style={styles.iconAction}/>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                  </View>
                </View>
                <Divider />
              </TouchableOpacity>

              <TouchableOpacity disabled={true} style={styles.button}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <MaterialCommunityIcons name="barn" size={25} style={styles.iconButton}/>
                    <Text style={[{color: colors.quaternary}, styles.textFontRegular]}>Structure</Text>
                  </View>
                  <View style={styles.actionButtonContainer}>
                    <Entypo name="lock" size={20} style={styles.iconAction}/>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                  </View>
                </View>
                <Divider />
              </TouchableOpacity> */}
            </View>
          </ScrollView>
        </View>
      </View>
      </LinearGradient>
    </>
  );
};

module.exports = ActionScreen;