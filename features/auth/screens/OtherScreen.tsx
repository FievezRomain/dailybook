import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AppIconButton } from '../../../shared/components/ui';
import { useQueryClient } from '@tanstack/react-query';
import TopTab from '../../../shared/components/common/TopTab';
import { useGroupsQuery, GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import type { TabScreenProps } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

type ButtonItem = {
  id: string | number;
  icon: string;
  label: string;
  screen: string;
  params?: Record<string, unknown>;
  disabled: boolean;
};

const BASE_BUTTONS: ButtonItem[] = [
  { id: 1, icon: 'heart', label: 'Wishlist', screen: 'Wish', disabled: false },
  { id: 2, icon: 'contacts', label: 'Contacts', screen: 'Contact', disabled: false },
  { id: 3, icon: 'note-edit-outline', label: 'Notes', screen: 'Note', disabled: false },
];

export default function OtherScreen({ navigation }: TabScreenProps<'Autre'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('groups');
  const queryClient = useQueryClient();
  const { data: groups, isFetching } = useGroupsQuery();
  const [buttons, setButtons] = useState<ButtonItem[]>(BASE_BUTTONS);

  useEffect(() => {
    const groupButtons: ButtonItem[] =
      groups && groups.length > 0
        ? groups.map((group: any) => ({
            id: `group-${group.id}`,
            icon: 'account-group',
            label: group.name,
            screen: 'GroupDetail',
            params: { groupId: group.id },
            disabled: false,
          }))
        : [{ id: 'group-default', icon: 'account-group', label: t('noGroupsYet'), screen: 'GroupDetail', disabled: true }];

    setButtons([...BASE_BUTTONS, ...groupButtons]);
  }, [groups]);

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
  };

  const styles = {
    container: { padding: 10 },
    row: { justifyContent: 'space-between' },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 5,
      backgroundColor: colors.background,
      paddingVertical: 15,
      borderRadius: 10,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 2,
    },
    label: {
      fontSize: 16,
      fontFamily: fonts.bodyMedium.fontFamily,
      color: colors.textPrimary,
      marginTop: 5,
      textAlign: 'center',
      paddingHorizontal: 10,
    },
  } as const;

  if (isFetching) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTab message1="Mes" message2="Autre" />
      <FlatList
        data={buttons}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => !item.disabled && (navigation as any).navigate(item.screen, item.params)}
            style={[styles.button, item.disabled && { opacity: 0.5 }]}
            disabled={item.disabled}
          >
            <AppIconButton icon={item.icon} color={colors.textPrimary} size={30} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.textPrimary} />
        }
      />
    </LinearGradient>
  );
}
