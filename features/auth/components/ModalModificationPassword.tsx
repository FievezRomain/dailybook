import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../stores/useAuthStore';
import { authService } from '../../../services/auth/FirebaseAuthService';
import LoggerService from '../../../services/logs/LoggerService';
import { Divider } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalModificationPasswordProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  onModify?: () => void;
}

const ModalModificationPassword = ({ isVisible, setVisible, onModify = undefined }: ModalModificationPasswordProps) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const { handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const closeModal = () => { setCurrentPassword(''); setPasswordRepeat(''); setPassword(''); setVisible(false); };

  const checkPasswordValidity = () => {
    if (currentPassword === '') { Toast.show({ type: 'error', position: 'top', text1: 'Veuillez saisir votre mot de passe actuel' }); return false; }
    if (password === '') { Toast.show({ type: 'error', position: 'top', text1: 'Veuillez saisir un nouveau mot de passe' }); return false; }
    if (password !== passwordRepeat) { Toast.show({ type: 'error', position: 'top', text1: 'Confirmation du mot de passe incorrect' }); return false; }
    if (password.length < 6) { Toast.show({ type: 'error', position: 'top', text1: 'Format du nouveau mot de passe incorrect' }); return false; }
    return true;
  };

  const submitRegister = async (_data: any) => {
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
            Toast.show({ type: 'error', position: 'top', text1: 'Mot de passe actuel incorrect' });
          }
        }
      } catch (error: any) {
        LoggerService.log('Erreur lors de la MAJ d\'un utilisateur sur Firebase : ' + error.message);
      }
    }
    setLoading(false);
  };

  const styles = StyleSheet.create({
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10, height: '100%' },
    inputContainer: { alignItems: 'center', width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5 },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.quaternary, color: colors.default_dark, alignSelf: 'baseline' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={isVisible} setVisible={setVisible} arrayHeight={['70%']}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.tertiary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { color: colors.default_dark }]}>Mot de passe</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.default_dark} /> : <Text style={[{ color: colors.default_dark }, styles.textFontRegular]}>Modifier</Text>}
          </TouchableOpacity>
        </View>
        <Divider />
        <KeyboardAwareScrollView extraScrollHeight={-150} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <View style={{ marginBottom: 10 }}>
              <Text style={[styles.textFontBold, { marginBottom: 5, color: colors.default_dark }]}>Choisissez un mot de passe sécurisé.</Text>
              <Text style={{ color: colors.default_dark }}>Utilisez au moins 6 caractères, avec une combinaison de lettres, chiffres et symboles pour renforcer sa sécurité. Gardez-le secret et ne le partagez jamais.</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular, { color: colors.default_dark }]}>Mot de passe actuel : </Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="******" placeholderTextColor={colors.secondary} secureTextEntry={!isPasswordVisible} onChangeText={(text) => setCurrentPassword(text)} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular, { color: colors.default_dark }]}>Nouveau mot de passe : </Text>
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
    </ModalEditGeneric>
  );
};

export default ModalModificationPassword;
