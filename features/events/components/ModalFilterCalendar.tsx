import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useForm } from 'react-hook-form';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import AppSheet from '../../../shared/components/ui/AppSheet';
import AnimalsPicker from '../../../shared/components/inputs/AnimalsPicker';
import { CalendarFilter } from '../models/CalendarFilter';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { Animal } from '../../../models/Animal';

interface ModalFilterCalendarProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  setFilter: (filter: CalendarFilter) => void;
  filter?: CalendarFilter;
}

const typesList = [
  { id: 1, title: 'Rendez-vous' },
  { id: 2, title: 'Traitement' },
  { id: 3, title: 'Vaccination' },
  { id: 4, title: 'Reproduction' },
  { id: 5, title: 'Alimentation' },
  { id: 6, title: 'Activité' },
  { id: 7, title: 'Autre' },
];

const ModalFilterCalendar = ({ modalVisible, setModalVisible, setFilter, filter }: ModalFilterCalendarProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('events');
  const { t: tc } = useTranslation('common');
  const { register, handleSubmit, setValue, watch } = useForm();
  const { data: animauxData } = useAnimalsQuery();
  const [animaux, setAnimaux] = useState<Animal[]>([]);
  const [selectedAnimals, setSelectedAnimals] = useState<Animal[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<number[]>([]);
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => { if (animauxData) setAnimaux(animauxData); }, [animauxData]);
  useEffect(() => {
    if (modalVisible) { sheetRef.current?.present(); } else { sheetRef.current?.dismiss(); }
  }, [modalVisible]);
  useEffect(() => {
    if (modalVisible) {
      setSelectedAnimals((filter?.animals ?? []) as any[]);
      setSelectedTypes((filter?.eventType ?? []) as any[]);
      setValue('animaux', filter?.animals ?? []);
    }
  }, [modalVisible]);

  const handleSelected = (item: { id: number; title: string }) => {
    setSelectedTypes(prev => prev.includes(item.id) ? prev.filter(t => t !== item.id) : [...prev, item.id]);
  };

  const checkState = (item: { id: number }) => selectedTypes.includes(item.id);

  const sendFilter = () => {
    const newFilter = new CalendarFilter(undefined, selectedAnimals.map((a: any) => a.id ?? a), undefined, '');
    setFilter(newFilter);
    setModalVisible(false);
  };

  const reset = () => { setSelectedAnimals([]); setSelectedTypes([]); setValue('animaux', []); };

  const styles = {
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 15, paddingTop: 5 },
    bottomBar: { height: 1, backgroundColor: colors.border, marginHorizontal: 20, marginBottom: 10 },
    contentCard: { paddingHorizontal: 20, paddingBottom: 20 },
    filtersContainer: { marginTop: 10 },
    filterTitle: { fontSize: 15, marginBottom: 8, color: colors.textPrimary },
    itemContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 5 },
    item: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: colors.surfaceVariant, marginRight: 8, marginBottom: 8 },
    selected: { backgroundColor: colors.primary },
    title: { fontSize: 13, color: colors.textPrimary },
    actionText: { color: colors.textPrimary, fontSize: 16 },
    cancelText: { color: colors.textSecondary, fontSize: 16 },
    headerTitle: { fontSize: 16, color: colors.textPrimary },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['50%']} onDismiss={() => setModalVisible(false)} scrollable>
      <View style={styles.containerActionsButtons}>
        <TouchableOpacity onPress={() => setModalVisible(false)}>
          <Text style={[styles.cancelText, styles.textFontRegular]}>{tc('cancel')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={reset}>
          <Text style={[styles.actionText, styles.textFontRegular]}>{t('reset')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={sendFilter}>
          <Text style={[styles.actionText, styles.textFontBold]}>{t('apply')}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bottomBar} />
      <View style={styles.contentCard}>
        <Text style={[styles.headerTitle, styles.textFontBold]}>{t('filterTitle')}</Text>
        <View style={styles.filtersContainer}>
          <AnimalsPicker animaux={animaux} mode="multiple" selected={selectedAnimals} setSelected={setSelectedAnimals} setValue={setValue} valueName="animaux" />
          <View>
            <Text style={[styles.filterTitle, styles.textFontRegular]}>Types d'événement :</Text>
            <View style={styles.itemContainer}>
              {typesList.map((item) => (
                <TouchableOpacity key={item.id} onPress={() => handleSelected(item)} style={[styles.item, checkState(item) ? styles.selected : null]}>
                  <Text style={[styles.title, styles.textFontRegular]}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>
    </AppSheet>
  );
};

export default ModalFilterCalendar;
