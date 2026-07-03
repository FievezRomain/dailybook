import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../stores/useAuthStore';
import { authService } from '../../../services/auth/FirebaseAuthService';
import LoggerService from '../../../services/logs/LoggerService';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

interface ModalModificationNameProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  onModify?: () => void;
}

const ModalModificationName = ({ isVisible, setVisible, onModify = undefined }: ModalModificationNameProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('auth');
  const { t: tc } = useTranslation('common');
  const { firebaseUser } = useAuthStore();
  const { handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [displayName, setDisplayName] = useState<string | undefined>();
  const previousDisplayName = firebaseUser?.displayName;

  const closeModal = () => setVisible(false);
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  const submitRegister = async (_data: any) => {
    if (loading) return;
    setLoading(true);
    try {
      if (previousDisplayName !== displayName) {
        await authService.updateProfile({ displayName });
        closeModal();
        onModify?.();
      }
    } catch (error: any) {
      LoggerService.log('Erreur lors de la MAJ d\'un utilisateur sur Firebase : ' + error.message);
      console.error('Erreur lors de la MAJ du user sur Firebase : ' + error.message);
    }
    setLoading(false);
  };

  const styles = {
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10, flex: 1 },
    inputContainer: { alignItems: 'center', width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5 },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, alignSelf: 'baseline' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['70%']} keyboardBehavior="extend" onDismiss={closeModal}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>{tc('cancel')}</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { color: colors.textPrimary }]}>{t('usernameTitle')}</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.textPrimary} /> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('edit')}</Text>}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView extraScrollHeight={-250} contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
          <View style={styles.formContainer}>
            <View style={{ marginBottom: 10 }}>
              <Text style={[styles.textFontBold, { marginBottom: 5 }, { color: colors.textPrimary }]}>{t('usernamePrivate')}</Text>
              <Text style={{ color: colors.textPrimary }}>{t('usernamePrivateDesc1')}</Text>
              <Text style={{ color: colors.textPrimary }}>{t('usernamePrivateDesc2')}</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular, { color: colors.textPrimary }]}>Nom : </Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Utilisateur" placeholderTextColor={colors.secondary} onChangeText={(text) => setDisplayName(text)} defaultValue={firebaseUser?.displayName ?? ''} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalModificationName;
