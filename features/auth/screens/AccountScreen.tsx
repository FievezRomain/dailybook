import React, { useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../../../theme/useAppTheme';
import { authService } from '../../../services/auth/FirebaseAuthService';
import Toast from 'react-native-toast-message';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import InputTextInLine from '../../../shared/components/inputs/InputTextInLine';
import AvatarPicker from '../../../shared/components/inputs/AvatarPicker';
import Button from '../../../shared/components/ui/AppButton';
import LoggerService from '../../../services/logs/LoggerService';
import { uploadFile } from '../../../services/aws/FileStorageService';
import { updateMe } from '../../../services/api/AuthService';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { AppStackScreenProps } from '../../../navigation/types';
import { useTranslation } from 'react-i18next';

export default function AccountScreen({ navigation }: AppStackScreenProps<'Account'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('common');
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [displayName, setDisplayName] = useState(firebaseUser?.displayName ?? '');
  const [email, setEmail] = useState(firebaseUser?.email ?? '');
  const [image, setImage] = useState<string | null>(firebaseUser?.photoURL ?? null);
  const [loading, setLoading] = useState(false);

  const submitModifications = async () => {
    setLoading(true);
    try {
      if (!authService.getCurrentUser()) return;

      if (displayName !== firebaseUser?.displayName) {
        await authService.updateProfile({ displayName });
      }
      if (image && image !== firebaseUser?.photoURL) {
        const filename = image.split('/').pop() ?? 'photo.jpg';
        const fileURL = await uploadFile(image, filename, 'image/jpeg', 'user', firebaseUser?.uid ?? '');
        await authService.updateProfile({ photoURL: fileURL });
      }
      if (email.trim() !== firebaseUser?.email) {
        await authService.updateEmail(email.trim());
      }
      if (password.trim()) {
        if (password !== passwordRepeat) {
          Toast.show({ type: 'error', position: 'top', text1: 'Les mots de passe ne correspondent pas' });
          return;
        }
        await authService.updatePassword(password);
      }

      const filename = image?.split('/').pop() ?? '';
      await updateMe({ newEmail: email.trim(), image: filename });
      Toast.show({ type: 'success', position: 'top', text1: "Modification de l'utilisateur" });
    } catch (error: any) {
      LoggerService.log('Erreur lors de la MAJ utilisateur : ' + error.message);
      Toast.show({ type: 'error', position: 'top', text1: error.message });
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  } as const;

  return (
    <View style={{ backgroundColor: colors.surfaceVariant, height: '100%', justifyContent: 'space-between' }}>
      <View>
        <KeyboardAwareScrollView>
          <TopTabSecondary message1="Mon" message2="Compte" />
          {image && (
            <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 30, marginBottom: 5 }}>
              <Image source={{ uri: image }} cachePolicy="disk" style={{ width: 100, height: 100, borderRadius: 50, borderWidth: 2, zIndex: 1 }} />
            </View>
          )}
          <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
            <AvatarPicker backgroundColor={colors.background} onChange={(uri: string) => setImage(uri)} />
          </View>
          <View style={{ width: '90%', alignSelf: 'center', marginTop: 10 }}>
            <InputTextInLine inputTextLabel="Email" value={email} onChangeText={setEmail} />
          </View>
          <View style={{ width: '90%', alignSelf: 'center', marginTop: 10 }}>
            <InputTextInLine inputTextLabel="Nom" value={displayName} onChangeText={setDisplayName} />
          </View>
          <View style={{ width: '90%', alignSelf: 'center', marginTop: 10 }}>
            <InputTextInLine inputTextLabel="Mot de passe" isPassword value={password} onChangeText={setPassword} />
          </View>
          {password !== '' && (
            <View style={{ width: '90%', alignSelf: 'center', marginTop: 10 }}>
              <InputTextInLine inputTextLabel="Confirmer le mot de passe" isPassword value={passwordRepeat} onChangeText={setPasswordRepeat} />
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
      <View style={{ width: '70%', alignSelf: 'center', marginBottom: 50 }}>
        {loading ? (
          <ActivityIndicator size={30} color={colors.textPrimary} />
        ) : (
          <Button isLong type="primary" size="m" onPress={submitModifications}>
            <Text style={styles.textFontMedium}>{t('save')}</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
