import { View } from "react-native";
import React from 'react';
import OfferInformations from '../components/OfferInformations';
import TopTabSecondary from "../components/TopTabSecondary";
import { ScrollView } from "react-native";
import { useTheme } from 'react-native-paper';

const DiscoverPremiumScreen = ({ navigation }) => {
    const { colors, fonts } = useTheme();
    
    return (
        <View style={{backgroundColor: colors.onSurface}}>
            <View style={{height: "100%", width: "90%", alignSelf: "center", display: "flex"}}>
                <TopTabSecondary
                    message1={"Découvrez"}
                    message2={"l'offre"}
                />
                <ScrollView contentContainerStyle={{paddingBottom: 30}}>
                    <OfferInformations
                        withMessageFunctionality={false}
                    />
                </ScrollView>
            </View>
        </View>
        
    );
}

module.exports = DiscoverPremiumScreen;