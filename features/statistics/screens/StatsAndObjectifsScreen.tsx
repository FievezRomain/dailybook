import React, { useState, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useFocusEffect } from '@react-navigation/native';
import { useQueryClient } from '@tanstack/react-query';
import { SimpleLineIcons, FontAwesome } from '@expo/vector-icons';
import TopTab from '../../../shared/components/common/TopTab';
import AnimalsPicker from '../../../shared/components/inputs/AnimalsPicker';
import StatistiquesBloc from '../components/StatistiquesBloc';
import ObjectifsBloc from '../../objectifs/components/ObjectifsBloc';
import { useAnimalsQuery, ANIMALS_KEY } from '../../../hooks/queries/useAnimalsQuery';
import { GROUPS_KEY } from '../../../hooks/queries/useGroupsQuery';
import { ListSkeleton } from '../../../shared/components/skeletons/CardSkeleton';

export default function StatsAndObjectifsScreen({ navigation }: TabScreenProps<'Performance'>) {
  const { colors, fonts } = useAppTheme();
  const queryClient = useQueryClient();
  const { data: animaux = [] } = useAnimalsQuery();
  const [selectedAnimal, setSelectedAnimal] = useState<any[]>([]);
  const [activeRubrique, setActiveRubrique] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const separatorPosition = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      if (animaux.length > 0) {
        const firstOwner = animaux.find((a: any) => a.provenance === 'owner');
        setSelectedAnimal(firstOwner ? [firstOwner] : []);
      }
    }, [animaux])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: GROUPS_KEY });
    await queryClient.invalidateQueries({ queryKey: ANIMALS_KEY });
    setRefreshing(false);
  };

  const moveSeparator = (index: number) => {
    Animated.timing(separatorPosition, { toValue: index, duration: 300, useNativeDriver: false }).start();
  };

  const styles = StyleSheet.create({
    iconsContainer: { flexDirection: 'row', paddingVertical: 10 },
    rubriqueContainer: { marginTop: 10, marginBottom: 10 },
    separatorFix: { borderTopColor: colors.quaternary, borderTopWidth: 0.4, position: 'absolute', bottom: 0, height: 2, width: '100%' },
    separatorAnimated: { height: 3, backgroundColor: colors.default_dark, position: 'absolute', bottom: 0, width: '50%' },
    textFontMedium: { fontFamily: fonts.labelMedium?.fontFamily },
    contentContainer: { flex: 1, alignSelf: 'center', height: '100%', width: '100%', borderRadius: 10 },
  });

  if (refreshing) {
    return (
      <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
        <TopTab message1="Mes" message2="Performances" />
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <ListSkeleton count={4} variant="event" />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={[colors.background, colors.onSurface]} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} style={{ flex: 1 }}>
      <TopTab message1="Mes" message2="Performances" />
      <FlatList
        data={[]}
        renderItem={null}
        keyExtractor={() => 'key'}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.default_dark} />}
        ListHeaderComponent={
          <>
            <View style={{ alignContent: 'flex-start', justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: 20 }}>
              <AnimalsPicker
                animaux={animaux}
                displayAnimalsShared={false}
                setSelected={setSelectedAnimal}
                selected={selectedAnimal}
                mode="multiple"
                selectAll
              />
            </View>
            <View style={styles.rubriqueContainer}>
              <View style={styles.iconsContainer}>
                <TouchableOpacity style={{ width: '50%', alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }} onPress={() => { setActiveRubrique(0); moveSeparator(0); }}>
                  <SimpleLineIcons name="target" size={20} color={activeRubrique === 0 ? colors.default_dark : colors.quaternary} style={{ marginRight: 5 }} />
                  <Text style={[{ color: activeRubrique === 0 ? colors.default_dark : colors.quaternary }, styles.textFontMedium]}>Objectifs</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ width: '50%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }} onPress={() => { setActiveRubrique(1); moveSeparator(1); }}>
                  <FontAwesome name="pie-chart" size={20} color={activeRubrique === 1 ? colors.default_dark : colors.quaternary} style={{ marginRight: 5 }} />
                  <Text style={[{ color: activeRubrique === 1 ? colors.default_dark : colors.quaternary }, styles.textFontMedium]}>Statistiques</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.separatorFix} />
              <Animated.View style={[styles.separatorAnimated, { left: separatorPosition.interpolate({ inputRange: [0, 1], outputRange: ['0%', '50%'] }) }]} />
            </View>
            <View style={styles.contentContainer}>
              {activeRubrique === 0 ? (
                <ObjectifsBloc animaux={animaux} selectedAnimal={selectedAnimal} navigation={navigation} />
              ) : (
                <StatistiquesBloc selectedAnimal={selectedAnimal} />
              )}
            </View>
          </>
        }
      />
    </LinearGradient>
  );
}
