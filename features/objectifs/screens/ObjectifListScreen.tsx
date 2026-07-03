import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useObjectifsQuery, useObjectifMutations } from '../../../hooks/queries/useObjectifsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import type { Objectif } from '../../../models/Objectif';
import Button from '../../../shared/components/ui/AppButton';
import { useTranslation } from 'react-i18next';

function ObjectifListCard({ item }: { item: Objectif }) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('objectifs');
  const done = item.sousetapes?.filter((s) => s.state === 'done').length ?? 0;
  const total = item.sousetapes?.length ?? 0;
  const progress = total > 0 ? done / total : 0;

  return (
    <View style={{ backgroundColor: colors.background, borderRadius: 16, padding: 16, marginBottom: 12, elevation: 1, shadowOpacity: 0.06, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
      <Text style={{ fontSize: 15, fontFamily: fonts.bodyMedium.fontFamily, color: colors.textPrimary, marginBottom: 4 }}>{item.title}</Text>
      {item.temporalityobjectif && (
        <Text style={{ fontSize: 12, color: colors.secondary, fontFamily: fonts.default?.fontFamily, marginBottom: 6 }}>{item.temporalityobjectif}</Text>
      )}
      {total > 0 && (
        <View style={{ marginTop: 6 }}>
          <View style={{ height: 4, backgroundColor: colors.surfaceVariant, borderRadius: 2, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${Math.round(progress * 100)}%`, backgroundColor: colors.primary, borderRadius: 2 }} />
          </View>
          <Text style={{ fontSize: 11, color: colors.secondary, marginTop: 4, fontFamily: fonts.default?.fontFamily }}>{t('steps', { done, total })}</Text>
        </View>
      )}
    </View>
  );
}

export default function ObjectifListScreen({ navigation }: AppStackScreenProps<'ObjectifList'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('objectifs');
  const { data: objectifs = [], isLoading } = useObjectifsQuery();

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ paddingTop: 56, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Text style={{ fontSize: 24, color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily }}>{t('title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('ObjectifAdd')}
          style={{ backgroundColor: colors.primary, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 }}
          activeOpacity={0.8}
        >
          <Text style={{ color: colors.textOnPrimary, fontFamily: fonts.bodyMedium.fontFamily, fontSize: 14 }}>{t('addButton')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={objectifs}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <ObjectifListCard item={item} />}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        ListEmptyComponent={
          !isLoading ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <MaterialCommunityIcons name="flag-checkered" size={52} color={colors.secondary} />
              <Text style={{ marginTop: 14, fontSize: 16, fontFamily: fonts.bodyMedium.fontFamily, color: colors.textPrimary }}>{t('noObjectifYet')}</Text>
              <Text style={{ marginTop: 6, fontSize: 13, color: colors.secondary, fontFamily: fonts.default?.fontFamily }}>{t('noObjectifSubtext')}</Text>
            </View>
          ) : null
        }
      />
    </LinearGradient>
  );
}
