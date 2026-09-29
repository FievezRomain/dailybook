import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, IconButton, ProgressSteps, TextField } from '../../../shared/components/ui';
import { emailSchema } from '../../../business/validators/auth';
import { spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AuthScreen } from '../components/AuthScreen';
import { TextLink } from '../components/TextLink';
import type { AuthStackParamList } from '../navigation';
import { useRegistrationDraft } from '../stores/useRegistrationDraft';

export type RegisterIdentityScreenProps = NativeStackScreenProps<AuthStackParamList, 'RegisterIdentity'>;

export function RegisterIdentityScreen({ navigation }: RegisterIdentityScreenProps) {
  const { colors } = useAppTheme();
  const draft = useRegistrationDraft();
  const [firstName, setFirstName] = useState(draft.firstName);
  const [email, setEmail] = useState(draft.email);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const next = () => {
    const nextErrors: typeof errors = {};
    if (firstName.trim().length < 2) nextErrors.firstName = 'Le prénom doit contenir au moins 2 caractères';
    if (!emailSchema.safeParse(email).success) nextErrors.email = 'Adresse e-mail invalide';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      draft.setIdentity({ firstName: firstName.trim(), email: email.trim().toLowerCase() });
      navigation.navigate('RegisterSecurity');
    }
  };
  const back = () => {
    draft.setIdentity({ firstName, email });
    navigation.goBack();
  };
  return <AuthScreen testID="auth-register-identity" contentStyle={{ gap: spacing.md, paddingTop: 28 }}>
    <IconButton icon="back" accessibilityLabel="Retour au choix d’inscription" variant="ghost" onPress={back} />
    <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32, letterSpacing: -0.2 }}>Étape 1 sur 3 · Vos informations</Text>
    <ProgressSteps current={1} total={3} />
    <TextField label="Prénom" helperText="Utilisé pour personnaliser l’application" errorMessage={errors.firstName} placeholder="Votre prénom" value={firstName} onChangeText={setFirstName} autoCapitalize="words" textContentType="givenName" returnKeyType="next" />
    <TextField label="Adresse e-mail" helperText="Elle restera privée" errorMessage={errors.email} placeholder="vous@exemple.fr" value={email} onChangeText={setEmail} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" textContentType="emailAddress" returnKeyType="done" onSubmitEditing={next} />
    <View style={{ flex: 1, minHeight: 80 }} />
    <Button label="Continuer" onPress={next} size="large" fullWidth />
    <TextLink label="Déjà un compte ? Se connecter" onPress={() => navigation.navigate('SignIn')} />
  </AuthScreen>;
}
