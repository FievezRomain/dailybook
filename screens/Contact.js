import React, { useState, useRef, useEffect } from 'react';
import { View, SectionList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TopTabSecondary from '../components/TopTabSecondary';
import contactsServiceInstance from '../services/ContactService';
import { useAuth } from "../providers/AuthenticatedUserProvider";
import { Entypo, Zocial } from '@expo/vector-icons';
import { Linking } from 'react-native';
import LoggerService from '../services/LoggerService';
import ModalSubMenuContactActions from '../components/Modals/ModalSubMenuContactActions';
import ModalContact from "../components/Modals/ModalContact";
import Toast from "react-native-toast-message";
import { LinearGradient } from "expo-linear-gradient";
import ModalDefaultNoValue from '../components/Modals/ModalDefaultNoValue';
import { useTheme } from 'react-native-paper';
import ModalValidation from "../components/Modals/ModalValidation";
import { useContacts } from '../providers/ContactsProvider';

const ContactScreen = ({ navigation }) => {
    const { colors, fonts } = useTheme();
    const sectionListRef = useRef(null);
    const { currentUser } = useAuth();
    const { contacts, setContacts } = useContacts();
    const [modalSubMenuVisible, setModalSubMenuVisible] = useState(false);
    const [contactFocus, setContactFocus] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

/*     const getContacts = async () => {
        const result = await contactsService.getContacts(currentUser.email);
        if (result && result.length > 0) {
            setContacts(result);
        } 
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
            getContacts();
        });
        return unsubscribe;
    }, [navigation]); */

    const groupedContacts = contacts.reduce((acc, contact) => {
        if (contact && contact.nom) {
            const firstLetter = contact.nom[0].toUpperCase();
            if (!acc[firstLetter]) {
                acc[firstLetter] = [];
            }
            acc[firstLetter].push(contact);
        } 
        return acc;
    }, {});

    const sections = Object.keys(groupedContacts).sort().map(letter => ({
        title: letter,
        data: groupedContacts[letter],
    }));

    const handleLetterSelect = (letter) => {
        const sectionIndex = sections.findIndex(section => section.title === letter);

        if (sectionIndex !== -1 && sectionListRef.current) {
            sectionListRef.current.scrollToLocation({
                sectionIndex: sectionIndex,
                itemIndex: 0, // Scroll to the first item in the section
                viewOffset: 0, // Adjust this if you want some space from the top
                viewPosition: 0, // 0 is top, 0.5 is middle, 1 is bottom
                animated: true,
            });
        }
    };

    const makePhoneCall = (phoneNumber) => {
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const sendSMS = (phoneNumber) => {
        const url = `sms:${phoneNumber}`;
        Linking.openURL(url).catch(err => LoggerService.log('Error opening SMS app', err.message));
    };

    const sendEmail = (email) => {
        const url = `mailto:${email}`;
        Linking.openURL(url).catch(err => LoggerService.log('Error opening email app', err.message));
    };

    const handleModify = () => {
        setModalVisible(true);
    }

    const onModify = (contact) =>{
        setTimeout(() => Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'un contact"
          }), 300);
          
        var tempArray = contacts;

        var index = tempArray.findIndex(objet => objet.id === contact.id);

        if(index !== -1){
            tempArray[index] = contact;
        }

        setContacts(tempArray);
        setContactFocus(contact);
    }

    const handleDelete = () =>{
        setModalValidationDeleteVisible(true);
    }

    const confirmDelete = () =>{
        let data = {};
        data["id"] = contactFocus.id;
        contactsServiceInstance.delete(data)
            .then((reponse) => {
                Toast.show({
                    type: "success",
                    position: "top",
                    text1: "Suppression d'un contact réussi"
                });
                let updatedContacts = [];
                updatedContacts = [... contacts];
        
                var index = updatedContacts.findIndex((a) => a.id == contactFocus.id);
                updatedContacts.splice(index, 1);
                setContactFocus({});
                setContacts(updatedContacts);
            })
            .catch((err) => {
                Toast.show({
                    type: "error",
                    position: "top",
                    text1: err.message
                });
                LoggerService.log("Erreur lors de la suppression d'un contact : " + err.message);
            });
    }

    const focusContact = (contact) =>{
        setContactFocus(contact);
        setModalSubMenuVisible(true);
    }

    const styles = StyleSheet.create({
        itemContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            padding: 15,
        },
        name: {
            fontSize: 16,
            fontFamily: fonts.bodyLarge.fontFamily
        },
        profession: {
            fontSize: 14,
            color: colors.default_dark,
            fontFamily: fonts.default.fontFamily
        },
        phone: {
            fontSize: 14,
            color: colors.default_dark,
            fontFamily: fonts.default.fontFamily
        },
        iconsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginRight: 50
        },
        headerContainer: {
            backgroundColor: '#f4f4f4',
            padding: 5,
        },
        header: {
            fontSize: 18,
            fontFamily: fonts.bodyLarge.fontFamily
        },
        separator: {
            height: 1,
            backgroundColor: '#ccc',
        },
        sidebarContainer: {
            position: 'absolute',
            right: 10,
            top: 50,
            bottom: 50,
            justifyContent: 'center',
        },
        letter: {
            fontSize: 14,
            paddingVertical: 2,
            fontFamily: fonts.bodyMedium.fontFamily
        },
        selectedLetter: {
            color: 'red',
            fontWeight: 'bold',
        },
    });

    return (
        <>
        <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
            <TopTabSecondary
                message1={"Vos"}
                message2={"Contacts"}
            />
            <ModalSubMenuContactActions
                contact={contactFocus}
                modalVisible={modalSubMenuVisible}
                setModalVisible={setModalSubMenuVisible}
                handleModify={handleModify}
                handleDelete={handleDelete}
            />
            <ModalContact
                actionType={"modify"}
                isVisible={modalVisible}
                setVisible={setModalVisible}
                contact={contactFocus}
                onModify={onModify}
            />
            <ModalValidation
                displayedText={"Êtes-vous sûr de vouloir supprimer le contact ?"}
                onConfirm={confirmDelete}
                setVisible={setModalValidationDeleteVisible}
                visible={modalValidationDeleteVisible}
                title={"Suppression d'un contact"}
            />
            <View style={{ flex: 1, }}>
                {contacts.length === 0 ?
                    <View style={{paddingLeft: 20, paddingRight: 20, paddingTop: 20}}>
                        <ModalDefaultNoValue
                            text={"Aucun contact enregistré"}
                        />
                    </View>
                :
                    <>
                        <SectionList
                            ref={sectionListRef}
                            sections={sections}
                            keyExtractor={(item, index) => item.nom + index}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.itemContainer} onPress={() => focusContact(item)}>
                                    <View style={{width: "70%"}}>
                                        <Text style={styles.name}>{item.nom}</Text>
                                        {item.profession && <Text style={styles.profession}>{item.profession}</Text>}
                                        <Text style={styles.phone}>{item.telephone}</Text>
                                        <Text style={styles.phone}>{item.email}</Text>
                                    </View>
                                    <View style={styles.iconsContainer}>
                                        {item.telephone != null && item.telephone != undefined &&
                                            <>
                                                <TouchableOpacity style={{marginRight: 5}} onPress={() => makePhoneCall(item.telephone)}>
                                                    <Entypo name='phone' size={25} color={colors.default_dark}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{marginRight: 5}} onPress={() => sendSMS(item.telephone)}>
                                                    <Entypo name='message' size={25} color={colors.default_dark}/>
                                                </TouchableOpacity>
                                            </>
                                        }
                                        {item.email != null && item.email != undefined &&
                                            <TouchableOpacity onPress={() => sendEmail(item.email)}>
                                                <Zocial name='email' size={25} color={colors.default_dark}/>
                                            </TouchableOpacity>
                                        }
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
                            viewabilityConfig={{
                                itemVisiblePercentThreshold: 50,
                            }}
                            getItemLayout={(data, index) => {
                                return { length: 50, offset: 50 * index, index };
                            }}
                        />
                    
                    
                    
                        <View style={styles.sidebarContainer}>
                            {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                                <TouchableOpacity key={letter} onPress={() => handleLetterSelect(letter)}>
                                    <Text style={[styles.letter]}>
                                        {letter}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </>
                }
            </View>
            </LinearGradient>
        </>
    );
};

export default ContactScreen;
