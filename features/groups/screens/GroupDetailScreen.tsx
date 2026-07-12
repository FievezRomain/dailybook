import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, Text, TouchableOpacity, View, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQueryClient } from '@tanstack/react-query';
import { MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import MembersGroup from '../components/MembersGroup';
import AnimalsGroup from '../components/AnimalsGroup';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import Button from '../../../shared/components/ui/AppButton';
import ModalAddAnimal from '../components/ModalAddAnimal';
import ModalAddMember from '../components/ModalAddMember';
import ModalGroup from '../components/ModalGroup';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import { useGroupsQuery, useGroupMutations, GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { AppStackScreenProps } from '../../../navigation/types';
import type { Group } from '../../../models/Group';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AppIcon } from '../../../shared/components/ui';
import { useTranslation } from 'react-i18next';

export default function GroupDetailScreen({ navigation, route }: AppStackScreenProps<'GroupDetail'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('groups');
  const queryClient = useQueryClient();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const { groupId } = route.params;
  const { data: groups = [] } = useGroupsQuery();
  const { remove: removeGroup } = useGroupMutations();

  type GroupDetail = Group & {
    data?: {
      animals?: unknown[];
      members?: Array<{ type: string; items?: Array<{ email?: string; role?: string }> }>;
    };
  };
  const group = groups.find((g) => String(g.id) === groupId) as GroupDetail | undefined;

  const [refreshing, setRefreshing] = useState(false);
  const [activeRubrique, setActiveRubrique] = useState(0);
  const [modalGroupVisible, setModalGroupVisible] = useState(false);
  const [modalGroupValidationVisible, setModalGroupValidationVisible] = useState(false);
  const [modalAddAnimalVisible, setModalAddAnimalVisible] = useState(false);
  const [modalAddMemberVisible, setModalAddMemberVisible] = useState(false);
  const separatorPosition = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    moveSeparator(activeRubrique);
  }, [activeRubrique]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    setRefreshing(false);
  };

  const moveSeparator = (index: number) => {
    Animated.timing(separatorPosition, { toValue: index, duration: 300, useNativeDriver: false }).start();
  };

  const getUserRoleFromGroup = () => {
    const acceptedSection = group?.data?.members?.find((m) => m.type === 'accepted');
    const member = acceptedSection?.items?.find((m) => m.email === firebaseUser?.email);
    return member?.role;
  };

  const onModify = () => {
      setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: t('modified') }), 350);
  };

  const onDelete = async () => {
    navigation.navigate('Tab', { screen: 'Accueil' });
    if (!group) return;
    removeGroup.mutate(String(group.id), {
      onSuccess: () => setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: t('deleted') }), 350),
    });
  };

  const getCurrentData = () => {
    if (activeRubrique === 0) return group?.data?.animals ?? [];
    if (activeRubrique === 1) return group?.data?.members ?? [];
    return [];
  };

  const getActionsComponents = () => {
    if (getUserRoleFromGroup() !== 'manager') return [];
    return [
      <TouchableOpacity key="edit" onPress={() => setModalGroupVisible(true)}>
        <AppIcon name="pencil" size={25} color={colors.textPrimary} />
      </TouchableOpacity>,
      <TouchableOpacity key="delete" onPress={() => setModalGroupValidationVisible(true)}>
        <AppIcon name="delete" size={25} color={colors.textPrimary} />
      </TouchableOpacity>,
    ];
  };

  const styles = {
    item: { paddingHorizontal: 20 },
    headerRubrique: { paddingVertical: 20 },
    iconsContainer: { flexDirection: 'row', paddingVertical: 10 },
    rubriqueContainer: { marginTop: 10, marginBottom: 10 },
    separatorFix: { borderTopColor: colors.surfaceVariant, borderTopWidth: 0.4, position: 'absolute', bottom: 0, height: 2, width: '100%' },
    separatorAnimated: { height: 3, backgroundColor: colors.textPrimary, position: 'absolute', bottom: 0, width: '50%' },
    textFontBold: { fontFamily: fonts.labelLarge?.fontFamily },
    textFontRegular: { fontFamily: fonts.default?.fontFamily },
    textFontMedium: { fontFamily: fonts.labelMedium?.fontFamily },
    headerContainer: { paddingHorizontal: 20 },
    headerTitle: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10 },
  } as const;

  const renderHeader = () => (
    <>
      <View style={[styles.rubriqueContainer, styles.headerContainer]}>
        <View>
          <View style={styles.headerTitle}>
            <Entypo name="info" size={20} color={colors.textPrimary} style={{ marginRight: 5 }} />
            <Text style={[styles.textFontBold, { color: colors.textPrimary }]}>{t('informations')}</Text>
          </View>
          <ModalDefaultNoValue text={group?.informations ?? t('noInformation')} />
        </View>
      </View>
      <View style={styles.rubriqueContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={{ width: '50%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => setActiveRubrique(0)}>
            <MaterialCommunityIcons name="paw" size={20} color={activeRubrique === 0 ? colors.textPrimary : colors.surfaceVariant} style={{ marginRight: 5 }} />
            <Text style={[{ color: activeRubrique === 0 ? colors.textPrimary : colors.surfaceVariant }, styles.textFontMedium]}>{t('animalsTab', { count: group?.nb_animaux ?? 0 })}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={() => setActiveRubrique(1)}>
            <MaterialIcons name="person" size={20} color={activeRubrique === 1 ? colors.textPrimary : colors.surfaceVariant} style={{ marginRight: 5 }} />
            <Text style={[{ color: activeRubrique === 1 ? colors.textPrimary : colors.surfaceVariant }, styles.textFontMedium]}>{t('membersTab', { count: group?.nb_members ?? 0 })}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorFix} />
        <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] }) }]} />
      </View>
      <View style={[styles.item, styles.headerRubrique]}>
        <Button type="quaternary" onPress={() => activeRubrique === 0 ? setModalAddAnimalVisible(true) : setModalAddMemberVisible(true)}>
          <Text style={[styles.textFontMedium, { color: colors.background, textAlign: 'center' }]}>{activeRubrique === 0 ? t('addAnimal') : t('addMember')}</Text>
        </Button>
      </View>
    </>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      {activeRubrique === 0 ? (
        <AnimalsGroup animals={item} userRole={getUserRoleFromGroup() ?? ''} group={group} />
      ) : (
        <MembersGroup members={item} userRole={getUserRoleFromGroup() ?? ''} group={group} />
      )}
    </View>
  );

  return (
    <>
      <ModalAddAnimal isVisible={modalAddAnimalVisible} setVisible={setModalAddAnimalVisible} group={group} onModify={onModify} />
      <ModalAddMember isVisible={modalAddMemberVisible} setVisible={setModalAddMemberVisible} group={group} onModify={onModify} />
      <ModalGroup actionType="modify" isVisible={modalGroupVisible} setVisible={setModalGroupVisible} group={group} onModify={onModify} />
      <ModalValidation displayedText={t('deleteConfirm')} title={t('deleteTitle')} onConfirm={onDelete} setVisible={setModalGroupValidationVisible} visible={modalGroupValidationVisible} />
      <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTabSecondary message1={t('titlePart1')} message2={group?.name ?? ''} btnList={getActionsComponents()} />
        {refreshing ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <ActivityIndicator animating size="large" />
          </View>
        ) : (
          <FlatList
            data={getCurrentData()}
            keyExtractor={(_, index) => index.toString()}
            ListHeaderComponent={renderHeader}
            renderItem={renderItem}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textPrimary} />}
            ListEmptyComponent={
              <View style={styles.item}>
                <ModalDefaultNoValue text={activeRubrique === 0 ? t('noAnimal') : t('noMember')} />
              </View>
            }
          />
        )}
      </LinearGradient>
    </>
  );
}
