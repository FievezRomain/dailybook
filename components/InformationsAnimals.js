import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import variables from "./styles/Variables";
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import ModalSubMenuAnimalActions from './Modals/ModalSubMenuAnimalActions';
import ModalAnimal from './Modals/ModalAnimal';
import ModalManageBodyAnimal from './Modals/ModalManageBodyAnimal';
import DateUtils from '../utils/DateUtils';
import { Image } from "expo-image";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import FileStorageService from "../services/FileStorageService";

const InformationsAnimals = ({ animal = {}, onModify, onDelete }) => {
    const [modalSubMenuAnimalActionsVisible, setModalSubMenuAnimalActionsVisible] = useState(false);
    const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
    const dateUtils = new DateUtils();
    const [modalManageBodyAnimalVisible, setModalBodyAnimalVisible] = useState(false);
    const fileStorageService = new FileStorageService();
    const { currentUser } = useAuth();

    function isValidString(str) {
      return str !== null && str !== undefined && str.trim() !== "";
    }
    
    const handleModify = () => {
      setModalAnimalVisible(true);
    }
  
    const handleManageBodyAnimal = () => {
      setModalBodyAnimalVisible(true);
    }
  
    const onModifyBodyAnimalHistory = (animal) =>{
      console.log("enregitrer historique");
    }

    return(
        <>
            <ModalSubMenuAnimalActions
                modalVisible={modalSubMenuAnimalActionsVisible}
                setModalVisible={setModalSubMenuAnimalActionsVisible}
                handleDelete={onDelete}
                handleModify={handleModify}
                handleManageBody={handleManageBodyAnimal}
            />
            <ModalAnimal
                actionType={"modify"}
                isVisible={modalAnimalVisible}
                setVisible={setModalAnimalVisible}
                animal={animal}
                onModify={onModify}
            />
            <ModalManageBodyAnimal
                isVisible={modalManageBodyAnimalVisible}
                setVisible={setModalBodyAnimalVisible}
                animal={animal}
                onModify={onModifyBodyAnimalHistory}
            />
            <ScrollView>
                <View style={{display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, width: "50%", alignSelf: "center"}}>
                    <Text style={[{color: variables.bai, fontSize: 16, paddingVertical: 15}, styles.textFontBold]}>Informations</Text>
                    {animal.image !== null ?
                        <Image style={{height: 90, width: 90, borderRadius: 50, borderWidth: 0.1, borderColor: variables.bai}} source={{uri:  fileStorageService.getFileUrl( animal.image, currentUser.uid ) }} cachePolicy="disk" />
                    :
                        <View style={{height: 90, width: 90, borderRadius: 50, borderWidth: 0.1, backgroundColor: variables.bai, borderColor: variables.bai, justifyContent: "center", alignItems: "center"}}>
                            <Text style={[{color: variables.blanc, fontSize: 50}, styles.textFontBold]}>{animal.nom[0]}</Text>
                        </View>
                    }
                </View>
                <View style={styles.form}>
                    <View style={styles.headerCard}>
                        <TouchableOpacity onPress={() => setModalSubMenuAnimalActionsVisible(true)} >
                            <Entypo name='dots-three-horizontal' size={20} />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.formContainer}>
                      {isValidString(animal.nom) && 
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Nom de l'animal :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Vasco"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.nom}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.espece) && 
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Espèce :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Cheval"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.espece}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.datenaissance) && 
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Date de naissance :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : 01/01/1900"
                              keyboardType="numeric"
                              maxLength={10}
                              placeholderTextColor={variables.gris}
                              defaultValue={(animal.datenaissance.includes("-") ?  dateUtils.dateFormatter( animal.datenaissance, "yyyy-mm-dd", "-") : animal.datenaissance)}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.numeroidentification) &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Numéro identification :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : XXXXXXXXX"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.numeroidentification}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.race) &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Race :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Fjord"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.race}
                              editable={false}
                          />
                        </View>
                      }
                      {animal.taille != null && animal.taille != undefined &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Taille (cm) :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : 140"
                              keyboardType="numeric"
                              placeholderTextColor={variables.gris}
                              defaultValue={String(animal.taille)}
                              editable={false}
                          />
                        </View>
                      }
                      {animal.poids != null && animal.poids != undefined &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Poids (kg) :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : 400"
                              keyboardType="numeric"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.poids != null ? String(animal.poids) : undefined}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.sexe) &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Sexe :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Mâle"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.sexe}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.food) &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Nom alimentation :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Granulés X"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.food}
                              editable={false}
                          />
                        </View>
                      }
                      {animal.quantity != null && animal.quantity != undefined &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Quantité (gramme / cl) :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : 200"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.quantity != null ? String(animal.quantity) : undefined}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.couleur) &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Couleur :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Isabelle"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.couleur}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.nomPere) &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Nom du père :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Esgard"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.nomPere}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.nomMere) &&
                        <View style={styles.inputContainer}>
                          <Text style={[styles.textInput, styles.textFontRegular]}>Nom de la mère :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Sherry"
                              placeholderTextColor={variables.gris}
                              defaultValue={animal.nomMere}
                              editable={false}
                          />
                        </View>
                      }
                    </View>
                </View>
            </ScrollView>
        </>
    )
}

const styles = StyleSheet.create({
    headerCard:{
        alignItems: "flex-end", 
        marginRight: 20, 
        marginTop: 10
      },
      titleCard:{
        alignItems: "center", 
        flex: 1
      },
      title:{
        color: variables.bai,
      },
      errorInput: {
        color: "red"
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
      textButton:{
        color: "white"
      },
      registerButton: {
        marginBottom: 20,
        marginTop: 10,
        backgroundColor: variables.bouton,
        borderRadius: 10
      },
      imagePrez:{
        height: "90%",
        width: "100%"
      },
      screenContainer:{
        backgroundColor: variables.fond,
      },
      contentContainer:{
        display: "flex",
        height: "90%",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      },
      image: {
        flex: 1,
        height: "100%",
        width: "100%",
        resizeMode: "cover",
        position: "absolute",
        justifyContent: "center",
        backgroundColor:  variables.default
      },
      form: {
        backgroundColor: variables.blanc, 
        width: "90%", 
        alignSelf: "center", 
        borderRadius: 10, 
        top: -35, 
        zIndex: 0,
        shadowColor: "black",
        shadowOpacity: 0.1,
        elevation: 1,
        shadowRadius:5,
        shadowOffset:{width:0, height:2}
      },
      formContainer:{
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 10,
        paddingBottom: 10,
      },
      inputContainer:{
        alignItems: "center",
        width: "100%"
      },
      textInput:{
        alignSelf: "flex-start",
        marginBottom: 5
      },
      input: {
        height: 40,
        width: "100%",
        marginBottom: 15,
        borderRadius: 5,
        paddingLeft: 15,
        backgroundColor: variables.rouan,
        color: "black",
        alignSelf: "baseline"
      },
      avatar: {
        width: 60,
        height: 60,
        borderRadius: 50,
        borderWidth: 2,
        zIndex: 1,
      },
      imageContainer:{
        flexDirection: "row",
        alignSelf: "flex-start",
        marginTop: 5,
        marginBottom: 15
      },
      datePicker:{
        marginBottom: 10,
        alignSelf: "flex-start",
        borderRadius: 5,
      },
      textFontRegular:{
          fontFamily: variables.fontRegular
      },
      textFontMedium:{
          fontFamily: variables.fontMedium
      },
      textFontBold:{
          fontFamily: variables.fontBold
      }
});

export default InformationsAnimals;