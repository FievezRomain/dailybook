import React, { useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useQueryClient } from '@tanstack/react-query';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import GroupCard from '../components/GroupCard';
import { useGroupsQuery, GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import { useTranslation } from 'react-i18next';

export default function GroupListScreen({ navigation }: AppStackScreenProps<'GroupList'>) {
  const { colors } = useAppTheme();
  const { t } = useTranslation('groups');
  const queryClient = useQueryClient();
  const { data: groups = [], isLoading, isFetching } = useGroupsQuery();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    setRefreshing(false);
  };

  if (isLoading) {
    return (
      <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTabSecondary message1={t('titlePart1')} message2={t('title')} />
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <ListSkeleton count={5} variant="group" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1={t('titlePart1')} message2={t('title')} />
      <FlatList
        data={groups}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => <GroupCard group={item} />}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.textPrimary }}>{t('noGroup')}</Text>
        }
      />
    </LinearGradient>
  );
}
