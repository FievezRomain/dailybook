import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { AntDesign, Entypo, FontAwesome } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAuthStore } from '../../../stores/useAuthStore';
import { createWish, updateWish } from '../../../services/api/WishService';
import { Wish } from '../../../models/Wish';
import { CreateWishPayload, UpdateWishPayload } from '../types';
import LoggerService from '../../../services/logs/LoggerService';
import FileStorageService from '../../../services/aws/FileStorageService';
import AvatarPicker from '../../../shared/components/inputs/AvatarPicker';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalWishProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  wish?: Wish;  onModify?: (data?: Wish) => void;
}

const ModalWish = ({ isVisible, setVisible, actionType, wish, onModify = undefined }: ModalWishProps) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [imageUri, setImageUri] = useState<string | undefined>(undefined);
  const [avatarPickerVisible, setAvatarPickerVisible] = useState(false);
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  useEffect(() => { if (isVisible) initValues(); }, [isVisible]);

  const closeModal = () => setVisible(false);

  const initValues = () => {
    if (actionType === 'create') {
      setValue('nom', ''); setValue('url', ''); setValue('prix', ''); setValue('destinataire', ''); setValue('image', undefined); setImageUri(undefined);
    } else {
      setValue('id', wish?.id); setValue('nom', wish?.nom); setValue('url', wish?.url); setValue('prix', wish?.prix?.toString() ?? ''); setValue('destinataire', wish?.destinataire); setValue('image', wish?.image); setImageUri(wish?.image);
    }
  };

  const checkNumericFormat = (value: string) => {
    if (!value || value === '') return true;
    const numericValue = parseFloat(value.replace(',', '.'));
    return !isNaN(numericValue);
  };

  const submitRegister = async (data: Record<string, unknown>) => {
    if (loading) return;
    setLoading(true);
    if (data.prix && !checkNumericFormat(String(data.prix))) {
      Toast.show({ type: 'error', position: 'top', text1: 'Format du prix incorrect', text2: 'Seul les chiffres, virgule et point sont acceptés' });
      setLoading(false); return;
    }
    if (data.prix) data.prix = parseFloat((data.prix as string).replace(',', '.'));
    data['email'] = firebaseUser?.email ?? '';
    try {
      if (imageUri && imageUri !== wish?.image) {
        const uploadedUrl = await FileStorageService.uploadImage(imageUri, `wishes/${data.email}`);
        data['image'] = uploadedUrl;
      }
      if (actionType === 'modify') {
        const reponse = await updateWish(String(data.id), data as unknown as UpdateWishPayload);
        closeModal(); onModify?.(reponse);
      } else {
        await createWish(data as unknown as CreateWishPayload);
        closeModal(); onModify?.();
      }
    } catch (err: any) {
      Toast.show({ type: 'error', position: 'top', text1: err.message });
      LoggerService.log('Erreur lors de la saisie d\'un souhait: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    form: { width: '100%', paddingBottom: 40, flex: 1 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    inputContainer: { alignItems: 'center', width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.textPrimary },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    imageContainer: { alignItems: 'center', marginBottom: 15 },
    imagePreview: { width: 100, height: 100, borderRadius: 10, marginBottom: 8 },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['90%']} keyboardBehavior="extend" onDismiss={closeModal}>
      <AvatarPicker onChange={(uri) => { setImageUri(uri); setValue('image', uri); }} />
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.textPrimary }]}>Souhait</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.textPrimary} /> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{actionType === 'modify' ? 'Modifier' : 'Créer'}</Text>}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10} enableResetScrollToCoords={false}>
          <View style={styles.formContainer}>
            <View style={styles.imageContainer}>
              {imageUri ? <Image source={{ uri: imageUri }} style={styles.imagePreview} contentFit="cover" /> : <View style={[styles.imagePreview, { backgroundColor: colors.surfaceVariant, justifyContent: 'center', alignItems: 'center' }]}><FontAwesome name="image" size={30} color={colors.secondary} /></View>}
              <TouchableOpacity onPress={() => setAvatarPickerVisible(true)}>
                <Text style={[styles.textFontRegular, { color: colors.primary }]}>{imageUri ? 'Modifier l\'image' : 'Ajouter une image'}</Text>
              </TouchableOpacity>
              {imageUri && <TouchableOpacity onPress={() => { setImageUri(undefined); setValue('image', undefined); }} style={{ marginTop: 5 }}>
                <Text style={[styles.textFontRegular, { color: colors.error }]}>Supprimer l'image</Text>
              </TouchableOpacity>}
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Nom : <Text style={{ color: colors.error }}>*</Text></Text>
              {errors.nom && <Text style={{ color: colors.error }}>Nom obligatoire</Text>}
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Mon souhait" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('nom', text)} defaultValue={watch('nom')} {...register('nom', { required: true })} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>URL :</Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="https://..." placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('url', text)} defaultValue={watch('url')} autoCapitalize="none" />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Prix :</Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 19.99" placeholderTextColor={colors.secondary} keyboardType="decimal-pad" onChangeText={(text) => setValue('prix', text)} defaultValue={watch('prix')} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Destinataire :</Text>
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Jean" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('destinataire', text)} defaultValue={watch('destinataire')} />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalWish;
