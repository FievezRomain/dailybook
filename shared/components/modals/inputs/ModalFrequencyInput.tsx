import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Button from '../../ui/AppButton';
import { useAppTheme } from '../../../../theme/useAppTheme';

interface ModalFrequencyInputProps {
  label?: string;
  onChange: (value: string, type: string) => void;
  defaultFrequencyType?: string;
  defaultInputValue?: string;
}

const ModalFrequencyInput = ({ label, onChange, defaultFrequencyType, defaultInputValue }: ModalFrequencyInputProps) => {
  const { colors, fonts } = useAppTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState('');
  const [inputValue, setInputValue] = useState(defaultInputValue ?? '');
  const [frequencyType, setFrequencyType] = useState(defaultFrequencyType ?? 'days');

  const openModal = () => { setFrequencyValue(''); setModalVisible(true); };
  const closeModal = () => setModalVisible(false);

  const mapFrequencyValue = () => {
    if (inputValue === '') return;
    if (frequencyType === 'days') setFrequencyValue(`Tous les ${inputValue} jours`);
    else setFrequencyValue(`${inputValue} fois par jour`);
  };

  const handleFrequencyChange = () => {
    mapFrequencyValue();
    onChange(frequencyValue, frequencyType);
    closeModal();
  };

  const handleTypeChange = (type: string) => { setFrequencyType(type); setInputValue(''); };

  const styles = StyleSheet.create({
    frequencyButton: { backgroundColor: colors.quaternary, padding: 10, borderRadius: 5, marginBottom: 10, width: '100%', alignSelf: 'flex-start' },
    card: { borderTopStartRadius: 10, borderTopEndRadius: 10, height: '30%' },
    background: { backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', height: '100%' },
    emptyBackground: { height: '80%' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 20 },
    headerCard: { flexDirection: 'row', justifyContent: 'space-between', backgroundColor: 'rgba(0, 0, 0, 0)' },
    bodyCard: { backgroundColor: colors.background, justifyContent: 'space-evenly', height: '100%' },
    headerButtonContainer: { borderTopStartRadius: 5, borderTopEndRadius: 5, backgroundColor: colors.quaternary, width: '50%', justifyContent: 'center' },
    typeSelected: { backgroundColor: colors.quaternary },
    textTypeButton: { textAlign: 'center' },
    textSelectedTypeButton: { color: colors.background },
    bottomBar: { width: '100%', height: 0.3, backgroundColor: colors.outline },
    input: { width: '15%', borderRadius: 5, backgroundColor: colors.quaternary, color: colors.default_dark, textAlign: 'center', paddingVertical: 2 },
    informationInputContainer: { flexDirection: 'row', justifyContent: 'center' },
    keyboardAvoidingContainer: { flex: 1 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.frequencyButton}>
        <Text>{frequencyValue || 'Saisir une fréquence'}</Text>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="position">
          <View style={styles.background}>
            <TouchableOpacity style={styles.emptyBackground} onPress={closeModal} />
            <View style={styles.card}>
              <View style={styles.headerCard}>
                <View style={[styles.headerButtonContainer, (frequencyType === 'days' || frequencyType === '') && styles.typeSelected]}>
                  <TouchableOpacity onPress={() => handleTypeChange('days')}>
                    <Text style={[styles.textTypeButton, styles.textFontRegular, (frequencyType === 'days' || frequencyType === '') && styles.textSelectedTypeButton]}>Plusieurs fois dans la période</Text>
                  </TouchableOpacity>
                </View>
                <View style={[styles.headerButtonContainer, frequencyType === 'times' && styles.typeSelected]}>
                  <TouchableOpacity onPress={() => handleTypeChange('times')}>
                    <Text style={[styles.textTypeButton, styles.textFontRegular, frequencyType === 'times' && styles.textSelectedTypeButton]}>Plusieurs fois par jour</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.bottomBar} />
              <View style={styles.bodyCard}>
                <View style={styles.informationInputContainer}>
                  {(frequencyType === 'days' || frequencyType === '') && (
                    <>
                      <Text style={styles.textFontRegular}>Tous les </Text>
                      <TextInput keyboardType="numeric" inputMode="numeric" placeholder="X" style={[styles.input, styles.textFontRegular]} value={inputValue} onChangeText={setInputValue} />
                      <Text style={styles.textFontRegular}> jours</Text>
                    </>
                  )}
                  {frequencyType === 'times' && (
                    <>
                      <TextInput keyboardType="numeric" inputMode="numeric" placeholder="X" style={[styles.input, styles.textFontRegular]} value={inputValue} onChangeText={setInputValue} />
                      <Text style={styles.textFontRegular}> fois par jour</Text>
                    </>
                  )}
                </View>
                <View style={styles.buttonContainer}>
                  <Button disabled={false} size="l" type="primary" onPress={handleFrequencyChange}>
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
