import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Fontisto, AntDesign } from '@expo/vector-icons';
import Button from './Button';
import Toast from "react-native-toast-message";
import { useTheme } from 'react-native-paper';

const OfferInformations = ({ withMessageFunctionality=true }) => {
  const { colors, fonts } = useTheme();

  const handleInscription = () =>{
    Toast.show({
      type: "success",
      position: "top",
      text1: "Inscription réussie"
    });
  }

  const DATA = [
    { id: '1', label: "Gestion d'animaux", free: 'Yes', premium: 'Yes' },
    { id: '2', label: "Gestion de tâches", free: 'Yes', premium: 'Yes' },
    { id: '3', label: "Gestion des objectifs", free: 'Yes', premium: 'Yes' },
    { id: '4', label: "Planification et suivi des événements", free: 'Yes', premium: 'Yes' },
    { id: '5', label: "Rappels des événements", free: 'Yes', premium: 'Yes' },
    { id: '6', label: "Gestion de plus de trois animaux", free: 'No', premium: 'Yes' },
    { id: '7', label: "Partage des tâches avec d'autres membres", free: 'No', premium: 'Yes' },
    { id: '8', label: "Suivi du budget", free: 'No', premium: 'Yes' },
    { id: '9', label: "Suivi de l'alimentation", free: 'No', premium: 'Yes' },
    { id: '10', label: "Statistiques d'activités", free: 'No', premium: 'Yes' },
    { id: '11', label: "Gestion du dossier médical", free: 'No', premium: 'Yes' },
    { id: '12', label: "Enregistrement GPS lors des activités", free: 'No', premium: 'Yes' },
    { id: '13', label: "Suivi de l'évolution physique de l'animal", free: 'No', premium: 'Yes' }
  ];

  const styles = StyleSheet.create({
    container:{
      alignItems: "center",
    },
    headerRow: {
      flexDirection: 'row',
      padding: 20,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    row: {
      flexDirection: 'row',
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#ddd',
    },
    cell: {
      flex: 1,
      textAlign: 'center',
    },
    headerCell: {
      color: colors.accent
    },
    table:{
      width: "100%",
      alignSelf: "center",
      marginTop: 10,
      backgroundColor: colors.background,
      borderRadius: 10,
    },
    offerButtonPrice:{
      alignItems: "center",
      marginTop: 10,
      marginBottom: 30
    },
    price:{
      marginTop: 5
    },
    textFontRegular:{
        fontFamily: fonts.default.fontFamily
    },
    textFontMedium:{
        fontFamily: fonts.bodyMedium.fontFamily
    },
    textFontBold:{
        fontFamily: fonts.bodyLarge.fontFamily
    }
  });

  const Item = ({ label, free, premium }) => (
    <View style={styles.row}>
      <Text style={[styles.cell, styles.textFontRegular]}>{label}</Text>
      { free === "Yes" ?
          <AntDesign name="checkcircle" size={20} style={styles.cell} />
        :
          <Fontisto name="locked" size={20} style={styles.cell} />
      }
      { premium === "Yes" ?
          <AntDesign name="checkcircle" size={20} style={styles.cell} />
        :
          <Fontisto name="locked" size={20} style={styles.cell} />
      }
    </View>
  );

  return (
    <>
      {withMessageFunctionality &&
        <Text style={[{textAlign: "center", color: colors.accent, marginHorizontal: 50, marginBottom: 5, fontSize: 14}, styles.textFontMedium]}>Cette fonctionnalité est disponible avec la version premium</Text>
      }
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.headerCell, styles.textFontBold]}> </Text>
            <Text style={[styles.cell, styles.headerCell, styles.textFontBold]}>Gratuit</Text>
            <Text style={[styles.cell, styles.headerCell, styles.textFontBold]}>Premium</Text>
          </View>
          {DATA.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={[styles.cell, styles.textFontRegular]}>{item.label}</Text>
              { item.free === "Yes" ?
                <AntDesign name="checkcircle" size={20} style={styles.cell} color={colors.accent} />
              :
                <Fontisto name="locked" size={20} style={styles.cell} color={colors.tertiary}/>
              }
              { item.premium === "Yes" ?
                  <AntDesign name="checkcircle" size={20} style={styles.cell} color={colors.accent} />
                :
                  <Fontisto name="locked" size={20} style={styles.cell} color={colors.tertiary}/>
              }
            </View>
          ))}
        </View>
        <View style={styles.offerButtonPrice}>
          <Button
            size={"m"}
            type={"tertiary"}
            onPress={() => handleInscription()}
          >
            <Text style={styles.textFontMedium}>S'inscrire pour être averti de la sortie de la version premium</Text>
          </Button>
          <Text style={[styles.price, styles.textFontRegular]}>8.99€ /an pour les 1 000 premiers inscrits</Text>
        </View>
    </>
  );
};

export default OfferInformations;
