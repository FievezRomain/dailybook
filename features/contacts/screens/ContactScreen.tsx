import React, { useState, useRef } from 'react';
import { View, SectionList, Text, TouchableOpacity, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, Zocial } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { useAppTheme } from '../../../theme/useAppTheme';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import ModalSubMenuContactActions from '../components/ModalSubMenuContactActions';
import ModalContact from '../components/ModalContact';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import LoggerService from '../../../services/logs/LoggerService';
import { useContactsQuery, useContactMutations } from '../../../hooks/queries/useContactsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import type { Contact } from '../../../models/Contact';
import { AppEmptyState, AppErrorState } from '../../../shared/components/ui';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';

export default function ContactScreen({ navigation }: AppStackScreenProps<'Contact'>) {
  const { colors, fonts } = useAppTheme();
  const sectionListRef = useRef<SectionList<Contact>>(null);
  const { data: contacts = [], isLoading, isError, refetch } = useContactsQuery();
  const { remove } = useContactMutations();

  const [modalSubMenuVisible, setModalSubMenuVisible] = useState(false);
  const [contactFocus, setContactFocus] = useState<Contact | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

  const groupedContacts = contacts.reduce((acc: Record<string, Contact[]>, contact: Contact) => {
    if (contact?.nom) {
      const firstLetter = contact.nom[0].toUpperCase();
      if (!acc[firstLetter]) acc[firstLetter] = [];
      acc[firstLetter].push(contact);
    }
    return acc;
  }, {});

  const sections = Object.keys(groupedContacts).sort().map((letter) => ({
    title: letter,
    data: groupedContacts[letter],
  }));

  const handleLetterSelect = (letter: string) => {
    const sectionIndex = sections.findIndex((s) => s.title === letter);
    if (sectionIndex !== -1 && sectionListRef.current) {
      sectionListRef.current.scrollToLocation({ sectionIndex, itemIndex: 0, viewOffset: 0, viewPosition: 0, animated: true });
    }
  };

  const makePhoneCall = (phoneNumber: string) => Linking.openURL(`tel:${phoneNumber}`);
  const sendSMS = (phoneNumber: string) =>
    Linking.openURL(`sms:${phoneNumber}`).catch((err) => LoggerService.log('Error opening SMS app: ' + err.message));
  const sendEmail = (email: string) =>
    Linking.openURL(`mailto:${email}`).catch((err) => LoggerService.log('Error opening email app: ' + err.message));

  const focusContact = (contact: Contact) => {
    setContactFocus(contact);
    setModalSubMenuVisible(true);
  };

  const confirmDelete = () => {
    if (!contactFocus) return;
    remove.mutate(String(contactFocus.id), {
      onSuccess: () => {
        Toast.show({ type: 'success', position: 'top', text1: "Suppression d'un contact réussi" });
        setContactFocus(null);
        setModalValidationDeleteVisible(false);
        setModalSubMenuVisible(false);
      },
      onError: (err: Error) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
      },
    });
  };

  const styles = {
    itemContainer: { flexDirection: 'row', justifyContent: 'space-between', padding: 15 },
    name: { fontSize: 16, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily },
    profession: { fontSize: 14, color: colors.textPrimary, fontFamily: fonts.default.fontFamily },
    phone: { fontSize: 14, color: colors.textPrimary, fontFamily: fonts.default.fontFamily },
    iconsContainer: { flexDirection: 'row', alignItems: 'center', marginRight: 50 },
    headerContainer: { backgroundColor: colors.surfaceVariant, padding: 5 },
    header: { fontSize: 18, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily },
    separator: { height: 1, backgroundColor: '#ccc' },
    sidebarContainer: { position: 'absolute', right: 10, top: 50, bottom: 50, justifyContent: 'center' },
    letter: { fontSize: 14, paddingVertical: 2, color: colors.textPrimary, fontFamily: fonts.bodyMedium.fontFamily },
  } as const;

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1="Vos" message2="Contacts" />
      <ModalSubMenuContactActions
        contact={contactFocus ?? undefined}
        modalVisible={modalSubMenuVisible}
        setModalVisible={setModalSubMenuVisible}
        handleModify={() => setModalVisible(true)}
        handleDelete={() => setModalValidationDeleteVisible(true)}
      />
      <ModalContact
        actionType="modify"
        isVisible={modalVisible}
        setVisible={setModalVisible}
        contact={contactFocus ?? undefined}
        onModify={(contact?: unknown) => {
          setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: "Modification d'un contact" }), 300);
          if (contact && typeof contact === 'object') {
            setContactFocus(contact as Contact);
          }
        }}
      />
      <ModalValidation
        displayedText="Êtes-vous sûr de vouloir supprimer le contact ?"
        onConfirm={confirmDelete}
        setVisible={setModalValidationDeleteVisible}
        visible={modalValidationDeleteVisible}
        title="Suppression d'un contact"
      />
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <ListSkeleton count={6} variant="contact" />
          </View>
        ) : isError ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppErrorState message="Impossible de charger les contacts." onRetry={() => void refetch()} />
          </View>
        ) : contacts.length === 0 ? (
          <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
            <AppEmptyState icon="card-account-phone-outline" title="Aucun contact enregistré" description="Ajoutez vos contacts utiles pour les retrouver vite." />
          </View>
        ) : (
          <>
            <SectionList
              ref={sectionListRef}
              sections={sections}
              keyExtractor={(item: Contact, index) => item.nom + index}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.itemContainer} onPress={() => focusContact(item)}>
                  <View style={{ width: '70%' }}>
                    <Text style={styles.name}>{item.nom}</Text>
                    {item.profession && <Text style={styles.profession}>{item.profession}</Text>}
                    <Text style={styles.phone}>{item.telephone}</Text>
                    <Text style={styles.phone}>{item.email}</Text>
                  </View>
                  <View style={styles.iconsContainer}>
                    {item.telephone && (
                      <>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => makePhoneCall(item.telephone)}>
                          <Entypo name="phone" size={25} color={colors.textPrimary} />
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginRight: 5 }} onPress={() => sendSMS(item.telephone)}>
                          <Entypo name="message" size={25} color={colors.textPrimary} />
                        </TouchableOpacity>
                      </>
                    )}
                    {item.email && (
                      <TouchableOpacity onPress={() => sendEmail(item.email)}>
                        <Zocial name="email" size={25} color={colors.textPrimary} />
                      </TouchableOpacity>
                    )}
                  </View>
                </TouchableOpacity>
              )}
              renderSectionHeader={({ section: { title } }) => (
                <View style={styles.headerContainer}>
                  <Text style={styles.header}>{title}</Text>
                </View>
              )}
              ListFooterComponent={<View style={{ height: 50 }} />}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              getItemLayout={(_data, index) => ({ length: 50, offset: 50 * index, index })}
            />
            <View style={styles.sidebarContainer}>
              {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter) => (
                <TouchableOpacity key={letter} onPress={() => handleLetterSelect(letter)}>
                  <Text style={styles.letter}>{letter}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </View>
    </LinearGradient>
  );
}
