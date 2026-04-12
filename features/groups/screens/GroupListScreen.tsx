import React, { useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useQueryClient } from '@tanstack/react-query';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import GroupCard from '../components/GroupCard';
import { useGroupsQuery, GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';

export default function GroupListScreen({ navigation }: AppStackScreenProps<'GroupList'>) {
  const { colors } = useAppTheme();
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1="Vos" message2="Groupes" />
      <FlatList
        data={groups}
        keyExtractor={(item: any) => item.id.toString()}
        renderItem={({ item }) => <GroupCard group={item} />}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, color: colors.default_dark }}>Aucun groupe pour le moment</Text>
        }
      />
    </LinearGradient>
  );
}
