import React, { useCallback } from 'react';
import { FlatList, RefreshControl, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';
import { LinearGradient } from 'expo-linear-gradient';
import { AppIcon } from '../../../shared/components/ui';
import { setBadgeCountAsync } from 'expo-notifications';
import { useFocusEffect } from '@react-navigation/native';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import { useNotificationsQuery, useNotificationMutations } from '../../../hooks/queries/useNotificationsQuery';
import { useGroupMutations } from '../../../hooks/queries/useGroupsQuery';
import type { AppStackScreenProps } from '../../../navigation/types';
import instanceDateUtils from '../../../shared/utils/DateUtils';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import type { Notification } from '../../../models/Notification';

export default function NotificationScreen({ navigation }: AppStackScreenProps<'Notification'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('notifications');
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

  const acceptInvitation = (item: Notification) => {
    if (item.object_id === undefined) return;
    const body = { status: 'accepted' as const };
    const id = String(item.object_id);
    if (item.type === 'group_member') {
      respondInvitation.mutate(
        { invitationId: id, body },
        { onSuccess: () => { navigation.navigate('Tab', { screen: 'Accueil' }); onRefresh(); } }
      );
    } else if (item.type === 'group_animal') {
      respondAnimalShare.mutate(
        { shareId: id, body },
        { onSuccess: () => { navigation.navigate('Tab', { screen: 'Accueil' }); onRefresh(); } }
      );
    }
  };

  const refuseInvitation = (item: Notification) => {
    if (item.object_id === undefined) return;
    const body = { status: 'declined' as const };
    const id = String(item.object_id);
    if (item.type === 'group_member') {
      respondInvitation.mutate({ invitationId: id, body }, { onSuccess: onRefresh });
    } else if (item.type === 'group_animal') {
      respondAnimalShare.mutate({ shareId: id, body }, { onSuccess: onRefresh });
    }
  };

  const styles = {
    card: { borderRadius: 5, shadowColor: colors.textPrimary, shadowOpacity: 0.1, elevation: 1, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, padding: 20, marginBottom: 10 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    textFontSmall: { fontFamily: fonts.bodySmall.fontFamily },
    textColor: { color: colors.textPrimary },
  } as const;

  if (isFetching && !notifications.length) {
    return (
      <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTabSecondary message1={t('titlePart1')} message2={t('titlePart2')} />
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <ListSkeleton count={5} variant="notification" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTabSecondary message1={t('titlePart1')} message2={t('titlePart2')} />
      <FlatList
        data={notifications}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ paddingTop: 10, paddingHorizontal: 20 }}
        refreshControl={<RefreshControl refreshing={isFetching} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListEmptyComponent={<ModalDefaultNoValue text={t('noNotification')} />}
        renderItem={({ item }) => (
          <View style={[styles.card, { backgroundColor: item.is_read ? colors.background : colors.surfaceVariant }]}>
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
                        <AppIcon name="close" size={30} color={colors.error} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => acceptInvitation(item)}>
                        <AppIcon name="check" size={30} color={colors.primary} />
                      </TouchableOpacity>
                    </>
                  )
                )}
              </View>
            </View>
            <View style={{ paddingTop: 10 }}>
              <Text style={[styles.textFontSmall, { fontSize: 11 }, styles.textColor]}>
                {instanceDateUtils.transformTimestampToDate(item.created_at)}
                {item.proposed_by && ' - ' + item.proposed_by}
              </Text>
            </View>
          </View>
        )}
      />
    </LinearGradient>
  );
}
