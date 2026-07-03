import React, { useState } from 'react';
import { View, Text, Image, TextInput, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import { useAppTheme } from '../../../theme/useAppTheme';
import { authService } from '../../../services/auth/FirebaseAuthService';
import { getFirebaseError } from '../../../shared/utils/FirebaseErrorUtils';
import { register as apiRegister } from '../../../services/api/AuthService';
import Back from '../../../shared/components/common/Back';
import Button from '../../../shared/components/ui/AppButton';
import SocialAuthButtons from '../components/SocialAuthButtons';
import type { AuthStackScreenProps } from '../../../navigation/types';
import { signUpSchema, type SignUpInput } from '../../../business/validators/auth';

const wallpaper_login = require('../../../assets/wallpaper_login.png');

export default function SignUpScreen({ navigation }: AuthStackScreenProps<'Register'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('auth');
  const { register, handleSubmit, formState: { errors }, setValue, getValues } = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', prenom: '', password: '', password_confirm: '' },
  });
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const submitRegister = async (data: SignUpInput) => {
    if (loading) return;
    try {
      setLoading(true);

      await authService.signUp(data.email.trim(), data.password, data.prenom);

      await apiRegister({ email: data.email, prenom: data.prenom });
      navigation.navigate('VerifyEmail');
      Toast.show({ type: 'success', position: 'top', text1: t('registrationSuccess') });
    } catch (err) {
      Toast.show({ type: 'error', position: 'top', text1: getFirebaseError(err) });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    textInput: { alignSelf: 'flex-start', marginLeft: 35, marginBottom: 10 },
    image: { flex: 1, height: '100%', width: '100%', resizeMode: 'cover', position: 'absolute', justifyContent: 'center' },
    register: { flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' },
    form: { paddingTop: 50, alignItems: 'center', backgroundColor: colors.surface, justifyContent: 'center', width: '90%', top: -(Constants.statusBarHeight + 10), borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' },
    title: { top: -(Constants.statusBarHeight + 10), color: colors.textPrimary, fontSize: 30, letterSpacing: 2, marginBottom: 20 },
    input: { height: 40, width: '80%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: 'black' },
    registerButton: { marginBottom: 20, marginTop: 10, borderRadius: 10 },
    textButton: { color: 'white' },
    errorInput: { color: colors.error, textAlign: 'center' },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  } as const;

  return (
    <>
      <Image style={styles.image} source={wallpaper_login} />
      <View style={{ height: '100%', width: '100%', paddingTop: Constants.statusBarHeight + 10 }}>
        <Back isWithBackground />
        <KeyboardAwareScrollView contentContainerStyle={styles.register}>
          <Text style={[styles.title, styles.textFontRegular]}>{t('signUpTitle')}</Text>
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
            {errors.prenom && <Text style={[styles.errorInput, styles.textFontRegular]}>{t((errors.prenom.message ?? 'firstNameRequired') as never)}</Text>}
            <Text style={[styles.textInput, styles.textFontRegular]}>{t('firstNameLabel')}</Text>
            <TextInput
              style={[styles.input, styles.textFontRegular]}
              placeholder={t('firstNamePlaceholder')}
              placeholderTextColor={colors.secondary}
              onChangeText={(text) => setValue('prenom', text)}
              defaultValue={getValues('prenom')}
              {...register('prenom')}
            />
            {errors.password && <Text style={[styles.errorInput, styles.textFontRegular]}>{t((errors.password.message ?? 'errors.passwordTooShort') as never)}</Text>}
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
            {errors.password_confirm && <Text style={[styles.errorInput, styles.textFontRegular]}>{t((errors.password_confirm.message ?? 'errors.passwordMismatch') as never)}</Text>}
            <Text style={[styles.textInput, styles.textFontRegular]}>{t('confirmPasswordLabel')}</Text>
            <View style={[{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 10 }, styles.input]}>
              <TextInput
                style={[styles.textFontRegular, { width: '90%' }]}
                placeholder={t('confirmPasswordPlaceholder')}
                placeholderTextColor={colors.secondary}
                secureTextEntry={!isPasswordVisible}
                onChangeText={(text) => setValue('password_confirm', text)}
                defaultValue={getValues('password_confirm')}
                {...register('password_confirm')}
              />
              <TouchableOpacity onPress={() => setIsPasswordVisible((v) => !v)} style={{ alignSelf: 'center' }}>
                <MaterialIcons name={isPasswordVisible ? 'visibility' : 'visibility-off'} size={22} />
              </TouchableOpacity>
            </View>
            <View style={styles.registerButton}>
              {!loading ? (
                <Button onPress={handleSubmit(submitRegister)} type="quaternary" size="m">
                  <Text style={[styles.textButton, styles.textFontMedium]}>{t('registerButton')}</Text>
                </Button>
              ) : (
                <Button type="quaternary" size="m">
                  <ActivityIndicator size="large" color={colors.background} />
                </Button>
              )}
            </View>
            <SocialAuthButtons onSuccess={() => navigation.navigate('Loading')} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
}
