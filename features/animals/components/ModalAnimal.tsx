import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { AppDivider } from '../../../shared/components/ui';
import Constants from 'expo-constants';
import { useAuthStore } from '../../../stores/useAuthStore';
import AvatarPicker from '../../../shared/components/inputs/AvatarPicker';
import LoggerService from '../../../services/logs/LoggerService';
import FileStorageService from '../../../services/aws/FileStorageService';
import DropdawnList from '../../../shared/components/inputs/DropdawnList';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AppSheet from '../../../shared/components/ui/AppSheet';
import instanceDateUtils from '../../../shared/utils/DateUtils';
import { useAppTheme } from '../../../theme/useAppTheme';
import { ModalAnimalProps } from '../types';
import { useTranslation } from 'react-i18next';
import { useAnimalMutations } from '../../../hooks/queries/useAnimalsQuery';
import type { CreateAnimalPayload, UpdateAnimalPayload } from '../types';

const especeList = [
  { label: 'Chat', value: 'Chat' }, { label: 'Chien', value: 'Chien' }, { label: 'Poisson', value: 'Poisson' },
  { label: 'Oiseaux', value: 'Oiseaux' }, { label: 'Lapin', value: 'Lapin' }, { label: 'Rongeur', value: 'Rongeur' },
  { label: 'Reptile', value: 'Reptile' }, { label: 'Furet', value: 'Furet' }, { label: 'Cheval', value: 'Cheval' },
  { label: 'Poney', value: 'Poney' }, { label: 'éne', value: 'éne' }, { label: 'Mulet et bardot', value: 'Mulet et bardot' },
  { label: 'Poule', value: 'Poule' }, { label: 'Canard', value: 'Canard' }, { label: 'Cochon', value: 'Cochon' },
  { label: 'Chévre', value: 'Chévre' }, { label: 'Mouton', value: 'Mouton' }, { label: 'Bovin', value: 'Bovin' },
  { label: 'Dinde', value: 'Dinde' }, { label: 'Oie', value: 'Oie' }, { label: 'Caille', value: 'Caille' },
  { label: 'écureuil', value: 'écureuil' }, { label: 'Amphibien', value: 'Amphibien' }, { label: 'Insecte', value: 'Insecte' },
  { label: 'Crustacé', value: 'Crustacé' }, { label: 'Arachnide', value: 'Arachnide' },
  { label: 'Lama et alpaga', value: 'Lama et alpaga' }, { label: 'Autruche et émeu', value: 'Autruche et émeu' }, { label: 'Autre', value: 'Autre' },
];

const unitsList = [
  { label: 'g', value: 'gramme' }, { label: 'kg', value: 'kilogramme' }, { label: 'mg', value: 'milligramme' },
  { label: 'q', value: 'quintal' }, { label: 't', value: 'tonne' }, { label: 'L', value: 'litre' },
  { label: 'mL', value: 'millilitre' }, { label: 'cL', value: 'centilitre' },
];

