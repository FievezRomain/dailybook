import { View, Text, StyleSheet, Image, FlatList, TextInput } from "react-native";
import React, { useContext, useState, useEffect } from 'react';
import Back from "../components/Back";
import ButtonLong from "../components/ButtonLong";
import { useAuth } from "../providers/AuthenticatedUserProvider";
import LogoutModal from "../components/Modals/ModalLogout";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native";
import TopTabSecondary from "../components/TopTabSecondary";
import notesServiceInstance from "../services/NoteService";
import NoteCard from "../components/cards/NoteCard";
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from "expo-linear-gradient";
import ModalDefaultNoValue from "../components/Modals/ModalDefaultNoValue";
import { useTheme } from 'react-native-paper';
import { useNotes } from "../providers/NotesProvider";

const NoteScreen = ({ navigation }) => {
    const { colors, fonts } = useTheme();
    const { notes, setNotes } = useNotes();
    const [filteredNotes, setFilteredNotes] = useState([]);
    const { currentUser } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

   /*  useEffect(() => {
        const unsubscribe = navigation.addListener("focus", () => {
          
          getNotes();
          
        });
        return unsubscribe;
    }, [navigation]);

    const getNotes = async () => {
        var result = await noteService.getNotes(currentUser.email);
        if(result.length != 0){
            setNotes(result);
        }
    } */

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (query === '') {
            setFilteredNotes(notes);
        } else {
          const filtered = notes.filter(note => {
            const lowercaseQuery = query.toLowerCase();
            return (
              (note.titre && note.titre.toLowerCase().includes(lowercaseQuery)) ||
              (note.note && note.note.toLowerCase().includes(lowercaseQuery))
            );
          });
          setFilteredNotes(filtered);
        }
    }

    const handleNoteChange = (note) => {
        setTimeout(() => Toast.show({
            type: "success",
            position: "top",
            text1: "Modification d'une note"
          }), 300);

        var tempArray = notes;

        var index = tempArray.findIndex(objet => objet.id === note.id);

        if(index !== -1){
            tempArray[index] = note;
        }

        setNotes(tempArray);
        handleSearch(searchQuery);
      }
  
      const handleNoteDelete = (note) => {
        let updatedNotes = [];
        updatedNotes = [... notes];
  
        var index = updatedNotes.findIndex((a) => a.id == note.id);
        updatedNotes.splice(index, 1);
        setNotes(updatedNotes);
      }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        }
    });

    return(
        <>
        <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
            <TopTabSecondary
                message1={"Vos"}
                message2={"Notes"}
            />
            <View style={styles.container}>
                <View style={{flexDirection: "row", alignContent: "center", alignItems: "center", backgroundColor: colors.background, marginBottom: 10, marginTop: 20, alignSelf: "center", width: "90%", justifyContent:"space-between", padding: 10, borderRadius: 5, shadowColor: "black", elevation: 1, shadowOpacity: 0.1, shadowRadius:5, shadowOffset:{width:0, height:2}}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <AntDesign name="search1" size={16} color={colors.default_dark}/>
                        <TextInput
                            placeholder="Recherche"             
                            style={[{marginLeft: 5, width: "100%", color:colors.default_dark}, styles.textFontRegular]}
                            placeholderTextColor={colors.default_dark}
                            value={searchQuery}
                            onChangeText={handleSearch}
                        />
                    </View>
                    
                </View>
                <View style={{width: "90%", alignSelf: "center", flex: 1}}>
                    {notes.length === 0 ?
                            <ModalDefaultNoValue
                                text={"Aucune note enregistrée"}
                            />
                        : 
                            <>
                                {searchQuery.length > 0 && 
                                    <Text style={{marginBottom: 10, textAlign: "center", color:colors.default_dark}}>Résultats de la recherche "{searchQuery}"</Text>
                                }
                                <FlatList
                                    data={searchQuery.length > 0 ? filteredNotes : notes}
                                    keyExtractor={(item) => item.id.toString()}
                                    renderItem={({ item, index }) => (
                                        <NoteCard
                                            note={item}
                                            handleNoteChange={handleNoteChange}
                                            handleNoteDelete={handleNoteDelete}
                                        />
                                    )}
                                    numColumns={1}
                                />
                            </>
                            
                    }
                </View>
                
            </View>
            </LinearGradient>
        </>
    )

}

module.exports = NoteScreen;