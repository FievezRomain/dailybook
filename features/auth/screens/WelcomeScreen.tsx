import React, { useState, useCallback } from 'react';
import { View, Text, Dimensions, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { isAfter, isEqual, startOfDay } from 'date-fns';
import TopTab from '../../../shared/components/common/TopTab';
import EventsBloc from '../../events/components/EventsBloc';
import ObjectifsInProgressBloc from '../../objectifs/components/ObjectifsInProgressBloc';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useEventsQuery } from '../../../hooks/queries/useEventsQuery';
import { useObjectifsQuery } from '../../../hooks/queries/useObjectifsQuery';
import { GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import { ANIMALS_KEY } from '../../../hooks/queries/useAnimalsQuery';
import { EVENTS_KEY } from '../../../hooks/queries/useEventsQuery';
import type { TabScreenProps } from '../../../navigation/types';

export default function WelcomeScreen({ navigation }: TabScreenProps<'Accueil'>) {
  const { colors, fonts } = useAppTheme();
  const queryClient = useQueryClient();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const displayName = firebaseUser?.displayName ?? '';

  const { data: events = [] } = useEventsQuery();
  const { data: objectifs = [] } = useObjectifsQuery();
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => {}, []));

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: GROUPS_KEY }),
      queryClient.invalidateQueries({ queryKey: ANIMALS_KEY }),
      queryClient.invalidateQueries({ queryKey: EVENTS_KEY }),
    ]);
    setRefreshing(false);
  };

  const getObjectifsInProgress = () => {
    if (!Array.isArray(objectifs)) return [];
    return objectifs.filter((item: any) =>
      item.sousEtapes?.some((e: any) => e.state === false) &&
      (
        isAfter(startOfDay(new Date(item.datefin)), startOfDay(new Date())) ||
        isEqual(startOfDay(new Date(item.datefin)), startOfDay(new Date()))
      )
    );
  };

  const convertDateToText = () =>
    new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });

  const convertDayDateToText = () => {
    const raw = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const day = raw.split(' ')[0];
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const styles = {
    svgCurve: { position: 'absolute', width: Dimensions.get('window').width },
    summaryContainer: { marginTop: 15, marginLeft: 20 },
    summary: { fontSize: 20, color: colors.textPrimary },
  } as const;

  const content = refreshing ? (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <ActivityIndicator animating size="large" />
    </View>
  ) : (
    <FlatList
      data={[]}
      keyExtractor={() => 'key'}
      renderItem={null}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textPrimary} />}
      ListHeaderComponent={
        <>
          <View style={styles.summaryContainer}>
            <Text style={[styles.summary, { fontFamily: fonts.bodyMedium.fontFamily, marginBottom: 2 }]}>
              Bienvenue {displayName.slice(0, 17)}
            </Text>
            <Text style={[styles.summary, { fontFamily: fonts.bodySmall.fontFamily }]}>
              {convertDayDateToText()} {convertDateToText()}
            </Text>
          </View>
          <View style={{ marginTop: 10, paddingBottom: 10 }}>
            <EventsBloc navigation={navigation} events={events} handleEventsChange={() => {}} />
            <ObjectifsInProgressBloc
              objectifs={getObjectifsInProgress()}
              handleObjectifChange={() => {}}
              handleObjectifDelete={() => {}}
            />
          </View>
        </>
      }
    />
  );

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <TopTab message1="Bienvenue" message2="" withBackground={false} withLogo />
        {content}
      </View>
    </LinearGradient>
  );
}
