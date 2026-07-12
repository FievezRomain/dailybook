import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTranslation } from 'react-i18next';
import { AppDivider, AppInput, AppSheet } from '../../../shared/components/ui';
import { useAppTheme } from '../../../theme/useAppTheme';
import { ContactFormValues, useContactForm } from '../hooks/useContactForm';
import type { Contact } from '../../../models/Contact';

interface ModalContactProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  contact?: Partial<Contact>;
  onModify?: (data?: unknown) => void;
}

const ModalContact = ({ isVisible, setVisible, actionType, contact = {}, onModify = undefined }: ModalContactProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('contacts');
  const { t: tc } = useTranslation('common');
  const { form, loading, initValues, resetValues, submit } = useContactForm(actionType, contact, onModify);
  const { register, handleSubmit, formState: { errors }, setValue, watch } = form;
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    register('nom', { required: true });
    register('profession');
    register('telephone');
    register('email');
  }, [register]);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  useEffect(() => {
    if (isVisible) initValues();
  }, [isVisible]);

  const closeModal = () => setVisible(false);

  const submitRegister = async (data: ContactFormValues) => {
    await submit(data, () => {
      resetValues();
      closeModal();
    });
  };

  const fieldValue = (name: keyof ContactFormValues) => String(watch(name) ?? '');

  const styles = {
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 14, paddingRight: 14, paddingTop: 18, paddingBottom: 10, gap: 14 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['88%']} keyboardBehavior="extend" scrollable={false} onDismiss={closeModal}>
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
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10} enableResetScrollToCoords={false}>
          <View style={styles.formContainer}>
            <AppInput
              label={t('fields.name', { defaultValue: 'Nom' })}
              required
              error={errors.nom ? t('nameRequired') : undefined}
              placeholder="Exemple : John Doe"
              value={fieldValue('nom')}
              onChangeText={(text) => setValue('nom', text, { shouldValidate: true })}
              autoCapitalize="words"
              returnKeyType="next"
            />
            <AppInput
              label={t('fields.profession', { defaultValue: 'Profession' })}
              placeholder="Exemple : Vétérinaire"
              value={fieldValue('profession')}
              onChangeText={(text) => setValue('profession', text)}
              autoCapitalize="sentences"
              returnKeyType="next"
            />
            <AppInput
              label={t('fields.phone', { defaultValue: 'Numéro de téléphone' })}
              placeholder="Exemple : 0606060606"
              value={fieldValue('telephone')}
              onChangeText={(text) => setValue('telephone', text)}
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
            />
            <AppInput
              label={t('fields.email', { defaultValue: 'Email' })}
              placeholder="Exemple : test@gmail.com"
              value={fieldValue('email')}
              onChangeText={(text) => setValue('email', text)}
              keyboardType="email-address"
              textContentType="emailAddress"
              autoCapitalize="none"
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalContact;
