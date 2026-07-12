import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, Animated, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import TopTab from '../../../shared/components/common/TopTab';
import AnimalsPicker from '../../../shared/components/inputs/AnimalsPicker';
import InformationsAnimals from '../components/InformationsAnimals';
import AnimalBody from '../components/AnimalBody';
import MedicalBook from '../components/MedicalBook';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import LoggerService from '../../../services/logs/LoggerService';
import { useAnimalsQuery, useAnimalMutations, ANIMALS_KEY } from '../../../hooks/queries/useAnimalsQuery';
import { GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import type { TabScreenProps } from '../../../navigation/types';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';
import type { Animal } from '../../../models/Animal';
import { AppEmptyState, AppErrorState } from '../../../shared/components/ui';

export default function PetsScreen({ navigation }: TabScreenProps<'Animaux'>) {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('animals');
  const queryClient = useQueryClient();
  const {
    data: animaux = [],
    isLoading,
    isError,
    refetch,
  } = useAnimalsQuery();
  const { remove } = useAnimalMutations();
  const [selected, setSelected] = useState<Animal[]>([]);
  const [activeRubrique, setActiveRubrique] = useState(0);
  const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const separatorPosition = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      if (selected.length === 0 && animaux.length > 0) {
        setSelected([animaux[0]]);
      }
    }, [navigation])
  );

  useEffect(() => {
    if (selected.length > 0 && animaux.length > 0) {
      const updated = selected
        .map((sel) => animaux.find((a) => a.id === sel.id))
        .filter((a): a is Animal => Boolean(a));
      if (updated.length > 0) setSelected(updated);
    }
  }, [animaux]);

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    await queryClient.invalidateQueries({ queryKey: ANIMALS_KEY });
    setRefreshing(false);
  };

  const confirmDeletePet = () => {
    setModalValidationDeleteVisible(false);
    if (!selected[0]) return;
    remove.mutate(String(selected[0].id), {
      onSuccess: () => {
        const remaining = animaux.filter((a) => a.id !== selected[0].id);
        if (remaining.length === 0) {
          navigation.navigate('AnimalAddWizard');
        } else {
          setSelected([remaining[0]]);
        }
        Toast.show({ type: 'success', position: 'top', text1: t('deleted') });
      },
      onError: (err: Error) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
        LoggerService.log('Erreur lors de la suppression : ' + err.message);
      },
    });
  };

  const onModify = () => {
    setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: t('modifyToast') }), 300);
  };

  const moveSeparator = (index: number) => {
    Animated.timing(separatorPosition, { toValue: index, duration: 300, useNativeDriver: false }).start();
  };

  const styles = {
    rubriqueContainer: { marginTop: 10, marginBottom: 25 },
    iconsContainer: { flexDirection: 'row', paddingVertical: 10 },
    separatorFix: { borderTopColor: colors.border, borderTopWidth: 0.4, position: 'absolute', bottom: 0, height: 2, width: '100%' },
    separatorAnimated: { height: 3, backgroundColor: colors.textPrimary, position: 'absolute', bottom: 0, width: '33.3%' },
    textFontMedium: { fontFamily: fonts.bodyMedium?.fontFamily },
  } as const;

  return (
    <>
      <ModalValidation
        displayedText={t('deleteText')}
        onConfirm={confirmDeletePet}
        setVisible={setModalValidationDeleteVisible}
        visible={modalValidationDeleteVisible}
        title={t('deleteTitle')}
      />
      <LinearGradient colors={[colors.background, colors.surfaceVariant]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTab message1="Mes" message2="Animaux" />
        {isLoading || refreshing ? (
          <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
            <ListSkeleton count={4} variant="animal" />
          </View>
        ) : isError ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AppErrorState message="Impossible de charger les animaux." onRetry={() => void refetch()} />
          </View>
        ) : (
          <FlatList
            data={[]}
            keyExtractor={() => 'key'}
            renderItem={null}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.textPrimary} />}
            ListHeaderComponent={
              animaux.length === 0 ? (
                <AppEmptyState icon="horse" title={t('noAnimal')} description={t('noAnimalSub')} />
              ) : (
              <>
                <View style={{ alignContent: 'flex-start', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 20 }}>
                  <AnimalsPicker
                    animaux={animaux}
                    setSelected={setSelected}
                    selected={selected}
                    setValue={() => {}}
                    mode="single"
                    buttonAdd
                    setDate={() => {}}
                  />
                </View>
                {selected[0] && (
                  <TouchableOpacity
                    onPress={() => {
                      Haptics.selectionAsync().catch(() => undefined);
                      navigation.navigate('AnimalDetail', { animalId: selected[0].id });
                    }}
                    style={{ alignSelf: 'flex-end', marginRight: 20, marginBottom: 4, flexDirection: 'row', alignItems: 'center' }}
                  >
                    <Text style={{ fontSize: 13, color: colors.primary, fontFamily: fonts.default.fontFamily }}>{t('seeProfile')}</Text>
                    <Entypo name="chevron-right" size={14} color={colors.primary} />
                  </TouchableOpacity>
                )}
                <View style={styles.rubriqueContainer}>
                  <View style={styles.iconsContainer}>
                    <TouchableOpacity style={{ width: '33.3%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => { setActiveRubrique(0); moveSeparator(0); }}>
                      <Entypo name="info-with-circle" size={20} color={activeRubrique === 0 ? colors.textPrimary : colors.border} style={{ marginRight: 5 }} />
                      <Text style={[{ color: activeRubrique === 0 ? colors.textPrimary : colors.border }, styles.textFontMedium]}>{t('informations')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '33.3%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => { setActiveRubrique(1); moveSeparator(1); }}>
                      <MaterialCommunityIcons name="clipboard-pulse-outline" size={20} color={activeRubrique === 1 ? colors.textPrimary : colors.border} style={{ marginRight: 5 }} />
                      <Text style={[{ color: activeRubrique === 1 ? colors.textPrimary : colors.border }, styles.textFontMedium]}>{t('physique')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '33.3%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => { setActiveRubrique(2); moveSeparator(2); }}>
                      <FontAwesome6 name="book-medical" size={20} color={activeRubrique === 2 ? colors.textPrimary : colors.border} style={{ marginRight: 5 }} />
                      <Text style={[{ color: activeRubrique === 2 ? colors.textPrimary : colors.border }, styles.textFontMedium]}>{t('health')}</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.separatorFix} />
                  <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1, 2], outputRange: ['0%', '33.3%', '66.6%'] }) }]} />
                </View>
                {selected[0] && activeRubrique === 0 && <InformationsAnimals animal={selected[0]} onDelete={() => setModalValidationDeleteVisible(true)} onModify={onModify} />}
                {selected[0] && activeRubrique === 1 && <AnimalBody animal={selected[0]} onModify={onModify} />}
                {selected[0] && activeRubrique === 2 && <MedicalBook animal={selected[0]} navigation={navigation} />}
              </>
              )
            }
          />
        )}
      </LinearGradient>
    </>
  );
}
