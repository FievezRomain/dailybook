import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity } from "react-native";
import { useState, useEffect, useContext } from "react";
import Variables from "../components/styles/Variables";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import DateTimePicker from '@react-native-community/datetimepicker';
import ModalAnimals from "../components/ModalAnimals";
import AnimalsService from "../services/AnimalsService";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import TopTab from '../components/TopTab';
import { Picker } from '@react-native-picker/picker';
import ModalDropdwn from "../components/ModalDropdown";
import moment from "moment";

const ActionScreen = ({ navigation }) => {
  const [messages, setMessages] = useState({message1: "Ajouter un", message2: "événement"})
  const animalsService = new AnimalsService;
  const { user } = useContext(AuthenticatedUserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDropdownVisible, setModalDropdownVisible] = useState(false);
  const [animaux, setAnimaux] = useState([]);
  const [selected, setSelected] = useState([]);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventType, setEventType] = useState(false);
  const list = [
    {title: "Balade", id: "balade"},
    {title: "Entrainement", id: "entrainement"},
    {title: "Concours", id: "concours"},
    {title: "Rendez-vous", id: "rdv"},
    {title: "Soins", id: "soins"},
    {title: "Autre", id: "autre"},
  ];
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
  const watchAll = watch();
  //setValue("date", String(jour + "/" + mois + "/" + annee));
  //const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
        setMessages({message1: "Ajouter un", message2: "événement"});
        getAnimals();
    });
    return unsubscribe;
  }, [navigation]);

  const getAnimals = async () => {
    // Si aucun animal est déjà présent dans la liste, alors
    if(animaux.length == 0){
      setLoadingEvent(true);
      // On récupère les animaux de l'utilisateur courant
      var result = await animalsService.getAnimals(user.id);
      setLoadingEvent(false);
      // Si l'utilisateur a des animaux, alors
      if(result.rowCount !== 0){
        // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
        setAnimaux(result.rows);
      }
    }
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

  const onChangeDate = (fieldname, selectedDate) => {
    nbOccur = (String(selectedDate).match(/\//g) || []).length;
    oldNbOccur = (String(getValues(fieldname)).match(/\//g) || []).length;
    if(String(selectedDate).length === 2){
        if(nbOccur === 0 && oldNbOccur === 0){
            selectedDate = selectedDate + "/";
            setValue(fieldname, selectedDate);
            //setState(selectedDate);
        }
    } else if(String(selectedDate).length === 5){
        if(nbOccur === 1 && oldNbOccur === 1){
            selectedDate = selectedDate + "/";
            setValue(fieldname, selectedDate);
            //setState(selectedDate);
        }
    } else if(String(selectedDate).length === 9){
        firstDatePart = String(selectedDate).split("/")[0];
        if(String(firstDatePart).length === 1){
            selectedDate = "0" + selectedDate;
            setValue(fieldname, selectedDate);
            //setState(selectedDate);
        }
    }
    setValue(fieldname, selectedDate);
    //setState(selectedDate);
  };

  const getActualDate = () =>{
    today = new Date();
    jour = parseInt(today.getDate()) < 10 ? "0"+String(today.getDate()) : String(today.getDate());
    mois = parseInt(today.getMonth()+1) < 10 ? "0" + String(today.getMonth()+1) : String(today.getMonth()+1);
    annee = today.getFullYear();
    if(watch("date") == undefined){
      //setValue("date", String(jour + "/" + mois + "/" + annee));
    }
    return String(jour + "/" + mois + "/" + annee);
    //setValue(fieldname, String(jour + "/" + mois + "/" + annee));
  }

  const onChangeTime = (fieldname, text) =>{
    today = new Date();
    jour = today.getHours();
  }

  const getActualTime = ()=>{
    today = new Date();
    hour = today.getHours();
    minutes = today.getMinutes()
    return String(hour + ":" + minutes);
  }

  const convertDateToText = (fieldname) =>{
    date = watch(fieldname);
    if(date == undefined){
      return "";
    }
    if(date.length != 10){
      return "";
    }
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateFormat = "DD/MM/YYYY";
    dateValid = moment(date, dateFormat, true).isValid();
    if (dateValid == false){
      return "Date invalide";
    }
    let [day, month, year] = date.split('/')
    dateObject  = new Date(year, month-1, day);
    return String(dateObject.toLocaleDateString("fr-FR", options));
  }

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
      <ModalAnimals
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAnimaux={setAnimaux}
        animaux={animaux}
        selected={selected}
        setSelected={setSelected}
      />
      <ModalDropdwn
        list={list}
        modalVisible={modalDropdownVisible}
        setModalVisible={setModalDropdownVisible}
        setState={setEventType}
        state={eventType}
      />
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View style={{display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center"}}>
        <View style={styles.form}>
          <ScrollView style={{width:"100%"}}>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Date : {convertDateToText("date")} <Text style={{color: "red"}}>*</Text></Text>
                <TextInput
                  style={styles.input}
                  placeholder="Exemple : 01/01/1900"
                  keyboardType="numeric"
                  maxLength={10}
                  placeholderTextColor={Variables.texte}
                  onChangeText={(text) => onChangeDate("date", text)}
                  value={watch("date")}
                  defaultValue={getActualDate()}
                />
                {/* <DateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    is24Hour={true}
                    onChange={onChangeDate}
                    accentColor={Variables.bouton}
                    style={styles.datePicker}
                    display="default"
                /> */}
              </View>
            
              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Animal : <Text style={{color: "red"}}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.textInput} 
                  onPress={()=>{setModalVisible(true)}} 
                >
                  <View style={styles.containerAnimaux}>
                    {selected.length == 0 &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Selectionner un animal</Text></View>
                    }
                    {selected.map((animal, index) => {
                      return (
                        <View key={animal.id} style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>{animal.nom}</Text></View>
                      );
                    })}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Événement : <Text style={{color: "red"}}>*</Text></Text>
                <TouchableOpacity 
                  style={styles.textInput} 
                  onPress={()=>{setModalDropdownVisible(true)}} 
                >
                  <View style={styles.containerAnimaux}>
                    {eventType == false &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Selectionner un type</Text></View>
                    }
                    {
                      eventType != false &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>{eventType.title}</Text></View>
                    }
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Nom de l'événement : <Text style={{color: "red"}}>*</Text></Text>
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
                <TextInput
                  style={styles.input}
                  placeholder="Exemple : Ecurie Avinesy"
                  placeholderTextColor={Variables.texte}
                  onChangeText={(text) => setValue("lieu", text)}
                  defaultValue={getValues("lieu")}
                />
              </View>

              {eventType.id === "balade" && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Date de début : {convertDateToText("datedebutbalade")}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 01/01/1900"
                        keyboardType="numeric"
                        maxLength={10}
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => onChangeDate("datedebutbalade", setDate, text)}
                        value={watch("datedebutbalade")}
                        defaultValue={getActualDate()}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Heure de début :</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 12:45"
                        keyboardType="numeric"
                        maxLength={5}
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => onChangeTime("heuredebutbalade", setDate, text)}
                        value={watch("heuredebutbalade")}
                        defaultValue={getActualTime()}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Date de fin : {convertDateToText("datefinbalade")} </Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 01/01/1900"
                        keyboardType="numeric"
                        maxLength={10}
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => onChangeDate("datefinbalade", setDate, text)}
                        value={watch("datefinbalade")}
                        defaultValue={getActualDate()}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Heure de fin :</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 12:45"
                        keyboardType="numeric"
                        maxLength={5}
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => onChangeTime("heurefinbalade", setDate, text)}
                        value={watch("heurefinbalade")}
                        defaultValue={getActualTime()}
                      />
                    </View>
                  </>
              )}

              {eventType.id === "entrainement" && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Discipline : <Text style={{color: "red"}}>*</Text></Text>
                      {errors.discipline && <Text style={styles.errorInput}>Discipline obligatoire</Text>}
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : CSO"
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => setValue("discipline", text)}
                        defaultValue={getValues("discipline")}
                        {...register("discipline", { required: true })}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Note de ressenti :</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 1 = Mauvais, 5 = Parfait"
                        keyboardType="numeric"
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => setValue("note", text)}
                        defaultValue={getValues("note")}
                      />
                    </View>
                  </>
              )}

              {eventType.id === "concours" && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Discipline : <Text style={{color: "red"}}>*</Text></Text>
                    {errors.discipline && <Text style={styles.errorInput}>Discipline obligatoire</Text>}
                    <TextInput
                      style={styles.input}
                      placeholder="Exemple : CSO"
                      placeholderTextColor={Variables.texte}
                      onChangeText={(text) => setValue("discipline", text)}
                      defaultValue={getValues("discipline")}
                      {...register("discipline", { required: true })}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Epreuve :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Exemple : galop 1"
                      placeholderTextColor={Variables.texte}
                      onChangeText={(text) => setValue("epreuve", text)}
                      defaultValue={getValues("epreuve")}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Dossart :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Exemple : 1"
                      keyboardType="numeric"
                      placeholderTextColor={Variables.texte}
                      onChangeText={(text) => setValue("dossart", text)}
                      defaultValue={getValues("dossart")}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Placement :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Exemple : 1"
                      keyboardType="numeric"
                      placeholderTextColor={Variables.texte}
                      onChangeText={(text) => setValue("placement", text)}
                      defaultValue={getValues("placement")}
                    />
                  </View>
                </>
              )}

              {eventType.id === "rdv" && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Spécialiste :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Exemple : Vétérinaire"
                      placeholderTextColor={Variables.texte}
                      onChangeText={(text) => setValue("specialiste", text)}
                      defaultValue={getValues("specialiste")}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Dépense :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Exemple : 0 (un doux rêve)"
                      keyboardType="numeric"
                      placeholderTextColor={Variables.texte}
                      onChangeText={(text) => setValue("depense", text)}
                      defaultValue={getValues("depense")}
                    />
                  </View>
                </>
              )}

              {eventType.id === "soins" && (
                <>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Traitement : <Text style={{color: "red"}}>*</Text></Text>
                    {errors.discipline && <Text style={styles.errorInput}>Traitement obligatoire </Text>}
                    <TextInput
                      style={styles.input}
                      placeholder="Exemple : Cure de CMV"
                      placeholderTextColor={Variables.texte}
                      onChangeText={(text) => setValue("traitement", text)}
                      defaultValue={getValues("traitement")}
                      {...register("traitement", { required: true })}
                    />
                  </View>
                </>
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
    paddingRight: 15,
    backgroundColor: Variables.fond_secondary,
    color: "black",
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
  },
  containerBadgeAnimal: {
    borderRadius: 5,
    backgroundColor: Variables.fond_secondary,
    margin: 5,
  }
});

module.exports = ActionScreen;