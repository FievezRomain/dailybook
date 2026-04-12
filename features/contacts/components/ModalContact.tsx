import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { createContact, updateContact } from '../../../services/api/ContactService';
import { useAuthStore } from '../../../stores/useAuthStore';
import LoggerService from '../../../services/logs/LoggerService';
import { Divider } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalContactProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  contact?: any;
  onModify?: (data?: any) => void;
}

const ModalContact = ({ isVisible, setVisible, actionType, contact = {}, onModify = undefined }: ModalContactProps) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible) initValues();
  }, [isVisible]);

  const closeModal = () => setVisible(false);

  const resetValues = () => {
    setValue('id', undefined); setValue('nom', undefined); setValue('profession', undefined);
    setValue('telephone', undefined); setValue('email', undefined); setValue('emailproprietaire', undefined);
  };

  const initValues = () => {
    setValue('id', contact.id); setValue('nom', contact.nom); setValue('profession', contact.profession);
    setValue('telephone', contact.telephone); setValue('email', contact.email); setValue('emailproprietaire', contact.emailproprietaire);
  };

  const submitRegister = async (data: any) => {
    if (loading) return;
    setLoading(true);
    data['emailproprietaire'] = firebaseUser?.email ?? '';
    if (actionType === 'modify') {
      updateContact(String(data.id), data)
        .then((reponse) => { onModify?.(reponse); resetValues(); closeModal(); setLoading(false); })
        .catch((err) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la MAJ d\'un contact : ' + err.message); setLoading(false); });
    } else {
      createContact(data)
        .then(() => { resetValues(); closeModal(); onModify?.(); setLoading(false); })
        .catch((err) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la création d\'un contact : ' + err.message); setLoading(false); });
    }
  };

  const styles = StyleSheet.create({
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    inputContainer: { alignItems: 'center', width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.default_dark },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.quaternary, color: colors.default_dark, alignSelf: 'baseline' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={isVisible} setVisible={setVisible} arrayHeight={['90%']}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.tertiary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.default_dark }]}>Contact</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size={10} color={colors.default_dark} />
            ) : (
              <Text style={[{ color: colors.default_dark }, styles.textFontRegular]}>
                {actionType === 'modify' ? 'Modifier' : 'Créer'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <Divider />
        <KeyboardAwareScrollView style={{ height: '100%' }}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Nom : <Text style={{ color: 'red' }}>*</Text></Text>
              {errors.nom && <Text style={{ color: 'red' }}>Nom obligatoire</Text>}
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : John Doe" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('nom', text)} defaultValue={watch('nom')} {...register('nom', { required: true })} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Profession : </Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Vétérinaire" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('profession', text)} defaultValue={watch('profession')} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Numéro de téléphone : </Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 0606060606" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('telephone', text)} defaultValue={watch('telephone')} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Email : </Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : test@gmail.com" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('email', text)} defaultValue={watch('email')} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </ModalEditGeneric>
  );
};

export default ModalContact;
