import { View, Text, StyleSheet, TextInput, Image, ScrollView, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useState, useEffect, useContext } from "react";
import Variables from "../components/styles/Variables";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import ModalAnimals from "../components/Modals/ModalAnimals";
import AnimalsService from "../services/AnimalsService";
import EventService from "../services/EventService";
import { AuthenticatedUserContext } from "../providers/AuthenticatedUserProvider";
import TopTab from '../components/TopTab';
import ModalDropdwn from "../components/Modals/ModalDropdown";
import moment from "moment";
import ModalNotifications from "../components/Modals/ModalNotifications";
import DatePickerModal from "../components/Modals/ModalDatePicker";
import RatingInput from "../components/RatingInput";
import FrequencyInput from "../components/FrequencyInput";

const ActionScreen = ({ navigation }) => {
  const [messages, setMessages] = useState({message1: "Ajouter un", message2: "événement"})
  const animalsService = new AnimalsService;
  const eventService = new EventService;
  const { user } = useContext(AuthenticatedUserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDropdownVisible, setModalDropdownVisible] = useState(false);
  const [modalDropdownNotifVisible, setModalDropdownNotifVisible] = useState(false);
  const [modalNotifications, setModalNotifications] = useState(false);
  const [modalOptionNotifications, setModalOptionNotifications] = useState(false);
  const [animaux, setAnimaux] = useState([]);
  const [selected, setSelected] = useState([]);
  const [eventType, setEventType] = useState(false);
  const [notifType, setNotifType] = useState(false);
  const [optionNotifType, setOptionNotifType] = useState(false);
  const list = [
    {title: "Balade", id: "balade"},
    {title: "Entrainement", id: "entrainement"},
    {title: "Concours", id: "concours"},
    {title: "Rendez-vous médical", id: "rdv"},
    {title: "Soins", id: "soins"},
    {title: "Autre", id: "autre"},
  ];
  const listNotif = [
    {title: "Aucune notification", id: "None"},
    {title: "Notification le jour J", id: "JourJ"},
    {title: "Notification la veille", id: "Veille"},
  ];
  const listOptionsNotif = [
    {title: "Aucune option supplémentaire", id: "None"},
    {title: "Me rappeler l'événement dans 1 an", id: "Annee"},
  ];
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
  const [notifications, setNotifications] = useState([]);
  const INITIAL_DATE = new Date().toISOString().split('T')[0];
  //const watchAll = watch();
  //setValue("date", String(jour + "/" + mois + "/" + annee));
  //const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
        setMessages({message1: "Ajouter un", message2: "événement"});
        getAnimals();
        getActualDate();
    });
    return unsubscribe;
  }, [navigation]);

  const getAnimals = async () => {
  
    // Si aucun animal est déjà présent dans la liste, alors
    if(animaux.length == 0){
      // On récupère les animaux de l'utilisateur courant
      var result = await animalsService.getAnimals(user.id);
      // Si l'utilisateur a des animaux, alors
      if(result.rowCount !== 0){
        // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
        setAnimaux(result.rows);
      }
    }
  
  };

  const submitRegister = async(data) =>{
    var complete = true;

    // Vérification complétion du formulaire
    if(data.date === undefined){
      complete = false;
      Toast.show({
        type: "error",
        position: "top",
        text1: "Veuillez saisir une date pour l'événement"
      });
    }
    if(animaux.length === 0){
      complete = false;
      Toast.show({
        type: "error",
        position: "top",
        text1: "Veuillez saisir un animal"
      });
    } else{
      setValue("animaux", selected.map(function(item) { return item["id"] }));
    }
    if(data.nom === undefined){
      complete = false;
      Toast.show({
        type: "error",
        position: "top",
        text1: "Veuillez saisir un nom d'événement"
      });
    }
    if(eventType === false){
      complete = false;
      Toast.show({
        type: "error",
        position: "top",
        text1: "Veuillez saisir un type d'événement"
      });
    } else{
      if(eventType.id === "entrainement"){
        if(data.discipline === undefined){
          complete = false;
          Toast.show({
            type: "error",
            position: "top",
            text1: "Veuillez saisir une discipline"
          });
        }
      }
      if(eventType.id === "concours"){
        if(data.discipline === undefined){
          complete = false;
          Toast.show({
            type: "error",
            position: "top",
            text1: "Veuillez saisir une discipline"
          });
        }
      }
      if(eventType.id === "soins"){
        if(data.traitement === undefined){
          complete = false;
          Toast.show({
            type: "error",
            position: "top",
            text1: "Veuillez saisir un traitement"
          });
        }
      }
    }

    // Si formulaire complet, on enregistre
    if(complete === true){
      eventService.create(data)
        .then((reponse) =>{

          Toast.show({
            type: "success",
            position: "top",
            text1: "Création d'un événement réussi"
          });

          resetValues();
        })
        .catch((err) =>{
          Toast.show({
              type: "error",
              position: "top",
              text1: err.message
          });
        });
    }

  };

  const resetValues = () =>{
    setValue("nom", "");
    setValue("lieu", "");
    setValue("discipline", "");
    setValue("note", "");
    setValue("epreuve", "");
    setValue("dossart", "");
    setValue("placement", "");
    setValue("specialiste", "");
    setValue("depense", "");
    setValue("traitement", "");
    setValue("datefinsoins", "");
    setValue("commentaire", "");
    setValue("note", "");
    setValue("frequenceValue", "");
    setValue("depense", "");
    setValue("frequenceType", "");
  }

  const onChangeDate = (propertyName, selectedDate) => {
    setValue(propertyName, selectedDate);
  };

  const handleRatingChange = (value) => {
    setValue("note", value);
  };

  const handleFrequencyChange = (newValue, newType) => {
    setValue("frequenceValue", newValue);
    setValue("frequenceType", newType);
  };

  const getActualDate = () =>{
    setValue("date", INITIAL_DATE);
  }

  const onChangeTime = (fieldname, text) =>{
    today = new Date();
    jour = today.getHours();
  }

  const getActualTime = ()=>{
    today = new Date();
    hour = today.getHours();
    minutes = today.getMinutes();
    if ( String(minutes).length == 1 ){
      minutes = "0" + String(minutes);
    }
    return String(hour + "h" + minutes);
  }

  const convertDateToText = (fieldname) =>{
    date = watch(fieldname);
    if(date == undefined){
      return "";
    }
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateObject  = new Date(date);
    return String(dateObject.toLocaleDateString("fr-FR", options));
  }

  return (
    <>
      <Image style={styles.image} source={require("../assets/wallpaper_addEvent.jpg")} />
      <ModalAnimals
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        setAnimaux={setAnimaux}
        animaux={animaux}
        selected={selected}
        setSelected={setSelected}
        setValue={setValue}
        valueName={"animaux"}
      />
      <ModalDropdwn
        list={list}
        modalVisible={modalDropdownVisible}
        setModalVisible={setModalDropdownVisible}
        setState={setEventType}
        state={eventType}
        setValue={setValue}
        valueName={"eventType"}
      />
      <ModalDropdwn
        list={listNotif}
        modalVisible={modalDropdownNotifVisible}
        setModalVisible={setModalDropdownNotifVisible}
        setState={setNotifType}
        state={notifType}
        setValue={setValue}
        valueName={"notif"}
      />
      <ModalDropdwn
        list={listOptionsNotif}
        modalVisible={modalOptionNotifications}
        setModalVisible={setModalOptionNotifications}
        setState={setOptionNotifType}
        state={optionNotifType}
        setValue={setValue}
        valueName={"optionNotif"}
      />
      <ModalNotifications
        modalVisible={modalNotifications}
        setModalVisible={setModalNotifications}
        notifications={notifications}
        setNotifications={setNotifications}
        eventType={eventType}
      />
      <TopTab message1={messages.message1} message2={messages.message2}/>
      <View style={{display: "flex", alignContent: "center", justifyContent: "center", alignItems: "center"}}>
        <View style={styles.form}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
          <ScrollView style={{width:"100%"}}>
            <View style={styles.formContainer}>
              <View style={styles.containerDate}>
                <Text style={styles.textInput}>Date : {convertDateToText("date")} <Text style={{color: "red"}}>*</Text></Text>
                <DatePickerModal
                  onDayChange={onChangeDate}
                  propertyName={"date"}
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
                  disabled={animaux.length > 0 ? false : true}
                  onPress={()=>{setModalVisible(true)}} 
                >
                  <View style={styles.containerAnimaux}>
                    {animaux.length === 0 &&
                      <View><Text style={[styles.badgeAnimal, styles.errorInput]}>Pour ajouter un événement vous devez d'abord créer un animal</Text></View>
                    }
                    {selected.length == 0 && animaux.length > 0 &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Sélectionner un animal</Text></View>
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
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Sélectionner un type</Text></View>
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
                  placeholder="Exemple : Rendez-vous vétérinaire"
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
                  placeholder="Exemple : Écurie de la Pomme"
                  placeholderTextColor={Variables.texte}
                  onChangeText={(text) => setValue("lieu", text)}
                  defaultValue={getValues("lieu")}
                />
              </View>

              {eventType.id === "balade" && (
                  <>
                    {/* <View style={styles.inputContainer}>
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
                    </View> */}
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Heure de début :</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 12h45"
                        keyboardType="numeric"
                        maxLength={5}
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => onChangeTime("heuredebutbalade", setDate, text)}
                        value={watch("heuredebutbalade")}
                        defaultValue={getActualTime()}
                      />
                    </View>
                    <View style={styles.containerDate}>
                      <Text style={styles.textInput}>Date de fin : {convertDateToText("datefinbalade")} </Text>
                      <DatePickerModal
                        onDayChange={onChangeDate}
                        propertyName={"datefinbalade"}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Heure de fin :</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 12h45"
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
                      <Text style={styles.textInput}>Ressenti :</Text>
                      <RatingInput 
                        onRatingChange={handleRatingChange}
                        defaultRating={getValues("note")}
                      />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Dépense :</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 1"
                        keyboardType="numeric"
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => setValue("depense", text)}
                        defaultValue={getValues("depense")}
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
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Ressenti :</Text>
                    <RatingInput 
                      onRatingChange={handleRatingChange} 
                      defaultRating={getValues("note")}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Dépense :</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Exemple : 1"
                      keyboardType="numeric"
                      placeholderTextColor={Variables.texte}
                      onChangeText={(text) => setValue("depense", text)}
                      defaultValue={getValues("depense")}
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
                  <View style={styles.containerDate}>
                    <Text style={styles.textInput}>Date de fin : {convertDateToText("datefinsoins")} </Text>
                    <DatePickerModal
                        onDayChange={onChangeDate}
                        propertyName={"datefinsoins"}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                    <Text style={styles.textInput}>Fréquence :</Text>
                    <FrequencyInput
                      label="Fréquence du traitement :"
                      onChange={handleFrequencyChange}
                      defaultFrequencyType={getValues("frequencyType")}
                      defaultInputValue={getValues("frequencyValue")}
                    />
                  </View>
                  <View style={styles.inputContainer}>
                      <Text style={styles.textInput}>Dépense :</Text>
                      <TextInput
                        style={styles.input}
                        placeholder="Exemple : 1"
                        keyboardType="numeric"
                        placeholderTextColor={Variables.texte}
                        onChangeText={(text) => setValue("depense", text)}
                        defaultValue={getValues("depense")}
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

              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Notifications :</Text>
                <TouchableOpacity 
                  style={styles.textInput} 
                  onPress={()=>{setModalDropdownNotifVisible(true)}} 
                >
                  <View style={styles.containerAnimaux}>
                    {notifType == false &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Par défaut, vous ne recevrez pas de notification</Text></View>
                    }
                    {
                      notifType != false &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>{notifType.title}</Text></View>
                    }
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity 
                  style={styles.textInput}
                  onPress={()=>{setModalNotifications(true)}} 
                >
                  <View style={styles.containerAnimaux}>
                    {notifications.length == 0 &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Par défaut, vous ne recevrez pas de notification.</Text></View>
                    }
                    {
                      notifications.length != 0 &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Notifications personnalisées</Text></View>
                    }
                  </View>
                </TouchableOpacity> */}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.textInput}>Option notifications :</Text>
                <TouchableOpacity 
                  style={styles.textInput} 
                  onPress={()=>{setModalOptionNotifications(true)}} 
                >
                  <View style={styles.containerAnimaux}>
                    {optionNotifType == false &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Aucune option</Text></View>
                    }
                    {
                      optionNotifType != false &&
                      <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>{optionNotifType.title}</Text></View>
                    }
                  </View>
                </TouchableOpacity>
              </View>

              
              

              <View style={styles.registerButton}>
                <Button type="primary" disabled={false} size={"m"} onPress={handleSubmit(submitRegister)}>
                  <Text style={styles.textButton}>Enregistrer</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
          </KeyboardAvoidingView>
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
    backgroundColor:  Variables.isabelle
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
    backgroundColor: Variables.isabelle,
    borderRadius: 10
  },
  title: {
    color: Variables.bai,
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
    backgroundColor: Variables.rouan,
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
    backgroundColor: Variables.rouan,
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
    backgroundColor: Variables.rouan,
    margin: 5,
  },
  containerDate:{
    flexDirection: "column",
    alignSelf: "flex-start",
    width: "100%"
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
});

module.exports = ActionScreen;