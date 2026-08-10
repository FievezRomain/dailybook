import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Text, View } from 'react-native';
import { Banner, Button, PasswordField, ProgressSteps } from '../../../shared/components/ui';
import { passwordSchema } from '../../../business/validators/auth';
import { register } from '../../../services/api/AuthService';
import { authService } from '../../../services/auth/FirebaseAuthService';
import { radii, spacing, typography } from '../../../theme/scales';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AuthScreen } from '../components/AuthScreen';
import type { AuthStackParamList } from '../navigation';
import { useRegistrationDraft } from '../stores/useRegistrationDraft';

export type RegisterSecurityScreenProps = NativeStackScreenProps<AuthStackParamList, 'RegisterSecurity'>;

export function RegisterSecurityScreen({ navigation }: RegisterSecurityScreenProps) {
  const { colors } = useAppTheme();
  const { firstName, email } = useRegistrationDraft();
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmation?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    const result = passwordSchema.safeParse(password);
    const nextErrors: typeof errors = {};
    if (!result.success) nextErrors.password = '12 caractères, avec majuscule, minuscule, chiffre et symbole';
    if (password !== confirmation) nextErrors.confirmation = 'Les deux mots de passe doivent correspondre';
    if (!email || !firstName) nextErrors.form = 'Vos informations sont incomplètes. Revenez à l’étape précédente.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0 || !result.success) return;
    setLoading(true);
    try {
      await authService.signUp(email, result.data, firstName);
      await register({ email, prenom: firstName });
      await authService.sendEmailVerification();
      navigation.navigate('VerifyEmail');
    } catch {
      setErrors({ form: 'Création du compte impossible. Cette adresse est peut-être déjà utilisée.' });
    } finally { setLoading(false); }
  };
  return <AuthScreen testID="auth-register-security" contentStyle={{ gap: spacing.md, paddingTop: 28 }}>
    <Text accessibilityRole="header" style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: typography.sizes.xxl, lineHeight: 32, letterSpacing: -0.2 }}>Sécuriser votre compte</Text>
    <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.md, lineHeight: typography.lineHeights.normal }}>Étape 2 sur 3 · Votre mot de passe</Text>
    <ProgressSteps current={2} total={3} />
    {errors.form ? <Banner tone="error" title="Création impossible" message={errors.form} blocking /> : null}
    <PasswordField autoFocus label="Mot de passe" helperText="12 caractères, majuscule, chiffre et symbole" errorMessage={errors.password} placeholder="Créer un mot de passe" value={password} onChangeText={setPassword} textContentType="newPassword" editable={!loading} />
    <PasswordField label="Confirmer le mot de passe" helperText="Les deux mots de passe doivent correspondre" errorMessage={errors.confirmation} placeholder="Saisir à nouveau" value={confirmation} onChangeText={setConfirmation} textContentType="newPassword" returnKeyType="done" onSubmitEditing={() => void submit()} editable={!loading} />
    <View style={{ padding: 14, borderRadius: radii.lg, backgroundColor: colors.surfaceVariant }}><Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>Un mot de passe robuste protège les données de vos animaux.</Text></View>
    <View style={{ flex: 1, minHeight: 48 }} />
    <Button label="Créer mon compte" onPress={() => void submit()} size="large" fullWidth loading={loading} />
  </AuthScreen>;
}
