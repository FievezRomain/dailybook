import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { AppDivider } from '../../../shared/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AppSheet from '../../../shared/components/ui/AppSheet';
import CalendarPicker from '../../../shared/components/modals/inputs/ModalDatePicker';
import { createAnimalHistory, updateAnimalHistory } from '../../../services/api/AnimalsService';
import LoggerService from '../../../services/logs/LoggerService';
import DropdawnList from '../../../shared/components/inputs/DropdawnList';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

interface ModalManageBodyAnimalProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  animal?: any;
  item?: string;
  infos?: any;
  onModify?: (data?: any) => void;
}

const ModalManageBodyAnimal = ({ isVisible, setVisible, actionType, animal = {}, item, infos, onModify = undefined }: ModalManageBodyAnimalProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('animals');
  const { t: tc } = useTranslation('common');
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch, clearErrors, setError } = useForm();
  const [loading, setLoading] = useState(false);
  const sheetRef = useRef<BottomSheetModal>(null);
  const unitsList = [
    { label: 'g', value: 'g' }, { label: 'kg', value: 'kg' }, { label: 'mg', value: 'mg' },
    { label: 'q', value: 'q' }, { label: 't', value: 't' }, { label: 'L', value: 'L' },
    { label: 'mL', value: 'mL' }, { label: 'cL', value: 'cL' },
  ];
  const [unity, setUnity] = useState<string | undefined>(undefined);

  useEffect(() => { initValues(); }, [isVisible]);
  useEffect(() => {
    if (isVisible) { sheetRef.current?.present(); } else { sheetRef.current?.dismiss(); }
  }, [isVisible]);
  useEffect(() => { setValue('unity', unity); }, [unity]);

  const initValues = () => {
    if (actionType === 'create') {
      setValue('datemodification', new Date().toISOString().split('T')[0]); setValue('value', undefined);
      setValue('unity', undefined); setValue('idAnimal', animal.id); setValue('item', item); setUnity(undefined);
    } else {
      setValue('datemodification', new Date(infos.date).toISOString().split('T')[0]); setValue('value', infos.value.toString());
      setValue('unity', infos.unity); setValue('id', infos.id); setValue('item', item); setValue('idAnimal', infos.idanimal); setUnity(infos.unity);
    }
  };

  const closeModal = () => setVisible(false);

  const checkNumericFormat = (data: any, attribute: string) => {
    if (data[attribute] != undefined) {
      const numericValue = parseFloat(data[attribute].replace(',', '.').replace(' ', ''));
      if (isNaN(numericValue)) { Toast.show({ position: 'top', type: 'error', text1: 'Probléme de format sur la valeur', text2: 'Seul les chiffres, virgule et point sont acceptés' }); return false; }
      else { data[attribute] = numericValue; }
    }
    return true;
  };

  const submitRegister = async (data: any) => {
    if (loading) return;
    setLoading(true);
    if (item === 'quantity' && !unity) { setError('unity', { type: 'manual' }); setLoading(false); return; }
    if (['taille', 'poids', 'quantity'].includes(item ?? '')) { data['value'] = data['value'].replace(',', '.'); }
    if (['taille', 'poids', 'quantity'].includes(item ?? '')) { if (!checkNumericFormat(data, 'value')) { setLoading(false); return; } }
    if (actionType === 'create') {
      createAnimalHistory(String(data.idAnimal), data).then(() => { closeModal(); onModify?.(); setLoading(false); }).catch((err: any) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la modification du physique: ' + err.message); setLoading(false); });
    } else {
      updateAnimalHistory(String(data.idAnimal), data).then(() => { closeModal(); onModify?.(); setLoading(false); }).catch((err: any) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la modification du physique: ' + err.message); setLoading(false); });
    }
    closeModal();
  };

  const convertDateToText = (fieldname: string) => {
    const d = watch(fieldname);
    if (d == undefined) return '';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return String(new Date(d).toLocaleDateString('fr-FR', options));
  };

  const getInput = () => {
    const commonProps = { style: [styles.input, styles.textFontRegular], keyboardType: 'decimal-pad' as const, inputMode: 'decimal' as const, placeholderTextColor: colors.secondary, onChangeText: (text: string) => setValue('value', text), defaultValue: watch('value') ?? '', ...register('value', { required: true }) };
    switch (item) {
      case 'taille': return <><Text style={[styles.textInput, styles.textFontRegular]}>{t('heightLabel')} <Text style={{ color: colors.error }}>*</Text></Text>{errors.value && <Text style={{ color: colors.error }}>{t('heightRequired')}</Text>}<TextInput {...commonProps} placeholder="Exemple : 140" /></>;
      case 'poids': return <><Text style={[styles.textInput, styles.textFontRegular]}>{t('weightLabel')} <Text style={{ color: colors.error }}>*</Text></Text>{errors.value && <Text style={{ color: colors.error }}>{t('weightRequired')}</Text>}<TextInput {...commonProps} placeholder="Exemple : 400" /></>;
      case 'food': return <><Text style={[styles.textInput, styles.textFontRegular]}>{t('foodLabel')} <Text style={{ color: colors.error }}>*</Text></Text>{errors.value && <Text style={{ color: colors.error }}>{t('foodRequired')}</Text>}<TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Granulés X" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('value', text)} defaultValue={watch('value') ?? ''} {...register('value', { required: true })} /></>;
      case 'quantity': return <><Text style={[styles.textInput, styles.textFontRegular]}>Quantité : <Text style={{ color: colors.error }}>*</Text></Text>{(errors.value || errors.unity) && <Text style={{ color: colors.error }}>Quantité obligatoire</Text>}<View style={{ flexDirection: 'row', justifyContent: 'space-between' }}><View style={{ width: '55%' }}><TextInput {...commonProps} placeholder="Exemple : 200" /></View><View style={{ width: '40%' }}><DropdawnList list={unitsList} setValue={(value) => { setUnity(value); if (value) clearErrors('unity'); }} value={unity ?? ''} /></View></View></>;
      default: return null;
    }
  };

  const styles = {
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    inputContainer: { width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5 },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, alignSelf: 'baseline' },
    containerDate: { flexDirection: 'column', alignSelf: 'flex-start', width: '100%', marginBottom: 15 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['70%']} onDismiss={() => setVisible(false)} keyboardBehavior="extend">
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>{tc('cancel')}</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold]}>{t('physique')}</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.textPrimary} /> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('save')}</Text>}
          </TouchableOpacity>
        </View>
        <AppDivider />
        <KeyboardAwareScrollView enableResetScrollToCoords={false} enableAutomaticScroll={false} contentContainerStyle={{ height: '100%' }}>
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.containerDate}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Date : {convertDateToText('datemodification')} <Text style={{ color: colors.error }}>*</Text></Text>
                <CalendarPicker onDayChange={(propertyName, selectedDate) => setValue('datemodification', selectedDate)} propertyName="datemodification" defaultDate={getValues('datemodification')} />
              </View>
              {getInput()}
            </View>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </AppSheet>
  );
};

export default ModalManageBodyAnimal;
