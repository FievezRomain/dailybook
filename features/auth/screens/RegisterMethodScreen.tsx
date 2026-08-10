import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Platform, Text, View } from 'react-native';
import { Banner, Button, Icon } from '../../../shared/components/ui';
import { isGoogleSigninAvailable } from '../../../services/auth/googleSigninModule';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AuthScreen } from '../components/AuthScreen';
import { TextLink } from '../components/TextLink';
import { useSignIn } from '../hooks/useSignIn';
import type { AuthStackParamList } from '../navigation';

export type RegisterMethodScreenProps = NativeStackScreenProps<AuthStackParamList, 'RegisterMethod'>;

export function RegisterMethodScreen({ navigation }: RegisterMethodScreenProps) {
  const { colors } = useAppTheme();
  const { loading, errors, signInWithApple, signInWithGoogle } = useSignIn();
  return <AuthScreen scroll={false} centered testID="auth-register-method" contentStyle={{ gap: spacing.md }}>
    <View style={{ height: 42 }} />
    <View accessibilityElementsHidden style={{ padding: 14, borderRadius: radii.full, backgroundColor: colors.surfaceVariant }}><Icon name="animals" size="lg" color={colors.primary} /></View>
    <Text accessibilityRole="header" style={{ width: '100%', color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32, letterSpacing: -0.2, textAlign: 'center' }}>Créer votre compte</Text>
    <Text style={{ width: '100%', color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: typography.lineHeights.normal, textAlign: 'center' }}>Choisissez la méthode la plus simple pour vous. Vous pourrez la modifier ensuite.</Text>
    <View style={{ height: 30 }} />
    {errors.form ? <Banner tone="error" title="Création impossible" message={errors.form} blocking /> : null}
    {Platform.OS === 'ios' ? <Button label="Continuer avec Apple" onPress={() => void signInWithApple()} variant="secondary" size="large" fullWidth disabled={loading} /> : null}
    {isGoogleSigninAvailable() ? <Button label="Continuer avec Google" onPress={() => void signInWithGoogle()} variant="secondary" size="large" fullWidth disabled={loading} /> : null}
    <Text accessibilityElementsHidden style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>ou</Text>
    <Button label="Créer avec mon e-mail" onPress={() => navigation.navigate('RegisterIdentity')} size="large" fullWidth />
    <View style={{ flex: 1, minHeight: 24 }} />
    <TextLink label="Déjà un compte ? Se connecter" onPress={() => navigation.navigate('SignIn')} />
  </AuthScreen>;
}
