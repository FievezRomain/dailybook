import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, Text, View } from 'react-native';
import { Button } from '../../../shared/components/ui';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { AuthStackParamList } from '../navigation';
import { AuthScreen } from '../components/AuthScreen';

export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'>;

export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const { colors } = useAppTheme();
  return <AuthScreen scroll={false} centered testID="auth-welcome" contentStyle={{ gap: spacing.md }}>
    <View style={{ height: 42 }} />
    <Image accessibilityIgnoresInvertColors source={require('../../../assets/logo.png')} resizeMode="contain" style={{ width: 64, height: 64 }} />
    <Text accessibilityRole="header" style={{ width: '100%', color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxxl, lineHeight: 38, letterSpacing: -0.3, textAlign: 'center' }}>Vasco</Text>
    <Text style={{ width: '100%', color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.lg, lineHeight: 26, textAlign: 'center' }}>Moins de charge mentale, plus de moments pour votre animal.</Text>
    <View style={{ flex: 1, minHeight: 120 }} />
    <Button label="Créer mon compte" onPress={() => navigation.navigate('RegisterMethod')} size="large" fullWidth />
    <Button label="J’ai déjà un compte" onPress={() => navigation.navigate('SignIn')} variant="secondary" size="large" fullWidth />
  </AuthScreen>;
}
