import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Animated, StyleSheet, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme, ActivityIndicator, Text, Icon } from 'react-native-paper';
import { useQueryClient } from '@tanstack/react-query';
import { MaterialIcons, MaterialCommunityIcons, Entypo } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import TopTabSecondary from '../../../shared/components/common/TopTabSecondary';
import MembersGroup from '../components/MembersGroup';
import AnimalsGroup from '../components/AnimalsGroup';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import Button from '../../../shared/components/inputs/Button';
import ModalAddAnimal from '../components/ModalAddAnimal';
import ModalAddMember from '../components/ModalAddMember';
import ModalGroup from '../components/ModalGroup';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import { useGroupsQuery, useGroupMutations, GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import { useAuthStore } from '../../../stores/useAuthStore';
import type { AppStackScreenProps } from '../../../navigation/types';

export default function GroupDetailScreen({ navigation, route }: AppStackScreenProps<'GroupDetail'>) {
  const { colors, fonts } = useTheme();
  const queryClient = useQueryClient();
  const firebaseUser = useAuthStore((s) => s.firebaseUser);
  const { groupId } = route.params;
  const { data: groups = [] } = useGroupsQuery();
  const { remove: removeGroup } = useGroupMutations();

  const group = (groups as any[]).find((g) => g.id === groupId) ?? {};

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
    const acceptedSection = group?.data?.members?.find((m: any) => m.type === 'accepted');
    const member = acceptedSection?.items?.find((m: any) => m.email === firebaseUser?.email);
    return member?.role;
  };

  const onModify = () => {
    setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Modification du groupe' }), 350);
  };

  const onDelete = async () => {
    navigation.navigate('Tab', { screen: 'Accueil' });
    removeGroup.mutate(group.id, {
      onSuccess: () => setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: 'Suppression du groupe' }), 350),
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
        <Icon source="pencil" size={25} color={(colors as any).default_dark} />
      </TouchableOpacity>,
      <TouchableOpacity key="delete" onPress={() => setModalGroupValidationVisible(true)}>
        <Icon source="delete" size={25} color={(colors as any).default_dark} />
      </TouchableOpacity>,
    ];
  };

  const styles = StyleSheet.create({
    item: { paddingHorizontal: 20 },
    headerRubrique: { paddingVertical: 20 },
    iconsContainer: { flexDirection: 'row', paddingVertical: 10 },
    rubriqueContainer: { marginTop: 10, marginBottom: 10 },
    separatorFix: { borderTopColor: (colors as any).quaternary, borderTopWidth: 0.4, position: 'absolute', bottom: 0, height: 2, width: '100%' },
    separatorAnimated: { height: 3, backgroundColor: (colors as any).default_dark, position: 'absolute', bottom: 0, width: '50%' },
    textFontBold: { fontFamily: (fonts as any).labelLarge?.fontFamily },
    textFontRegular: { fontFamily: (fonts as any).default?.fontFamily },
    textFontMedium: { fontFamily: (fonts as any).labelMedium?.fontFamily },
    headerContainer: { paddingHorizontal: 20 },
    headerTitle: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10 },
  });

  const renderHeader = () => (
    <>
      <View style={[styles.rubriqueContainer, styles.headerContainer]}>
        <View>
          <View style={styles.headerTitle}>
            <Entypo name="info" size={20} color={(colors as any).default_dark} style={{ marginRight: 5 }} />
            <Text style={[styles.textFontBold, { color: (colors as any).default_dark }]}>Informations</Text>
          </View>
          <ModalDefaultNoValue text={group.informations ?? 'Aucune information'} />
        </View>
      </View>
      <View style={styles.rubriqueContainer}>
        <View style={styles.iconsContainer}>
          <TouchableOpacity style={{ width: '50%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => setActiveRubrique(0)}>
            <MaterialCommunityIcons name="paw" size={20} color={activeRubrique === 0 ? (colors as any).default_dark : (colors as any).quaternary} style={{ marginRight: 5 }} />
            <Text style={[{ color: activeRubrique === 0 ? (colors as any).default_dark : (colors as any).quaternary }, styles.textFontMedium]}>Animaux ({group.nb_animaux ?? 0})</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={() => setActiveRubrique(1)}>
            <MaterialIcons name="person" size={20} color={activeRubrique === 1 ? (colors as any).default_dark : (colors as any).quaternary} style={{ marginRight: 5 }} />
            <Text style={[{ color: activeRubrique === 1 ? (colors as any).default_dark : (colors as any).quaternary }, styles.textFontMedium]}>Membres ({group.nb_members ?? 0})</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.separatorFix} />
        <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] }) }]} />
      </View>
      <View style={[styles.item, styles.headerRubrique]}>
        <Button type="quaternary" onPress={() => activeRubrique === 0 ? setModalAddAnimalVisible(true) : setModalAddMemberVisible(true)}>
          <Text style={[styles.textFontMedium, { color: colors.background, textAlign: 'center' }]}>{activeRubrique === 0 ? 'Ajouter un animal' : 'Ajouter un membre'}</Text>
        </Button>
      </View>
    </>
  );

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.item}>
      {activeRubrique === 0 ? (
        <AnimalsGroup animals={item} userRole={getUserRoleFromGroup()} group={group} />
      ) : (
        <MembersGroup members={item} userRole={getUserRoleFromGroup()} group={group} />
      )}
    </View>
  );

  return (
    <>
      <ModalAddAnimal isVisible={modalAddAnimalVisible} setVisible={setModalAddAnimalVisible} group={group} onModify={onModify} />
      <ModalAddMember isVisible={modalAddMemberVisible} setVisible={setModalAddMemberVisible} group={group} onModify={onModify} />
      <ModalGroup actionType="modify" isVisible={modalGroupVisible} setVisible={setModalGroupVisible} group={group} onModify={onModify} />
      <ModalValidation displayedText="Êtes-vous sûr de vouloir supprimer le groupe ?" title="Suppression d'un groupe" onConfirm={onDelete} setVisible={setModalGroupValidationVisible} visible={modalGroupValidationVisible} />
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTabSecondary message1="Vos" message2={group.name ?? ''} btnList={getActionsComponents()} />
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
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={(colors as any).default_dark} />}
            ListEmptyComponent={
              <View style={styles.item}>
                <ModalDefaultNoValue text={activeRubrique === 0 ? 'Aucun animal' : 'Aucun membre'} />
              </View>
            }
          />
        )}
      </LinearGradient>
    </>
  );
}
