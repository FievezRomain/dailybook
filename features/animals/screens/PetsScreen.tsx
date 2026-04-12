import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Entypo, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
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

export default function PetsScreen({ navigation }: TabScreenProps<'Animaux'>) {
  const { colors, fonts } = useTheme();
  const queryClient = useQueryClient();
  const { data: animaux = [], isFetching } = useAnimalsQuery();
  const { remove } = useAnimalMutations();
  const [selected, setSelected] = useState<any[]>([]);
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
      const updated = selected.map((sel: any) => animaux.find((a: any) => a.id === sel.id)).filter(Boolean);
      if (updated.length > 0) setSelected(updated as any[]);
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
    remove.mutate(selected[0].id, {
      onSuccess: () => {
        const remaining = (animaux as any[]).filter((a: any) => a.id !== selected[0].id);
        if (remaining.length === 0) {
        (navigation as any).navigate('FirstPageAddAnimal');
        } else {
          setSelected([remaining[0]]);
        }
        Toast.show({ type: 'success', position: 'top', text1: 'Suppression réussie' });
      },
      onError: (err: any) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
        LoggerService.log('Erreur lors de la suppression : ' + err.message);
      },
    });
  };

  const onModify = () => {
    setTimeout(() => Toast.show({ type: 'success', position: 'top', text1: "Modification de l'animal" }), 300);
  };

  const moveSeparator = (index: number) => {
    Animated.timing(separatorPosition, { toValue: index, duration: 300, useNativeDriver: false }).start();
  };

  const styles = StyleSheet.create({
    rubriqueContainer: { marginTop: 10, marginBottom: 25 },
    iconsContainer: { flexDirection: 'row', paddingVertical: 10 },
    separatorFix: { borderTopColor: (colors as any).quaternary, borderTopWidth: 0.4, position: 'absolute', bottom: 0, height: 2, width: '100%' },
    separatorAnimated: { height: 3, backgroundColor: (colors as any).default_dark, position: 'absolute', bottom: 0, width: '33.3%' },
    textFontMedium: { fontFamily: (fonts as any).bodyMedium?.fontFamily },
  });

  return (
    <>
      <ModalValidation
        displayedText="Êtes-vous sûr de vouloir supprimer l'animal ?"
        onConfirm={confirmDeletePet}
        setVisible={setModalValidationDeleteVisible}
        visible={modalValidationDeleteVisible}
        title="Suppression d'un animal"
      />
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTab message1="Mes" message2="Animaux" />
        {refreshing ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
            <ActivityIndicator animating size="large" />
          </View>
        ) : (
          <FlatList
            data={[]}
            keyExtractor={() => 'key'}
            renderItem={null}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={(colors as any).default_dark} />}
            ListHeaderComponent={
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
                <View style={styles.rubriqueContainer}>
                  <View style={styles.iconsContainer}>
                    <TouchableOpacity style={{ width: '33.3%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => { setActiveRubrique(0); moveSeparator(0); }}>
                      <Entypo name="info-with-circle" size={20} color={activeRubrique === 0 ? (colors as any).default_dark : (colors as any).quaternary} style={{ marginRight: 5 }} />
                      <Text style={[{ color: activeRubrique === 0 ? (colors as any).default_dark : (colors as any).quaternary }, styles.textFontMedium]}>Informations</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '33.3%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => { setActiveRubrique(1); moveSeparator(1); }}>
                      <MaterialCommunityIcons name="clipboard-pulse-outline" size={20} color={activeRubrique === 1 ? (colors as any).default_dark : (colors as any).quaternary} style={{ marginRight: 5 }} />
                      <Text style={[{ color: activeRubrique === 1 ? (colors as any).default_dark : (colors as any).quaternary }, styles.textFontMedium]}>Physique</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: '33.3%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => { setActiveRubrique(2); moveSeparator(2); }}>
                      <FontAwesome6 name="book-medical" size={20} color={activeRubrique === 2 ? (colors as any).default_dark : (colors as any).quaternary} style={{ marginRight: 5 }} />
                      <Text style={[{ color: activeRubrique === 2 ? (colors as any).default_dark : (colors as any).quaternary }, styles.textFontMedium]}>Santé</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.separatorFix} />
                  <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1, 2], outputRange: ['0%', '33.3%', '66.6%'] }) }]} />
                </View>
                {selected[0] && activeRubrique === 0 && <InformationsAnimals animal={selected[0]} onDelete={() => setModalValidationDeleteVisible(true)} onModify={onModify} />}
                {selected[0] && activeRubrique === 1 && <AnimalBody animal={selected[0]} onModify={onModify} />}
                {selected[0] && activeRubrique === 2 && <MedicalBook animal={selected[0]} navigation={navigation} />}
              </>
            }
          />
        )}
      </LinearGradient>
    </>
  );
}
