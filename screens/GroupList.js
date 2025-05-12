import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import groupServiceInstance from '../services/GroupService';
import GroupCard from '../components/cards/GroupCard';
import TopTabSecondary from '../components/TopTabSecondary';
import { LinearGradient } from 'expo-linear-gradient';
import { useGroups } from '../providers/GroupProvider';
import LoggerService from '../services/LoggerService';

const GroupListScreen = () => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();
  const { groups } = useGroups();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = async () => {
    try {
      setRefreshing(true);
      setLoading(true);
      await groupServiceInstance.refreshCache(currentUser.email);
    } catch (error) {
      console.error('Erreur lors du chargement des groupes :', error);
      LoggerService.log('Erreur lors du chargement des groupes :' + error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
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
    <>
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{flex: 1}}>
        <TopTabSecondary message1={"Vos"} message2={"Groupes"}/>
        <FlatList
          data={groups}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <GroupCard group={item} />}
          contentContainerStyle={{ padding: 16 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20, color: colors.default_dark }}>Aucun groupe pour le moment</Text>
          }
        />
      </LinearGradient>
    </>
  );
};

export default GroupListScreen;
