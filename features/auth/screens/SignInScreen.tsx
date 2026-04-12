import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import { getFirebaseAuth } from '../../../firebase';
import { getFirebaseError } from '../../../shared/utils/FirebaseErrorUtils';
import Button from '../../../shared/components/inputs/Button';
import type { AuthStackScreenProps } from '../../../navigation/types';

const wallpaper_login = require('../../../assets/wallpaper_login.png');

type FormData = { email: string; password: string };

export default function SignInScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { colors, fonts } = useAppTheme();
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const submitLogin = async (data: FormData) => {
    try {
      setLoading(true);
      await signInWithEmailAndPassword(getFirebaseAuth(), data.email.trim(), data.password);
      navigation.navigate('Loading');
    } catch (error) {
      Toast.show({ type: 'error', position: 'top', text1: getFirebaseError(error) });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    const email = getValues('email');
    if (!email) {
      Toast.show({ type: 'error', position: 'top', text1: 'Veuillez saisir votre adresse e-mail' });
      return;
    }
    try {
      await sendPasswordResetEmail(getFirebaseAuth(), email.trim());
      Toast.show({ type: 'success', position: 'top', text1: 'Un e-mail vous a été envoyé' });
    } catch (error) {
      Toast.show({ type: 'error', position: 'top', text1: getFirebaseError(error) });
    }
  };

  const styles = StyleSheet.create({
    textInput: { alignSelf: 'flex-start', marginLeft: 35, marginBottom: 10 },
    image: { flex: 1, height: '100%', width: '100%', resizeMode: 'cover', position: 'absolute', justifyContent: 'center', backgroundColor: colors.onSurface },
    login: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    form: { paddingTop: 50, alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', width: '90%', borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' },
    title: { fontSize: 30, letterSpacing: 2, marginBottom: 20 },
    input: { height: 40, width: '80%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.quaternary, color: 'black' },
    clickableText: { marginLeft: 5, color: colors.onSurface, alignSelf: 'flex-end', justifyContent: 'flex-end', textTransform: 'uppercase' },
    forgetPassword: { flexDirection: 'row', marginBottom: 50 },
    loginButton: { marginBottom: 20, marginTop: 10, backgroundColor: colors.secondary, borderRadius: 10 },
    registerButton: { marginBottom: 30, marginTop: 10, borderRadius: 10 },
    textButton: { color: 'white', textTransform: 'uppercase' },
    errorInput: { color: 'red' },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  });

  return (
    <>
      <Image style={styles.image} source={wallpaper_login} />
      <KeyboardAwareScrollView contentContainerStyle={styles.login}>
        <Text style={[styles.title, styles.textFontRegular]}>Connexion</Text>
        <View style={styles.form}>
          {errors.email && <Text style={[styles.errorInput, styles.textFontRegular]}>Identifiant obligatoire</Text>}
          <Text style={[styles.textInput, styles.textFontRegular]}>Identifiant :</Text>
          <TextInput
            style={[styles.input, styles.textFontRegular]}
            placeholder="Email"
            placeholderTextColor={colors.secondary}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setValue('email', text)}
            {...register('email', { required: true, pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' } })}
          />
          {errors.password && <Text style={[styles.errorInput, styles.textFontRegular]}>Mot de passe obligatoire</Text>}
          <Text style={[styles.textInput, styles.textFontRegular]}>Mot de passe :</Text>
          <View style={[{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }, styles.input]}>
            <TextInput
              style={[styles.textFontRegular, { width: '90%' }]}
              placeholder="Mot de passe"
              placeholderTextColor={colors.secondary}
              secureTextEntry={!isPasswordVisible}
              onChangeText={(text) => setValue('password', text)}
              defaultValue={getValues('password')}
              {...register('password', { required: true })}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible((v) => !v)} style={{ alignSelf: 'center' }}>
              <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} />
            </TouchableOpacity>
          </View>

          <View style={styles.loginButton}>
            {!loading ? (
              <Button onPress={handleSubmit(submitLogin)} type="quaternary" size="l">
                <Text style={[styles.textButton, styles.textFontMedium]}>Je me connecte</Text>
              </Button>
            ) : (
              <Button type="quaternary" size="m">
                <ActivityIndicator size="large" color={colors.background} />
              </Button>
            )}
          </View>

          <View style={styles.forgetPassword}>
            <TouchableOpacity onPress={handlePasswordReset}>
              <Text style={[styles.clickableText, styles.textFontMedium]}>Mot de passe oublié ?</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerButton}>
            <Button onPress={() => navigation.navigate('Register')} type="primary" size="m">
              <Text style={[styles.textButton, styles.textFontMedium]}>Pas de compte ? S'inscrire</Text>
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}
