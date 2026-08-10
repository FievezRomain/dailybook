import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';
import { Button, Icon } from '../../../shared/components/ui';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import type { AuthStackParamList } from '../navigation';
import { AuthScreen } from '../components/AuthScreen';
import { TextLink } from '../components/TextLink';

export type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'Welcome'> & { onChangeLanguage?: () => void };

export function WelcomeScreen({ navigation, onChangeLanguage = () => undefined }: WelcomeScreenProps) {
  const { colors } = useAppTheme();
  return <AuthScreen scroll={false} centered testID="auth-welcome" contentStyle={{ gap: spacing.md }}>
    <View style={{ height: 42 }} />
    <View accessibilityElementsHidden style={{ padding: 14, borderRadius: radii.full, backgroundColor: colors.surfaceVariant }}><Icon name="animals" size="lg" color={colors.primary} /></View>
    <Text accessibilityRole="header" style={{ width: '100%', color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxxl, lineHeight: 38, letterSpacing: -0.3, textAlign: 'center' }}>Vasco</Text>
    <Text style={{ width: '100%', color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.lg, lineHeight: 26, textAlign: 'center' }}>Moins de charge mentale, plus de moments pour votre animal.</Text>
    <View style={{ flex: 1, minHeight: 120 }} />
    <Button label="Créer mon compte" onPress={() => navigation.navigate('RegisterMethod')} size="large" fullWidth />
    <Button label="J’ai déjà un compte" onPress={() => navigation.navigate('SignIn')} variant="secondary" size="large" fullWidth />
    <TextLink label="Français · Modifier la langue" onPress={onChangeLanguage} />
  </AuthScreen>;
}
