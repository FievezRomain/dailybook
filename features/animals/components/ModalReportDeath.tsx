import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../../../stores/useAuthStore';
import { AppDivider } from '../../../shared/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AppSheet from '../../../shared/components/ui/AppSheet';
import { useAnimalForm } from '../hooks/useAnimalForm';
import CalendarPicker from '../../../shared/components/modals/inputs/ModalDatePicker';
import { format } from 'date-fns';
import instanceDateUtils from '../../../shared/utils/DateUtils';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

interface ModalReportDeathProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: string;
  animal?: any;
  onModify?: (data?: any) => void;
}

const ModalReportDeath = ({ isVisible, setVisible, actionType, animal = {}, onModify = undefined }: ModalReportDeathProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('animals');
  const { t: tc } = useTranslation('common');
  const { firebaseUser } = useAuthStore();
  const today = new Date();
  const jour = parseInt(String(today.getDate())) < 10 ? '0' + String(today.getDate()) : String(today.getDate());
  const mois = parseInt(String(today.getMonth() + 1)) < 10 ? '0' + String(today.getMonth() + 1) : String(today.getMonth() + 1);
  const annee = today.getFullYear();
  const [date, setDate] = useState(String(jour + '/' + mois + '/' + annee));
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch, setError } = useForm();

  const closeModal = () => setVisible(false);
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (isVisible) { sheetRef.current?.present(); } else { sheetRef.current?.dismiss(); }
  }, [isVisible]);

  const { initializeAnimal, resetAnimalValues, submitAnimal, loading } = useAnimalForm(setValue, firebaseUser as any, onModify ?? (() => {}), closeModal);

  useEffect(() => {
    if (animal) {
      initializeAnimal(animal, () => {}, () => {}, setDate as any);
      setValue('datedeces', animal.datedeces === undefined
        ? instanceDateUtils.dateFormatter(format(new Date(), 'dd/MM/yyyy'), 'dd/MM/yyyy', '/')
        : instanceDateUtils.dateFormatter(new Date(animal.datedeces).toLocaleDateString(), 'dd/MM/yyyy', '/'));
    }
  }, [animal]);

  const submitRegister = async (data: any) => {
    submitAnimal(data, actionType, setDate as unknown as (v: string | null) => void, undefined, () => {}, setError);
  };

  const convertDateToText = (fieldname: string) => {
    const d = watch(fieldname);
    if (d == undefined) return '';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateObject: Date;
    if (d.includes('/')) {
      dateObject = new Date(instanceDateUtils.dateFormatter(d, 'dd/MM/yyyy', '/') ?? '');
    } else {
      dateObject = new Date(d);
    }
    return String(dateObject.toLocaleDateString('fr-FR', options));
  };

  const styles = {
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', alignItems: 'center' },
    bottomBar: { width: '100%', marginBottom: 10, marginTop: 10, height: 0.3, backgroundColor: colors.border },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.textPrimary },
    containerDate: { flexDirection: 'column', alignSelf: 'center', width: '90%', marginBottom: 15 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['30%', '90%']} onDismiss={() => setVisible(false)}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textSecondary }, styles.textFontRegular]}>{tc('cancel')}</Text>
          </TouchableOpacity>
          <Text style={[styles.textFontBold, { width: '33.33%', alignSelf: 'center', textAlign: 'center', color: colors.textPrimary }]}>{t('signalDeath')}</Text>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('save')}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomBar} />
        <View style={styles.containerDate}>
          <Text style={[styles.textInput, styles.textFontRegular]}>Date <Text style={{ color: colors.error }}>*</Text> : {convertDateToText('datedeces')}</Text>
          <CalendarPicker
            onDayChange={(property, value) => setValue(property, value)}
            propertyName="datedeces"
            defaultDate={getValues('datedeces')}
          />
        </View>
      </View>
    </AppSheet>
  );
};

export default ModalReportDeath;
