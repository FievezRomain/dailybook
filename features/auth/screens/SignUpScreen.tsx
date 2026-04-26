import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import { useAppTheme } from '../../../theme/useAppTheme';
import { authService } from '../../../services/auth/FirebaseAuthService';
import { getFirebaseError } from '../../../shared/utils/FirebaseErrorUtils';
import { register as apiRegister } from '../../../services/api/AuthService';
import Back from '../../../shared/components/common/Back';
import Button from '../../../shared/components/inputs/Button';
import type { AuthStackScreenProps } from '../../../navigation/types';

const wallpaper_login = require('../../../assets/wallpaper_login.png');

type FormData = { email: string; prenom: string; password: string; password_confirm: string };

export default function SignUpScreen({ navigation }: AuthStackScreenProps<'Register'>) {
  const { colors, fonts } = useAppTheme();
  const [evenPassword, setEvenPassword] = useState(true);
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const submitRegister = async (data: FormData) => {
    if (loading) return;
    try {
      setLoading(true);
      if (data.password !== data.password_confirm) {
        setEvenPassword(false);
        return;
      }
      setEvenPassword(true);

      await authService.signUp(data.email.trim(), data.password, data.prenom);

      await apiRegister({ email: data.email, prenom: data.prenom });
      navigation.navigate('VerifyEmail');
      Toast.show({ type: 'success', position: 'top', text1: 'Enregistrement réussi' });
    } catch (err) {
      Toast.show({ type: 'error', position: 'top', text1: getFirebaseError(err) });
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    textInput: { alignSelf: 'flex-start', marginLeft: 35, marginBottom: 10 },
    image: { flex: 1, height: '100%', width: '100%', resizeMode: 'cover', position: 'absolute', justifyContent: 'center' },
    register: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    form: { paddingTop: 50, alignItems: 'center', backgroundColor: colors.surface, justifyContent: 'center', width: '90%', top: -(Constants.statusBarHeight + 10), borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' },
    title: { top: -(Constants.statusBarHeight + 10), color: colors.default_dark, fontSize: 30, letterSpacing: 2, marginBottom: 20 },
    input: { height: 40, width: '80%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.quaternary, color: 'black' },
    registerButton: { marginBottom: 20, marginTop: 10, borderRadius: 10 },
    textButton: { color: 'white' },
    errorInput: { color: 'red', textAlign: 'center' },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  });

  return (
    <>
      <Image style={styles.image} source={wallpaper_login} />
      <View style={{ height: '100%', width: '100%', paddingTop: Constants.statusBarHeight + 10 }}>
        <Back isWithBackground />
        <KeyboardAwareScrollView contentContainerStyle={styles.register}>
          <Text style={[styles.title, styles.textFontRegular]}>S'inscrire</Text>
          <View style={styles.form}>
            {errors.email && <Text style={[styles.errorInput, styles.textFontRegular]}>Email obligatoire</Text>}
            <Text style={[styles.textInput, styles.textFontRegular]}>Email :</Text>
            <TextInput
              style={[styles.input, styles.textFontRegular]}
              placeholder="Email"
              placeholderTextColor={colors.secondary}
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={(text) => setValue('email', text)}
              {...register('email', { required: true, pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' } })}
            />
            {errors.prenom && <Text style={[styles.errorInput, styles.textFontRegular]}>Prénom obligatoire</Text>}
            <Text style={[styles.textInput, styles.textFontRegular]}>Prénom :</Text>
            <TextInput
              style={[styles.input, styles.textFontRegular]}
              placeholder="Votre prénom"
              placeholderTextColor={colors.secondary}
              onChangeText={(text) => setValue('prenom', text)}
              defaultValue={getValues('prenom')}
              {...register('prenom', { required: true })}
            />
            {errors.password && <Text style={[styles.errorInput, styles.textFontRegular]}>Le mot de passe doit contenir au moins 6 caractères</Text>}
            <Text style={[styles.textInput, styles.textFontRegular]}>Mot de passe :</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }, styles.input]}>
              <TextInput
                style={[styles.textFontRegular, { width: '90%' }]}
                placeholder="Mot de passe"
                placeholderTextColor={colors.secondary}
                secureTextEntry={!isPasswordVisible}
                onChangeText={(text) => setValue('password', text)}
                defaultValue={getValues('password')}
                {...register('password', { required: true, minLength: 6 })}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible((v) => !v)} style={{ alignSelf: 'center' }}>
                <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} />
              </TouchableOpacity>
            </View>
            {errors.password_confirm && <Text style={[styles.errorInput, styles.textFontRegular]}>Confirmation du mot de passe obligatoire</Text>}
            {!evenPassword && <Text style={[styles.errorInput, styles.textFontRegular]}>Mots de passe différents</Text>}
            <Text style={[styles.textInput, styles.textFontRegular]}>Confirmation du mot de passe :</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }, styles.input]}>
              <TextInput
                style={[styles.textFontRegular, { width: '90%' }]}
                placeholder="Confirmation mot de passe"
                placeholderTextColor={colors.secondary}
                secureTextEntry={!isPasswordVisible}
                onChangeText={(text) => setValue('password_confirm', text)}
                defaultValue={getValues('password_confirm')}
                {...register('password_confirm', { required: true })}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible((v) => !v)} style={{ alignSelf: 'center' }}>
                <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} />
              </TouchableOpacity>
            </View>
            <View style={styles.registerButton}>
              {!loading ? (
                <Button onPress={handleSubmit(submitRegister)} type="quaternary" size="m">
                  <Text style={[styles.textButton, styles.textFontMedium]}>S'enregistrer</Text>
                </Button>
              ) : (
                <Button type="quaternary" size="m">
                  <ActivityIndicator size="large" color={colors.background} />
                </Button>
              )}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
}
