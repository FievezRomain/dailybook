import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import groupServiceInstance from '../services/GroupService';
import GroupCard from '../components/cards/GroupCard';

const GroupListScreen = () => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = async () => {
    try {
      const data = await groupServiceInstance.getGroups(currentUser.email);
      setGroups(data);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes :', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchGroups();
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator animating={true} size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={groups}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <GroupCard group={item} />}
      contentContainerStyle={{ padding: 16, backgroundColor: colors.background }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
        />
      }
      ListEmptyComponent={
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Aucun groupe pour le moment</Text>
      }
    />
  );
};

export default GroupListScreen;
