import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, Image, TouchableWithoutFeedback, KeyboardAvoidingView } from "react-native";
import { useState, useEffect, useContext, useRef } from "react";
import Variables from "../styles/Variables";
import { useForm } from "react-hook-form";
import Button from "../Button";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import ModalAnimals from "../Modals/ModalAnimals";
import AnimalsService from "../../services/AnimalsService";
import EventService from "../../services/EventService";
import { AuthenticatedUserContext } from "../../providers/AuthenticatedUserProvider";
import ModalDropdwn from "../Modals/ModalDropdown";
import ModalNotifications from "../Modals/ModalNotifications";
import DatePickerModal from "../Modals/ModalDatePicker";

const ModalModificationEvents = ({isVisible, setVisible, event, onModify}) => {

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
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [eventType, setEventType] = useState(false);
  const [notifType, setNotifType] = useState(false);
  const [optionNotifType, setOptionNotifType] = useState(false);
  const list = [
    {title: "Balade", id: "balade"},
    {title: "Entrainement", id: "entrainement"},
    {title: "Concours", id: "concours"},
    {title: "Rendez-vous", id: "rdv"},
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
    if(isVisible){
      getAnimals();
    }
  }, [isVisible]);

  useEffect(() => {
    initValuesEvent();
  }, [animaux]);

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

  const initValuesEvent = () => {
    setValue("id", event.id);
    setValue("eventTypePrecedent", event.eventtype);
    setValue("date", event.dateevent);
    setValue("nom", event.nom);
    setValue("lieu", event.lieu);
    setValue("heuredebutbalade", event.heuredebutbalade);
    setValue("datefinbalade", event.datefinbalade);
    setValue("heurefinbalade", event.heurefinbalade);
    setValue("discipline", event.discipline);
    setValue("note", event.note);
    setValue("epreuve", event.epreuve);
    setValue("dossart", event.dossart);
    setValue("placement", event.placement);
    setValue("specialiste", event.specialiste);
    setValue("depense", event.depense);
    setValue("traitement", event.traitement);
    setValue("datefinsoins", event.datefinsoins);
    setValue("commentaire", event.commentaire);
    setValue("animaux", event.animaux);
    setSelected(animaux.filter((item) => event.animaux.includes(item.id)));
    setValue("eventType", event.eventtype);
    setEventType(list.filter((item) =>item.id === event.eventtype)[0]);
    setValue("notif", "");
    setValue("optionNotif", "");
  }

  const submitRegister = async(data) =>{
    var complete = true;
    setLoadingEvent(true);

    // Vérification complétion du formulaire
    if(data.date === undefined){
      complete = false;
      setLoadingEvent(false);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Veuillez saisir une date pour l'événement"
      });
    }
    if(animaux.length === 0){
      complete = false;
      setLoadingEvent(false);
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
      setLoadingEvent(false);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Veuillez saisir un nom d'événement"
      });
    }
    if(eventType === false){
      complete = false;
      setLoadingEvent(false);
      Toast.show({
        type: "error",
        position: "top",
        text1: "Veuillez saisir un type d'événement"
      });
    } else{
      if(eventType.id === "entrainement"){
        if(data.discipline === undefined){
          complete = false;
          setLoadingEvent(false);
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
          setLoadingEvent(false);
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
          setLoadingEvent(false);
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
      eventService.update(data)
        .then((reponse) =>{
          setLoadingEvent(false);

          Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'un événement réussi"
          });
          resetValues();
          onModify(data.id, reponse);
        })
        .catch((err) =>{
          setLoadingEvent(false);
          Toast.show({
              type: "error",
              position: "top",
              text1: err.message
          });
        });
    }
  };

  const resetValues = () =>{
    setValue("id", "");
    setValue("eventTypePrecedent", "");
    setValue("date", event.dateevent);
    setValue("nom", "");
    setValue("lieu", "");
    setValue("heuredebutbalade", "");
    setValue("datefinbalade", "");
    setValue("heurefinbalade", "");
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
    setValue("animaux", []);
    setValue("eventType", "");
    setValue("notif", "");
    setValue("optionNotif", "");
  }

  const onChangeDate = (propertyName, selectedDate) => {
    setValue(propertyName, selectedDate);
  };

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
    var date = watch(fieldname);
    if(date == undefined){
      return "";
    }
    options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateObject  = new Date(date);
    return String(dateObject.toLocaleDateString("fr-FR", options));
  }

  const closeModal = () => {
    setVisible(false);
  };

  return (
    <>
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisible}
        onRequestClose={closeModal}
      >
        {loadingEvent && (
        <View style={styles.loadingEvent}>
            <Image
            style={styles.loaderEvent}
            source={require("../../assets/loader.gif")}
            />
        </View>
        )}
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
        <View style={styles.modalContainer}>
          <View style={styles.form}>
            <View style={styles.containerActionsButtons}>

              <TouchableOpacity onPress={closeModal}>
                <Text style={{color: Variables.aubere}}>Annuler</Text>
              </TouchableOpacity>
              <Text style={{fontWeight: "bold"}}>Modifier un événement</Text>
              <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                <Text style={{color: Variables.alezan}}>Modifier</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBar} />
              <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: Variables.isabelle }}>
                    <View style={styles.formContainer}>
                      <View style={styles.containerDate}>
                        <Text style={styles.textInput}>Date : {convertDateToText("date")} <Text style={{color: "red"}}>*</Text></Text>
                        <DatePickerModal
                          onDayChange={onChangeDate}
                          propertyName={"date"}
                          defaultDate={event.dateevent}
                        />
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
                          <View style={styles.containerDate}>
                            <Text style={styles.textInput}>Date de fin : {convertDateToText("datefinsoins")} </Text>
                            <DatePickerModal
                                onDayChange={onChangeDate}
                                propertyName={"datefinsoins"}
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
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              </View>
            </View>
        </Modal>
      </>
    );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    height: "100%",
    justifyContent: "flex-end",
  },
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
  containerActionsButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center"
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
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: "100%",
    marginLeft: "auto",
    marginRight: "auto",
    borderRadius: 10,
    height: "90%",
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
    borderRadius: 10,
    backgroundColor: Variables.rouan,
    margin: 5,
  },
  containerDate:{
    flexDirection: "column",
    alignSelf: "flex-start",
    width: "100%"
  },
  bottomBar: {
    width: '100%',
    marginBottom: 10,
    marginTop: 10,
    height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
    backgroundColor: Variables.souris,
  },
  keyboardAvoidingContainer: {
    flex: 1,
  },
});

export default ModalModificationEvents;
