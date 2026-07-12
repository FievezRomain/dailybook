import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, MaterialIcons, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { AppDivider } from '../ui';
import { useAppTheme } from '../../../theme/useAppTheme';
import Toast from 'react-native-toast-message';
import ModalEditGeneric from './common/ModalEditGeneric';
import ModalObjectif from '../../../features/objectifs/components/ModalObjectif';
import ModalWish from '../../../features/wishes/components/ModalWish';
import ModalContact from '../../../features/contacts/components/ModalContact';
import ModalNote from '../../../features/notes/components/ModalNote';
import ModalAnimal from '../../../features/animals/components/ModalAnimal';
import ModalGroup from '../../../features/groups/components/ModalGroup';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useTranslation } from 'react-i18next';
import type { AppNavigationProp } from '../../../navigation/types';

interface ModalCreateProps {
  isVisible: boolean;
  setModalVisible: (v: boolean) => void;
  navigation?: AppNavigationProp;
}

const ModalCreate = ({ isVisible, setModalVisible, navigation }: ModalCreateProps) => {
  const { colors, fonts } = useAppTheme();
  const { hasRole } = useCurrentUser();
  const { t } = useTranslation('common');
  const isPremium = hasRole('premium');
  const [isObjectifModalVisible, setObjectifModalVisible] = useState(false);
  const [isWishModalVisible, setWishModalVisible] = useState(false);
  const [isContactModalVisible, setContactModalVisible] = useState(false);
  const [isNoteModalVisible, setNoteModalVisible] = useState(false);
  const [isAnimalModalVisible, setAnimalModalVisible] = useState(false);
  const [isGroupModalVisible, setGroupModalVisible] = useState(false);

  const openAfterMenuClose = (openModal: () => void) => {
    setModalVisible(false);
    setTimeout(openModal, 180);
  };

  const openEventWizard = () => {
    openAfterMenuClose(() => navigation?.navigate('EventEntry'));
  };

  const handleCreateContact = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un contact réussi' }), 300); };
  const handleCreateNote = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'une note réussi' }), 300); };
  const handleCreateWish = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un souhait réussi' }), 300); };
  const handleCreateAnimal = () => { setModalVisible(false); setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Création d\'un animal réussi' }), 300); };
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
      {isObjectifModalVisible && (
        <ModalObjectif actionType="create" isVisible={isObjectifModalVisible} setVisible={setObjectifModalVisible} onModify={handleCreateObjectif} />
      )}
      {isWishModalVisible && (
        <ModalWish actionType="create" isVisible={isWishModalVisible} setVisible={setWishModalVisible} onModify={handleCreateWish} />
      )}
      {isContactModalVisible && (
        <ModalContact actionType="create" isVisible={isContactModalVisible} setVisible={setContactModalVisible} onModify={handleCreateContact} />
      )}
      {isNoteModalVisible && (
        <ModalNote actionType="create" isVisible={isNoteModalVisible} setVisible={setNoteModalVisible} onModify={handleCreateNote} />
      )}
      {isAnimalModalVisible && (
        <ModalAnimal actionType="create" isVisible={isAnimalModalVisible} setVisible={setAnimalModalVisible} onModify={handleCreateAnimal} />
      )}
      {isGroupModalVisible && (
        <ModalGroup actionType="create" isVisible={isGroupModalVisible} setVisible={setGroupModalVisible} onModify={handleCreateGroup} />
      )}
      <ModalEditGeneric isVisible={isVisible} setVisible={setModalVisible} arrayHeight={['90%']} handleStyle={styles.handleStyleModal}>
        <View style={{ display: 'flex', alignContent: 'center', backgroundColor: colors.onSurface, flex: 1 }}>
          <View style={styles.form}>
            <View style={styles.formContainer}>
              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openAfterMenuClose(() => setAnimalModalVisible(true))}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="paw" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>{t('createMenu.animal')}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <AppDivider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={openEventWizard}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <MaterialIcons name="event-note" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>{t('createMenu.event')}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <AppDivider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openAfterMenuClose(() => setObjectifModalVisible(true))}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <SimpleLineIcons name="target" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>{t('createMenu.goal')}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <AppDivider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openAfterMenuClose(() => setWishModalVisible(true))}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="heart" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>{t('createMenu.wish')}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <AppDivider />
                  </TouchableOpacity>
                </View>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openAfterMenuClose(() => setContactModalVisible(true))}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <AntDesign name="contacts" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>{t('createMenu.contact')}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <AppDivider />
                  </TouchableOpacity>
                </View>
                <View style={styles.button}>
                  <TouchableOpacity onPress={() => openAfterMenuClose(() => setNoteModalVisible(true))}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <SimpleLineIcons name="note" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>{t('createMenu.note')}</Text>
                      </View>
                      <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                    </View>
                    <AppDivider />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.groupButton}>
                <View style={styles.button}>
                  <TouchableOpacity disabled={!isPremium} onPress={() => openAfterMenuClose(() => setGroupModalVisible(true))}>
                    <View style={styles.touchableOpacityButtonContent}>
                      <View style={styles.informationsButtonContainer}>
                        <FontAwesome name="group" size={20} style={styles.iconButton} />
                        <Text style={[styles.textFontRegular, styles.titleButton]}>{t('createMenu.group')}</Text>
                      </View>
                      <View style={styles.actionButtonContainer}>
                        {!isPremium && <View style={styles.premiumOverlay}><Text style={styles.premiumText}>{t('createMenu.premium')}</Text></View>}
                        <MaterialIcons name="keyboard-arrow-right" size={25} style={styles.iconAction} />
                      </View>
                    </View>
                    <AppDivider />
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
