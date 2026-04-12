import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from 'react-native-paper';
import { updateProfile, updatePassword, updateEmail, getAuth } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import InputTextInLine from '../../../shared/components/inputs/InputTextInLine';
import AvatarPicker from '../../../shared/components/inputs/AvatarPicker';
import Button from '../../../shared/components/inputs/Button';
import LoggerService from '../../../services/logs/LoggerService';
import { uploadFile } from '../../../services/aws/FileStorageService';
import { updateMe } from '../../../services/api/AuthService';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { AppStackScreenProps } from '../../../navigation/types';

export default function AccountScreen({ navigation }: AppStackScreenProps<'Account'>) {
  const { colors, fonts } = useTheme();
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
      const fbUser = getAuth().currentUser;
      if (!fbUser) return;

      if (displayName !== firebaseUser?.displayName) {
        await updateProfile(fbUser, { displayName });
      }
      if (image && image !== firebaseUser?.photoURL) {
        const filename = image.split('/').pop() ?? 'photo.jpg';
        const fileURL = await uploadFile(image, filename, 'image/jpeg', 'user', fbUser.uid);
        await updateProfile(fbUser, { photoURL: fileURL });
      }
      if (email.trim() !== firebaseUser?.email) {
        await updateEmail(fbUser, email.trim());
      }
      if (password.trim()) {
        if (password !== passwordRepeat) {
          Toast.show({ type: 'error', position: 'top', text1: 'Les mots de passe ne correspondent pas' });
          return;
        }
        await updatePassword(fbUser, password);
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

  const styles = StyleSheet.create({
    textFontMedium: { fontFamily: (fonts as any).bodyMedium.fontFamily },
  });

  return (
    <View style={{ backgroundColor: colors.onSurface, height: '100%', justifyContent: 'space-between' }}>
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
          <ActivityIndicator size={30} color={(colors as any).default_dark} />
        ) : (
          <Button isLong type="primary" size="m" onPress={submitModifications}>
            <Text style={styles.textFontMedium}>Enregistrer</Text>
          </Button>
        )}
      </View>
    </View>
  );
}
