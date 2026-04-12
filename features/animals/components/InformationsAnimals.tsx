import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import variables from "../../../styles/Variables";
import { Entypo, FontAwesome6 } from '@expo/vector-icons';
import ModalSubMenuAnimalActions from './ModalSubMenuAnimalActions';
import ModalAnimal from './ModalAnimal';
import { Image } from "expo-image";
import { useAuthStore } from "../../../stores/useAuthStore";
import FileStorageService from "../../../services/aws/FileStorageService";
import { useAppTheme } from '../../../theme/useAppTheme';
import ModalReportDeath from './ModalReportDeath';
import { format } from 'date-fns'
import instanceDateUtils from '../../../shared/utils/DateUtils';

const InformationsAnimals = ({ animal = {} as any, onModify, onDelete }: any) => {
    const [modalSubMenuAnimalActionsVisible, setModalSubMenuAnimalActionsVisible] = useState(false);
    const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
    const [modalReportDeathVisible, setModalReportDeathVisible] = useState(false);
    const fileStorageService = new FileStorageService();
    const { firebaseUser } = useAuthStore();
    const { colors, fonts } = useAppTheme();

    function isValidString(str: any) {
      return str !== null && str !== undefined && str.trim() !== "";
    }
    
    const handleModify = () => {
      setModalAnimalVisible(true);
    }

    const handleReportDeath = () => {
      setModalReportDeathVisible(true);
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
          backgroundColor: (variables as any).bouton,
          borderRadius: 10
        },
        imagePrez:{
          height: "90%",
          width: "100%"
        },
        screenContainer:{
          backgroundColor: (variables as any).fond,
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
          shadowColor: colors.default_dark,
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
          color: colors.default_dark,
          alignSelf: "baseline"
        },
        inputTextArea: {
          height: 100,
          width: "100%",
          marginBottom: 15,
          borderRadius: 5,
          paddingLeft: 15,
          paddingRight: 15,
          backgroundColor: colors.quaternary,
          color: colors.default_dark,
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
                handleReportDeath={handleReportDeath}
            />
            <ModalAnimal
                actionType={"modify"}
                isVisible={modalAnimalVisible}
                setVisible={setModalAnimalVisible}
                animal={animal}
                onModify={onModify}
            />
            <ModalReportDeath
              isVisible={modalReportDeathVisible}
              setVisible={setModalReportDeathVisible}
              actionType={"modify"}
              animal={animal}
              onModify={onModify}
            />
              <View style={{display: "flex", flexDirection: "column", alignItems: "center", zIndex: 1, width: "50%", alignSelf: "center"}}>
                  {animal.image !== null ?
                      <Image style={{height: 90, width: 90, borderRadius: 50, borderWidth: 0.1, borderColor: colors.default_dark}} source={{uri:  fileStorageService.getFileUrl( animal.image, firebaseUser?.uid ?? '' ) }} cachePolicy="disk" />
                  :
                      <View style={{height: 90, width: 90, borderRadius: 50, borderWidth: 0.1, backgroundColor: colors.default_dark, borderColor: colors.default_dark, justifyContent: "center", alignItems: "center"}}>
                          <Text style={[{color: colors.background, fontSize: 50}, styles.textFontBold]}>{animal.nom[0]}</Text>
                      </View>
                  }
              </View>
              <View style={styles.form}>
                
                  <View style={styles.headerCard}>
                      <TouchableOpacity onPress={() => setModalSubMenuAnimalActionsVisible(true)} disabled={animal.provenance === "group"}>
                          <Entypo name='dots-three-horizontal' size={20} color={animal.provenance === "group" ? colors.background : colors.default_dark}/>
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
                            defaultValue={(animal.datenaissance.includes("-") ?  instanceDateUtils.dateFormatter( animal.datenaissance, "yyyy-mm-dd", "-") : animal.datenaissance)}
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
                            defaultValue={format(new Date(animal.datedeces), 'dd/MM/yyyy')}
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
                    {isValidString(animal.datearrivee) && 
                      <View style={styles.inputContainer}>
                        <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Date d'arrivée :</Text>
                        <TextInput
                            style={[styles.input, styles.textFontRegular]}
                            placeholder="Exemple : 01/01/1900"
                            keyboardType="numeric"
                            inputMode="numeric"
                            maxLength={10}
                            placeholderTextColor={colors.secondary}
                            defaultValue={(animal.datearrivee.includes("-") ?  instanceDateUtils.dateFormatter( animal.datearrivee, "yyyy-mm-dd", "-") : animal.datearrivee)}
                            editable={false}
                        />
                      </View>
                    }
                    {isValidString(animal.datedepart) && 
                      <View style={styles.inputContainer}>
                        <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Date de départ :</Text>
                        <TextInput
                            style={[styles.input, styles.textFontRegular]}
                            placeholder="Exemple : 01/01/1900"
                            keyboardType="numeric"
                            inputMode="numeric"
                            maxLength={10}
                            placeholderTextColor={colors.secondary}
                            defaultValue={(animal.datedepart.includes("-") ?  instanceDateUtils.dateFormatter( animal.datedepart, "yyyy-mm-dd", "-") : animal.datedepart)}
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
                    {isValidString(animal.nompere) &&
                      <View style={styles.inputContainer}>
                        <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Nom du père :</Text>
                        <TextInput
                            style={[styles.input, styles.textFontRegular]}
                            placeholder="Exemple : Esgard"
                            placeholderTextColor={colors.secondary}
                            defaultValue={animal.nompere}
                            editable={false}
                        />
                      </View>
                    }
                    {isValidString(animal.nommere) &&
                      <View style={styles.inputContainer}>
                        <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Nom de la mère :</Text>
                        <TextInput
                            style={[styles.input, styles.textFontRegular]}
                            placeholder="Exemple : Sherry"
                            placeholderTextColor={colors.secondary}
                            defaultValue={animal.nommere}
                            editable={false}
                        />
                      </View>
                    }
                    {isValidString(animal.informations) &&
                      <View style={styles.inputContainer}>
                        <Text style={[{color: colors.default_dark}, styles.textInput, styles.textFontRegular]}>Informations supplémentaires :</Text>
                        <TextInput
                            style={[styles.inputTextArea, styles.textFontRegular]}
                            multiline={true}
                            numberOfLines={4}
                            placeholder="Exemple : Allergique aux incariens"
                            placeholderTextColor={colors.secondary}
                            defaultValue={animal.informations}
                            editable={false}
                        />
                      </View>
                    }
                  </View>
              </View>
        </>
    )
}

export default InformationsAnimals;
