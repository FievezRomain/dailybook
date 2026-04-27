import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import type { AppStackScreenProps } from '../../../navigation/types';

export default function EventEntryScreen({ navigation }: AppStackScreenProps<'EventEntry'>) {
  const { colors, fonts } = useAppTheme();
  const reset = useEventWizardStore((s) => s.reset);

  const startWizard = () => {
    reset();
    navigation.navigate('EventWizardType');
  };

  const startAI = () => {
    reset();
    navigation.navigate('EventAI');
  };

  const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 },
    title: { fontSize: 26, color: colors.default_dark, fontFamily: fonts.bodyLarge.fontFamily, textAlign: 'center' },
    subtitle: { fontSize: 15, color: colors.secondary, fontFamily: fonts.default.fontFamily, textAlign: 'center', marginTop: 8, marginBottom: 48 },
    card: { width: '100%', borderRadius: 16, padding: 24, marginBottom: 16, flexDirection: 'row', alignItems: 'center' },
    cardTitle: { fontSize: 18, fontFamily: fonts.bodyMedium.fontFamily, color: colors.default_dark },
    cardSub: { fontSize: 13, fontFamily: fonts.default.fontFamily, color: colors.secondary, marginTop: 4 },
    cardText: { flex: 1, marginLeft: 16 },
  });

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Ajouter un événement</Text>
        <Text style={styles.subtitle}>Choisissez comment vous souhaitez saisir votre événement.</Text>

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.background, elevation: 2, shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }]} onPress={startWizard}>
          <MaterialCommunityIcons name="format-list-bulleted" size={32} color={colors.accent} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Saisie guidée</Text>
            <Text style={styles.cardSub}>Étape par étape, en quelques secondes.</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.card, { backgroundColor: colors.background, elevation: 2, shadowOpacity: 0.1, shadowRadius: 8, shadowOffset: { width: 0, height: 2 } }]} onPress={startAI}>
          <MaterialCommunityIcons name="robot-outline" size={32} color={colors.primary} />
          <View style={styles.cardText}>
            <Text style={styles.cardTitle}>Dictée intelligente 🤖</Text>
            <Text style={styles.cardSub}>Décrivez en langage naturel, on s'occupe du reste.</Text>
          </View>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
