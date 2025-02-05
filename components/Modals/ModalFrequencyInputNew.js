import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Button from '../Button';
import { useTheme } from 'react-native-paper';

const ModalFrequencyInput = ({ label, onChange, defaultFrequencyType, defaultInputValue }) => {
    const { colors, fonts } = useTheme();
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

  const styles = StyleSheet.create({
    frequencyButton:{
        backgroundColor: colors.quaternary,
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
        backgroundColor: colors.secondary,
        paddingVertical: 15
    },
    bodyCard:{
        backgroundColor: colors.background,
        height: "100%",
    },
    headerButtonContainer:{
        borderTopStartRadius: 5,
        borderTopEndRadius: 5,
        backgroundColor: colors.quaternary,
        width: "50%",
        justifyContent: "center",
    },
    typeSelected:{
        backgroundColor: colors.neutral,
    },
    textTypeButton:{
        textAlign: "center",
    },
    textSelectedTypeButton:{
        color: colors.background,
    },
    bottomBar: {
        width: '100%',
        height: 0.3, // ou la hauteur que vous souhaitez pour votre barre
        backgroundColor: colors.text,
    },
    input: {
        width: "15%",
        borderRadius: 5,
        backgroundColor: colors.quaternary,
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
        fontFamily: fonts.default.fontFamily
    },
    textFontMedium:{
        fontFamily: fonts.bodyMedium.fontFamily
    },
    textFontBold:{
        fontFamily: fonts.bodyLarge.fontFamily
    }
    });

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
                            <Text style={styles.textFontRegular}>Le jour J</Text>
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

export default ModalFrequencyInput;
