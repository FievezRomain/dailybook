import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { Divider, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { authService } from '../../../services/auth/FirebaseAuthService';
import * as ImagePicker from 'expo-image-picker';
import Toast from 'react-native-toast-message';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import ModalSubMenuAvatarPickerActions from '../../../shared/components/modals/common/ModalSubMenuAvatarPicker';
import ModalModificationName from '../components/ModalModificationName';
import ModalModificationPassword from '../components/ModalModificationPassword';
import LoggerService from '../../../services/logs/LoggerService';
import { uploadFile } from '../../../services/aws/FileStorageService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useThemeStore } from '../../../stores/useThemeStore';
import ImageUtils from '../../../shared/utils/ImageUtils';
import type { AppNavigationProp } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/useAppTheme';

const imageUtils = new ImageUtils();

export default function SettingsScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { colors, fonts } = useAppTheme();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const user = useAuthStore((s) => s.user);
  const signOutUser = useAuthStore((s) => s.signOutUser);
  const { isDark, toggleTheme } = useThemeStore();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalVerifDeleteAccountVisible, setModalVerifDeleteAccountVisible] = useState(false);
  const [modalSubMenuAvatarPickerVisible, setModalSubMenuAvatarPickerVisible] = useState(false);
  const [modalModificationPasswordVisible, setModalModificationPasswordVisible] = useState(false);
  const [modalModificationNameVisible, setModalModificationNameVisible] = useState(false);

  const photoURL = firebaseUser?.photoURL ?? null;
  const previousImage = photoURL;

  const disconnect = async () => {
    await signOutUser();
  };

  const handleDeleteAccount = async () => {
    try {
      await authService.deleteCurrentUser();
      await signOutUser();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      Toast.show({ type: 'error', position: 'top', text1: msg });
      LoggerService.log('Erreur lors de la suppression du compte : ' + msg);
    }
  };

  const saveNewPhoto = async (uriImage: string) => {
    const filename = uriImage.split('/').pop() ?? 'photo.jpg';
    const fileURL = await uploadFile(uriImage, filename, 'image/jpeg', 'user', firebaseUser?.uid ?? '');
    await authService.updateProfile({ photoURL: fileURL });
    Toast.show({ type: 'success', position: 'top', text1: 'Photo mise à jour' });
  };

  const takePhotoAsync = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { alert('Permission caméra refusée'); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    Toast.show({ type: 'info', position: 'top', text1: 'Modification en cours...' });
    if (!result.canceled) {
      const uri = await imageUtils.compressImage(result.assets[0].uri);
      if (uri !== previousImage) await saveNewPhoto(uri);
    }
    setModalSubMenuAvatarPickerVisible(false);
  };

  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { alert("Permission bibliothèque refusée"); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    Toast.show({ type: 'info', position: 'top', text1: 'Modification en cours...' });
    if (!result.canceled) {
      const uri = await imageUtils.compressImage(result.assets[0].uri);
      if (uri !== previousImage) await saveNewPhoto(uri);
    }
    setModalSubMenuAvatarPickerVisible(false);
  };

  const handleUserModified = () => {
    setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Modification de vos informations réussie' }), 350);
  };

  const styles = StyleSheet.create({
    settings: { flexDirection: 'column' },
    title: { fontSize: 25 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: colors.background, alignSelf: 'center', top: 25, zIndex: 1, backgroundColor: colors.background },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    informationsUserContainer: { alignItems: 'center' },
    buttonEditUserImage: { height: 30, width: 30, backgroundColor: colors.accent, zIndex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 70 },
    titleContainer: { color: colors.quaternary, marginLeft: 20, fontFamily: fonts.labelMedium?.fontFamily, fontSize: 16, paddingVertical: 10 },
    abonnementContainer: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, backgroundColor: colors.accent, marginTop: 10, marginBottom: 20 },
    contentContainer: { flex: 1 },
    email: { fontSize: 14 },
  });

  const row = (icon: string, label: string, onPress: () => void) => (
    <>
      <TouchableOpacity style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon={icon} iconColor={colors.accent} size={20} />
          <Text style={[styles.textFontMedium, { fontSize: 16, color: colors.default_dark }]}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconButton icon="chevron-right" iconColor={colors.accent} size={20} />
        </View>
      </TouchableOpacity>
      <Divider />
    </>
  );

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1="Mon" message2="Compte" />
      <ScrollView style={styles.contentContainer}>
        <ModalValidation
          displayedText="Êtes-vous sûr de vouloir vous déconnecter ?"
          title="Demande de déconnexion"
          visible={modalVisible}
          setVisible={setModalVisible}
          onConfirm={disconnect}
        />
        <ModalValidation
          displayedText="Êtes-vous sûr de vouloir supprimer votre compte ?"
          title="Demande de suppression de compte"
          visible={modalVerifDeleteAccountVisible}
          onConfirm={handleDeleteAccount}
          setVisible={setModalVerifDeleteAccountVisible}
        />
        <ModalSubMenuAvatarPickerActions
          modalVisible={modalSubMenuAvatarPickerVisible}
          setModalVisible={setModalSubMenuAvatarPickerVisible}
          handleCameraPick={takePhotoAsync}
          handleLibraryPick={pickImageAsync}
        />
        <ModalModificationName
          isVisible={modalModificationNameVisible}
          setVisible={setModalModificationNameVisible}
          onModify={handleUserModified}
        />
        <ModalModificationPassword
          isVisible={modalModificationPasswordVisible}
          setVisible={setModalModificationPasswordVisible}
          onModify={handleUserModified}
        />
        <View style={styles.settings}>
          <View style={styles.informationsUserContainer}>
            {photoURL ? (
              <Image style={styles.avatar} source={{ uri: photoURL }} cachePolicy="disk" />
            ) : (
              <View style={[styles.avatar, { alignItems: 'center', justifyContent: 'center' }]}>
                <FontAwesome5 size={40} name="user-alt" />
              </View>
            )}
            <TouchableOpacity style={styles.buttonEditUserImage} onPress={() => setModalSubMenuAvatarPickerVisible(true)}>
              <IconButton icon="pencil" size={20} iconColor={colors.background} />
            </TouchableOpacity>
            <Text style={[styles.title, styles.textFontBold, { color: colors.default_dark }]}>
              {firebaseUser?.displayName?.slice(0, 17) ?? ''}
            </Text>
            <Text style={[styles.email, styles.textFontRegular, { color: colors.default_dark }]}>
              {firebaseUser?.email ?? ''}
            </Text>
            {user && (
              <View style={styles.abonnementContainer}>
                <Text style={[styles.textFontRegular, { color: colors.background }]}>
                  {(user as any).abonnement?.libelle ?? 'Gratuit'}
                </Text>
              </View>
            )}
          </View>

          <View>
            <Text style={styles.titleContainer}>Paramètres</Text>
            <View style={{ backgroundColor: colors.background }}>
              {row('key', 'Changer mon mot de passe', () => setModalModificationPasswordVisible(true))}
              {row('card-account-details', 'Changer mon nom', () => setModalModificationNameVisible(true))}
            </View>
          </View>

          <View>
            <Text style={styles.titleContainer}>Informations</Text>
            <View style={{ backgroundColor: colors.background }}>
              {row('cellphone', 'Gérer mon abonnement', () => navigation.navigate('DiscoverPremium'))}
              {row('help-circle', 'Support utilisateur', () =>
                Linking.openURL('mailto:contact.vascoandco@gmail.com').catch((e) =>
                  LoggerService.log('Error opening email: ' + e.message)
                )
              )}
              {row('invert-colors', `Passer en mode ${isDark ? 'clair' : 'sombre'}`, toggleTheme)}
              {row('account-remove', 'Supprimer mon compte', () => setModalVerifDeleteAccountVisible(true))}
              {row('logout', 'Déconnexion', () => setModalVisible(true))}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
