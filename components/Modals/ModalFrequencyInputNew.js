import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Variables from '../styles/Variables';
import Button from '../Button';

const ModalFrequencyInput = ({ label, onChange, defaultFrequencyType, defaultInputValue }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState('');
  const [inputValue, setInputValue] = useState(defaultInputValue == undefined || defaultInputValue == null ? '' : defaultInputValue);
  const [frequencyType, setFrequencyType] = useState(defaultFrequencyType == undefined || defaultFrequencyType == null ? 'days' : defaultFrequencyType);

  const openModal = () => {
    setFrequencyValue('');
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleFrequencyChange = () => {
    mapFrequencyValue();
    onChange(frequencyValue, frequencyType);
    closeModal();
  };

  const mapFrequencyValue = () =>{
    var newFrequency = "";
    if(inputValue == ""){
        return;
    }
    if(frequencyType === "days"){
        newFrequency = `Tous les ${inputValue} jours`;
    }else{
        newFrequency = `${inputValue} fois par jour`;
    }

    setFrequencyValue(newFrequency);
  }

  const handleTypeChange = (type) => {
    setFrequencyType(type);
    setInputValue('');
  };

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.frequencyButton}>
        <Text style={styles.textFontRegular}>{frequencyValue || 'Saisir une fréquence'}</Text>
      </TouchableOpacity>
      
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="position">
        <View style={styles.background}>
            <TouchableOpacity
            style={styles.emptyBackground}
            onPress={closeModal}
            ></TouchableOpacity>

            <View style={styles.card}>

                <View style={styles.headerCard}>
                    <Text style={styles.textFontRegular}>Saisir la fréquence des soins</Text>
                </View>
                <View style={styles.bottomBar} />

                
                <View style={styles.bodyCard}>
                    
                    <View>

                        <View>
                            <Text style={styles.textFontRegular}>Jamais</Text>
                        </View>

                        <View>
                            <Text style={styles.textFontRegular}>Tous les jours</Text>
                        </View>

                        <View>
                            <Text style={styles.textFontRegular}>Toutes les semaines</Text>
                        </View>

                        <View>
                            <Text style={styles.textFontRegular}>Toutes les 2 semaines</Text>
                        </View>

                        <View>
                            <Text style={styles.textFontRegular}>Tous les mois</Text>
                        </View>

                        <View>
                            <Text style={styles.textFontRegular}>Tous les ans</Text>
                        </View>

                        <View>
                            <Text style={styles.textFontRegular}>Personnaliser</Text>
                        </View>
                    </View>
                    

                    <View style={styles.buttonContainer}>
                        <Button
                            disabled={false}
                            size={"l"}
                            type={"primary"}
                            onPress={handleFrequencyChange}
                        >
                        <Text style={styles.textFontMedium}>OK</Text>
                        </Button>
                    </View>
                </View>

            </View>

        </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
    frequencyButton:{
        backgroundColor: Variables.rouan,
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: "100%",
        alignSelf: "flex-start"
    },
    card: {
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        height: "50%",
        //flexDirection: "row wrap"
    },
    background: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: "flex-end",
        height: "100%",
    },
    emptyBackground: {
        height: "80%",
    },
    buttonContainer:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 5,
        marginBottom: 20
    },
    headerCard:{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        backgroundColor: Variables.pinterest,
        paddingVertical: 15
    },
    bodyCard:{
        backgroundColor: Variables.blanc,
        height: "100%",
    },
    headerButtonContainer:{
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        backgroundColor: Variables.rouan,
        width: "50%",
        justifyContent: "center",
    },
    typeSelected:{
        backgroundColor: Variables.isabelle,
    },
    textTypeButton:{
        textAlign: "center",
    },
    textSelectedTypeButton:{
        color: Variables.blanc,
    },
    bottomBar: {
        width: '100%',
        height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
        backgroundColor: Variables.souris,
    },
    input: {
        width: "15%",
        borderRadius: 5,
        backgroundColor: Variables.rouan,
        color: "black",
        textAlign: "center",
        paddingVertical: 2
      },
    informationInputContainer:{
        display: "flex",
        flexDirection: "row",
        textAlign: "center",
        justifyContent: "center"
    },
    keyboardAvoidingContainer: {
        flex: 1,
    },
    textFontRegular:{
        fontFamily: Variables.fontRegular
    },
    textFontMedium:{
        fontFamily: Variables.fontMedium
    },
    textFontBold:{
        fontFamily: Variables.fontBold
    }
});

export default ModalFrequencyInput;
