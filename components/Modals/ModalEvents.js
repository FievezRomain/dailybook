import { View, Text, StyleSheet, TextInput, Modal, ScrollView, TouchableOpacity, KeyboardAvoidingView } from "react-native";
import { useState, useEffect } from "react";
import Variables from "../styles/Variables";
import { useForm } from "react-hook-form";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import ModalAnimals from "./ModalSelectAnimals";
import AnimalsService from "../../services/AnimalsService";
import EventService from "../../services/EventService";
import { useAuth } from "../../providers/AuthenticatedUserProvider";
import ModalDropdwn from "./ModalDropdown";
import ModalNotifications from "./ModalNotifications";
import DatePickerModal from "./ModalDatePicker";
import RatingInput from "../RatingInput";
import ToogleSwitch from "../ToggleSwitch";
import StatePicker from "../StatePicker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from "react-native";
import TimePickerCustom from "../TimePicker";

const ModalEvents = ({isVisible, setVisible, actionType, event=undefined, onModify=undefined}) => {
  const { currentUser } = useAuth();
  const animalsService = new AnimalsService;
  const eventService = new EventService;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDropdownVisible, setModalDropdownVisible] = useState(false);
  const [modalDropdownNotifVisible, setModalDropdownNotifVisible] = useState(false);
  const [modalNotifications, setModalNotifications] = useState(false);
  const [modalOptionNotifications, setModalOptionNotifications] = useState(false);
  const [modalCategorieDepense, setModalCategorieDepense] = useState(false);
  const [modalFrequence, setModalFrequence] = useState(false);
  const [animaux, setAnimaux] = useState([]);
  const [selected, setSelected] = useState([]);
  const [eventType, setEventType] = useState(false);
  const [notifType, setNotifType] = useState(false);
  const [optionNotifType, setOptionNotifType] = useState(false);
  const [categorieDepense, setCategorieDepense] = useState(false);
  const [frequence, setFrequence] = useState(false);
  const [dateEvent, setDateEvent] = useState(null);
  const list = [
    {title: "Balade", id: "balade"},
    {title: "Entraînement", id: "entrainement"},
    {title: "Concours", id: "concours"},
    {title: "Rendez-vous", id: "rdv"},
    {title: "Soins", id: "soins"},
    {title: "Autre", id: "autre"},
    {title: "Depense", id: "depense"},
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
  const listCategorieDepense = [
    {title: "Alimentation", id: "alimentation"},
    {title: "Équipement", id: "equipement"},
    {title: "Accessoire", id: "accessoire"},
    {title: "Service de garde / Pension", id: "garde"},
    {title: "Formation", id: "formation"},
    {title: "Assurance", id: "assurance"},
  ];
  const listFrequency = [
    {title: "Tous les jours", id: "tlj"},
    {title: "Toutes les semaines", id: "tls"},
    {title: "Toutes les 2 semaines", id:"tl2s"},
    {title: "Tous les mois", id:"tlm"}
  ]
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  //const watchAll = watch();
  //setValue("date", String(jour + "/" + mois + "/" + annee));
  //const [date, setDate] = useState(String(jour + "/" + mois + "/" + annee));

  useEffect(() => {
    if(isVisible){
      getAnimals();
      initValuesEvent();
    }
  }, [isVisible]);

  useEffect(() => {
    initValuesEvent();
  }, [animaux]);

  const getAnimals = async () => {
  
    // Si aucun animal est déjà présent dans la liste, alors
    if(animaux.length == 0){
      // On récupère les animaux de l'utilisateur courant
      var result = await animalsService.getAnimals(currentUser.id);
      // Si l'utilisateur a des animaux, alors
      if(result.length !== 0){
        // On renseigne toute la liste dans le hook (permet de switcher entre des animaux)
        setAnimaux(result);
        
      }
    }
  
  };

  const initValuesEvent = () => {
    setValue("id", event.id);
    setValue("dateevent", event.dateevent === undefined ? new Date().toISOString().split('T')[0] : event.dateevent);
    var defaultDate;
    if( event.dateevent !== null && event.heuredebutevent !== null && event.dateevent !== undefined && event.heuredebutevent !== undefined ){
      defaultDate = new Date(event.dateevent)
      var heure = parseInt(event.heuredebutevent.split("h")[0], 10);
      var minutes = parseInt(event.heuredebutevent.split("h")[1], 10);
      defaultDate.setHours(heure);
      defaultDate.setMinutes(minutes);
    } else{
      defaultDate = null;;
    }
    setDateEvent( defaultDate );
    setValue("nom", event.nom);
    setValue("heuredebutevent", event.heuredebutevent === undefined ? null : event.heuredebutevent);
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
    if(event.animaux != undefined){
      var animauxSelected = animaux.filter((item) => event.animaux.includes(item.id));
      if(animauxSelected != undefined){
        setSelected(animaux.filter((item) => event.animaux.includes(item.id)));
      }
    }
    setValue("eventtype", event.eventtype);
    var eventTypeSelected = list.filter((item) =>item.id === event.eventtype)[0];
    if(eventTypeSelected != undefined){
      setEventType(list.filter((item) =>item.id === event.eventtype)[0]);
    }
    setValue("frequencevalue", event.frequencevalue);
    setValue("depense", event.depense);
    setValue("categoriedepense", event.categoriedepense);
    setValue("frequencetype", event.frequencetype);
    setValue("notif", event.frequencetype);
    setValue("optionnotif", event.frequencetype);
    setValue("state", event.state === undefined ? "À faire" : event.state);
    setValue("todisplay", event.todisplay === undefined ? true : event.todisplay);
  }

  const submitRegister = async(data) =>{
    if(loading){
      return;
    }
    var complete = true;
    setLoading(true);

    // Vérification complétion du formulaire
    if(data.dateevent === undefined){
      complete = false;
      Toast.show({
        type: "error",
        position: "top",
        text1: "Veuillez saisir une date pour l'événement"
      });
    }
    if(selected.length === 0){
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
        if(data.datefinsoins !== undefined && new Date(data.dateevent) > new Date(data.datefinsoins)){
          complete = false;
          Toast.show({
            type: "error",
            position: "top",
            text1: "Date de fin de traitement postérieure à la date d'evénement"
          });
        }
      }
    }
    // Si formulaire complet, on enregistre
    if(complete === true){
      // Mise à défaut de l'option notif si rien de selectionné
      if(notifType === false)
      {
        data.notif = "JourJ";
      }
      if(frequence === false){
        data.frequencevalue = "tlj";
      }

      // Récupération du expo token pour gérer les notifications
      data.expotoken = JSON.parse(await AsyncStorage.getItem("userExpoToken"));

      if(actionType === "modify"){
        eventService.update(data)
        .then((reponse) =>{

          Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'un événement réussi"
          });
          resetValues();
          onModify(data.id, data);
          closeModal();
          setLoading(false);
        })
        .catch((err) =>{
          Toast.show({
              type: "error",
              position: "top",
              text1: err.message
          });
          setLoading(false);
        });
      } else {
        eventService.create(data)
        .then((reponse) =>{

          Toast.show({
            type: "success",
            position: "top",
            text1: "Création d'un événement réussi"
          });
          closeModal();
          setLoading(false);
        })
        .catch((err) =>{
          Toast.show({
              type: "error",
              position: "top",
              text1: err.message
          });
          setLoading(false);
        });
      }
    } else{
      setLoading(false);
    }
  };

  const resetValues = () =>{
    setValue("id", "");
    setValue("dateevent", event.dateevent);
    setValue("nom", "");
    setValue("heuredebutevent", "");
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
    setValue("eventtype", "");
    setEventType(false);
    setValue("notif", "");
    setValue("optionnotif", "");
    setValue("frequencevalue", "");
    setValue("depense", "");
    setValue("categoriedepense", "");
    setValue("frequencetype", "");
    setValue("state", "");
    setValue("todisplay", "");
    setSelected([]);
  }

  const onChangeDate = (propertyName, selectedDate) => {
    setValue(propertyName, selectedDate);
    if(new Date() > new Date(selectedDate)){
      handleStateChange("Terminé");
      setNotifType({title: "Aucune notification", id: "None"});
      setValue("notif", "None");
    }
  };

  const onChangeTime = (fieldname, text) =>{
    today = new Date();
    jour = today.getHours();
  }

  const handleRatingChange = (value) => {
    setValue("note", value);
  };

  const handleFrequencyChange = (newValue, newType) => {
    setValue("frequencevalue", newValue);
    setValue("frequencetype", newType);
  };

  const handleStateChange = (value) => {
    setValue("state", value);
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
    resetValues();
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
          valueName={"eventtype"}
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
          valueName={"optionnotif"}
        />
        <ModalDropdwn
          list={listCategorieDepense}
          modalVisible={modalCategorieDepense}
          setModalVisible={setModalCategorieDepense}
          setState={setCategorieDepense}
          state={categorieDepense}
          setValue={setValue}
          valueName={"categoriedepense"}
        />
        <ModalDropdwn
          list={listFrequency}
          modalVisible={modalFrequence}
          setModalVisible={setModalFrequence}
          setState={setFrequence}
          state={frequence}
          setValue={setValue}
          valueName={"frequencevalue"}
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
              { actionType === "modify" && 
                <Text style={{fontWeight: "bold"}}>Modifier un événement</Text>
              }
              { actionType === "create" && 
                <Text style={{fontWeight: "bold"}}>Créer un événement</Text>
              }
              <TouchableOpacity onPress={handleSubmit(submitRegister)}>
                { loading ? 
                    <ActivityIndicator size={10} color={Variables.bai} />
                  :
                    actionType === "modify" ?
                      <Text style={{color: Variables.alezan}}>Modifier</Text>
                    :
                      <Text style={{color: Variables.alezan}}>Créer</Text>
                }
              </TouchableOpacity>
            </View>
            <View style={styles.bottomBar} />
              <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="padding">
                <ScrollView style={{ width: "100%" }} showsVerticalScrollIndicator={true} scrollIndicatorInsets={{ color: Variables.isabelle }}>
                    <View style={styles.formContainer}>
                      <View style={styles.containerDate}>
                        <Text style={styles.textInput}>Date : {convertDateToText("dateevent")} <Text style={{color: "red"}}>*</Text></Text>
                        <DatePickerModal
                          onDayChange={onChangeDate}
                          propertyName={"dateevent"}
                          defaultDate={getValues("dateevent")}
                        />
                      </View>
                    
                      <View style={styles.inputContainer}>
                        <Text style={styles.textInput}>Animaux : <Text style={{color: "red"}}>*</Text></Text>
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
                              <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Sélectionner un ou plusieurs animaux</Text></View>
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

                      <View style={[styles.inputContainer, {marginBottom: 15}]}>
                        <Text style={styles.textInput}>Heure de début : </Text>
                        <TimePickerCustom
                          setValue={setValue}
                          valueName={"heuredebutevent"}
                          defaultValue={dateEvent}
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
                            </View> */}
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
                            <View style={styles.containerDate}>
                              <Text style={styles.textInput}>Date de fin : {convertDateToText("datefinbalade")} </Text>
                              <DatePickerModal
                                onDayChange={onChangeDate}
                                propertyName={"datefinbalade"}
                              />
                            </View>
                            {/* <View style={styles.inputContainer}>
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
                            </View> */}
                            <View style={styles.inputContainer}>
                              <Text style={styles.textInput}>Ressenti :</Text>
                              <RatingInput 
                                onRatingChange={handleRatingChange}
                                defaultRating={getValues("note")}
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
                            {errors.traitement && <Text style={styles.errorInput}>Traitement obligatoire </Text>}
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
                            <TouchableOpacity 
                              style={styles.textInput} 
                              onPress={()=>{setModalFrequence(true)}} 
                            >
                              <View style={styles.containerAnimaux}>
                                {frequence == false &&
                                  <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Par défaut, le soin sera tous les jours</Text></View>
                                }
                                {
                                  frequence != false &&
                                  <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>{frequence.title}</Text></View>
                                }
                              </View>
                            </TouchableOpacity>
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

                      {eventType.id === "depense" && (
                        <>
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

                          <View style={styles.inputContainer}>
                            <Text style={styles.textInput}>Catégorie :</Text>
                            <TouchableOpacity 
                              style={styles.textInput} 
                              onPress={()=>{setModalCategorieDepense(true)}} 
                            >
                              <View style={styles.containerAnimaux}>
                                {categorieDepense == false &&
                                  <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Par défaut, la dépense n'est dans aucune catégorie</Text></View>
                                }
                                {
                                  categorieDepense != false &&
                                  <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>{categorieDepense.title}</Text></View>
                                }
                              </View>
                            </TouchableOpacity>
                          </View>
                        </>
                      )}

                      <Text style={styles.textInput}>Status de l'événement :</Text>
                      <View style={styles.inputToggleContainer}>
                        <StatePicker
                          firstState={"À faire"}
                          secondState={"Terminé"}
                          handleChange={handleStateChange}
                          defaultState={watch("state") === undefined ? "À faire" : watch("state")}
                        />
                      </View>

                      <View style={styles.inputToggleContainer}>
                        <Text style={styles.textInput}>Afficher sur le calendrier :</Text>
                        <ToogleSwitch
                          isActive={watch("todisplay")}
                          onToggle={(value) => setValue("todisplay", value)}
                        />
                      </View>

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
                              <View style={styles.containerBadgeAnimal}><Text style={styles.badgeAnimal}>Par défaut, vous recevrez une notification le jour J</Text></View>
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
  inputToggleContainer:{
    display: "flex", 
    flexDirection: "row", 
    width: "100%",
    marginBottom: 15
  },
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
    padding: 10,
  },
  containerBadgeAnimal: {
    borderRadius: 5,
    backgroundColor: Variables.rouan,
    marginRight: 5,
    marginBottom: 5
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

export default ModalEvents;
