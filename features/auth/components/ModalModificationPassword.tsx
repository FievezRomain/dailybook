import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../stores/useAuthStore';
import { authService } from '../../../services/auth/FirebaseAuthService';
import LoggerService from '../../../services/logs/LoggerService';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import { updatePasswordSchema } from '../../../business/validators/auth';

interface ModalModificationPasswordProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  onModify?: () => void;
}

const ModalModificationPassword = ({ isVisible, setVisible, onModify = undefined }: ModalModificationPasswordProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
  const { firebaseUser } = useAuthStore();
  const { handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isPasswordVisible] = useState(false);

  const closeModal = () => { setCurrentPassword(''); setPasswordRepeat(''); setPassword(''); setVisible(false); };
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  const checkPasswordValidity = () => {
    const result = updatePasswordSchema.safeParse({
      currentPassword,
      newPassword: password,
      confirmPassword: passwordRepeat,
    });
    if (!result.success) {
      const firstIssue = result.error.issues[0];
      const messageKey = firstIssue?.message ?? 'errors.passwordRequired';
      Toast.show({ type: 'error', position: 'top', text1: t(messageKey as never) });
      return false;
    }
    return true;
  };

  const submitRegister = async (_data: unknown) => {
    if (loading) return;
    setLoading(true);
    if (checkPasswordValidity()) {
      try {
        if (password !== '') {
          try {
            await authService.reauthenticate(firebaseUser!.email!, currentPassword);
            await authService.updatePassword(password);
            closeModal();
            onModify?.();
          } catch {
            Toast.show({ type: 'error', position: 'top', text1: t('currentPasswordIncorrect') });
          }
        }
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        LoggerService.log('Erreur lors de la MAJ d\'un utilisateur sur Firebase : ' + message);
      }
    }
    setLoading(false);
  };

  const styles = {
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10, height: '100%' },
    inputContainer: { alignItems: 'center', width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5 },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, alignSelf: 'baseline' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['70%']} keyboardBehavior="extend" onDismiss={closeModal}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>{tc('cancel')}</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { color: colors.textPrimary }]}>{t('password')}</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.textPrimary} /> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('edit')}</Text>}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView extraScrollHeight={-150} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <View style={{ marginBottom: 10 }}>
              <Text style={[styles.textFontBold, { marginBottom: 5, color: colors.textPrimary }]}>{t('passwordSecureTitle')}</Text>
              <Text style={{ color: colors.textPrimary }}>{t('passwordSecureDesc')}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular, { color: colors.textPrimary }]}>Mot de passe actuel : </Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="******" placeholderTextColor={colors.secondary} secureTextEntry={!isPasswordVisible} onChangeText={(text) => setCurrentPassword(text)} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular, { color: colors.textPrimary }]}>Nouveau mot de passe : </Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="******" placeholderTextColor={colors.secondary} secureTextEntry={!isPasswordVisible} onChangeText={(text) => setPassword(text)} />
            </View>
            <View style={styles.inputContainer}>
              {password !== '' && (
                <>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Confirmer le nouveau mot de passe : </Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="******" placeholderTextColor={colors.secondary} secureTextEntry={!isPasswordVisible} onChangeText={(text) => setPasswordRepeat(text)} />
                </>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalModificationPassword;
