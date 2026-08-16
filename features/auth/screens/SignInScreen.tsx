import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { Banner, Button, PasswordField, TextField } from '../../../shared/components/ui';
import { isGoogleSigninAvailable } from '../../../services/auth/googleSigninModule';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AuthScreen } from '../components/AuthScreen';
import { TextLink } from '../components/TextLink';
import { useSignIn } from '../hooks/useSignIn';
import type { AuthStackParamList } from '../navigation';

export type SignInScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignIn'>;

export function SignInScreen({ navigation }: SignInScreenProps) {
  const { colors } = useAppTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loading, errors, signIn, signInWithApple, signInWithGoogle } = useSignIn();
  return <AuthScreen testID="auth-sign-in" contentStyle={{ gap: spacing.md }}>
    <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32, letterSpacing: -0.2 }}>Connexion</Text>
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: typography.lineHeights.normal }}>Retrouvez simplement le quotidien de vos animaux.</Text>
    {Platform.OS === 'ios' ? <Button label="Continuer avec Apple" onPress={() => void signInWithApple()} variant="secondary" fullWidth disabled={loading} /> : null}
    {isGoogleSigninAvailable() ? <Button label="Continuer avec Google" onPress={() => void signInWithGoogle()} variant="secondary" fullWidth disabled={loading} /> : null}
    <Text accessibilityElementsHidden style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20, textAlign: 'center' }}>ou</Text>
    {errors.form ? <Banner tone="error" title="Connexion impossible" message={errors.form} blocking /> : null}
    <TextField label="Adresse e-mail" helperText="Adresse utilisée pour votre compte" errorMessage={errors.email} placeholder="vous@exemple.fr" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" returnKeyType="next" editable={!loading} />
    <PasswordField label="Mot de passe" helperText="12 caractères minimum" errorMessage={errors.password ?? (errors.form ? 'E-mail ou mot de passe incorrect' : undefined)} placeholder="Votre mot de passe" value={password} onChangeText={setPassword} textContentType="password" returnKeyType="done" onSubmitEditing={() => void signIn(email, password)} editable={!loading} />
    <View style={{ marginTop: spacing.sm, marginBottom: spacing.lg }}><TextLink label="Mot de passe oublié ?" onPress={() => navigation.navigate('ForgotPassword', { initialEmail: email })} /></View>
    <Button label="Se connecter" onPress={() => void signIn(email, password)} size="large" fullWidth loading={loading} />
    <TextLink label="Pas encore de compte ? S’inscrire" onPress={() => navigation.navigate('RegisterMethod')} />
  </AuthScreen>;
}
