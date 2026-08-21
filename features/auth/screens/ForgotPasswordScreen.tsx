import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Banner, Button, IconButton, TextField } from '../../../shared/components/ui';
import { emailSchema } from '../../../business/validators/auth';
import { authService } from '../../../services/auth/FirebaseAuthService';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AuthScreen } from '../components/AuthScreen';
import type { AuthStackParamList } from '../navigation';

export type ForgotPasswordScreenProps = NativeStackScreenProps<AuthStackParamList, 'ForgotPassword'>;

export function ForgotPasswordScreen({ navigation, route }: ForgotPasswordScreenProps) {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState(route.params?.initialEmail ?? '');
  const [error, setError] = useState<string>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    const result = emailSchema.safeParse(email);
    if (!result.success) return setError('Adresse e-mail invalide');
    setError(undefined); setLoading(true);
    try { await authService.sendPasswordResetEmail(result.data); setSent(true); }
    catch { setError('Envoi impossible. Vérifiez votre connexion et réessayez.'); }
    finally { setLoading(false); }
  };
  return <AuthScreen testID="auth-forgot-password" contentStyle={{ gap: spacing.md, paddingTop: 28 }}>
    <IconButton icon="back" accessibilityLabel="Retour à la connexion" variant="ghost" onPress={() => navigation.goBack()} />
    <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32, letterSpacing: -0.2 }}>Mot de passe oublié ?</Text>
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: typography.lineHeights.normal }}>Indiquez votre adresse e-mail. Nous vous enverrons un lien sécurisé pour choisir un nouveau mot de passe.</Text>
    <View style={{ height: spacing.sm }} />
    {sent ? <Banner tone="success" title="Lien envoyé" message="Si un compte correspond à cette adresse, vous recevrez les instructions par e-mail." blocking /> : null}
    <TextField autoFocus label="Adresse e-mail" helperText="Adresse associée à votre compte" errorMessage={error} placeholder="vous@exemple.fr" value={email} onChangeText={(value) => { setEmail(value); setSent(false); }} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" returnKeyType="send" onSubmitEditing={() => void submit()} editable={!loading} />
    <View style={{ flex: 1, minHeight: 80 }} />
    <Button label="Envoyer le lien" onPress={() => void submit()} size="large" fullWidth loading={loading} />
    <Button label="Retour à la connexion" onPress={() => navigation.navigate('SignIn')} variant="ghost" fullWidth disabled={loading} />
  </AuthScreen>;
}
