import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { createContact, updateContact } from '../../../services/api/ContactService';
import { useAuthStore } from '../../../stores/useAuthStore';
import LoggerService from '../../../services/logs/LoggerService';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

interface ModalContactProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  contact?: any;
  onModify?: (data?: any) => void;
}

const ModalContact = ({ isVisible, setVisible, actionType, contact = {}, onModify = undefined }: ModalContactProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('contacts');
  const { t: tc } = useTranslation('common');
  const { firebaseUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

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

  const styles = {
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    inputContainer: { alignItems: 'center', width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.textPrimary },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, alignSelf: 'baseline' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['90%']} keyboardBehavior="extend" onDismiss={closeModal}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>{tc('cancel')}</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.textPrimary }]}>{t('modalTitle')}</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? (
              <ActivityIndicator size={10} color={colors.textPrimary} />
            ) : (
              <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>
                {actionType === 'modify' ? tc('edit') : tc('create')}
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView style={{ height: '100%' }}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Nom : <Text style={{ color: colors.error }}>*</Text></Text>
              {errors.nom && <Text style={{ color: colors.error }}>{t('nameRequired')}</Text>}
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
    </AppSheet>
  );
};

export default ModalContact;
