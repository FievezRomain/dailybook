import { View, Text, StyleSheet, Image } from "react-native";
import React, { useContext, useState } from 'react';
import Back from "../components/Back";
import ButtonLong from "../components/ButtonLong";
import Variables from "../components/styles/Variables";
import { AuthenticatedUserContext } from '../providers/AuthenticatedUserProvider';
import LogoutModal from "../components/Modals/ModalLogout";
import Button from "../components/Button";
import { TouchableOpacity } from "react-native";
import TopTab from "../components/TopTab";

const NoteScreen = ({ navigation }) => {
    return(
        <>
            <TopTab
                message1={"Vos"}
                message2={"notes"}
            />
            <Text>Coucou les notes</Text>
        </>
    )

}

module.exports = NoteScreen;