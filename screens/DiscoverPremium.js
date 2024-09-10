import { View } from "react-native";
import React from 'react';
import OfferInformations from '../components/OfferInformations';
import TopTabSecondary from "../components/TopTabSecondary";
import variables from "../components/styles/Variables";
import { ScrollView } from "react-native";

const DiscoverPremiumScreen = ({ navigation }) => {
    return (
        <View style={{backgroundColor: variables.default}}>
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