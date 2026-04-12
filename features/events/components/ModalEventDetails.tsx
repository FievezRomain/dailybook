import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { Image } from 'expo-image';
import { Entypo, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import RatingInput from '../../../shared/components/inputs/RatingInput';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { patchEvent } from '../../../services/api/EventService';
import Toast from 'react-native-toast-message';
import LoggerService from '../../../services/logs/LoggerService';
import FileStorageService from '../../../services/aws/FileStorageService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useAppTheme } from '../../../theme/useAppTheme';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import Constants from 'expo-constants';
import instanceDateUtils from '../../../shared/utils/DateUtils';
import DocumentButton from '../../../shared/components/common/DocumentButton';
import { Event } from '../../../models/Event';
import { Animal } from '../../../models/Animal';

interface ModalEventDetailsProps {
  event?: Event;
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  animaux: Animal[];
  handleEventsChange: () => void;
}

const ModalEventDetails = ({ event = undefined, isVisible, setVisible, animaux, handleEventsChange }: ModalEventDetailsProps) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const fileStorageService = new FileStorageService();
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [localEvent, setLocalEvent] = useState<any>(event ?? undefined);

  useEffect(() => { setLocalEvent(event ?? undefined); }, [isVisible]);

  const closeModal = () => setVisible(false);

  const handleRatingChange = (value: number) => handleInputChange('note', value);

  const getColorEventType = () => {
    if (event === undefined) return;
    const map: Record<string, string> = { depense: colors.quaternary, balade: colors.accent, soins: colors.neutral, concours: colors.primary, entrainement: colors.tertiary, autre: colors.error, rdv: colors.text };
    return map[event.eventtype];
  };

  const getTitleEventType = () => {
    if (event === undefined) return;
    const map: Record<string, string> = { depense: 'Dépense', balade: 'Balade', soins: 'Soin', concours: 'Concours', entrainement: 'Entraînement', autre: 'Autre', rdv: 'Rendez-vous' };
    return map[event.eventtype];
  };

  const getIconEventType = () => {
    if (event === undefined) return;
    const map: Record<string, React.ReactElement> = {
      depense: <FontAwesome6 name="money-bill-wave" size={40} color={colors.background} />,
      balade: <Entypo name="compass" size={40} color={colors.background} />,
      soins: <FontAwesome6 name="hand-holding-medical" size={40} color={colors.background} />,
      concours: <FontAwesome name="trophy" size={40} color={colors.background} />,
      entrainement: <Entypo name="traffic-cone" size={40} color={colors.background} />,
      autre: <FontAwesome6 name="check-circle" size={40} color={colors.background} />,
      rdv: <FontAwesome name="stethoscope" size={40} color={colors.background} />,
    };
    return map[event.eventtype];
  };

  const useLightText = () => ['balade','soins','concours','autre','rdv'].includes(event?.eventtype ?? '');

  const hexToRgba = (hex: string, opacity: number) => {
    if (!hex) return null;
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (_m: string, r: string, g: string, b: string) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` : null;
  };

  const convertDateToText = (date: string | undefined) => {
    if (date == undefined) return '';
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    let dateString = new Date(date).toLocaleDateString('fr-FR', options);
    return dateString.charAt(0).toUpperCase() + dateString.slice(1);
  };

  const getAnimalById = (idAnimal: number) => animaux.filter((a) => a.id === idAnimal)[0];

  function isValidString(str: unknown): boolean { return str !== null && str !== undefined && String(str).trim() !== ''; }

  const checkOverdueEvent = (evt: Event, color: string) => {
    const dateEvent = new Date(evt.dateevent).setHours(0, 0, 0, 0);
    const currentDate = new Date().setHours(0, 0, 0, 0);
    if (dateEvent < currentDate && evt.state !== 'Terminé') {
      const diffDays = Math.ceil(Math.abs(currentDate - dateEvent) / (1000 * 60 * 60 * 24));
      return <Text style={{ color, fontFamily: fonts.default.fontFamily }}>{diffDays} jour(s) de retard</Text>;
    }
  };

  const checkNumericFormat = () => {
    if (localEvent.depense != undefined) {
      const numericValue = parseFloat(String(localEvent.depense).replace(',', '.').replace(' ', ''));
      if (isNaN(numericValue)) { Toast.show({ position: 'top', type: 'error', text1: 'Problème de format sur la valeur de dépense', text2: 'Seul les chiffres, virgule et point sont acceptés' }); return false; }
      else { localEvent.depense = numericValue; }
    }
    return true;
  };

  const handleModifyEvent = () => {
    if (loading || !checkNumericFormat()) return;
    setLoading(true);
    const data: any = { id: localEvent.id, commentaire: localEvent.commentaire, depense: localEvent.depense, animaux: localEvent.animaux, note: localEvent.note, email: firebaseUser?.email ?? '' };
    patchEvent(String(data.id), data)
      .then(() => { handleEventsChange(); setVisible(false); setLoading(false); })
      .catch((err: any) => { Toast.show({ type: 'error', position: 'top', text1: err.message }); LoggerService.log('Erreur lors de la MAJ du commentaire : ' + err.message); setLoading(false); });
  };

  const isWithRating = () => event?.eventtype !== 'depense' && event?.eventtype !== 'rdv' && event?.eventtype !== 'soins';

  const handleInputChange = (key: string, value: unknown) => setLocalEvent((prev: any) => prev ? ({ ...prev, [key]: value }) : prev);

  const textColor = useLightText() ? colors.background : colors.default_dark;
  const eventColor = getColorEventType();

  const styles = StyleSheet.create({
    form: { width: '100%', paddingBottom: 40 },
    containerActionsButtons: { flexDirection: 'row', paddingBottom: 15, backgroundColor: eventColor },
    handleStyleModal: { backgroundColor: eventColor, borderTopEndRadius: 15, borderTopStartRadius: 15, marginBottom: -1 },
    handleIndicatorStyle: { backgroundColor: colors.background },
    tableauPrimaryInfos: { paddingVertical: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    tableauSecondaryInfo: { paddingVertical: 10, justifyContent: 'center', alignItems: 'center', width: '100%' },
    tableauInfos: { marginLeft: 30, marginTop: 10 },
    animauxPicturesContainer: { marginRight: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-end' },
    avatar: { width: 25, height: 25, borderRadius: 15, zIndex: 1, justifyContent: 'center' as const },
    avatarText: { color: colors.background, textAlign: 'center' as const },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    colorTextBlack: { color: colors.default_dark },
    colorTextWhite: { color: colors.background },
    input: { backgroundColor: colors.quaternary, padding: 10, borderRadius: 5, color: colors.default_dark },
  });

  const getTextEventType = () => {
    const textStyle = useLightText() ? styles.colorTextWhite : styles.colorTextBlack;
    const overdueColor = useLightText() ? colors.background : colors.accent;
    return (
      <>
        <Text style={[textStyle, styles.textFontBold]}>{event?.nom}</Text>
        <Text style={[textStyle, styles.textFontRegular]}>{convertDateToText(event?.dateevent)}</Text>
        {event && checkOverdueEvent(event, overdueColor)}
      </>
    );
  };

  return (
    <ModalEditGeneric isVisible={isVisible} setVisible={setVisible} arrayHeight={['90%']} handleStyle={styles.handleStyleModal} handleIndicatorStyle={styles.handleIndicatorStyle}>
      <View style={styles.containerActionsButtons}>
        <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
          <Text style={[{ color: colors.background }, styles.textFontRegular]}>Annuler</Text>
        </TouchableOpacity>
        <View style={{ width: '33.33%', alignItems: 'center' }}>
          <Text style={[styles.textFontBold, { color: colors.background }]}>{getTitleEventType()}</Text>
        </View>
        <TouchableOpacity onPress={() => handleModifyEvent()} style={{ width: '33.33%', alignItems: 'center' }}>
          {loading ? <ActivityIndicator size={10} color={colors.default_dark} /> : <Text style={[{ color: colors.background }, styles.textFontRegular]}>Enregistrer</Text>}
        </TouchableOpacity>
      </View>
      <View style={[styles.tableauPrimaryInfos, { backgroundColor: hexToRgba(eventColor ?? '', 0.5) ?? undefined }]}>
        <View style={{ justifyContent: 'center', marginLeft: 20 }}>
          {getTextEventType()}
        </View>
        <View style={styles.animauxPicturesContainer}>
          {event !== undefined && animaux.length !== 0 && event.animaux?.map((eventAnimal: number) => {
            const animal = getAnimalById(eventAnimal);
            if (!animal) return null;
            return (
              <View key={animal.id} style={{ marginRight: -3 }}>
                <View style={{ height: 25, width: 25, backgroundColor: colors.default_dark, borderRadius: 15, justifyContent: 'center' }}>
                  {animal.image != null ? <Image style={styles.avatar} source={{ uri: fileStorageService.getFileUrl(animal.image, firebaseUser?.uid ?? '') }} cachePolicy="disk" /> : <Text style={[styles.avatarText, styles.textFontRegular]}>{animal.nom[0]}</Text>}
                </View>
              </View>
            );
          })}
        </View>
      </View>
      {isWithRating() && (
        <View style={[styles.tableauSecondaryInfo, { backgroundColor: hexToRgba(eventColor ?? '', 0.2) ?? undefined }]}>
          <RatingInput onRatingChange={handleRatingChange} defaultRating={localEvent.note ?? 0} margin={0} size={25} color={eventColor} />
        </View>
      )}
      <KeyboardAwareScrollView ref={scrollRef} keyboardShouldPersistTaps="handled" enableOnAndroid={true} extraScrollHeight={10}>
        <View style={styles.tableauInfos}>
          {isValidString(localEvent.heuredebutevent) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Heure : {localEvent.heuredebutevent}</Text></View>}
          {isValidString(localEvent.discipline) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Discipline : {localEvent.discipline}</Text></View>}
          {isValidString(localEvent.lieu) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Lieu : {localEvent.lieu}</Text></View>}
          {isValidString(localEvent.datefinbalade) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Date de fin de balade : {localEvent.datefinbalade.includes('-') ? instanceDateUtils.dateFormatter(localEvent.datefinbalade, 'yyyy-mm-dd', '-') : localEvent.datefinbalade}</Text></View>}
          {isValidString(localEvent.heurefinbalade) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Heure de fin de balade : {localEvent.heurefinbalade}</Text></View>}
          {isValidString(localEvent.epreuve) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Épreuve : {localEvent.epreuve}</Text></View>}
          {isValidString(localEvent.dossart) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Dossart : {localEvent.dossart}</Text></View>}
          {localEvent.placement != null && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Classement : {localEvent.placement}</Text></View>}
          {isValidString(localEvent.specialiste) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Spécialiste : {localEvent.specialiste}</Text></View>}
          {event?.eventtype !== 'depense' && localEvent.depense != null && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Dépense : {localEvent.depense ? parseFloat(localEvent.depense).toFixed(2) : localEvent.depense}</Text></View>}
          {isValidString(localEvent.traitement) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Traitement : {localEvent.traitement}</Text></View>}
          {isValidString(localEvent.datefinsoins) && <View style={{ marginBottom: 5 }}><Text style={[styles.textFontRegular, styles.colorTextBlack]}>Date de fin du soin : {localEvent.datefinsoins.includes('-') ? instanceDateUtils.dateFormatter(localEvent.datefinsoins, 'yyyy-mm-dd', '-') : localEvent.datefinsoins}</Text></View>}
          {event?.eventtype !== 'depense' ? (
            <View style={{ width: '90%' }}>
              <Text style={[{ marginBottom: 5 }, styles.textFontRegular, styles.colorTextBlack]}>Commentaire :</Text>
              <TextInput style={[styles.input, styles.textFontRegular, { height: 200 }]} multiline={true} numberOfLines={4} maxLength={2000} placeholder="Exemple : Ça s'est très bien passé" onFocus={(e) => { if (Constants.platform?.ios) { e.target?.measure((_x: number, _y: number, _w: number, _h: number, _px: number, pageY: number) => { scrollRef.current?.scrollToPosition(0, Math.max(pageY - 100, 0), true); }); } }} onChangeText={(text) => handleInputChange('commentaire', text)} defaultValue={localEvent.commentaire} />
            </View>
          ) : (
            <View style={{ marginBottom: 5, width: '90%' }}>
              <Text style={[styles.textFontRegular, { marginBottom: 5 }, styles.colorTextBlack]}>Dépense : </Text>
              <TextInput style={[styles.input, styles.textFontRegular, { borderRadius: 5 }]} placeholder="Exemple : 1" keyboardType="decimal-pad" inputMode="decimal" onChangeText={(text) => handleInputChange('depense', text)} defaultValue={localEvent?.depense != null ? String(parseFloat(String(localEvent.depense)).toFixed(2)) : undefined} />
            </View>
          )}
          {(event?.eventtype === 'rdv' || event?.eventtype === 'soins') && (
            <FlatList data={(event as any).documents} keyExtractor={(_item: any, index: number) => index.toString()} ListHeaderComponent={<Text style={[styles.textFontRegular, { color: colors.default_dark }]}>Documents :</Text>} ListEmptyComponent={<Text style={{ color: colors.default_dark }}>Aucun document lié à l'événement</Text>} numColumns={3} scrollEnabled={false} renderItem={({ item }) => <DocumentButton item={item} event={event as any} />} columnWrapperStyle={{ justifyContent: 'space-around' }} style={{ paddingTop: 10, paddingRight: 30 }} />
          )}
        </View>
      </KeyboardAwareScrollView>
    </ModalEditGeneric>
  );
};

export default ModalEventDetails;
