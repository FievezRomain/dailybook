import React, { useEffect, useState } from 'react';
import { View, FlatList, RefreshControl } from 'react-native';
import { useTheme, ActivityIndicator, Text } from 'react-native-paper';
import { useAuth } from '../providers/AuthenticatedUserProvider';
import groupServiceInstance from '../services/GroupService';
import GroupCard from '../components/cards/GroupCard';
import TopTabSecondary from '../components/TopTabSecondary';
import { LinearGradient } from 'expo-linear-gradient';
import { useRoute } from '@react-navigation/native';
import { useGroups } from '../providers/GroupProvider';

const GroupDetailScreen = ( ) => {
  const { colors } = useTheme();
  const { currentUser } = useAuth();
  const route = useRoute();
  const { group } = route.params;
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    groupServiceInstance.refreshCache(currentUser.email);
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
        <TopTabSecondary message1={"Vos"} message2={group.name}/>
        
      </LinearGradient>
    </>
  );
};

export default GroupDetailScreen;
