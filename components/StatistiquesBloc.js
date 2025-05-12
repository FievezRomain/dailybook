import React, { useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { FontAwesome6, FontAwesome, MaterialCommunityIcons, Entypo, Feather, MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from "react-native";
import OfferInformations from './OfferInformations';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import { useTheme, IconButton } from 'react-native-paper';
import StatePicker from './inputs/StatePicker';
import ChartWithLoader from './ChartWithLoader';
import DepenseComponent from './statistics/DepenseComponent';
import EntrainementComponent from './statistics/EntrainementComponent';
import ModalDefaultNoValue from './modals/common/ModalDefaultNoValue';
import BaladeComponent from './statistics/BaladeComponent';
import PoidsComponent from './statistics/PoidsComponent';
import TailleComponent from './statistics/TailleComponent';
import AlimentationComponent from './statistics/AlimentationComponent';
import ConcoursComponent from './statistics/ConcoursComponent';
import { ThemeContext } from '../providers/ThemeProvider';

const StatistiquesBloc = ({ selectedAnimal }) =>{
    const { isDarkTheme } = useContext( ThemeContext );
    const { colors, fonts } = useTheme();
    const { currentUser, abonnement } = useAuth();
    const [itemStatistique, setItemStatistique] = useState("depense");
    const chartComponents = {
        balade: BaladeComponent,
        entrainement: EntrainementComponent,
        depense: DepenseComponent,
        poids: PoidsComponent,
        taille: TailleComponent,
        alimentation: AlimentationComponent,
        concours: ConcoursComponent
    };
    
    const ChartComponent = chartComponents[itemStatistique];
    const accountType = abonnement.libelle;
    const arrayState = [
        {value: 'Mois', label: 'Mois', checkedColor: colors.default_dark, uncheckedColor: colors.quaternary, style: {borderRadius: 5}, rippleColor: "transparent"},
        {value: 'Année', label: 'Année', checkedColor: colors.default_dark, uncheckedColor: colors.quaternary, style: {borderRadius: 5}, rippleColor: "transparent"},
      ];
    const [temporality, setTemporality] = useState('Mois');
    const chartConfig = {
        depense: {
            backgroundGradientFrom: "#1E2923",
            backgroundGradientTo: "#08130D",
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        },
        entrainement: {
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => opacityToColor(opacity-0.05),
            labelColor: (opacity = 1) => opacityToColor(opacity-0.05),
        },
        balade: {
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => opacityToColor(opacity-0.05),
            labelColor: (opacity = 1) => opacityToColor(opacity-0.05),
        },
        poids: {
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => colors.default_dark,
            labelColor: (opacity = 1) => colors.default_dark,
            decimalPlaces: 2,
        },
        taille: {
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => colors.default_dark,
            labelColor: (opacity = 1) => colors.default_dark,
            decimalPlaces: 2,
        },
        alimentation: {
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => colors.default_dark,
            labelColor: (opacity = 1) => colors.default_dark,
            decimalPlaces: 2,
        },
        concours: {
            backgroundGradientFromOpacity: 0,
            backgroundGradientToOpacity: 0,
            color: (opacity = 1) => opacityToColor(opacity-0.05),
            labelColor: (opacity = 1) => opacityToColor(opacity-0.05),
        },
    };
    const ChartConfig = chartConfig[itemStatistique];
    const now = new Date();
    const [parameters, setParameters] = useState({ animaux: selectedAnimal.map(function(item) { return item["id"] }), email: currentUser.email, dateDebut: new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString(), dateFin: new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString() });
    const itemStatistiqueSeveralAnimals = {
        balade: true,
        entrainement: true,
        depense: true,
        poids: false,
        taille: false,
        alimentation: false,
        concours: true
      };

    useEffect(() => {
        checkSeveralAnimalsAccepted(itemStatistique);
      }, [itemStatistique]);

    useEffect(() => {
        if(temporality === "Mois"){
            setParameters({ animaux: selectedAnimal.map(function(item) { return item["id"] }), email: currentUser.email, dateDebut: new Date(now.getFullYear(), now.getMonth(), 1).toLocaleDateString(), dateFin: new Date(now.getFullYear(), now.getMonth() + 1, 0).toLocaleDateString() });
        } else{
            setParameters({ animaux: selectedAnimal.map(function(item) { return item["id"] }), email: currentUser.email, dateDebut: new Date(now.getFullYear(), 0, 1).toLocaleDateString(), dateFin: new Date(now.getFullYear(), 11, 31).toLocaleDateString() });
        }
        
    }, [temporality, selectedAnimal]);

    const checkSeveralAnimalsAccepted = (value) => {
        return itemStatistiqueSeveralAnimals[value];
    }

    function opacityToColor(opacity) {

        if( opacity <= 0.15 ){
            return isDarkTheme ? hexToRgba(colors.secondary, opacity) : colors.secondary;
        }

        if( isDarkTheme ){
            if( opacity <= 0.2 ){
                return hexToRgba(colors.quaternary, opacity+0.1);
            }
            if( opacity <= 0.4 ){
                return hexToRgba(colors.quaternary, opacity+0.1);
            }
            if( opacity <= 0.6 ){
                return hexToRgba(colors.quaternary, opacity+0.1);
            }
            if( opacity <= 0.7 ){
                return hexToRgba(colors.quaternary, opacity+0.1);
            }
            if( opacity <= 0.8 ){
                return hexToRgba(colors.quaternary, opacity+0.1);
            }
            if( opacity <= 1 ){
                return hexToRgba(colors.default_dark, opacity);
            }
        } else {
            if( opacity <= 0.15 ){
                return isDarkTheme ? hexToRgba(colors.secondary, opacity) : colors.secondary;
            }
            if( opacity <= 0.2 ){
                return hexToRgba(colors.accent, opacity+0.1);
            }
            if( opacity <= 0.4 ){
                return hexToRgba(colors.accent, opacity+0.1);
            }
            if( opacity <= 0.6 ){
                return hexToRgba(colors.accent, opacity+0.1);
            }
            if( opacity <= 0.7 ){
                return hexToRgba(colors.accent, opacity+0.1);
            }
            if( opacity <= 0.8 ){
                return hexToRgba(colors.accent, opacity+0.1);
            }
            if( opacity <= 1 ){
                return hexToRgba(colors.text, opacity);
            }
        }
    }

    function hexToRgba(hex, opacity) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${opacity})` : null;
    }

    const onTemporalityChange = (value) => {
        setTemporality(value);
    };

    const getDateToDisplay = () => {
        const [dayStart, monthStart, yearStart] = parameters.dateDebut.split('/').map(Number);
        const [dayEnd, monthEnd, yearEnd] = parameters.dateFin.split('/').map(Number);
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        const formatter = new Intl.DateTimeFormat('fr-FR', options);

        const startFormatted = formatter.format( new Date(yearStart, monthStart - 1, dayStart) );
        const endFormatted = formatter.format( new Date(yearEnd, monthEnd - 1, dayEnd) );

        return `${startFormatted} - ${endFormatted}`;
    }

    const changeDates = (offset) => {
        let objet = parameters;
        const [day, month, year] = parameters.dateDebut.split('/').map(Number);
        let actualDateFromParameters = new Date(year, month - 1, day);

        if( temporality === "Mois" ){
            objet = { animaux: selectedAnimal.map(function(item) { return item["id"] }), email: currentUser.email, dateDebut: new Date(actualDateFromParameters.getFullYear(), actualDateFromParameters.getMonth() + offset, 1).toLocaleDateString(), dateFin: new Date(actualDateFromParameters.getFullYear(), actualDateFromParameters.getMonth() + 1 + offset, 0).toLocaleDateString() };

        } else{
            objet = { animaux: selectedAnimal.map(function(item) { return item["id"] }), email: currentUser.email, dateDebut: new Date(actualDateFromParameters.getFullYear() + offset, 0, 1).toLocaleDateString(), dateFin: new Date(actualDateFromParameters.getFullYear() + offset, 11, 31).toLocaleDateString() };

        }

        setParameters( objet );
    }

    const onItemStatistiqueChange = (value) => {
        setItemStatistique(value);
    }

    const styles = StyleSheet.create({
        statistiquesContainer:{
            marginTop: 10,
            justifyContent: "center",
        },
        bottomBar: {
            width: '100%',
            height: 0.4, // ou la hauteur que vous souhaitez pour votre barre
            backgroundColor: colors.default_dark,
        },
        midBar: {
            width: 0.4,
            borderRightWidth: 0.4,
            borderRightColor: colors.default_dark,
        },
        composantContainer:{
            marginLeft: 10,
            marginRight: 10,
            width: "100%",
            alignSelf: "center"
        },
        headerContainer:{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 20,
            marginBottom: 10,
        },
        title:{
            color: colors.quaternary,
            marginLeft: 10,
        },
        statistiqueIndicatorContainer:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-around",
        },
        itemIndicatorStatistique:{
            padding: 5,
            borderTopRightRadius: 10,
            borderTopLeftRadius: 10,
            paddingHorizontal: 10,
        },
        temporalityIndicator:{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            width: "100%",
            alignSelf: "center",
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 5,
            top: 5,
            zIndex: 1,
        },
        itemIconDefault:{
            color: colors.quaternary,
        },
        itemIconSelected:{
            color: colors.default_dark,
        },
        textFontRegular:{
            fontFamily: fonts.default.fontFamily
        },
        textFontMedium:{
            fontFamily: fonts.bodyMedium.fontFamily
        },
        textFontBold:{
            fontFamily: fonts.bodyLarge.fontFamily
        },
        dateContainer:{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center"
        }
    });

    return (
        <>
            <View style={styles.temporalityIndicator}>
                <StatePicker
                    arrayState={arrayState}
                    handleChange={onTemporalityChange}
                    defaultState={temporality}
                    color={hexToRgba(colors.quaternary, 1)}
                />
            </View>
            {accountType === "Premium" &&
                <View style={styles.dateContainer}>
                    <TouchableOpacity onPress={() => changeDates(-1)}>
                        <IconButton icon={"chevron-left"} size={30} iconColor={colors.default_dark} />
                    </TouchableOpacity>
                    <Text style={[styles.textFontRegular, {color: colors.default_dark}]}>{getDateToDisplay()}</Text>
                    <TouchableOpacity onPress={() => changeDates(1)}>
                        <IconButton icon={"chevron-right"} size={30} iconColor={colors.default_dark} />
                    </TouchableOpacity>
                </View>
            }

            <View style={styles.composantContainer}>
                <ScrollView contentContainerStyle={{paddingBottom: 30}}>
                    {accountType === "Premium" ?
                        <>
                            <View style={{width: "90%", alignSelf: "center"}}>
                                <View style={styles.statistiqueIndicatorContainer}>
                                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("depense")}}>
                                        <FontAwesome6 name="money-bill-wave" size={20} style={itemStatistique == "depense" ? styles.itemIconSelected : styles.itemIconDefault}  />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("balade")}}>
                                        <Entypo name="compass" size={20} style={itemStatistique == "balade" ? styles.itemIconSelected : styles.itemIconDefault}  />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("entrainement")}}>
                                        <Entypo name="traffic-cone" size={20} style={itemStatistique == "entrainement" ? styles.itemIconSelected : styles.itemIconDefault}  />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("concours")}}>
                                        <FontAwesome name="trophy" size={20} style={itemStatistique == "concours" ? styles.itemIconSelected : styles.itemIconDefault}  />
                                    </TouchableOpacity>
                                    <View style={styles.midBar} />
                                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("poids")}}>
                                        <FontAwesome6 name="weight-scale" size={20} style={itemStatistique == "poids" ? styles.itemIconSelected : styles.itemIconDefault}  />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("taille")}}>
                                        <MaterialIcons name="height" size={20} style={itemStatistique == "taille" ? styles.itemIconSelected : styles.itemIconDefault}  />
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.itemIndicatorStatistique} onPress={() => {onItemStatistiqueChange("alimentation")}}>
                                        <MaterialCommunityIcons name="food-apple" size={20} style={itemStatistique == "alimentation" ? styles.itemIconSelected : styles.itemIconDefault}  />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bottomBar} />
                            </View>
                            
                            <View style={styles.statistiquesContainer}>
                                {!checkSeveralAnimalsAccepted(itemStatistique) && selectedAnimal.length > 1 ?
                                        <View style={{width: "90%", alignSelf: "center"}}>
                                            <ModalDefaultNoValue
                                                text={"⚠️ Cette statistique n'est pas disponible sur plusieurs animaux."}
                                            />
                                        </View>
                                        
                                    :
                                        <ChartWithLoader
                                            ChartComponent={ChartComponent}
                                            chartConfig={ChartConfig}
                                            chartType={itemStatistique}
                                            chartParameters={parameters}
                                        />
                                }
                                
                            </View>
                        </>
                    :
                        <OfferInformations />
                    }
                
                
                </ScrollView>
            </View>
            
        </>
    );
}

export default StatistiquesBloc;
