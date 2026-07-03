import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Keyboard } from 'react-native';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import { AppDivider } from '../../../shared/components/ui';
import { AntDesign, Entypo, Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { isBefore, isEqual, startOfDay } from 'date-fns';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import AppSheet from '../../../shared/components/ui/AppSheet';
import ModalAnimals from '../../animals/components/ModalSelectAnimals';
import ModalDropdown from '../../../shared/components/modals/inputs/ModalDropdown';
import ModalNotifications from '../../../shared/components/modals/inputs/ModalNotifications';
import CalendarPicker from '../../../shared/components/modals/inputs/ModalDatePicker';
import ModalMultiSelect from '../../../shared/components/modals/inputs/ModalMultiSelect';
import RatingInput from '../../../shared/components/inputs/RatingInput';
import StatePicker from '../../../shared/components/inputs/StatePicker';
import TimePicker from '../../../shared/components/inputs/TimePicker';
import DocumentPickerComponent from '../../../shared/components/inputs/DocumentPickerComponent';
import FilesList from '../../../shared/components/common/FilesList';
import { createEvent, updateEvent } from '../../../services/api/EventService';
import { useAuthStore } from '../../../stores/useAuthStore';
import LoggerService from '../../../services/logs/LoggerService';
import FileStorageService from '../../../services/aws/FileStorageService';
import instanceDateUtils from '../../../shared/utils/DateUtils';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { useGroupsQuery } from '../../../hooks/queries/useGroupsQuery';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import * as Haptics from 'expo-haptics';
import { ModalEventsProps } from '../types';
import {
  EVENT_TYPE_LIST,
  NOTIF_LIST,
  NOTIF_OPTIONS_LIST,
  EXPENSE_CATEGORY_LIST,
  FREQUENCY_LIST,
} from '../constants';
import { getColorByEventType, hexToRgba, checkNumericFormat } from '../utils/eventHelpers';

const ModalEvents = ({ isVisible, setVisible, actionType, event = undefined, onModify = undefined, date = null }: ModalEventsProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('events');
  const { t: tc } = useTranslation('common');
  const { firebaseUser, user } = useAuthStore();
  const accountType = (user as any)?.abonnement?.libelle;
  const sheetRef = useRef<BottomSheetModal>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalDropdownVisible, setModalDropdownVisible] = useState(false);
  const [modalDropdownNotifVisible, setModalDropdownNotifVisible] = useState(false);
  const [modalNotifications, setModalNotifications] = useState(false);
  const [modalOptionNotifications, setModalOptionNotifications] = useState(false);
  const [modalCategorieDepense, setModalCategorieDepense] = useState(false);
  const [modalFrequence, setModalFrequence] = useState(false);
  const [modalMultiSelectGroupVisible, setModalMultiSelectGroupVisible] = useState(false);
  const { data: animaux = [] } = useAnimalsQuery();
  const { data: groups = [] } = useGroupsQuery();
  const [selected, setSelected] = useState<any[]>([]);
  const [eventType, setEventTypeRaw] = useState<any>(false);
  const setEventType = (item: any) => { setEventTypeRaw(item); Haptics.selectionAsync().catch(() => undefined); };
  const [notifType, setNotifType] = useState<any>(false);
  const [optionNotifType, setOptionNotifType] = useState<any>(false);
  const [categorieDepense, setCategorieDepense] = useState<any>(false);
  const [frequence, setFrequence] = useState<any>(false);
  const [dateEvent, setDateEvent] = useState<Date | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: events = [] } = useEventsQuery();
  const scrollRef = useRef<any>(null);
  const fileStorageService = new FileStorageService();
  const { register, handleSubmit, formState: { errors }, setValue, getValues, watch } = useForm();
  const initializedEventKeyRef = useRef<string | null>(null);

  const list = EVENT_TYPE_LIST;
  const listNotif = NOTIF_LIST;
  const listOptionsNotif = NOTIF_OPTIONS_LIST;
  const listCategorieDepense = EXPENSE_CATEGORY_LIST;
  const listFrequency = FREQUENCY_LIST;
  const arrayState = [
    { value: 'é faire', label: 'é faire', checkedColor: colors.primary, uncheckedColor: colors.surfaceVariant, style: { borderRadius: 5 }, rippleColor: 'transparent' },
    { value: 'Terminé', label: 'Terminé', checkedColor: colors.primary, uncheckedColor: colors.surfaceVariant, style: { borderRadius: 5 }, rippleColor: 'transparent' },
  ];

  useEffect(() => {
    if (isVisible) { sheetRef.current?.present(); } else { sheetRef.current?.dismiss(); }
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) {
      initializedEventKeyRef.current = null;
      return;
    }

    const eventKey = `${actionType}:${event?.id ?? 'new'}:${event?.eventtype ?? ''}:${date ?? ''}`;
    if (initializedEventKeyRef.current === eventKey) return;

    initializedEventKeyRef.current = eventKey;
    initValuesEvent(event);
    if (event?.idparent != null) getEvents();
  }, [actionType, date, event?.eventtype, event?.id, event?.idparent, isVisible]);

  useEffect(() => {
    if (!isVisible || actionType === 'create') return;
    initValuesEvent(event);
    if (event?.idparent != null) getEvents();
  }, [animaux, isVisible]);

  const getEvents = async () => {
    const eventParent = (events as any[]).filter(e => e.id === event?.idparent);
    if (eventParent.length > 0) await initValuesEvent(eventParent[0]);
  };

  const initValuesEvent = (evt: any) => {
    if (!evt) return;
    setValue('id', evt.id);
    setValue('dateevent', evt.dateevent === undefined ? new Date().toISOString().split('T')[0] : evt.dateevent);
    let defaultDate: Date | null = null;
    if (evt.dateevent && evt.heuredebutevent) {
      defaultDate = new Date(evt.dateevent);
      const heure = parseInt(evt.heuredebutevent.split('h')[0], 10);
      const minutes = parseInt(evt.heuredebutevent.split('h')[1], 10);
      defaultDate.setHours(heure); defaultDate.setMinutes(minutes);
    }
    setDateEvent(defaultDate);
    setValue('nom', evt.nom);
    setValue('heuredebutevent', evt.heuredebutevent ?? null);
    setValue('lieu', evt.lieu);
    setValue('heuredebutbalade', evt.heuredebutbalade);
    setValue('datefinbalade', evt.datefinbalade != null ? (evt.datefinbalade.includes('/') ? instanceDateUtils.dateFormatter(evt.datefinbalade, 'dd/MM/yyyy', '/') : evt.datefinbalade) : undefined);
    setValue('heurefinbalade', evt.heurefinbalade);
    setValue('discipline', evt.discipline);
    setValue('note', evt.note);
    setValue('epreuve', evt.epreuve);
    setValue('dossart', evt.dossart);
    setValue('placement', evt.placement);
    setValue('specialiste', evt.specialiste);
    setValue('depense', evt.depense);
    setValue('traitement', evt.traitement);
    setValue('datefinsoins', evt.datefinsoins != null ? (evt.datefinsoins.includes('/') ? instanceDateUtils.dateFormatter(evt.datefinsoins, 'dd/MM/yyyy', '/') : evt.datefinsoins) : undefined);
    setValue('commentaire', evt.commentaire);
    setValue('animaux', evt.animaux);
    if (evt.animaux != undefined) {
      const animauxSelected = (animaux as any[]).filter(item => evt.animaux.includes(item.id));
      if (animauxSelected) setSelected(animauxSelected);
    }
    setValue('eventtype', evt.eventtype);
    const eventTypeSelected = list.find(item => item.id === evt.eventtype);
    if (eventTypeSelected) setEventTypeRaw(eventTypeSelected);
    else setEventTypeRaw(false);
    setValue('frequencevalue', evt.frequencevalue);
    if (evt.frequencevalue) {
      switch (evt.frequencevalue) {
        case 'tlj': setFrequence(listFrequency[1]); break;
        case 'tls': setFrequence(listFrequency[2]); break;
        case 'tl2s': setFrequence(listFrequency[3]); break;
        case 'tlm': setFrequence(listFrequency[4]); break;
      }
    }
    setValue('depense', evt.depense);
    setValue('categoriedepense', evt.categoriedepense);
    setValue('frequencetype', evt.frequencetype);
    setValue('notif', evt.optionnotification);
    setValue('optionnotif', evt.rappelnotification);
    if (evt.optionnotification) {
      const found = listNotif.find(e => e.id === evt.optionnotification);
      if (found) setNotifType(found);
    }
    if (evt.rappelnotification) {
      const found = listOptionsNotif.find(e => e.id === evt.rappelnotification);
      if (found) setOptionNotifType(found);
    }
    setValue('state', evt.state === undefined ? 'é faire' : evt.state);
    setValue('todisplay', evt.todisplay === undefined ? true : evt.todisplay);
    setValue('idparent', evt.idparent);
    if (actionType === 'create' && date !== null) { setValue('dateevent', new Date(date).toISOString().split('T')[0]); onChangeDate('dateevent', date); }
    setValue('documents', evt.documents ?? undefined);
    setValue('shared_groups', evt.shared_groups ?? undefined);
    setValue('created_by', evt.created_by);
    setValue('made_by', evt.made_by);
  };

  const resetValues = () => {
    ['id','dateevent','nom','heuredebutevent','lieu','heuredebutbalade','datefinbalade','heurefinbalade','discipline','note','epreuve','dossart','placement','specialiste','depense','traitement','datefinsoins','commentaire','eventtype','notif','optionnotif','frequencevalue','categoriedepense','frequencetype','state','todisplay','idparent','documents','shared_groups','created_by','made_by'].forEach(k => setValue(k, k === 'dateevent' ? (event as any)?.dateevent : ''));
    setSelected([]); setNotifType(false); setOptionNotifType(false); setFrequence(false); setEventType(false);
  };

  const onChangeDate = (propertyName: string, selectedDate: any) => {
    setValue(propertyName, selectedDate);
    const today = startOfDay(new Date());
    const sel = startOfDay(typeof selectedDate === 'string' ? new Date(selectedDate) : selectedDate);
    if (isEqual(sel, today)) return;
    if (isBefore(sel, today)) { handleStateChange('Terminé'); setNotifType({ title: 'Aucune notification', id: 'None' }); setValue('notif', 'None'); }
    else { handleStateChange('é faire'); setNotifType({ title: 'Notification le jour J', id: 'JourJ' }); setValue('notif', 'JourJ'); }
  };

  const handleRatingChange = (value: number) => setValue('note', value);
  const handleFrequencyChange = (newValue: string, newType: string) => { setValue('frequencevalue', newValue); setValue('frequencetype', newType); };
  const handleStateChange = (value: string) => setValue('state', value);

  const convertDateToText = (fieldname: string) => {
    const d = watch(fieldname);
    if (d == undefined) return '';
    return String(new Date(d).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
  };

  const closeModal = () => { resetValues(); setVisible(false); };

  const checkNumericFormatLocal = (data: Record<string, unknown>, attribute: string) => checkNumericFormat(data, attribute);

  const onDocumentsChange = (documents: any) => setValue('documents', documents);
  const markFileAsDeleted = (filename: string) => {
    const updated = [...getValues('documents')];
    const index = updated.findIndex((a: any) => a.name === filename);
    if (updated[index].isNew) updated.splice(index, 1);
    else updated[index].toDelete = true;
    setValue('documents', updated);
  };

  const onGroupsSelectedChange = (selectedGroup: any) => {
    const arrayGroup = getValues('shared_groups');
    if (!arrayGroup || arrayGroup.length === 0) { setValue('shared_groups', [selectedGroup]); return; }
    const updated = [...arrayGroup];
    const idx = updated.findIndex((g: any) => g.id === selectedGroup.id);
    if (idx !== -1) { updated.splice(idx, 1); setValue('shared_groups', updated.length === 0 ? undefined : updated); }
    else { updated.push(selectedGroup); setValue('shared_groups', updated); }
  };

  const getSelectableGroup = () => {
    const selectedAnimals = getValues('animaux');
    if (!Array.isArray(selectedAnimals)) return [];
    return (groups as any[]).filter(group => {
      const groupAnimalIds = group.data.animals.filter((ag: any) => ag.type === 'accepted').flatMap((a: any) => a.items.map((animal: any) => animal.id));
      return selectedAnimals.every((id: number) => groupAnimalIds.includes(id));
    });
  };

  const getSelectableAnimals = () => {
    const selectedGroups = getValues('shared_groups');
    if (!Array.isArray(selectedGroups) || selectedGroups.length === 0) return animaux;
    const acceptedPerGroup = selectedGroups.map((group: any) => {
      const groupData = (groups as any[]).find(g => g.id === group.id);
      if (!groupData) return [];
      return groupData.data.animals.filter((ag: any) => ag.type === 'accepted').flatMap((ag: any) => ag.items.map((animal: any) => animal.id));
    });
    const intersectionIds = acceptedPerGroup.reduce((acc: number[], ids: number[]) => acc.filter(id => ids.includes(id)));
    return (animaux as any[]).filter(animal => intersectionIds.includes(animal.id));
  };

  const submitRegister = async (data: any) => {
    try {
      if (loading) return;
      let complete = true;
      setLoading(true);
      if (data.dateevent === undefined) { complete = false; Toast.show({ type: 'error', position: 'top', text1: 'Veuillez saisir une date pour l\'événement' }); }
      if (selected.length === 0) { complete = false; Toast.show({ type: 'error', position: 'top', text1: 'Veuillez saisir un animal' }); }
      else { setValue('animaux', selected.map(item => item['id'])); }
      if (data.nom === undefined) { complete = false; Toast.show({ type: 'error', position: 'top', text1: 'Veuillez saisir un nom d\'événement' }); }
      if (eventType === false) { complete = false; Toast.show({ type: 'error', position: 'top', text1: 'Veuillez saisir un type d\'événement' }); }
      else {
        if (eventType.id === 'soins' && data.datefinsoins !== undefined && new Date(data.dateevent) > new Date(data.datefinsoins)) { complete = false; Toast.show({ type: 'error', position: 'top', text1: 'Date de fin de traitement postérieure é la date d\'événement' }); }
        if (eventType.id === 'balade' && data.datefinbalade !== undefined && new Date(data.dateevent) > new Date(data.datefinbalade)) { complete = false; Toast.show({ type: 'error', position: 'top', text1: 'Date de fin de balade postérieure é la date d\'événement' }); }
      }
      if (!checkNumericFormatLocal(data, 'depense') || !checkNumericFormatLocal(data, 'dossart') || !checkNumericFormatLocal(data, 'placement')) complete = false;
      if (complete === true) {
        if (notifType === false) data.notif = 'JourJ';
        if (frequence === false) data.frequencevalue = 'tlj';
        const expoToken = await AsyncStorage.getItem('userExpoToken');
        const timezone = await AsyncStorage.getItem('userTimezone');
        if (expoToken) data.expotoken = JSON.parse(expoToken);
        if (timezone) data.timezone = JSON.parse(timezone);
        data.email = firebaseUser?.email ?? '';
        if (Array.isArray(data.documents) && data.documents.length > 0) {
          const docsToUpload = data.documents.filter((f: any) => f.isNew && !f.toDelete);
          const docsToKeep = data.documents.filter((f: any) => !f.isNew && !f.toDelete);
          const docsToRemove = data.documents.filter((f: any) => !f.isNew && f.toDelete);
          const documentsFilenameArray: string[] = [];
          for (const doc of docsToUpload) { let fn = doc.name.split('/'); fn = fn[fn.length - 1]; await fileStorageService.uploadFile(doc.uri, fn, doc.mimeType, firebaseUser?.uid ?? '', 'evenements/'); documentsFilenameArray.push(fn); }
          for (const doc of docsToKeep) { let fn = doc.name.split('/'); fn = fn[fn.length - 1]; documentsFilenameArray.push(fn); }
          for (const doc of docsToRemove) { let fn = doc.name.split('/'); fn = fn[fn.length - 1]; await fileStorageService.deleteFile(fn, firebaseUser?.uid ?? ''); }
          data.documents = documentsFilenameArray;
        }
        if (data.state === 'Terminé' && !data.made_by) data.made_by = { email: firebaseUser?.email ?? '' };
        if (actionType === 'modify') {
          updateEvent(data.id, data).then(() => { resetValues(); closeModal(); onModify?.(); setLoading(false); }).catch((err: any) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la MAJ d\'un event : ' + err.message); setLoading(false); });
        } else {
          createEvent(data).then(() => { closeModal(); onModify?.(); setLoading(false); }).catch((err: any) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la création d\'un event : ' + err.message); setLoading(false); });
        }
      } else setLoading(false);
    } catch (error: any) { LoggerService.log('Erreur lors de l\'enregistrement/modification d\'un event : ' + error.message); }
  };

  const styles = {
    inputToggleContainer: { display: 'flex', flexDirection: 'row', width: '100%', marginBottom: 15 },
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', alignItems: 'center', paddingBottom: 15, paddingTop: 5, backgroundColor: eventType ? hexToRgba(getColorByEventType(eventType.id), 0.3) ?? undefined : colors.background },
    formContainer: { paddingLeft: 30, paddingRight: 30, paddingTop: 10, paddingBottom: 10 },
    inputContainer: { width: '100%' },
    textInput: { alignSelf: 'flex-start', marginBottom: 5, color: colors.textPrimary },
    input: { height: 40, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary, alignSelf: 'baseline' },
    inputTextArea: { height: 100, width: '100%', marginBottom: 15, borderRadius: 5, paddingLeft: 15, paddingRight: 15, backgroundColor: colors.surfaceVariant, color: colors.textPrimary },
    containerDate: { flexDirection: 'column', alignSelf: 'flex-start', width: '100%', marginBottom: 15 },
    containerAnimaux: { display: 'flex', flexDirection: 'row', flexWrap: 'wrap' },
    badgeAnimal: { padding: 10 },
    containerBadgeAnimal: { borderRadius: 5, backgroundColor: colors.surfaceVariant, marginRight: 5, marginBottom: 5 },
    errorInput: { color: colors.error },
    disabled: { backgroundColor: colors.surfaceVariant },
    disabledText: { color: colors.textDisabled },
    premiumOverlay: { position: 'absolute', top: 30, right: 5, backgroundColor: colors.primary, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, zIndex: 2 },
    premiumText: { fontSize: 10, color: colors.background, fontFamily: fonts.bodySmall.fontFamily },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <>
      <AppSheet ref={sheetRef} snapPoints={['90%']} onDismiss={() => setVisible(false)} keyboardBehavior="extend">
        {modalVisible && (
          <ModalAnimals modalVisible={modalVisible} setModalVisible={setModalVisible} setAnimaux={undefined} animaux={getSelectableAnimals()} selected={selected} setSelected={setSelected} setValue={setValue} valueName="animaux" />
        )}
        {modalDropdownVisible && (
          <ModalDropdown list={list} modalVisible={modalDropdownVisible} setModalVisible={setModalDropdownVisible} setState={setEventType} state={eventType} setValue={setValue} valueName="eventtype" />
        )}
        {modalDropdownNotifVisible && (
          <ModalDropdown list={listNotif} modalVisible={modalDropdownNotifVisible} setModalVisible={setModalDropdownNotifVisible} setState={setNotifType} state={notifType} setValue={setValue} valueName="notif" />
        )}
        {modalOptionNotifications && (
          <ModalDropdown list={listOptionsNotif} modalVisible={modalOptionNotifications} setModalVisible={setModalOptionNotifications} setState={setOptionNotifType} state={optionNotifType} setValue={setValue} valueName="optionnotif" />
        )}
        {modalCategorieDepense && (
          <ModalDropdown list={listCategorieDepense} modalVisible={modalCategorieDepense} setModalVisible={setModalCategorieDepense} setState={setCategorieDepense} state={categorieDepense} setValue={setValue} valueName="categoriedepense" modalHeight="50%" />
        )}
        {modalFrequence && (
          <ModalDropdown list={listFrequency} modalVisible={modalFrequence} setModalVisible={setModalFrequence} setState={setFrequence} state={frequence} setValue={setValue} valueName="frequencevalue" />
        )}
        {modalNotifications && (
          <ModalNotifications modalVisible={modalNotifications} setModalVisible={setModalNotifications} notifications={notifications} setNotifications={setNotifications} eventType={eventType} />
        )}
        {modalMultiSelectGroupVisible && (
          <ModalMultiSelect list={getSelectableGroup()} onChange={onGroupsSelectedChange} onClose={() => setModalMultiSelectGroupVisible(false)} visible={modalMultiSelectGroupVisible} valueKey="id" labelKey="name" selected={watch('shared_groups')} customizable={false} />
        )}
        <View style={styles.form}>
          <View style={styles.containerActionsButtons}>
            <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
              <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('cancel')}</Text>
            </TouchableOpacity>
            <View style={{ width: '33.33%', alignItems: 'center' }}>
              <Text style={[styles.textFontBold, { color: getColorByEventType(eventType?.id), fontSize: 16 }]}>{eventType && eventType.title}</Text>
            </View>
            <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
              {loading ? <ActivityIndicator size={16} color={colors.textPrimary} /> : actionType === 'modify' ? <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('edit')}</Text> : <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{tc('create')}</Text>}
            </TouchableOpacity>
          </View>
          <AppDivider />
          <KeyboardAwareScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10} enableResetScrollToCoords={false}>
            <View style={styles.formContainer}>
              <Text style={[styles.textInput, styles.textFontRegular]}>Status de l'événement :</Text>
              <View style={styles.inputToggleContainer}>
                <StatePicker arrayState={arrayState} handleChange={handleStateChange} defaultState={watch('state') === undefined ? 'é faire' : watch('state')} color={colors.surfaceVariant} />
              </View>
              {actionType === 'modify' && eventType && (eventType.id === 'soins' || eventType.id === 'balade') ? (
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Date : <Text style={{ color: colors.error }}>(Non modifiable)</Text></Text>
                  <TextInput style={[styles.input, styles.textFontRegular, styles.disabledText, styles.disabled]} placeholder="Exemple : 01/01/2024" placeholderTextColor={colors.secondary} defaultValue={convertDateToText('dateevent')} editable={false} />
                </View>
              ) : (
                <View style={styles.containerDate}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Date : {convertDateToText('dateevent')} <Text style={{ color: colors.error }}>*</Text></Text>
                  <CalendarPicker onDayChange={onChangeDate} propertyName="dateevent" defaultDate={getValues('dateevent')} />
                </View>
              )}
              <View style={styles.inputContainer}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Animaux : <Text style={{ color: colors.error }}>*</Text></Text>
                <TouchableOpacity style={styles.textInput} disabled={(animaux as any[]).length > 0 ? false : true} onPress={() => { Keyboard.dismiss(); setModalVisible(true); }}>
                  <View style={styles.containerAnimaux}>
                    {(animaux as any[]).length === 0 && <View><Text style={[styles.badgeAnimal, styles.errorInput, styles.textFontRegular]}>Pour ajouter un événement vous devez d'abord créer un animal</Text></View>}
                    {selected.length === 0 && (animaux as any[]).length > 0 && <View style={[styles.containerBadgeAnimal, { width: '100%' }]}><Text style={[styles.badgeAnimal, styles.textFontRegular, { color: colors.secondary }]}>Sélectionner un ou plusieurs animaux</Text></View>}
                    {selected.map((animal: any) => <View key={animal.id} style={styles.containerBadgeAnimal}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{animal.nom}</Text></View>)}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Nom de l'événement : <Text style={{ color: colors.error }}>*</Text></Text>
                {errors.nom && <Text style={[styles.errorInput, styles.textFontRegular]}>{t('nameRequired')}</Text>}
                <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Rendez-vous vétérinaire" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('nom', text)} defaultValue={getValues('nom')} {...register('nom', { required: true })} />
              </View>
              {eventType && eventType.id === 'soins' && (
                <View style={styles.containerDate}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Date de fin : {convertDateToText('datefinsoins')} <Text style={{ color: colors.error }}>*</Text></Text>
                  <CalendarPicker onDayChange={onChangeDate} propertyName="datefinsoins" defaultDate={watch('datefinsoins')} />
                </View>
              )}
              {eventType && eventType.id === 'balade' && (
                <View style={styles.containerDate}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Date de fin : {convertDateToText('datefinbalade')} <Text style={{ color: colors.error }}>*</Text></Text>
                  <CalendarPicker onDayChange={onChangeDate} propertyName="datefinbalade" defaultDate={watch('datefinbalade')} />
                </View>
              )}
              <AppDivider />
              <View style={[styles.inputContainer, { marginBottom: 15, marginTop: 15 }]}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Heure de début : </Text>
                <TimePicker setValue={setValue} valueName="heuredebutevent" defaultValue={dateEvent} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Lieu de l'événement :</Text>
                <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : écurie de la Pomme" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('lieu', text)} defaultValue={getValues('lieu')} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Partager aux groupes :</Text>
                <TouchableOpacity style={styles.textInput} onPress={() => { Keyboard.dismiss(); setModalMultiSelectGroupVisible(true); }} disabled={getSelectableGroup().length === 0}>
                  <View style={styles.containerAnimaux}>
                    {(getValues('shared_groups') === undefined || getValues('shared_groups') === null) ? (
                      <View style={[styles.containerBadgeAnimal, { width: '100%', flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={[styles.badgeAnimal, styles.textFontRegular, { color: colors.secondary }]}>{getSelectableGroup().length === 0 ? (Array.isArray(getValues('animaux')) ? 'Aucun groupe disponible avec l\'ensemble de ces animaux partagés' : 'Aucun animal sélectionné') : 'Sélectionner un ou plusieurs groupes'}</Text>
                      </View>
                    ) : getValues('shared_groups').map((group: any) => <View key={group.id} style={styles.containerBadgeAnimal}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{group.name}</Text></View>)}
                  </View>
                </TouchableOpacity>
              </View>
              {eventType && eventType.id === 'balade' && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Ressenti :</Text>
                  <RatingInput onRatingChange={handleRatingChange} defaultRating={getValues('note')} />
                </View>
              )}
              {eventType && eventType.id === 'entrainement' && (
                <>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Discipline : </Text><TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : CSO" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('discipline', text)} defaultValue={getValues('discipline')} /></View>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Ressenti :</Text><RatingInput onRatingChange={handleRatingChange} defaultRating={getValues('note')} /></View>
                </>
              )}
              {eventType && eventType.id === 'concours' && (
                <>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Discipline : </Text><TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : CSO" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('discipline', text)} defaultValue={getValues('discipline')} /></View>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Epreuve :</Text><TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Club 1" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('epreuve', text)} defaultValue={getValues('epreuve')} /></View>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Dossart :</Text><TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 1" keyboardType="decimal-pad" inputMode="decimal" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('dossart', text)} defaultValue={getValues('dossart')} /></View>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Classement :</Text><TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 1" keyboardType="decimal-pad" inputMode="decimal" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('placement', text)} defaultValue={getValues('placement')} /></View>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Ressenti :</Text><RatingInput onRatingChange={handleRatingChange} defaultRating={getValues('note')} /></View>
                </>
              )}
              {eventType && eventType.id === 'rdv' && (
                <>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Spécialiste :</Text><TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Vétérinaire" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('specialiste', text)} defaultValue={getValues('specialiste')} /></View>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Documents :</Text><DocumentPickerComponent onChange={onDocumentsChange} accountType={accountType} value={watch('documents') || []} /><FilesList onMarkDelete={markFileAsDeleted} files={watch('documents') || []} /></View>
                </>
              )}
              {eventType && eventType.id === 'soins' && (
                <>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Documents :</Text><DocumentPickerComponent onChange={onDocumentsChange} accountType={accountType} value={watch('documents') || []} /><FilesList onMarkDelete={markFileAsDeleted} files={watch('documents') || []} /></View>
                  <View style={styles.inputContainer}><Text style={[styles.textInput, styles.textFontRegular]}>Traitement : </Text><TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : Cure de CMV" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('traitement', text)} defaultValue={getValues('traitement')} /></View>
                  <View style={styles.inputContainer}>
                    <Text style={[styles.textInput, styles.textFontRegular]}>Fréquence : {actionType === 'modify' && eventType.id === 'soins' && <Text style={{ color: colors.error }}>(Non modifiable)</Text>}</Text>
                    <TouchableOpacity style={styles.textInput} onPress={() => { Keyboard.dismiss(); setModalFrequence(true); }} disabled={actionType === 'modify' && eventType.id === 'soins'}>
                      <View style={styles.containerAnimaux}>
                        {frequence === false ? <View style={[styles.containerBadgeAnimal, actionType === 'modify' && eventType.id === 'soins' && styles.disabled, { width: '100%' }]}><Text style={[styles.badgeAnimal, styles.textFontRegular, actionType === 'modify' && eventType.id === 'soins' && styles.disabledText, { color: colors.secondary }]}>Par défaut, le soin sera le jour J</Text></View> : <View style={[styles.containerBadgeAnimal, actionType === 'modify' && eventType.id === 'soins' && styles.disabled, { width: '100%' }]}><Text style={[styles.badgeAnimal, styles.textFontRegular, actionType === 'modify' && eventType.id === 'soins' && styles.disabledText]}>{frequence.title}</Text></View>}
                      </View>
                    </TouchableOpacity>
                  </View>
                </>
              )}
              <View style={styles.inputContainer}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Dépense :</Text>
                <TextInput style={[styles.input, styles.textFontRegular]} placeholder="Exemple : 1" keyboardType="decimal-pad" inputMode="decimal" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('depense', text)} defaultValue={getValues('depense')} />
              </View>
              {eventType && eventType.id === 'depense' && (
                <View style={styles.inputContainer}>
                  <Text style={[styles.textInput, styles.textFontRegular]}>Catégorie :</Text>
                  <TouchableOpacity style={styles.textInput} onPress={() => { Keyboard.dismiss(); setModalCategorieDepense(true); }}>
                    <View style={styles.containerAnimaux}>
                      {categorieDepense === false ? <View style={[styles.containerBadgeAnimal, { width: '100%' }]}><Text style={[styles.badgeAnimal, styles.textFontRegular, { color: colors.secondary }]}>Par défaut, la dépense n'est dans aucune catégorie</Text></View> : <View style={[styles.containerBadgeAnimal, { width: '100%' }]}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{categorieDepense.title}</Text></View>}
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              <View style={styles.inputContainer}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Commentaire :</Text>
                <TextInput style={[styles.inputTextArea, styles.textFontRegular]} multiline={true} numberOfLines={4} maxLength={2000} placeholder="Exemple : éa s'est trés bien passé" placeholderTextColor={colors.secondary} onChangeText={(text) => setValue('commentaire', text)} defaultValue={getValues('commentaire')} onFocus={() => { if (Constants.platform?.ios) setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100); }} />
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Notifications :</Text>
                <TouchableOpacity style={styles.textInput} onPress={() => { Keyboard.dismiss(); setModalDropdownNotifVisible(true); }}>
                  <View style={styles.containerAnimaux}>
                    {notifType === false ? <View style={[styles.containerBadgeAnimal, { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15 }]}><View style={{ width: '90%' }}><Text style={[styles.badgeAnimal, styles.textFontRegular, { color: colors.secondary }]}>Par défaut, vous recevrez une notification le jour J</Text></View><Ionicons name="chevron-down" size={20} /></View> : <View style={[styles.containerBadgeAnimal, { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15 }]}><View style={{ width: '90%' }}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{notifType.title}</Text></View><Ionicons name="chevron-down" size={20} /></View>}
                  </View>
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={[styles.textInput, styles.textFontRegular]}>Rappel :</Text>
                <TouchableOpacity style={styles.textInput} onPress={() => { Keyboard.dismiss(); setModalOptionNotifications(true); }}>
                  <View style={styles.containerAnimaux}>
                    {optionNotifType === false ? <View style={[styles.containerBadgeAnimal, { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15 }]}><View style={{ width: '90%' }}><Text style={[styles.badgeAnimal, styles.textFontRegular, { color: colors.secondary }]}>{t('noReminder')}</Text></View><Ionicons name="chevron-down" size={20} /></View> : <View style={[styles.containerBadgeAnimal, { width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15 }]}><View style={{ width: '90%' }}><Text style={[styles.badgeAnimal, styles.textFontRegular]}>{optionNotifType.title}</Text></View><Ionicons name="chevron-down" size={20} /></View>}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </AppSheet>
    </>
  );
};

export default ModalEvents;