const ModalAnimal = ({ isVisible, setVisible, actionType, animal, onModify = undefined }: ModalAnimalProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('animals');
  const { t: tc } = useTranslation('common');
  const { firebaseUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, setError, getValues, watch, clearErrors } = useForm();
  const [image, setImage] = useState<string | null>(null);
  const today = new Date();
  const jour = today.getDate() < 10 ? '0' + today.getDate() : String(today.getDate());
  const mois = today.getMonth() + 1 < 10 ? '0' + (today.getMonth() + 1) : String(today.getMonth() + 1);
  const annee = today.getFullYear();
  const [date, setDate] = useState<string | undefined>(undefined);
  const [dateArrivee, setDateArrivee] = useState<string | undefined>(undefined);
  const [dateDepart, setDateDepart] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [espece, setEspece] = useState<string | undefined>(undefined);
  const [unity, setUnity] = useState<string | undefined>(undefined);
  const scrollRef = useRef<any>(null);
  const sheetRef = useRef<BottomSheetModal>(null);
  const fileStorageService = new FileStorageService();
  const { create, update } = useAnimalMutations();

  useEffect(() => { if (animal?.id !== undefined) initValuesAnimal(); }, [animal]);
  useEffect(() => { setValue('espece', espece); }, [espece]);
  useEffect(() => {
    if (isVisible) { sheetRef.current?.present(); } else { sheetRef.current?.dismiss(); }
  }, [isVisible]);

  const initValuesAnimal = () => {
    if (!animal) return;
    setValue('id', animal.id);
    setValue('nom', animal.nom);
    setValue('espece', animal.espece);
    setEspece(animal.espece);
    const formatDate = (d: string | null | undefined) => d != null ? (d.includes('-') ? instanceDateUtils.dateFormatter(d, 'yyyy-mm-dd', '-') : d) : undefined;
    setValue('datenaissance', formatDate(animal.datenaissance));
    setValue('datearrivee', formatDate(animal.datearrivee));
    setValue('datedepart', formatDate(animal.datedepart));
    setValue('datedeces', animal.datedeces ?? undefined);
    setValue('race', animal.race ?? undefined);
    setValue('taille', animal.taille != null ? animal.taille.toString() : undefined);
    setValue('poids', animal.poids != null ? animal.poids.toString() : undefined);
    setValue('sexe', animal.sexe ?? undefined);
    setValue('food', animal.food ?? undefined);
    setValue('quantity', animal.quantity != null ? animal.quantity.toString() : undefined);
    setValue('unity', animal.unity ?? undefined);
    setUnity(animal.unity);
    setValue('couleur', animal.couleur ?? undefined);
    setValue('nompere', animal.nompere ?? undefined);
    setValue('nommere', animal.nommere ?? undefined);
    setValue('numeroidentification', animal.numeroidentification ?? undefined);
    setValue('image', animal.image);
    setValue('previousimage', animal.image);
    setValue('informations', animal.informations ?? undefined);
    setDate(formatDate(animal.datenaissance));
    setDateArrivee(formatDate(animal.datearrivee));
    setDateDepart(formatDate(animal.datedepart));
    setImage(animal.image != null ? fileStorageService.getFileUrl(animal.image, firebaseUser?.uid ?? '') : null);
  };

  const closeModal = () => setVisible(false);

  const resetValues = () => {
    ['id','nom','espece','datenaissance','datearrivee','datedepart','datedeces','race','taille','poids','sexe','food','quantity','unity','couleur','nompere','nommere','image','numeroidentification','informations'].forEach(k => setValue(k, undefined));
    setUnity(undefined); setImage(null);
    const defaultDate = `${jour}/${mois}/${annee}`;
    setDate(defaultDate); setDateArrivee(defaultDate); setDateDepart(defaultDate);
    setEspece(undefined);
  };

  const checkNumericFormat = (data: any, attribute: string) => {
    if (data[attribute] != undefined) {
      const numericValue = parseFloat(data[attribute].replace(',', '.').replace(' ', ''));
      if (isNaN(numericValue)) {
        Toast.show({ position: 'top', type: 'error', text1: 'Probléme de format sur l\'attribut ' + attribute, text2: 'Seul les chiffres, virgule et point sont acceptés' });
        return false;
      } else { data[attribute] = numericValue; }
    }
    return true;
  };

  const submitRegister = async (data: any) => {
    if (loading) return;
    setLoading(true);
    if (!espece) { setError('espece', { type: 'manual' }); setLoading(false); return; }
    data['email'] = firebaseUser?.email ?? '';
    if (data['poids']) data['poids'] = data['poids'].replace(',', '.');
    if (data['taille']) data['taille'] = data['taille'].replace(',', '.');
    if (data['quantity']) data['quantity'] = data['quantity'].replace(',', '.');
    ['datenaissance','datearrivee','datedepart'].forEach(k => { if (data[k] !== null && data[k] !== undefined && data[k].length === 0) data[k] = undefined; });
    for (const field of ['datenaissance','datearrivee','datedepart']) {
      if (data[field] != null && data[field] !== undefined) {
        if (data[field].length !== 10 || !instanceDateUtils.isDateValid(instanceDateUtils.dateFormatter(data[field], 'dd/MM/yyyy', '/') ?? '')) {
          Toast.show({ position: 'top', type: 'error', text1: 'Probléme de format de date' });
          setLoading(false); return;
        }
        data[field] = instanceDateUtils.dateFormatter(data[field], 'dd/MM/yyyy', '/');
      }
    }
    if (!checkNumericFormat(data, 'taille') || !checkNumericFormat(data, 'poids') || !checkNumericFormat(data, 'quantity')) { setLoading(false); return; }
    if (data.image != undefined && (actionType !== 'modify' || data['previousimage'] !== data['image'])) {
      if (image != null) {
        let filename = data.image.split('/');
        filename = filename[filename.length - 1];
        await fileStorageService.uploadFile(image, filename, 'image/jpeg', firebaseUser?.uid ?? '');
        data.image = filename;
      }
    }
    try {
      if (actionType === 'modify') {
        const response = await update.mutateAsync({ id: String(data.id), body: data as UpdateAnimalPayload });
        resetValues();
        closeModal();
        onModify?.(response);
      } else {
        await create.mutateAsync(data as CreateAnimalPayload);
        resetValues();
        closeModal();
        onModify?.();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      Toast.show({ type: 'error', position: 'top', text1: message });
      LoggerService.log('Erreur lors de l\'enregistrement d\'un animal : ' + message);
    } finally {
      setLoading(false);
    }
  };

  const onChangeDate = (valueName: string, currentDate: string | undefined, setter: (v: string) => void, selectedDate: string) => {
    const nbOccur = (selectedDate.match(/\//g) || []).length;
    const oldNbOccur = (String(currentDate).match(/\//g) || []).length;
    if (selectedDate.length === 2 && nbOccur === 0 && oldNbOccur === 0) selectedDate = selectedDate + '/';
    else if (selectedDate.length === 5 && nbOccur === 1 && oldNbOccur === 1) selectedDate = selectedDate + '/';
    setter(selectedDate);
    setValue(valueName, selectedDate);
  };

  const onChangeImage = (imageUri: string) => { setImage(imageUri); setValue('image', imageUri); };
  const deleteImage = () => { if (actionType === 'modify') setValue('image', 'todelete'); setImage(null); };

  const convertDateToText = (fieldValue: string | undefined) => {
    if (!fieldValue || fieldValue === null) return '';
    if (fieldValue.length !== 10) return 'Invalid Date';
    let d = fieldValue;
    if (d.includes('/')) d = instanceDateUtils.dateFormatter(d, 'dd/MM/yyyy', '/') ?? d;
    return String(new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  };

  const styles = {
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    inputContainer: { width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.textPrimary },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, alignSelf: 'baseline' },
    inputTextArea: { height: 100, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, paddingRight: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary },
    containerDate: { flexDirection: 'column', alignSelf: 'flex-start', width: '100%' },
    imageContainer: { flexDirection: 'row', alignSelf: 'flex-start', marginTop: 5 },
    avatar: { width: 60, height: 60, borderRadius: 50, borderWidth: 2, zIndex: 1 },
    errorInput: { color: colors.error },
    separatorForm: { width: '100%', marginBottom: 20, marginTop: 10, height: 0.5, backgroundColor: colors.text },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <>
      <AppSheet ref={sheetRef} snapPoints={['90%']} scrollable={false} onDismiss={() => setVisible(false)}>
        <View style={styles.form}>
          <View style={styles.containerActionsButtons}>
            <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
              <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>{tc('cancel')}</Text>
            </TouchableOpacity>
            <View style={{ width: '33.33%', alignItems: 'center' }}>
              <Text style={[styles.textFontBold, { fontSize: 16, color: colors.textPrimary }]}>{t('modalTitle')}</Text>
            </View>
            <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
              {loading ? <ActivityIndicator size={10} color={colors.textPrimary} /> : actionType === 'modify' ? <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('edit')}</Text> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('create')}</Text>}
            </TouchableOpacity>
          </View>
          <AppDivider />
          <KeyboardAwareScrollView ref={scrollRef} enableOnAndroid={true} enableResetScrollToCoords={false}>
            <View style={styles.formContainer}>
              <View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Nom de l'animal : <Text style={{ color: colors.error }}>*</Text></Text>
                  {errors.nom && <Text style={[styles.errorInput, styles.textFontRegular]}>{t('nameRequired')}</Text>}
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Vasco" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('nom', text)} defaultValue={getValues('nom') ?? ''} {...register('nom', { required: true })} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Espéce : <Text style={{ color: colors.error }}>*</Text></Text>
                  {errors.espece && <Text style={[styles.errorInput, styles.textFontRegular]}>{t('speciesRequired')}</Text>}
                  <DropdawnList list={especeList} setValue={(value) => { setEspece(value); if (value) clearErrors('espece'); }} value={espece ?? ''} />
                </View>
              </View>
              <AppDivider />
              <View style={{ paddingTop: 10 }}>
                <View style={[styles.inputContainer, { marginBottom: 10 }]}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Image :</Text>
                  <AvatarPicker onChange={onChangeImage} />
                  {image && (
                    <View style={styles.imageContainer}>
                      <Image source={{ uri: image }} style={styles.avatar} cachePolicy="disk" />
                      <TouchableOpacity onPress={() => deleteImage()}>
                        <Image source={require('../../../assets/cross.png')} style={{ height: 20, width: 20 }} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
                <View style={styles.containerDate}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Date de naissance : {convertDateToText(date)}</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 01/01/1900" keyboardType="numeric" inputMode="numeric" maxLength={10} placeholderTextColor={colors.secondary} onChangeText={(text) => onChangeDate('datenaissance', date, setDate, text)} defaultValue={date} />
                </View>
                <View style={styles.containerDate}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Numéro d'identification :</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="XXXXXXXXXX" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('numeroidentification', text)} defaultValue={watch('numeroidentification')} />
                </View>
                <View style={styles.containerDate}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Date d'arrivée : {convertDateToText(dateArrivee)}</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 01/01/1900" keyboardType="numeric" inputMode="numeric" maxLength={10} placeholderTextColor={colors.secondary} onChangeText={(text) => onChangeDate('datearrivee', dateArrivee, setDateArrivee, text)} defaultValue={dateArrivee} />
                </View>
                <View style={styles.containerDate}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Date de départ : {convertDateToText(dateDepart)}</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 01/01/1900" keyboardType="numeric" inputMode="numeric" maxLength={10} placeholderTextColor={colors.secondary} onChangeText={(text) => onChangeDate('datedepart', dateDepart, setDateDepart, text)} defaultValue={dateDepart} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Race :</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Fjord" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('race', text)} defaultValue={getValues('race')} />
                </View>
                {actionType === 'create' && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={[styles.textInput, styles.textFontRegular]}>Taille (cm) :</Text>
                      <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 140" keyboardType="decimal-pad" inputMode="decimal" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('taille', text)} defaultValue={getValues('taille')} />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={[styles.textInput, styles.textFontRegular]}>Poids (kg) :</Text>
                      <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 400" keyboardType="decimal-pad" inputMode="decimal" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('poids', text)} defaultValue={getValues('poids')} />
                    </View>
                  </>
                )}
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Sexe :</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Méle" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('sexe', text)} defaultValue={getValues('sexe')} />
                </View>
                {actionType === 'create' && (
                  <>
                    <View style={styles.inputContainer}>
                      <Text style={[styles.textInput, styles.textFontRegular]}>Nom alimentation :</Text>
                      <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Granulés X" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('food', text)} defaultValue={getValues('food')} />
                    </View>
                    <View style={styles.inputContainer}>
                      <Text style={[styles.textInput, styles.textFontRegular]}>Quantité :</Text>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ width: '55%' }}>
                          <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 200" keyboardType="decimal-pad" inputMode="decimal" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('quantity', text)} defaultValue={getValues('quantity') ?? ''} />
                        </View>
                        <View style={{ width: '40%' }}>
                          <DropdawnList list={unitsList} setValue={(value) => { setUnity(value); if (value) clearErrors('unity'); }} value={unity ?? ''} />
                        </View>
                      </View>
                    </View>
                  </>
                )}
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Couleur :</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Isabelle" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('couleur', text)} defaultValue={getValues('couleur')} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Nom du pére :</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Esgard" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('nompere', text)} defaultValue={getValues('nompere')} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Nom de la mére :</Text>
                  <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Sherry" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('nommere', text)} defaultValue={getValues('nommere')} />
                </View>
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Informations supplémentaires :</Text>
                  <TextInput style={[styles.inputTextArea, styles.textFontRegular]} multiline={true} numberOfLines={4} maxLength={2000} placeholder="Exemple : Allergie, pathologie..." placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('informations', text)} defaultValue={getValues('informations')} onFocus={(e) => { if (Constants.platform?.ios) { setTimeout(() => { scrollRef.current?.scrollToEnd({ animated: true }); }, 100); } }} />
                </View>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </AppSheet>
    </>
  );
};

export default ModalAnimal;
