import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { createObjectif, updateObjectif } from '../../../services/api/ObjectifService';
import { AntDesign, Entypo } from '@expo/vector-icons';
import CalendarPicker from '../../../shared/components/modals/inputs/ModalDatePicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LoggerService from '../../../services/logs/LoggerService';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import instanceDateUtils from '../../../shared/utils/DateUtils';
import ModalMultiSelect from '../../../shared/components/modals/inputs/ModalMultiSelect';
import ModalAnimals from '../../animals/components/ModalSelectAnimals';
import Button from '../../../shared/components/ui/AppButton';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalObjectifProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  objectif?: any;
  onModify?: (data?: any) => void;
}

const ModalObjectif = ({ isVisible, setVisible, actionType, objectif = {}, onModify = undefined }: ModalObjectifProps) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [modalAnimalVisible, setModalAnimalVisible] = useState(false);
  const [animaux, setAnimaux] = useState<any[]>([]);
  const [selected, setSelected] = useState<any[]>([]);
  const [inputs, setInputs] = useState<string[]>([]);
  const { data: animauxData } = useAnimalsQuery();
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [isVisible]);

  useEffect(() => { if (animauxData) setAnimaux(animauxData); }, [animauxData]);
  useEffect(() => { if (isVisible) initValues(); }, [isVisible]);

  const closeModal = () => setVisible(false);

  const initValues = () => {
    if (actionType === 'create') {
      setValue('titre', ''); setValue('datedebut', undefined); setValue('datefin', undefined); setValue('animaux', []); setSelected([]); setInputs(['']);
    } else {
      setValue('id', objectif.id); setValue('titre', objectif.titre); setValue('datedebut', objectif.datedebut); setValue('datefin', objectif.datefin);
      setValue('animaux', objectif.animaux?.map((a: any) => a.id) ?? []);
      setSelected(objectif.animaux ?? []);
      setInputs(objectif.sousEtapes?.map((s: any) => s.titre) ?? ['']);
    }
  };

  const handleAddInput = () => setInputs([...inputs, '']);
  const handleRemoveInput = (index: number) => setInputs(inputs.filter((_, i) => i !== index));
  const handleInputChange = (value: string, index: number) => {
    const newInputs = [...inputs];
    newInputs[index] = value;
    setInputs(newInputs);
    setValue('sousEtapes', newInputs.filter(s => s.trim() !== ''));
  };

  const convertDateToText = (fieldname: string) => {
    const d = watch(fieldname);
    if (d == undefined) return '';
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(d).toLocaleDateString('fr-FR', options);
  };

  const submitRegister = async (data: any) => {
    if (loading) return;
    setLoading(true);
    data['email'] = firebaseUser?.email ?? '';
    data['sousEtapes'] = inputs.filter(s => s.trim() !== '').map(titre => ({ titre, etat: false }));
    if (actionType === 'modify') {
      updateObjectif(String(data.id), data)
        .then((reponse) => { closeModal(); onModify?.(reponse); setLoading(false); })
        .catch((err: any) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la modification d\'un objectif: ' + err.message); setLoading(false); });
    } else {
      createObjectif(data)
        .then(() => { closeModal(); onModify?.(); setLoading(false); })
        .catch((err: any) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la création d\'un objectif: ' + err.message); setLoading(false); });
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
    containerAnimaux: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    containerBadgeAnimal: { borderRadius: 5, backgroundColor: colors.surfaceVariant, marginRight: 5, marginBottom: 5 },
    badgeAnimal: { padding: 10 },
    sousEtapeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    inputSousEtape: { flex: 1, height: 40, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, marginRight: 10 },
    containerDate: { flexDirection: 'column', alignSelf: 'flex-start', width: '100%', marginBottom: 15 },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['90%']} keyboardBehavior="extend" onDismiss={closeModal}>
      <ModalAnimals modalVisible={modalAnimalVisible} setModalVisible={setModalAnimalVisible} setAnimaux={undefined} animaux={animaux} selected={selected} setSelected={setSelected} setValue={setValue} valueName="animaux" displayAnimalsShared={false} />
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.textPrimary }]}>Objectif</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.textPrimary} /> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{actionType === 'modify' ? 'Modifier' : 'Créer'}</Text>}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10} enableResetScrollToCoords={false}>
          <View style={styles.formContainer}>
            <View style={styles.containerDate}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Date de début : {convertDateToText('datedebut')}</Text>
              <CalendarPicker onDayChange={(propertyName, selectedDate) => setValue('datedebut', selectedDate)} propertyName="datedebut" defaultDate={getValues('datedebut')} />
            </View>
            <View style={styles.containerDate}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Date de fin : {convertDateToText('datefin')}</Text>
              <CalendarPicker onDayChange={(propertyName, selectedDate) => setValue('datefin', selectedDate)} propertyName="datefin" defaultDate={getValues('datefin')} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Animaux :</Text>
              <TouchableOpacity style={[{ width: '100%' }]} onPress={() => setModalAnimalVisible(true)}>
                <View style={styles.containerAnimaux}>
                  {selected.length === 0 && <View style={[styles.containerBadgeAnimal, { width: '100%' }]}><Text style={[styles.badgeAnimal, styles.textFontRegular, { color: colors.secondary }]}>Sélectionner un ou plusieurs animaux</Text></View>}
                  {selected.map((animal: any) => <View key={animal.id} style={styles.containerBadgeAnimal}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{animal.nom}</Text></View>)}
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Titre : <Text style={{ color: colors.error }}>*</Text></Text>
              {errors.titre && <Text style={{ color: colors.error }}>Titre obligatoire</Text>}
              <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Objectif" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('titre', text)} defaultValue={watch('titre')} {...register('titre', { required: true })} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Sous-étapes :</Text>
              {inputs.map((value, index) => (
                <View key={index} style={styles.sousEtapeRow}>
                  <TextInput style={[styles.inputSousEtape, styles.textFontRegular]} value={value} onChangeText={(text) => handleInputChange(text, index)} placeholder={`étape ${index + 1}`} placeholderTextColor={colors.secondary} />
                  <TouchableOpacity onPress={() => handleRemoveInput(index)}>
                    <AntDesign name="delete" size={20} color={colors.textPrimary} />
                  </TouchableOpacity>
                </View>
              ))}
              <Button onPress={handleAddInput} type="primary" size="s" isLong={true}>
                <Entypo name="plus" size={16} color="white" />
                <Text style={styles.textFontRegular}> Ajouter une sous-étape</Text>
              </Button>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalObjectif;
