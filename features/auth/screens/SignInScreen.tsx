import type { AuthStackScreenProps } from '../../../navigation/types';
import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/useAppTheme';
import { authService } from '../../../services/auth/FirebaseAuthService';
import { getFirebaseError } from '../../../shared/utils/FirebaseErrorUtils';
import Button from '../../../shared/components/ui/AppButton';
import SocialAuthButtons from '../components/SocialAuthButtons';
import { signInSchema, type SignInInput } from '../../../business/validators/auth';

const wallpaper_login = require('../../../assets/wallpaper_login.png');

export default function SignInScreen({ navigation }: AuthStackScreenProps<'Login'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('auth');
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const submitLogin = async (data: SignInInput) => {
    try {
      setLoading(true);
      await authService.signIn(data.email.trim(), data.password);
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
      Toast.show({ type: 'error', position: 'top', text1: t('enterEmailFirst') });
      return;
    }
    try {
      await authService.sendPasswordResetEmail(email.trim());
      Toast.show({ type: 'success', position: 'top', text1: t('emailSent') });
    } catch (error) {
      Toast.show({ type: 'error', position: 'top', text1: getFirebaseError(error) });
    }
  };

  const styles = {
    textInput: { alignSelf: 'flex-start', marginLeft: 35, marginBottom: 10 },
    image: { flex: 1, height: '100%', width: '100%', resizeMode: 'cover', position: 'absolute', justifyContent: 'center', backgroundColor: colors.surfaceVariant },
    login: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    form: { paddingTop: 50, alignItems: 'center', backgroundColor: colors.surface, justifyContent: 'center', width: '90%', borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' },
    title: { fontSize: 30, letterSpacing: 2, marginBottom: 20 },
    input: { height: 40, width: '80%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: 'black' },
    clickableText: { marginLeft: 5, color: colors.surfaceVariant, alignSelf: 'flex-end', justifyContent: 'flex-end', textTransform: 'uppercase' },
    forgetPassword: { flexDirection: 'row', marginBottom: 50 },
    loginButton: { marginBottom: 20, marginTop: 10, backgroundColor: colors.secondary, borderRadius: 10 },
    registerButton: { marginBottom: 30, marginTop: 10, borderRadius: 10 },
    textButton: { color: 'white', textTransform: 'uppercase' },
    errorInput: { color: colors.error },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  } as const;

  return (
    <>
      <Image style={styles.image} source={wallpaper_login} />
      <KeyboardAwareScrollView contentContainerStyle={styles.login}>
        <Text style={[styles.title, styles.textFontRegular]}>{t('signInTitle')}</Text>
        <View style={styles.form}>
          {errors.email && <Text style={[styles.errorInput, styles.textFontRegular]}>{t((errors.email.message ?? 'errors.emailRequired') as never)}</Text>}
          <Text style={[styles.textInput, styles.textFontRegular]}>{t('emailLabel')}</Text>
          <TextInput
            style={[styles.input, styles.textFontRegular]}
            placeholder="Email"
            placeholderTextColor={colors.secondary}
            autoCapitalize="none"
            keyboardType="email-address"
            onChangeText={(text) => setValue('email', text)}
            {...register('email')}
          />
          {errors.password && <Text style={[styles.errorInput, styles.textFontRegular]}>{t((errors.password.message ?? 'errors.passwordRequired') as never)}</Text>}
          <Text style={[styles.textInput, styles.textFontRegular]}>{t('passwordLabel')}</Text>
          <View style={[{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }, styles.input]}>
            <TextInput
              style={[styles.textFontRegular, { width: '90%' }]}
              placeholder="Mot de passe"
              placeholderTextColor={colors.secondary}
              secureTextEntry={!isPasswordVisible}
              onChangeText={(text) => setValue('password', text)}
              defaultValue={getValues('password')}
              {...register('password')}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible((v) => !v)} style={{ alignSelf: 'center' }}>
              <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} />
            </TouchableOpacity>
          </View>

          <View style={styles.loginButton}>
            {!loading ? (
              <Button onPress={handleSubmit(submitLogin)} type="quaternary" size="l">
                <Text style={[styles.textButton, styles.textFontMedium]}>{t('loginButton')}</Text>
              </Button>
            ) : (
              <Button type="quaternary" size="m">
                <ActivityIndicator size="large" color={colors.background} />
              </Button>
            )}
          </View>

          <View style={styles.forgetPassword}>
            <TouchableOpacity onPress={handlePasswordReset}>
              <Text style={[styles.clickableText, styles.textFontMedium]}>{t('forgotPassword')}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.registerButton}>
            <Button onPress={() => navigation.navigate('Register')} type="primary" size="m">
              <Text style={[styles.textButton, styles.textFontMedium]}>{t('noAccountRegister')}</Text>
            </Button>
          </View>

          <SocialAuthButtons onSuccess={() => navigation.navigate('Loading')} />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
}