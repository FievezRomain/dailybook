import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect, useState } from 'react';
import { AppState, Image, Linking, Text, View } from 'react-native';
import { Banner, Button } from '../../../shared/components/ui';
import { authService } from '../../../services/auth/FirebaseAuthService';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AuthScreen } from '../components/AuthScreen';
import { TextLink } from '../components/TextLink';
import type { AuthStackParamList } from '../navigation';
import { useRegistrationDraft } from '../stores/useRegistrationDraft';
import { useAuthStore } from '../../../stores/useAuthStore';

export type VerifyEmailScreenProps = NativeStackScreenProps<AuthStackParamList, 'VerifyEmail'>;

export function VerifyEmailScreen({ navigation }: VerifyEmailScreenProps) {
  const { colors } = useAppTheme();
  const email = useRegistrationDraft((state) => state.email) || authService.getCurrentUser()?.email || 'votre adresse';
  const [seconds, setSeconds] = useState(42);
  const [message, setMessage] = useState<string>();
  const refreshFirebaseUser = useAuthStore((state) => state.refreshFirebaseUser);
  const refreshVerification = useCallback(async () => {
    try { await refreshFirebaseUser(); }
    catch { setMessage('Vérification impossible pour le moment. Réessayez dans quelques instants.'); }
  }, [refreshFirebaseUser]);
  useEffect(() => { if (seconds <= 0) return; const timer = setTimeout(() => setSeconds((value) => value - 1), 1000); return () => clearTimeout(timer); }, [seconds]);
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void refreshVerification();
    });
    return () => subscription.remove();
  }, [refreshVerification]);
  const resend = async () => {
    try { await authService.sendEmailVerification(); setSeconds(42); setMessage('Un nouvel e-mail de vérification a été envoyé.'); }
    catch { setMessage('Envoi impossible pour le moment. Réessayez dans quelques instants.'); }
  };
  return <AuthScreen scroll={false} centered testID="auth-verify-email" contentStyle={{ gap: spacing.md, paddingTop: 28 }}>
    <View style={{ height: 72 }} />
    <Image accessibilityIgnoresInvertColors source={require('../../../assets/logo.png')} resizeMode="contain" style={{ width: 64, height: 64 }} />
    <Text accessibilityRole="header" style={{ width: '100%', color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32, letterSpacing: -0.2, textAlign: 'center' }}>Vérifiez votre e-mail</Text>
    <Text style={{ width: '100%', color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.lg, lineHeight: 26, textAlign: 'center' }}>Étape 3 sur 3 · Nous avons envoyé un lien à {email}. Ouvrez-le pour activer votre compte.</Text>
    <View style={{ flex: 1, minHeight: 48 }} />
    {message ? <Banner tone="info" title="Vérification" message={message} onDismiss={() => setMessage(undefined)} /> : null}
    <Button label="Ouvrir mon application e-mail" onPress={() => void Linking.openURL('mailto:')} size="large" fullWidth />
    <Button label="Renvoyer l’e-mail" onPress={() => void resend()} variant="secondary" fullWidth disabled={seconds > 0} />
    <Text accessibilityLiveRegion="polite" style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20, textAlign: 'center' }}>{seconds > 0 ? `Nouvel envoi possible dans 00:${String(seconds).padStart(2, '0')}` : 'Vous pouvez demander un nouvel envoi'}</Text>
    <TextLink label="Modifier l’adresse e-mail" onPress={() => navigation.navigate('RegisterIdentity')} />
  </AuthScreen>;
}
