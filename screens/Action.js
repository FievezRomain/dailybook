import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from "react-native";
import { useState, useContext } from "react";
import Variables from "../components/styles/Variables";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import TopTab from '../components/TopTab';
import { FontAwesome5, FontAwesome, MaterialIcons, Entypo, SimpleLineIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import ModalEvents from "../components/Modals/ModalEvents";
import ModalObjectif from "../components/Modals/ModalObjectif";
import ModalWish from "../components/Modals/ModalWish";
import ModalContact from "../components/Modals/ModalContact";
import ModalNote from "../components/Modals/ModalNote";
import ModalAnimal from "../components/Modals/ModalAnimal";
import { Toast } from "react-native-toast-message/lib/src/Toast";

const ActionScreen = ({ navigation }) => {
  const [messages, setMessages] = useState({message1: "Ajouter un", message2: "élément"})
  const { user } = useContext(AuthenticatedUserContext);
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

  const handleCreateContact = (contact) =>{
    Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'un contact réussi"
    });
  }

  const handleCreateNote = (contact) =>{
    Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'une note réussi"
    });
  }

  const handleCreateWish = (wish) =>{
    Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'un souhait réussi"
    });
  }

  const handleCreateAnimal = (animal) =>{
    Toast.show({
      type: "success",
      position: "top",
      text1: "Création d'un animal réussi"
    });
  }

  return (
    <>
      <ModalEvents
        actionType={"create"}
        isVisible={isEventModalVisible}
        setVisible={setEventModalVisible}
        event={event}
      />
      <ModalObjectif
        actionType={"create"}
        isVisible={isObjectifModalVisible}
        setVisible={setObjectifModalVisible}
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
      <Image style={styles.image} />
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View style={{display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center"}}>
        <View style={styles.form}>
          <ScrollView style={{width:"100%"}} persistentScrollbar={true}>
            <View style={styles.formContainer}>

              <TouchableOpacity onPress={() => setAnimalModalVisible(true)}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome name="paw" size={20} style={styles.iconButton}/>
                    <Text>Animal</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModalEvent("balade")}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <Entypo name="compass" size={20} style={styles.iconButton}/>
                    <Text>Balade</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModalEvent("entrainement")}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <Entypo name="traffic-cone" size={20} style={styles.iconButton}/>
                    <Text>Entraînement</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModalEvent("concours")}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome name="trophy" size={20} style={styles.iconButton}/>
                    <Text>Concours</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModalEvent("rdv")}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome name="stethoscope" size={20} style={styles.iconButton}/>
                    <Text>Rendez-vous médical</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModalEvent("soins")}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome5 name="hand-holding-medical" size={20} style={styles.iconButton}/>
                    <Text>Soin</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModalEvent("depense")}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome5 name="money-bill-wave" size={20} style={styles.iconButton}/>
                    <Text>Dépense</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => openModalEvent("autre")}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome5 name="check-circle" size={20} style={styles.iconButton}/>
                    <Text>Autre tâche</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setObjectifModalVisible(true)}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <SimpleLineIcons name="target" size={20} style={styles.iconButton}/>
                    <Text>Objectif</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setWishModalVisible(true)}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome name="heart" size={20} style={styles.iconButton}/>
                    <Text>Voeux</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setContactModalVisible(true)}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <AntDesign name="contacts" size={20} style={styles.iconButton}/>
                    <Text>Contact</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => setNoteModalVisible(true)}>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <SimpleLineIcons name="note" size={20} style={styles.iconButton}/>
                    <Text>Note</Text>
                  </View>
                  <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <FontAwesome name="group" size={20} style={styles.iconButton}/>
                    <Text style={styles.textDesactivated}>Groupe</Text>
                  </View>
                  <View style={styles.actionButtonContainer}>
                    <Entypo name="lock" size={20} style={styles.iconAction}/>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                  </View>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>

              <TouchableOpacity>
                <View style={styles.touchableOpacityButtonContent}>
                  <View style={styles.informationsButtonContainer}>
                    <MaterialCommunityIcons name="barn" size={25} style={styles.iconButton}/>
                    <Text style={styles.textDesactivated}>Structure</Text>
                  </View>
                  <View style={styles.actionButtonContainer}>
                    <Entypo name="lock" size={20} style={styles.iconAction}/>
                    <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction}/>
                  </View>
                </View>
                <View style={styles.bottomBar} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
        <View style={[styles.triangle,styles.arrowUp]}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  textDesactivated:{
    color: Variables.isabelle,
  },
  iconAction:{
    color: Variables.alezan,
  },
  iconButton:{
    marginRight: 20,
    color: Variables.alezan,
  },
  bottomBar: {
    width: '100%',
    height: 0.7,
    backgroundColor: Variables.alezan,
    marginBottom: 10,
  },
  informationsButtonContainer:{
    flexDirection: "row",
    alignItems: "center",
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
    marginBottom: 5,
  },
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    position: "absolute",
    justifyContent: "center",
    backgroundColor:  Variables.default
  },
  formContainer:{
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  form: {
    alignItems: "center",
    backgroundColor: Variables.blanc,
    justifyContent: "center",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    height: "85%",
    paddingBottom: 10,
    paddingTop: 10,
    shadowColor: "black",
    shadowOpacity: 0.3,
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
    borderTopColor: Variables.blanc,
    borderRightColor: 'transparent',
    borderBottomColor: "transparent",
    borderLeftColor: 'transparent',
  },
});

module.exports = ActionScreen;