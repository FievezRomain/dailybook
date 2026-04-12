import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import ModalDefaultNoValue from '../../../shared/components/modals/common/ModalDefaultNoValue';
import AnimalCard from '../../animals/components/AnimalCard';
import { Icon, useTheme } from 'react-native-paper';
import { useAnimalsQuery } from '../../../hooks/queries/useAnimalsQuery';

const AnimalsGroup = ({
  animals,
  userRole,
  group,
}: {
  animals: { type: string; items: any[] };
  userRole: string;
  group: any;
}) => {
  const { colors, fonts } = useTheme();
  const { data: animaux = [] } = useAnimalsQuery();

  const areMyAnimalsWaiting = () => {
    if (animals.type === 'pending' && animals !== undefined) {
      const pendingAnimalsIds = animals.items.map((item: any) => item.id);
      return animaux.some((animal: any) => pendingAnimalsIds.includes(animal.id));
    }
    return false;
  };

  const canSeePendingAnimals = () => {
    if (userRole === 'manager' && animals !== undefined && animals.type === 'pending') return true;
    return areMyAnimalsWaiting();
  };

  const getPendingAnimalsICanSee = () => {
    if (userRole === 'manager') return animals.items;
    const pendingAnimalsIds = animals.items.map((item: any) => item.id);
    return animals.items.filter((animal: any) => pendingAnimalsIds.includes(animal.id));
  };

  const styles = StyleSheet.create({
    containerHeader: { paddingBottom: 10, flexDirection: 'row', alignItems: 'center' },
    container: { paddingVertical: 10 },
    title: { marginLeft: 5, color: (colors as any).default_dark },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <>
      {canSeePendingAnimals() && (
        <View style={styles.container}>
          <View style={styles.containerHeader}>
            <Icon source="clock-outline" size={20} color={(colors as any).default_dark} />
            <Text style={[styles.title, styles.textFontBold]}>Animaux en attente</Text>
          </View>
          <View>
            <FlatList
              data={getPendingAnimalsICanSee()}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item }) => (
                <AnimalCard animal={item} animalState={animals.type} userRole={userRole} group={group} />
              )}
              ListEmptyComponent={<ModalDefaultNoValue text="Aucun animal en attente" />}
            />
          </View>
        </View>
      )}
      {animals && animals.type === 'accepted' && (
        <View style={styles.container}>
          <View style={styles.containerHeader}>
            <Icon source="format-list-bulleted" size={20} color={(colors as any).default_dark} />
            <Text style={[styles.title, styles.textFontBold]}>Animaux du groupe</Text>
          </View>
          <View>
            <FlatList
              data={animals.items}
              keyExtractor={(_item, index) => index.toString()}
              renderItem={({ item }) => (
                <AnimalCard animal={item} animalState={animals.type} userRole={userRole} group={group} />
              )}
              ListEmptyComponent={<ModalDefaultNoValue text="Aucun animal dans le groupe" />}
            />
          </View>
        </View>
      )}
    </>
  );
};

export default AnimalsGroup;
