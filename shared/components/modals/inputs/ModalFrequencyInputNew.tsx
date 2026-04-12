import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, KeyboardAvoidingView } from 'react-native';
import Button from '../../inputs/Button';
import { useTheme } from 'react-native-paper';

interface ModalFrequencyInputNewProps {
  label?: string;
  onChange: (value: string, type: string) => void;
  defaultFrequencyType?: string;
  defaultInputValue?: string;
}

const ModalFrequencyInputNew = ({ label, onChange, defaultFrequencyType, defaultInputValue }: ModalFrequencyInputNewProps) => {
  const { colors, fonts } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [frequencyValue, setFrequencyValue] = useState('');
  const [inputValue, setInputValue] = useState(defaultInputValue ?? '');
  const [frequencyType, setFrequencyType] = useState(defaultFrequencyType ?? 'days');

  const openModal = () => { setFrequencyValue(''); setModalVisible(true); };
  const closeModal = () => setModalVisible(false);

  const handleFrequencyChange = () => {
    onChange(frequencyValue, frequencyType);
    closeModal();
  };

  const styles = StyleSheet.create({
    frequencyButton: { backgroundColor: (colors as any).quaternary, padding: 10, borderRadius: 5, marginBottom: 10, width: '100%', alignSelf: 'flex-start' },
    card: { borderTopStartRadius: 10, borderTopEndRadius: 10, height: '50%' },
    background: { backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'flex-end', height: '100%' },
    emptyBackground: { height: '80%' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5, marginBottom: 20 },
    headerCard: { flexDirection: 'row', justifyContent: 'center', backgroundColor: colors.secondary, paddingVertical: 15 },
    bodyCard: { backgroundColor: colors.background, height: '100%' },
    headerButtonContainer: { borderTopStartRadius: 5, borderTopEndRadius: 5, backgroundColor: (colors as any).quaternary, width: '50%', justifyContent: 'center' },
    typeSelected: { backgroundColor: (colors as any).neutral },
    textTypeButton: { textAlign: 'center' },
    textSelectedTypeButton: { color: colors.background },
    bottomBar: { width: '100%', height: 0.3, backgroundColor: colors.outline },
    keyboardAvoidingContainer: { flex: 1 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <>
      <TouchableOpacity onPress={openModal} style={styles.frequencyButton}>
        <Text style={styles.textFontRegular}>{frequencyValue || 'Saisir une fréquence'}</Text>
      </TouchableOpacity>
      <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <KeyboardAvoidingView style={styles.keyboardAvoidingContainer} behavior="position">
          <View style={styles.background}>
            <TouchableOpacity style={styles.emptyBackground} onPress={closeModal} />
            <View style={styles.card}>
              <View style={styles.headerCard}>
                <Text style={styles.textFontRegular}>Saisir la fréquence des soins</Text>
              </View>
              <View style={styles.bottomBar} />
              <View style={styles.bodyCard}>
                <View>
                  {['Le jour J', 'Tous les jours', 'Toutes les semaines', 'Toutes les 2 semaines', 'Tous les mois', 'Tous les ans', 'Personnaliser'].map((opt) => (
                    <View key={opt}><Text style={styles.textFontRegular}>{opt}</Text></View>
                  ))}
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

export default ModalFrequencyInputNew;
