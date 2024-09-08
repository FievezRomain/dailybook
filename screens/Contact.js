import React, { useState, useRef, useEffect } from 'react';
import { View, SectionList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import TopTabSecondary from '../components/TopTabSecondary';
import ContactService from '../services/ContactService';
import { useAuth } from "../providers/AuthenticatedUserProvider";
import variables from '../components/styles/Variables';
import { Entypo, Zocial } from '@expo/vector-icons';
import { Linking } from 'react-native';
import LoggerService from '../services/LoggerService';
import ModalSubMenuContactActions from '../components/Modals/ModalSubMenuContactActions';
import ModalContact from "../components/Modals/ModalContact";
import Toast from "react-native-toast-message";

const ContactScreen = ({ navigation }) => {
    const sectionListRef = useRef(null);
    const { currentUser } = useAuth();
    const contactsService = new ContactService();
    const [contacts, setContacts] = useState([]);
    const [modalSubMenuVisible, setModalSubMenuVisible] = useState(false);
    const [contactFocus, setContactFocus] = useState({});
    const [modalVisible, setModalVisible] = useState(false);

    const getContacts = async () => {
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
    }, [navigation]);

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
        console.log(contact);
        var tempArray = contacts;

        var index = tempArray.findIndex(objet => objet.id === contact.id);

        if(index !== -1){
            tempArray[index] = contact;
        }

        setContacts(tempArray);
        setContactFocus(contact);
    }

    const handleDelete = () =>{
        let data = {};
        data["id"] = contactFocus.id;
        contactsService.delete(data)
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

    return (
        <>
            <TopTabSecondary
                message1={"Vos"}
                message2={"contacts"}
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
            <View style={{ flex: 1, backgroundColor: variables.default }}>
                {contacts.length === 0 ?
                    <Text style={[{color: variables.rouan, textAlign: "center", marginTop: 20}, styles.textFontRegular]}>Aucun contact enregistré</Text>
                :
                    <>
                        <SectionList
                            ref={sectionListRef}
                            sections={sections}
                            keyExtractor={(item, index) => item.nom + index}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.itemContainer} onPress={() => focusContact(item)}>
                                    <View>
                                        <Text style={styles.name}>{item.nom}</Text>
                                        {item.profession && <Text style={styles.profession}>{item.profession}</Text>}
                                        <Text style={styles.phone}>{item.telephone}</Text>
                                        <Text style={styles.phone}>{item.email}</Text>
                                    </View>
                                    <View style={styles.iconsContainer}>
                                        {item.telephone != null && item.telephone != undefined &&
                                            <>
                                                <TouchableOpacity style={{marginRight: 5}} onPress={() => makePhoneCall(item.telephone)}>
                                                    <Entypo name='phone' size={25}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{marginRight: 5}} onPress={() => sendSMS(item.telephone)}>
                                                    <Entypo name='message' size={25}/>
                                                </TouchableOpacity>
                                            </>
                                        }
                                        {item.email != null && item.email != undefined &&
                                            <TouchableOpacity onPress={() => sendEmail(item.email)}>
                                                <Zocial name='email' size={25}/>
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
        </>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: 'white',
    },
    name: {
        fontSize: 16,
        color: variables.bai_brun,
        fontFamily: variables.fontBold
    },
    profession: {
        fontSize: 14,
        color: variables.bai,
        fontFamily: variables.fontRegular
    },
    phone: {
        fontSize: 14,
        color: variables.bai,
        fontFamily: variables.fontRegular
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
        fontFamily: variables.fontBold
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
        fontFamily: variables.fontMedium
    },
    selectedLetter: {
        color: 'red',
        fontWeight: 'bold',
    },
});

export default ContactScreen;
