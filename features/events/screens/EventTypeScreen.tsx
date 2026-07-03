import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../theme/useAppTheme';
import { eventTypeColors } from '../../../theme/tokens';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import type { AppStackScreenProps } from '../../../navigation/types';

const EVENT_TYPES = [
  { id: 'soins', label: 'Soins', icon: 'medical-bag', color: eventTypeColors.soins },
  { id: 'rdv', label: 'Rendez-vous', icon: 'calendar-check', color: eventTypeColors.rdv },
  { id: 'balade', label: 'Balade', icon: 'horse', color: eventTypeColors.balade },
  { id: 'entrainement', label: 'Entraînement', icon: 'run-fast', color: eventTypeColors.entrainement },
  { id: 'concours', label: 'Concours', icon: 'trophy-outline', color: eventTypeColors.concours },
  { id: 'depense', label: 'Dépense', icon: 'currency-eur', color: eventTypeColors.depense },
  { id: 'autre', label: 'Autre', icon: 'dots-horizontal-circle-outline', color: eventTypeColors.autre },
] as const;

function EventTypeCard({ item, onPress }: { item: typeof EVENT_TYPES[number]; onPress: () => void }) {
  const { colors, fonts } = useAppTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const handlePress = async () => {
    scale.value = withSpring(0.93, { stiffness: 300, damping: 15 }, () => { scale.value = withSpring(1, { stiffness: 150, damping: 20 }); });
    await Haptics.selectionAsync().catch(() => undefined);
    onPress();
  };

  return (
    <Animated.View style={[animStyle, { width: '47%', margin: '1.5%' }]}>
      <TouchableOpacity
        style={{ backgroundColor: colors.background, borderRadius: 16, padding: 20, alignItems: 'center', elevation: 2, shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons name={item.icon as any} size={36} color={item.color} />
        <Text style={{ marginTop: 10, fontSize: 14, fontFamily: fonts.bodyMedium.fontFamily, color: colors.textPrimary, textAlign: 'center' }}>{item.label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function EventTypeScreen({ navigation }: AppStackScreenProps<'EventWizardType'>) {
  const { colors, fonts } = useAppTheme();
  const setField = useEventWizardStore((s) => s.setField);

  const onSelect = (type: string) => {
    setField('eventType', type);
    navigation.navigate('EventWizardForm', { eventType: type });
  };

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12 }}>
          <Entypo name="chevron-left" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 22, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily }}>Quel type d'événement ?</Text>
      </View>
      <ScrollView contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 12, paddingTop: 16, paddingBottom: 40 }}>
        {EVENT_TYPES.map((item) => (
          <EventTypeCard key={item.id} item={item} onPress={() => onSelect(item.id)} />
        ))}
      </ScrollView>
    </LinearGradient>
  );
}
