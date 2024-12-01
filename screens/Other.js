import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { IconButton, useTheme } from 'react-native-paper';
import TopTab from '../components/TopTab';

const OtherScreen = ({ navigation }) => {
    const { colors, fonts } = useTheme();
    const [messages, setMessages] = useState({message1: "Mes", message2: "Autre"});
    const buttons = [
        { id: 1, icon: "heart", label: "Wishlist", screen: "Wish" },
        { id: 2, icon: "contacts", label: "Contacts", screen: "Contact" },
        { id: 3, icon: "note-edit-outline", label: "Notes", screen: "Note"}
    ];

    const renderButton = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => navigation.navigate(item.screen)} style={styles.button}>
                <IconButton icon={item.icon} size={30}/>
                <Text style={styles.label}>{item.label}</Text>
            </TouchableOpacity>
        );
    }

    const styles = StyleSheet.create({
        container: {
            padding: 10,
        },
        row: {
            justifyContent: "space-between",
        },
        button: {
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            margin: 5,
            backgroundColor: colors.background,
            paddingVertical: 15,
            borderRadius: 10,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowRadius: 4,
            shadowOffset: {width: 0, height: 1},
            elevation: 2,
        },
        label: {
            fontSize: 16,
            fontFamily: fonts.bodyMedium.fontFamily,
            color: colors.text,
            marginTop: 5,
            textAlign: "center",
        },
    })

    return(
        <>
            <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
                <TopTab message1={messages.message1} message2={messages.message2}/>
                <FlatList
                    data={buttons}
                    renderItem={renderButton}
                    keyExtractor={(item) => item.id.toString()}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    contentContainerStyle={styles.container}
                />
            </LinearGradient>
        </>
    )
}

module.exports = OtherScreen;