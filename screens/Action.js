import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect, useContext } from "react";
import Variables from "../components/styles/Variables";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import DateTimePicker from '@react-native-community/datetimepicker';
import TestModal from "../components/Modal";
import AnimalsService from "../services/AnimalsService";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import TopTab from '../components/TopTab';

const ActionScreen = ({ navigation }) => {
  const [messages, setMessages] = useState({message1: "Ajouter un", message2: "événement"})
  const animalsService = new AnimalsService;
  const { user } = useContext(AuthenticatedUserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [animaux, setAnimaux] = useState([{nom:"Selectionner un animal"}]);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventType, setEventType] = useState(false);
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm();
  const [date, setDate] = useState(new Date(new Date().getTime()));

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
        setMessages({message1: "Ajouter un", message2: "événement"});
        getAnimals();
    });
    return unsubscribe;
  }, [navigation]);

  const getAnimals = async () => {
    //A TERMINER
    var animaux = await animalsService.getAnimals(user.id)
    if(animaux.rowCount != 0){
      setAnimaux(animaux);
    }
    //setAnimaux([{nom:"Selectionner un animal"}]);
  };

  const submitRegister = async(data) =>{
    Toast.show({
      type: "success",
      position: "top",
      text1: getValues("date")
    });
  };

  const handleChange = (val) =>{
    setValue("type", val)
    setEventType(val);
  }

  const onChangeDate = (event, selectedDate) => {
    setValue("date", selectedDate.getDate() + "/" + parseInt(selectedDate.getMonth()+1) + "/" + selectedDate.getFullYear());
    setDate(selectedDate);
  };

  return (
    <>
      {loadingEvent && (
      <View style={styles.loadingEvent}>
          <Image
          style={styles.loaderEvent}
          source={require("../assets/loader.gif")}
          />
      </View>
      )}
      <Image style={styles.image} source={require("../assets/wallpaper_addEvent.jpg")} />
      <TestModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAnimaux={setAnimaux}
        animaux={animaux}
      />
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View style={{display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center"}}>
        <View style={styles.form}>
          <ScrollView style={{width:"100%"}}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Date :</Text>
                <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={onChangeDate}
                    accentColor={Variables.bouton}
                    style={styles.datePicker}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Nom de l'événement :</Text>
                {errors.nom && <Text style={styles.errorInput}>Nom obligatoire</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="Exemple : RDV vétérinaire"
                  placeholderTextColor={Variables.texte}
                  onChangeText={(text) => setValue("nom", text)}
                  defaultValue={getValues("nom")}
                  {...register("nom", { required: true })}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Lieu de l'événement :</Text>
                {errors.lieu && <Text style={styles.errorInput}>Lieu obligatoire</Text>}
                <TextInput
                  style={styles.input}
                  placeholder="Exemple : Ecurie Avinesy"
                  placeholderTextColor={Variables.texte}
                  onChangeText={(text) => setValue("lieu", text)}
                  defaultValue={getValues("lieu")}
                  {...register("lieu", { required: true })}
                />
              </View>
            
              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Les animaux :</Text>
                <TouchableOpacity 
                  style={styles.textInput} 
                  onPress={()=>{setModalVisible(true)}} 
                >
                  <View style={styles.containerAnimaux}>
                    {animaux.map((animal, index) => {
                      return (
                        <Text style={styles.badgeAnimal}>{animal.nom}</Text>
                      );
                    })}
                  </View>
                </TouchableOpacity>
              </View>

              {eventType === "Balade" && (
                  <Text>Balade weeeeeeesh</Text>
              )}

              {eventType === "Entrainement" && (
                  <Text>Entrainement weeeeeeesh</Text>
              )}

              {eventType === "Concours" && (
                  <Text>Concours weeeeeeesh</Text>
              )}

              {eventType === "rdv" && (
                  <Text>rdv weeeeeeesh</Text>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Commentaire :</Text>
                <TextInput
                  style={styles.inputTextArea}
                  multiline={true}
                  numberOfLines={4}
                  maxLength={2000}
                  placeholder="Exemple : Rappel des vaccins"
                  placeholderTextColor={Variables.texte}
                  onChangeText={(text) => setValue("commentaire", text)}
                  defaultValue={getValues("commentaire")}
                />
              </View>
              

              <View style={styles.registerButton}>
                <Button type="primary" onPress={handleSubmit(submitRegister)}>
                  <Text style={styles.textButton}>Enregistrer</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        </View>
        <View style={[styles.triangle,styles.arrowUp]}/>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  image: {
    flex: 1,
    height: "100%",
    width: "100%",
    resizeMode: "cover",
    position: "absolute",
    justifyContent: "center",
    backgroundColor:  Variables.fond
  },
  inputContainer:{
    alignItems: "center",
    width: "100%"
  },
  textInput:{
    alignSelf: "flex-start",
    marginBottom: 5
  },
  textButton:{
    color: "white"
  },
  registerButton: {
    marginBottom: 20,
    marginTop: 10,
    backgroundColor: Variables.bouton,
    borderRadius: 10
  },
  title: {
    color: Variables.texte,
    fontSize: 30,
    letterSpacing: 2,
    marginBottom:20,
    fontWeight: "bold"
  },
  errorInput: {
    color: "red"
  },
  formContainer:{
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 10,
    paddingBottom: 10,
  },
  form: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 1)",
    justifyContent: "center",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    height: "85%",
    paddingBottom: 10,
    paddingTop: 10,
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
  input: {
    height: 40,
    width: "100%",
    marginBottom: 15,
    borderRadius: 5,
    paddingLeft: 15,
    backgroundColor: Variables.fond_secondary,
    color: "black",
    alignSelf: "baseline"
  },
  inputTextArea: {
    height: 100,
    width: "100%",
    marginBottom: 15,
    borderRadius: 5,
    paddingLeft: 15,
    backgroundColor: Variables.fond_secondary,
    color: "black",
    alignSelf: "center",
  },
  datePicker:{
    marginBottom: 15,
    alignSelf: "flex-start",
    borderRadius: 5,
  },
  containerInput:{
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    with: "100%"
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
    borderTopColor: "rgba(255, 255, 255, 1)",
    borderRightColor: 'transparent',
    borderBottomColor: "transparent",
    borderLeftColor: 'transparent',
  },
  containerAnimaux: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  badgeAnimal: {
    padding: 8,
    backgroundColor: Variables.fond_secondary,
    borderRadius: 20,
    margin: 5
  }
});

module.exports = ActionScreen;