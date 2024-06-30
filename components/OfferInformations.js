import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import { Fontisto, AntDesign } from '@expo/vector-icons';
import variables from './styles/Variables';
import Button from './Button';

const OfferInformations = ({ }) => {

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

  const Item = ({ label, free, premium }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{label}</Text>
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
      <Text style={{textAlign: "center", color: variables.alezan, fontWeight: "500", marginHorizontal: 50, marginBottom: 5, fontSize: 14}}>Cette fonctionnalité est disponible avec la version premium</Text>
      <ScrollView>
        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={[styles.cell, styles.headerCell]}> </Text>
            <Text style={[styles.cell, styles.headerCell]}>Gratuit</Text>
            <Text style={[styles.cell, styles.headerCell]}>Premium</Text>
          </View>
          {DATA.map((item) => (
            <View key={item.id} style={styles.row}>
              <Text style={styles.cell}>{item.label}</Text>
              { item.free === "Yes" ?
                <AntDesign name="checkcircle" size={20} style={styles.cell} color={variables.alezan} />
              :
                <Fontisto name="locked" size={20} style={styles.cell} color={variables.aubere}/>
              }
              { item.premium === "Yes" ?
                  <AntDesign name="checkcircle" size={20} style={styles.cell} color={variables.alezan} />
                :
                  <Fontisto name="locked" size={20} style={styles.cell} color={variables.aubere}/>
              }
            </View>
          ))}
        </View>
        <View style={styles.offerButtonPrice}>
          <Button
            size={"m"}
            type={"tertiary"}
          >
            <Text>S'inscrire pour être averti de la sortie de la version premium</Text>
          </Button>
          <Text style={styles.price}>4€99 /mois ou 32€ /an</Text>
        </View>
      </ScrollView>
    </>
  );
};

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
    fontWeight: 'bold',
    color: variables.alezan
  },
  table:{
    width: "100%",
    alignSelf: "center",
    marginTop: 10,
    backgroundColor: variables.blanc,
    borderRadius: 10,
  },
  offerButtonPrice:{
    alignItems: "center",
    marginTop: 10,
    marginBottom: 30
  },
  price:{
    marginTop: 5
  }
});

export default OfferInformations;
