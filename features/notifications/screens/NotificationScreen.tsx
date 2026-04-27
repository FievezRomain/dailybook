import React, { useCallback, useEffect } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { Icon } from 'react-native-paper';
import { setBadgeCountAsync } from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import { useNotificationsQuery, useNotificationMutations } from '../../../hooks/queries/useNotificationsQuery';
import { useGroupMutations } from '../../../hooks/queries/useGroupsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import instanceDateUtils from '../../../shared/utils/DateUtils';
import { useAppTheme } from '../../../theme/useAppTheme';

export default function NotificationScreen({ navigation }: AppStackScreenProps<'Notification'>) {
  const { colors, fonts } = useAppTheme();
  const { data: notifications = [], isFetching, refetch } = useNotificationsQuery();
  const { markAllAsRead } = useNotificationMutations();
  const { respondInvitation, respondAnimalShare } = useGroupMutations();

  useFocusEffect(
    useCallback(() => {
      refetch();
      markAllAsRead.mutate(undefined);
      setBadgeCountAsync(0).catch(() => {});
    }, [])
  );

  const onRefresh = () => refetch();

  const acceptInvitation = (item: any) => {
    const body = { status: 'accepted' as const };
    if (item.type === 'group_member') {
      respondInvitation.mutate(
        { invitationId: item.object_id, body },
        { onSuccess: () => { navigation.navigate('Tab', { screen: 'Accueil' }); onRefresh(); } }
      );
    } else if (item.type === 'group_animal') {
      respondAnimalShare.mutate(
        { shareId: item.object_id, body },
        { onSuccess: () => { navigation.navigate('Tab', { screen: 'Accueil' }); onRefresh(); } }
      );
    }
  };

  const refuseInvitation = (item: any) => {
    const body = { status: 'declined' as const };
    if (item.type === 'group_member') {
      respondInvitation.mutate({ invitationId: item.object_id, body }, { onSuccess: onRefresh });
    } else if (item.type === 'group_animal') {
      respondAnimalShare.mutate({ shareId: item.object_id, body }, { onSuccess: onRefresh });
    }
  };

  const styles = StyleSheet.create({
    card: { borderRadius: 5, shadowColor: colors.default_dark, shadowOpacity: 0.1, elevation: 1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, padding: 20, marginBottom: 10 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    textFontSmall: { fontFamily: fonts.bodySmall.fontFamily },
    textColor: { color: colors.default_dark },
  });

  if (isFetching && !notifications.length) {
    return (
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTabSecondary message1="Vos" message2="Notifications" />
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <ListSkeleton count={5} variant="notification" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1="Vos" message2="Notifications" />
      <FlatList
        data={notifications}
        keyExtractor={(item: any, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20 }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={<ModalDefaultNoValue text="Vous n'avez aucune notification" />}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: item.is_read ? colors.background : colors.quaternary }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ width: '80%' }}>
                <Text style={[styles.textFontBold, styles.textColor]}>{item.title}</Text>
                <Text style={[styles.textFontRegular, styles.textColor]}>{item.message}</Text>
              </View>
              <View style={{ flexDirection: 'row', width: '20%', justifyContent: 'space-between' }}>
                {item.action_available && (
                  isFetching ? (
                    <ActivityIndicator animating size="small" />
                  ) : (
                    <>
                      <TouchableOpacity onPress={() => refuseInvitation(item)}>
                        <Icon source="close" size={30} color={colors.error} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => acceptInvitation(item)}>
                        <Icon source="check" size={30} color={colors.accent} />
                      </TouchableOpacity>
                    </>
                  )
                )}
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text style={[styles.textFontSmall, { fontSize: 11 }, styles.textColor]}>
                {(instanceDateUtils as any).transformTimestampToDate(item.created_at)}
                {item.proposed_by && ' - ' + item.proposed_by}
              </Text>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
}
