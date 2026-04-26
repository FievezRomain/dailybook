import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesome6, FontAwesome, MaterialIcons, Entypo, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import { useAppTheme } from '../../../theme/useAppTheme';
import Toast from 'react-native-toast-message';
import ModalEditGeneric from './common/ModalEditGeneric';
import ModalEvents from '../../../features/events/components/ModalEvents';
import ModalObjectif from '../../../features/objectifs/components/ModalObjectif';
import ModalWish from '../../../features/wishes/components/ModalWish';
import ModalContact from '../../../features/contacts/components/ModalContact';
import ModalNote from '../../../features/notes/components/ModalNote';
import ModalAnimal from '../../../features/animals/components/ModalAnimal';
import ModalGroup from '../../../features/groups/components/ModalGroup';
import { useCalendarUIStore } from '../../../stores/useCalendarUIStore';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import type { AppNavigationProp } from '../../../navigation/types';

interface ModalCreateProps {
  isVisible: boolean;
  setModalVisible: (v: boolean) => void;
  navigation?: AppNavigationProp;
}

const ModalCreate = ({ isVisible, setModalVisible, navigation }: ModalCreateProps) => {
  const { colors, fonts } = useAppTheme();
  const { user } = useAuthStore();
  const { hasRole } = useCurrentUser();
  const isPremium = hasRole('premium');
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [isObjectifModalVisible, setObjectifModalVisible] = useState(false);
  const [isWishModalVisible, setWishModalVisible] = useState(false);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [isAnimalModalVisible, setAnimalModalVisible] = useState(false);
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);
  const [event, setEvent] = useState<any>({});
  const { selectedDate: date } = useCalendarUIStore();

  const openModalEvent = (typeEvent: string) => {
    setEvent({ eventtype: typeEvent });
    setEventModalVisible(true);
  };

  const handleCreateContact = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un contact réussi' }), 300); };
  const handleCreateNote = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'une note réussi' }), 300); };
  const handleCreateWish = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un souhait réussi' }), 300); };
  const handleCreateAnimal = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un animal réussi' }), 300); };
  const handleCreateEvent = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un événement réussi' }), 300); };
  const handleCreateObjectif = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un objectif réussi' }), 300); };
  const handleCreateGroup = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un groupe réussi' }), 300); };

  const styles = StyleSheet.create({
    textDesactivated: { color: colors.neutral },
    iconAction: { color: colors.accent, paddingRight: 10 },
    iconButton: { marginRight: 20, color: colors.accent, width: 30 },
    informationsButtonContainer: { flexDirection: 'row', alignItems: 'center', paddingLeft: 30 },
    actionButtonContainer: { flexDirection: 'row', alignItems: 'center' },
    touchableOpacityButtonContent: { display: 'flex', flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingBottom: 10, paddingTop: 10 },
    formContainer: { paddingTop: 10, paddingBottom: 10 },
    form: { alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', borderRadius: 10, paddingTop: 10 },
    textFontRegular: { fontFamily: fonts.labelMedium.fontFamily, fontSize: 16 },
    groupButton: { backgroundColor: colors.background, marginBottom: 10 },
    handleStyleModal: { backgroundColor: colors.onSurface, borderTopEndRadius: 15, borderTopStartRadius: 15, marginBottom: -1 },
    titleButton: { color: colors.default_dark },
    premiumOverlay: { backgroundColor: colors.primary, borderRadius: 4, paddingHorizontal: 10, paddingVertical: 5, zIndex: 2 },
    premiumText: { fontSize: 12, color: colors.default_dark, fontFamily: fonts.bodySmall.fontFamily },
    button: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: colors.quaternary },
  });

  return (
    <>
      <ModalEditGeneric isVisible={isVisible} setVisible={setModalVisible} arrayHeight={['90%']} handleStyle={styles.handleStyleModal}>
        <ModalEvents actionType="create" isVisible={isEventModalVisible} setVisible={setEventModalVisible} event={event} onModify={handleCreateEvent} date={date} />
        <ModalObjectif actionType="create" isVisible={isObjectifModalVisible} setVisible={setObjectifModalVisible} onModify={handleCreateObjectif} />
        <ModalWish actionType="create" isVisible={isWishModalVisible} setVisible={setWishModalVisible} onModify={handleCreateWish} />
        <ModalContact actionType="create" isVisible={isContactModalVisible} setVisible={setContactModalVisible} onModify={handleCreateContact} />
        <ModalNote actionType="create" isVisible={isNoteModalVisible} setVisible={setNoteModalVisible} onModify={handleCreateNote} />
        <ModalAnimal actionType="create" isVisible={isAnimalModalVisible} setVisible={setAnimalModalVisible} onModify={handleCreateAnimal} />
        <ModalGroup actionType="create" isVisible={isGroupModalVisible} setVisible={setGroupModalVisible} onModify={handleCreateGroup} />
        <View style={{ display: 'flex', alignContent: 'center', backgroundColor: colors.onSurface, flex: 1 }}>
          <View style={styles.form}>
            <View style={styles.formContainer}>
              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setAnimalModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="paw" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>Animal</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                {[
                  { label: 'Balade', type: 'balade', Icon: () => <Entypo name="compass" size={20} style={styles.iconButton} /> },
                  { label: 'Entraînement', type: 'entrainement', Icon: () => <Entypo name="traffic-cone" size={20} style={styles.iconButton} /> },
                  { label: 'Concours', type: 'concours', Icon: () => <FontAwesome name="trophy" size={20} style={styles.iconButton} /> },
                  { label: 'Rendez-vous médical', type: 'rdv', Icon: () => <FontAwesome name="stethoscope" size={20} style={styles.iconButton} /> },
                  { label: 'Soin', type: 'soins', Icon: () => <FontAwesome6 name="hand-holding-medical" size={20} style={styles.iconButton} /> },
                  { label: 'Dépense', type: 'depense', Icon: () => <FontAwesome6 name="money-bill-wave" size={20} style={styles.iconButton} /> },
                  { label: 'Autre', type: 'autre', Icon: () => <FontAwesome6 name="check-circle" size={20} style={styles.iconButton} /> },
                ].map(({ label, type, Icon }) => (
                  <View key={type} style={styles.button}>
                    <TouchableOpacity onPress={() => openModalEvent(type)}>
                      <View style={styles.touchableOpacityButtonContent}>
                        <View style={styles.informationsButtonContainer}>
                          <Icon />
                          <Text style={[styles.textFontRegular, styles.titleButton]}>{label}</Text>
                        </View>
                        <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                      </View>
                      <Divider />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setObjectifModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <SimpleLineIcons name="target" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>Objectif</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setWishModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="heart" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>Souhait</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setContactModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <AntDesign name="contacts" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>Contact</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => setNoteModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <SimpleLineIcons name="note" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>Note</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity disabled={!isPremium} onPress={() => setGroupModalVisible(true)}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="group" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>Groupe</Text>
                      </View>
                      <View style={styles.actionButtonContainer}>
                        {!isPremium && <View style={styles.premiumOverlay}><Text style={styles.premiumText}>Premium</Text></View>}
                        <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                      </View>
                    </View>
                    <Divider />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ModalEditGeneric>
    </>
  );
};

export default ModalCreate;
