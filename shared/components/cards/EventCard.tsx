import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Entypo, MaterialIcons, FontAwesome6, FontAwesome } from '@expo/vector-icons';
import BaladeCard from '../../../features/events/components/eventCards/BaladeCard';
import SoinsCard from '../../../features/events/components/eventCards/SoinsCard';
import AutreCard from '../../../features/events/components/eventCards/AutreCard';
import EntrainementCard from '../../../features/events/components/eventCards/EntrainementCard';
import ConcoursCard from '../../../features/events/components/eventCards/ConcoursCard';
import RdvCard from '../../../features/events/components/eventCards/RdvCard';
import DepenseCard from '../../../features/events/components/eventCards/DepenseCard';
import ModalEvents from '../../../features/events/components/ModalEvents';
import ModalSubMenuEventActions from '../../../features/events/components/ModalSubMenuEventActions';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import ModalEventDetails from '../../../features/events/components/ModalEventDetails';
import { deleteEvent, patchEvent } from '../../../services/api/EventService';
import LoggerService from '../../../services/logs/LoggerService';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import ModalValidation from '../modals/common/ModalValidation';
import Feather from '@expo/vector-icons/Feather';

function hexToRgba(hex: string | null | undefined, opacity: number): string | null {
  if (!hex) return null;
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (_m: string, r: string, g: string, b: string) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})`
    : null;
}

const EventCard = ({
  eventInfos,
  handleEventsChange,
  withSubMenu = true,
  withDate = false,
  withState = false,
  typeEvent = undefined,
}: {
  eventInfos: any;
  handleEventsChange: () => void;
  withSubMenu?: boolean;
  withDate?: boolean;
  withState?: boolean;
  typeEvent?: string;
}) => {
  const { colors, fonts } = useAppTheme();
  const { firebaseUser } = useAuthStore();
  const [modalModificationVisible, setModalModificationVisible] = useState(false);
  const [modalSubMenuEventVisible, setModalSubMenuEventVisible] = useState(false);
  const [modalEventDetailsVisible, setModalEventDetailsVisible] = useState(false);
  const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);
  const [modalValidationDeleteAllVisible, setModalValidationDeleteAllVisible] = useState(false);
  const { data: animaux = [] } = useAnimalsQuery();

  const getColorEventType = (): string | undefined => {
    if (eventInfos === undefined) return undefined;
    switch (eventInfos.eventtype) {
      case 'depense': return colors.quaternary;
      case 'balade': return colors.accent;
      case 'soins': return colors.neutral;
      case 'concours': return colors.primary;
      case 'entrainement': return colors.tertiary;
      case 'autre': return colors.error;
      case 'rdv': return colors.onSurface;
      default: return undefined;
    }
  };

  const getIconEventType = () => {
    if (eventInfos === undefined) return null;
    const color = getColorEventType();
    switch (eventInfos.eventtype) {
      case 'depense': return <FontAwesome6 name="money-bill-wave" size={20} color={color} style={{ marginRight: 10, marginLeft: 5 }} />;
      case 'balade': return <Entypo name="compass" size={20} color={color} style={{ marginRight: 10, marginLeft: 5 }} />;
      case 'soins': return <FontAwesome6 name="hand-holding-medical" size={20} color={color} style={{ marginRight: 10, marginLeft: 5 }} />;
      case 'concours': return <FontAwesome name="trophy" size={20} color={color} style={{ marginRight: 10, marginLeft: 5 }} />;
      case 'entrainement': return <Entypo name="traffic-cone" size={20} color={color} style={{ marginRight: 10, marginLeft: 5 }} />;
      case 'autre': return <FontAwesome6 name="check-circle" size={20} color={color} style={{ marginRight: 10, marginLeft: 5 }} />;
      case 'rdv': return <FontAwesome name="stethoscope" size={20} color={color} style={{ marginRight: 10, marginLeft: 5 }} />;
      default: return null;
    }
  };

  const getTitleEventType = (): string | undefined => {
    if (eventInfos === undefined) return undefined;
    switch (eventInfos.eventtype) {
      case 'depense': return 'Dépense';
      case 'balade': return 'Balade';
      case 'soins': return 'Soin';
      case 'concours': return 'Concours';
      case 'entrainement': return 'Entraînement';
      case 'autre': return 'Autre';
      case 'rdv': return 'Rendez-vous médical';
      default: return undefined;
    }
  };

  const getCardComponentEventType = () => {
    if (eventInfos === undefined) return null;
    const sharedProps = { eventInfos, animaux, setSubMenu: setModalSubMenuEventVisible };
    switch (eventInfos.eventtype) {
      case 'depense': return <DepenseCard {...sharedProps} />;
      case 'balade': return <BaladeCard {...sharedProps} />;
      case 'soins': return <SoinsCard {...sharedProps} />;
      case 'concours': return <ConcoursCard {...sharedProps} />;
      case 'entrainement': return <EntrainementCard {...sharedProps} />;
      case 'autre': return <AutreCard {...sharedProps} />;
      case 'rdv': return <RdvCard {...sharedProps} />;
      default: return null;
    }
  };

  const handleDelete = () => setModalValidationDeleteVisible(true);

  const confirmDelete = () => {
    deleteEvent(eventInfos.id)
      .then(() => Toast.show({ type: 'success', position: 'top', text1: "Suppression d'un événement réussi" }))
      .catch((err: any) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
        LoggerService.log("Erreur lors de suppression d'un event : " + err.message);
      });
  };

  const handleDeleteAll = () => setModalValidationDeleteAllVisible(true);

  const confirmDeleteAll = () => {
    const parentId = eventInfos.idparent ?? eventInfos.id;
    deleteEvent(parentId)
      .then(() => {
        Toast.show({ type: 'success', position: 'top', text1: "Suppression d'un événement réussi" });
        handleEventsChange();
      })
      .catch((err: any) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
        LoggerService.log("Erreur lors de suppression d'un event : " + err.message);
      });
  };

  const handleStateChange = async () => {
    switch (eventInfos.state) {
      case 'À faire': eventInfos.state = 'Terminé'; break;
      case 'Terminé': eventInfos.state = 'À faire'; break;
    }
    patchEvent(eventInfos.id, { state: eventInfos.state })
      .then(() => handleEventsChange())
      .catch((err: any) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
        LoggerService.log("Erreur lors de la MAJ du statut d'un event : " + err.message);
      });
  };

  const handleModify = () => setModalModificationVisible(true);

  const getDateText = (date: string): string => {
    const d = new Date(date);
    return `${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)}`;
  };

  const getYearText = (date: string): number => new Date(date).getFullYear();

  const getDayText = (date: string): string => {
    const dateObject = new Date(date);
    const dateText = dateObject.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    return (dateText.charAt(0).toUpperCase() + dateText.slice(1)).slice(0, 3);
  };

  const eventColor = getColorEventType();

  const styles = StyleSheet.create({
    eventContainer: {
      backgroundColor: colors.background,
      borderRadius: 5,
      width: '100%',
      flexDirection: 'column',
      marginBottom: 10,
      shadowColor: colors.default_dark,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
    },
    eventTypeContainer: {
      backgroundColor: hexToRgba(eventColor ?? null, 0.3) ?? 'transparent',
    },
    typeEventIndicator: { width: '100%', borderTopStartRadius: 5, borderTopEndRadius: 5 },
    cardEventContainer: { paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between' },
    cardEventContainerWithIndicator: { width: '80%' },
    cardEventContainerWithoutIndicator: { width: '100%', paddingRight: 10, paddingLeft: 10 },
    headerEventContainer: { flexDirection: 'row' },
    headerEvent: { flexDirection: 'row', justifyContent: 'space-between' },
    titleTypeEventContainer: { flexDirection: 'row', alignItems: 'center', paddingLeft: 10 },
    contentEventContainer: { flexDirection: 'row' },
    indicatorEventContainer: {
      justifyContent: 'center',
      padding: 10,
      marginRight: 10,
      borderRightWidth: 0.3,
      borderColor: colors.default_dark,
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    subMenuContainer: { paddingVertical: 10, paddingLeft: 20, paddingRight: 10 },
    textColor: { color: colors.default_dark },
  });

  return (
    <>
      <ModalEvents
        event={eventInfos}
        isVisible={modalModificationVisible}
        setVisible={setModalModificationVisible}
        actionType="modify"
        onModify={handleEventsChange}
      />
      <ModalSubMenuEventActions
        event={eventInfos}
        handleDelete={handleDelete}
        handleModify={handleModify}
        modalVisible={modalSubMenuEventVisible}
        setModalVisible={setModalSubMenuEventVisible}
        handleDeleteAll={handleDeleteAll}
        handleShare={() => {}}
      />
      <ModalEventDetails
        isVisible={modalEventDetailsVisible}
        setVisible={setModalEventDetailsVisible}
        event={eventInfos}
        animaux={animaux}
        handleEventsChange={handleEventsChange}
      />
      <ModalValidation
        displayedText="Êtes-vous sûr de vouloir supprimer l'événement ?"
        onConfirm={confirmDelete}
        setVisible={setModalValidationDeleteVisible}
        visible={modalValidationDeleteVisible}
        title="Suppression d'un événement"
      />
      <ModalValidation
        displayedText="Êtes-vous sûr de vouloir supprimer l'événement ?"
        onConfirm={confirmDeleteAll}
        setVisible={setModalValidationDeleteAllVisible}
        visible={modalValidationDeleteAllVisible}
        title="Suppression d'un événement"
      />
      <View style={styles.eventContainer}>
        <View style={styles.headerEventContainer}>
          <TouchableOpacity
            style={[styles.eventTypeContainer, styles.typeEventIndicator, styles.headerEvent]}
            onPress={() => setModalEventDetailsVisible(true)}
          >
            <View style={styles.titleTypeEventContainer}>
              {getIconEventType()}
              <Text style={[{ color: eventColor, fontSize: 14 }, styles.textFontBold]}>{getTitleEventType()}</Text>
            </View>
            <View>
              <TouchableOpacity onPress={() => setModalSubMenuEventVisible(true)} style={styles.subMenuContainer}>
                <Entypo name="dots-three-horizontal" size={20} color={eventColor} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.contentEventContainer}>
          {withState === true && (
            <TouchableOpacity onPress={handleStateChange} style={styles.indicatorEventContainer}>
              {eventInfos.state === 'À faire' ? (
                <Feather name="square" size={25} color={colors.default_dark} />
              ) : (
                <Feather name="x-square" size={25} color={colors.default_dark} />
              )}
            </TouchableOpacity>
          )}
          {withDate === true && (
            <View style={[styles.indicatorEventContainer, { alignItems: 'center' }]}>
              <Text style={[styles.textFontRegular, styles.textColor]}>{getDayText(eventInfos.dateevent)}.</Text>
              <Text style={[{ fontSize: 11 }, styles.textFontRegular, styles.textColor]}>{getDateText(eventInfos.dateevent)}</Text>
              <Text style={[{ fontSize: 9 }, styles.textFontRegular, styles.textColor]}>{getYearText(eventInfos.dateevent)}</Text>
            </View>
          )}
          <TouchableOpacity
            style={[
              styles.cardEventContainer,
              withDate === false && withState === false
                ? styles.cardEventContainerWithoutIndicator
                : styles.cardEventContainerWithIndicator,
            ]}
            onPress={() => setModalEventDetailsVisible(true)}
          >
            {getCardComponentEventType()}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default EventCard;
