import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useQueryClient } from '@tanstack/react-query';
import TopTab from '../../../shared/components/common/TopTab';
import { useGroupsQuery, GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import AppErrorState from '../../../shared/components/ui/AppErrorState';
import type { TabScreenProps } from '../../../navigation/types';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';
import { buildOtherButtons, type OtherButtonItem } from './otherButtons';

export default function OtherScreen({ navigation }: TabScreenProps<'Autre'>) {
  const { colors, fonts, tokens } = useAppTheme();
  const { t } = useTranslation('groups');
  const queryClient = useQueryClient();
  const { data: groups, isFetching, isError, refetch } = useGroupsQuery();
  const buttons = useMemo(() => buildOtherButtons(groups, t('noGroupsYet')), [groups, t]);

  const onRefresh = () => {
    queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
  };

  const styles = {
    container: { padding: tokens.spacing.sm },
    row: { justifyContent: 'space-between' },
    button: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      margin: tokens.spacing.xs,
      backgroundColor: colors.background,
      paddingVertical: tokens.spacing.md,
      borderRadius: tokens.radii.md,
      shadowColor: tokens.shadows.sm.shadowColor,
      shadowOpacity: tokens.shadows.sm.shadowOpacity,
      shadowRadius: tokens.shadows.sm.shadowRadius,
      shadowOffset: tokens.shadows.sm.shadowOffset,
      elevation: tokens.shadows.sm.elevation,
    },
    label: {
      fontSize: tokens.fontSizes.md,
      fontFamily: fonts.bodyMedium.fontFamily,
      color: colors.textPrimary,
      marginTop: tokens.spacing.xs,
      textAlign: 'center',
      paddingHorizontal: tokens.spacing.sm,
    },
    sectionLoader: {
      alignItems: 'center',
      justifyContent: 'center',
      gap: tokens.spacing.sm,
      paddingVertical: tokens.spacing.xl,
    },
    sectionLoaderText: {
      fontSize: tokens.fontSizes.sm,
      fontFamily: fonts.default.fontFamily,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  } as const;

  const handlePress = (item: OtherButtonItem) => {
    if (item.disabled) return;

    if (item.screen === 'GroupDetail') {
      navigation.navigate('GroupDetail', item.params);
      return;
    }

    navigation.navigate(item.screen);
  };

  const renderGroupsState = () => {
    if (isError) {
      return <AppErrorState message={t('groupsLoadError')} onRetry={() => refetch()} />;
    }

    if (isFetching) {
      return (
        <View style={styles.sectionLoader}>
          <ActivityIndicator animating size="small" color={colors.primary} />
          <Text style={styles.sectionLoaderText}>{t('groupsLoading')}</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTab message1="Mes" message2="Autre" />
      <FlatList
        data={buttons}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePress(item)}
            style={[styles.button, item.disabled && { opacity: 0.5 }]}
            disabled={item.disabled}
            accessibilityRole="button"
            accessibilityLabel={item.label}
          >
            <MaterialCommunityIcons name={item.icon} color={colors.textPrimary} size={30} />
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.container}
        ListFooterComponent={renderGroupsState}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.textPrimary} />
        }
      />
    </LinearGradient>
  );
}
