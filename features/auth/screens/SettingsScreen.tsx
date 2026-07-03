import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5 } from '@expo/vector-icons';
import { AppDivider, AppIconButton } from '../../../shared/components/ui';
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
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../../shared/components/ui/LanguageSwitcher';

const imageUtils = new ImageUtils();

export default function SettingsScreen() {
  const navigation = useNavigation<AppNavigationProp>();
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('auth');
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
    Toast.show({ type: 'success', position: 'top', text1: t('photoUpdated') });
  };

  const takePhotoAsync = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') { alert(t('permissionCamera')); return; }
    const result = await ImagePicker.launchCameraAsync({ allowsEditing: true, quality: 1 });
    Toast.show({ type: 'info', position: 'top', text1: t('modifyLoading') });
    if (!result.canceled) {
      const uri = await imageUtils.compressImage(result.assets[0].uri);
      if (uri !== previousImage) await saveNewPhoto(uri);
    }
    setModalSubMenuAvatarPickerVisible(false);
  };

  const pickImageAsync = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') { alert(t('permissionLibrary')); return; }
    const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 1 });
    Toast.show({ type: 'info', position: 'top', text1: t('modifyLoading') });
    if (!result.canceled) {
      const uri = await imageUtils.compressImage(result.assets[0].uri);
      if (uri !== previousImage) await saveNewPhoto(uri);
    }
    setModalSubMenuAvatarPickerVisible(false);
  };

  const handleUserModified = () => {
    setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: t('modifySuccess') }), 350);
  };

  const styles = {
    settings: { flexDirection: 'column' },
    title: { fontSize: 25 },
    avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: colors.background, alignSelf: 'center', top: 25, zIndex: 1, backgroundColor: colors.background },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    informationsUserContainer: { alignItems: 'center' },
    buttonEditUserImage: { height: 30, width: 30, backgroundColor: colors.primary, zIndex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 70 },
    titleContainer: { color: colors.surfaceVariant, marginLeft: 20, fontFamily: fonts.labelMedium?.fontFamily, fontSize: 16, paddingVertical: 10 },
    abonnementContainer: { paddingHorizontal: 15, paddingVertical: 5, borderRadius: 15, backgroundColor: colors.primary, marginTop: 10, marginBottom: 20 },
    contentContainer: { flex: 1 },
    email: { fontSize: 14 },
  } as const;

  const row = (icon: string, label: string, onPress: () => void) => (
    <>
      <TouchableOpacity style={{ paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }} onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppIconButton icon={icon} color={colors.primary} size={20} />
          <Text style={[styles.textFontMedium, { fontSize: 16, color: colors.textPrimary }]}>{label}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <AppIconButton icon="chevron-right" color={colors.primary} size={20} />
        </View>
      </TouchableOpacity>
      <AppDivider />
    </>
  );

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1="Mon" message2="Compte" />
      <ScrollView style={styles.contentContainer}>
        <ModalValidation
          displayedText={t('disconnectConfirmText')}
          title={t('disconnectTitle')}
          visible={modalVisible}
          setVisible={setModalVisible}
          onConfirm={disconnect}
        />
        <ModalValidation
          displayedText={t('deleteAccountConfirmText')}
          title={t('deleteAccountTitle')}
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
              <AppIconButton icon="pencil" size={20} color={colors.background} />
            </TouchableOpacity>
            <Text style={[styles.title, styles.textFontBold, { color: colors.textPrimary }]}>
              {firebaseUser?.displayName?.slice(0, 17) ?? ''}
            </Text>
            <Text style={[styles.email, styles.textFontRegular, { color: colors.textPrimary }]}>
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
            <Text style={styles.titleContainer}>{t('settings')}</Text>
            <View style={{ backgroundColor: colors.background }}>
              {row('key', t('changePassword'), () => setModalModificationPasswordVisible(true))}
              {row('card-account-details', t('changeName'), () => setModalModificationNameVisible(true))}
              <View style={{ paddingHorizontal: 10, paddingVertical: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <AppIconButton icon="translate" color={colors.primary} size={20} />
                  <Text style={[styles.textFontMedium, { fontSize: 16, color: colors.textPrimary }]}>{t('language')}</Text>
                </View>
                <LanguageSwitcher compact />
              </View>
              <AppDivider />
            </View>
          </View>

          <View>
            <Text style={styles.titleContainer}>{t('sectionInfo')}</Text>
            <View style={{ backgroundColor: colors.background }}>
              {row('cellphone', t('manageSubscription'), () => navigation.navigate('DiscoverPremium'))}
              {row('help-circle', t('support'), () =>
                Linking.openURL('mailto:contact.vascoandco@gmail.com').catch((e) =>
                  LoggerService.log('Error opening email: ' + e.message)
                )
              )}
              {row('invert-colors', isDark ? t('toggleLight') : t('toggleDark'), toggleTheme)}
              {row('account-remove', t('deleteAccount'), () => setModalVerifDeleteAccountVisible(true))}
              {row('logout', t('logout'), () => setModalVisible(true))}
            </View>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}
