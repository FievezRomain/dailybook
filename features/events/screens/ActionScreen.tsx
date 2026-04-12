import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome6, FontAwesome, MaterialIcons, Entypo, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { useTheme, Divider } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import TopTab from '../../../shared/components/common/TopTab';
import ModalEvents from '../components/ModalEvents';
import ModalObjectif from '../../objectifs/components/ModalObjectif';
import ModalWish from '../../wishes/components/ModalWish';
import ModalContact from '../../contacts/components/ModalContact';
import ModalNote from '../../notes/components/ModalNote';
import ModalAnimal from '../../animals/components/ModalAnimal';
import type { TabScreenProps } from '../../../navigation/types';

const toastSuccess = (text1: string) => setTimeout(() => Toast.show({ type: 'success', position: 'top', text1 }), 300);

export default function ActionScreen({ navigation }: TabScreenProps<'Action' extends keyof any ? any : any>) {
  const { colors, fonts } = useTheme();
  const [isEventModalVisible, setEventModalVisible] = useState(false);
  const [isObjectifModalVisible, setObjectifModalVisible] = useState(false);
  const [isWishModalVisible, setWishModalVisible] = useState(false);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [isAnimalModalVisible, setAnimalModalVisible] = useState(false);
  const [event, setEvent] = useState<Record<string, unknown>>({});

  const openModalEvent = (typeEvent: string) => {
    setEvent({ eventtype: typeEvent });
    setEventModalVisible(true);
  };

  const styles = StyleSheet.create({
    iconAction: { color: (colors as any).default_dark, paddingRight: 10 },
    iconButton: { marginRight: 20, color: (colors as any).default_dark },
    informationsButtonContainer: { flexDirection: 'row', alignItems: 'center', paddingLeft: 30 },
    touchableOpacityButtonContent: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', paddingBottom: 10, paddingTop: 10 },
    formContainer: { paddingTop: 10, paddingBottom: 10 },
    form: { alignItems: 'center', justifyContent: 'center', marginLeft: 'auto', marginRight: 'auto', borderRadius: 10, paddingTop: 10, shadowColor: (colors as any).default_dark, shadowOpacity: 0.1, marginTop: 50, elevation: 1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 } },
    groupButton: { backgroundColor: colors.background, marginBottom: 10 },
    button: {},
    textFontRegular: { fontFamily: (fonts as any).default?.fontFamily },
  });

  const row = (icon: React.ReactNode, label: string, onPress: () => void) => (
    <View style={styles.button}>
      <TouchableOpacity onPress={onPress}>
        <View style={styles.touchableOpacityButtonContent}>
          <View style={styles.informationsButtonContainer}>
            {icon}
            <Text style={styles.textFontRegular}>{label}</Text>
          </View>
          <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
        </View>
        <Divider />
      </TouchableOpacity>
    </View>
  );

  return (
    <>
      <ModalEvents actionType="create" isVisible={isEventModalVisible} setVisible={setEventModalVisible} event={event} onModify={() => toastSuccess("Création d'un événement réussi")} />
      <ModalObjectif actionType="create" isVisible={isObjectifModalVisible} setVisible={setObjectifModalVisible} onModify={() => toastSuccess("Création d'un objectif réussi")} />
      <ModalWish actionType="create" isVisible={isWishModalVisible} setVisible={setWishModalVisible} onModify={() => toastSuccess("Création d'un souhait réussi")} />
      <ModalContact actionType="create" isVisible={isContactModalVisible} setVisible={setContactModalVisible} onModify={() => toastSuccess("Création d'un contact réussi")} />
      <ModalNote actionType="create" isVisible={isNoteModalVisible} setVisible={setNoteModalVisible} onModify={() => toastSuccess("Création d'une note réussi")} />
      <ModalAnimal actionType="create" isVisible={isAnimalModalVisible} setVisible={setAnimalModalVisible} onModify={() => toastSuccess("Création d'un animal réussi")} />
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <View style={{ alignContent: 'center', justifyContent: 'center', alignItems: 'center' }}>
          <View style={styles.form}>
            <ScrollView style={{ width: '100%' }} persistentScrollbar>
              <View style={styles.formContainer}>
                <View style={styles.groupButton}>
                  {row(<FontAwesome name="paw" size={20} style={styles.iconButton} />, 'Animal', () => setAnimalModalVisible(true))}
                </View>
                <View style={styles.groupButton}>
                  {row(<Entypo name="compass" size={20} style={styles.iconButton} />, 'Balade', () => openModalEvent('balade'))}
                  {row(<Entypo name="traffic-cone" size={20} style={styles.iconButton} />, 'Entraînement', () => openModalEvent('entrainement'))}
                  {row(<FontAwesome name="trophy" size={20} style={styles.iconButton} />, 'Concours', () => openModalEvent('concours'))}
                  {row(<FontAwesome name="stethoscope" size={20} style={styles.iconButton} />, 'Rendez-vous médical', () => openModalEvent('rdv'))}
                  {row(<FontAwesome6 name="hand-holding-medical" size={20} style={styles.iconButton} />, 'Soin', () => openModalEvent('soins'))}
                  {row(<FontAwesome6 name="money-bill-wave" size={20} style={styles.iconButton} />, 'Dépense', () => openModalEvent('depense'))}
                  {row(<FontAwesome6 name="check-circle" size={20} style={styles.iconButton} />, 'Autre', () => openModalEvent('autre'))}
                </View>
                <View style={styles.groupButton}>
                  {row(<SimpleLineIcons name="target" size={20} style={styles.iconButton} />, 'Objectif', () => setObjectifModalVisible(true))}
                </View>
                <View style={styles.groupButton}>
                  {row(<FontAwesome name="heart" size={20} style={styles.iconButton} />, 'Souhait', () => setWishModalVisible(true))}
                  {row(<AntDesign name="contacts" size={20} style={styles.iconButton} />, 'Contact', () => setContactModalVisible(true))}
                  {row(<SimpleLineIcons name="note" size={20} style={styles.iconButton} />, 'Note', () => setNoteModalVisible(true))}
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}
