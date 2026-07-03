import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { authService } from '../../../services/auth/FirebaseAuthService';
import Toast from 'react-native-toast-message';
import Constants from 'expo-constants';
import { useTranslation } from 'react-i18next';
import Button from '../../../shared/components/ui/AppButton';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { AuthStackScreenProps } from '../../../navigation/types';

const wallpaper_login = require('../../../assets/wallpaper_login.png');

export default function VerifyEmailScreen({ navigation }: AuthStackScreenProps<'VerifyEmail'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('auth');
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const [canResend, setCanResend] = useState(false);
  const [timer, setTimer] = useState(120);

  const handleResendVerificationEmail = async () => {
    if (firebaseUser && canResend) {
      await authService.sendEmailVerification();
      setCanResend(false);
      setTimer(120);
      Toast.show({ type: 'success', position: 'top', text1: t('emailSent') });
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => { setTimer(120); }, []);

  const styles = {
    image: { flex: 1, height: '100%', width: '100%', resizeMode: 'cover', position: 'absolute', justifyContent: 'center' },
    register: { flex: 1, flexDirection: 'column', justifyContent: 'space-between', paddingHorizontal: 10, paddingVertical: 80 },
    form: { marginTop: 100, padding: 10, alignItems: 'center', justifyContent: 'center', width: '90%', borderRadius: 10, marginLeft: 'auto', marginRight: 'auto' },
    title: { top: -(Constants.statusBarHeight + 10), color: colors.secondary, fontSize: 30, letterSpacing: 2, marginBottom: 20 },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  } as const;

  return (
    <>
      <Image style={styles.image} source={wallpaper_login} />
      <View style={{ height: '100%', width: '100%', paddingTop: Constants.statusBarHeight + 10 }}>
        <KeyboardAwareScrollView contentContainerStyle={styles.register}>
          <View style={{ padding: 40, marginBottom: 30 }}>
            <Text style={[{ textAlign: 'center', textTransform: 'uppercase', fontSize: 16 }, styles.textFontMedium]}>
              {t('verifyEmailBody')}
            </Text>
          </View>
          <View style={{ width: '70%', alignSelf: 'center' }}>
            <View style={{ shadowColor: colors.textPrimary, shadowOpacity: 0.1, elevation: 1, shadowRadius: 1, shadowOffset: { width: 0, height: 1 } }}>
              {!canResend ? (
                <Button size="m" type="secondary">
                  <Text style={[styles.textFontMedium, { color: colors.surfaceVariant }]}>
                    {t('resendEmailCountdown', { timer })}
                  </Text>
                </Button>
              ) : (
                <Button onPress={handleResendVerificationEmail} size="m" type="primary">
                  <Text style={styles.textFontMedium}>{t('resendEmailButton')}</Text>
                </Button>
              )}
            </View>
            <View style={{ marginTop: 10, shadowColor: colors.textPrimary, shadowOpacity: 0.1, elevation: 1, shadowRadius: 1, shadowOffset: { width: 0, height: 1 } }}>
              <Button onPress={() => navigation.navigate('Login')} size="m" type="quaternary">
                <Text style={styles.textFontMedium}>{t('loginButton')}</Text>
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
}
