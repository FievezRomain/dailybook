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
import { useTheme } from 'react-native-paper';
import ModalReportDeath from './Modals/ModalReportDeath';

const InformationsAnimals = ({ animal = {}, onModify, onDelete }) => {
    const [modalSubMenuAnimalActionsVisible, setModalSubMenuAnimalActionsVisible] = useState(false);
    const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
    const [modalReportDeathVisible, setModalReportDeathVisible] = useState(false);
    const dateUtils = new DateUtils();
    const [modalManageBodyAnimalVisible, setModalBodyAnimalVisible] = useState(false);
    const fileStorageService = new FileStorageService();
    const { currentUser } = useAuth();
    const { colors, fonts } = useTheme();

    function isValidString(str) {
      return str !== null && str !== undefined && str.trim() !== "";
    }
    
    const handleModify = () => {
      setModalAnimalVisible(true);
    }
  
    const handleManageBodyAnimal = () => {
      setModalBodyAnimalVisible(true);
    }

    const handleReportDeath = () => {
      setModalReportDeathVisible(true);
    }
  
    const onModifyBodyAnimalHistory = (animal) =>{
      console.log("enregitrer historique");
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
          color: colors.default_dark,
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
          color: colors.background,
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
          backgroundColor:  colors.onSurface
        },
        form: {
          backgroundColor: colors.background, 
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
          backgroundColor: colors.quaternary,
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
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return(
        <>
            <ModalSubMenuAnimalActions
                modalVisible={modalSubMenuAnimalActionsVisible}
                setModalVisible={setModalSubMenuAnimalActionsVisible}
                handleDelete={onDelete}
                handleModify={handleModify}
                handleManageBody={handleManageBodyAnimal}
                handleReportDeath={handleReportDeath}
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
            <ModalReportDeath
              isVisible={modalReportDeathVisible}
              setVisible={setModalReportDeathVisible}
              actionType={"modify"}
              animal={animal}
              onModify={onModify}
            />
            <ScrollView>
                <View style={{display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, width: "50%", alignSelf: "center"}}>
                    {/* <Text style={[{color: colors.default_dark, fontSize: 16, paddingVertical: 15}, styles.textFontBold]}>Informations</Text> */}
                    {animal.image !== null ?
                        <Image style={{height: 90, width: 90, borderRadius: 50, borderWidth: 0.1, borderColor: colors.default_dark}} source={{uri:  fileStorageService.getFileUrl( animal.image, currentUser.uid ) }} cachePolicy="disk" />
                    :
                        <View style={{height: 90, width: 90, borderRadius: 50, borderWidth: 0.1, backgroundColor: colors.default_dark, borderColor: colors.default_dark, justifyContent: "center", alignItems: "center"}}>
                            <Text style={[{color: colors.background, fontSize: 50}, styles.textFontBold]}>{animal.nom[0]}</Text>
                        </View>
                    }
                </View>
                <View style={styles.form}>
                    <View style={styles.headerCard}>
                        <TouchableOpacity onPress={() => setModalSubMenuAnimalActionsVisible(true)} >
                            <Entypo name='dots-three-horizontal' size={20} color={colors.default_dark}/>
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.formContainer}>
                      {isValidString(animal.nom) && 
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Nom de l'animal :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Vasco"
                              placeholderTextColor={colors.secondary}
                              defaultValue={animal.nom}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.espece) && 
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Espèce :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Cheval"
                              placeholderTextColor={colors.secondary}
                              defaultValue={animal.espece}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.datenaissance) && 
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Date de naissance :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : 01/01/1900"
                              keyboardType="numeric"
                              inputMode="numeric"
                              maxLength={10}
                              placeholderTextColor={colors.secondary}
                              defaultValue={(animal.datenaissance.includes("-") ?  dateUtils.dateFormatter( animal.datenaissance, "yyyy-mm-dd", "-") : animal.datenaissance)}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.datedeces) && 
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Date de décès :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : 01/01/1900"
                              keyboardType="numeric"
                              inputMode="numeric"
                              maxLength={10}
                              placeholderTextColor={colors.secondary}
                              defaultValue={new Date(animal.datedeces).toLocaleDateString()}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.numeroidentification) &&
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Numéro identification :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : XXXXXXXXX"
                              placeholderTextColor={colors.secondary}
                              defaultValue={animal.numeroidentification}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.race) &&
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Race :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Fjord"
                              placeholderTextColor={colors.secondary}
                              defaultValue={animal.race}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.sexe) &&
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Sexe :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Mâle"
                              placeholderTextColor={colors.secondary}
                              defaultValue={animal.sexe}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.couleur) &&
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Couleur :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Isabelle"
                              placeholderTextColor={colors.secondary}
                              defaultValue={animal.couleur}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.nomPere) &&
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Nom du père :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Esgard"
                              placeholderTextColor={colors.secondary}
                              defaultValue={animal.nomPere}
                              editable={false}
                          />
                        </View>
                      }
                      {isValidString(animal.nomMere) &&
                        <View style={styles.inputContainer}>
                          <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Nom de la mère :</Text>
                          <TextInput
                              style={[styles.input, styles.textFontRegular]}
                              placeholder="Exemple : Sherry"
                              placeholderTextColor={colors.secondary}
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

export default InformationsAnimals;