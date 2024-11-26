import { LinearGradient } from 'expo-linear-gradient';
import React, { useState, useContext, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from 'react-native-paper';
import TopTab from '../components/TopTab';

const OtherScreen = ({ navigation }) => {
    const { colors, fonts } = useTheme();
    const [messages, setMessages] = useState({message1: "Mes", message2: "Autre"});

    return(
        <>
            <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
                <TopTab message1={messages.message1} message2={messages.message2}/>
                <View>
                    <Text>Autre !</Text>
                </View>
            </LinearGradient>
        </>
    )
}

module.exports = OtherScreen;