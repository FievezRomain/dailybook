import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../../../theme/useAppTheme';
import ItemAnimalPicker from './ItemAnimalPicker';
import { Animal } from '../../../models/Animal';

type AnimalListItem = Animal | { id: 'select_all'; nom: string; image: null; provenance?: undefined };

interface AnimalsPickerProps {
  animaux: Animal[];
  setSelected: (animals: Animal[]) => void;
  selected: Animal[];
  mode: 'single' | 'multiple';
  buttonAdd?: boolean;
  setValue?: (name: string, value: unknown) => void;
  setDate?: (date: string | null) => void;
  valueName?: string;
  inModal?: boolean;
  selectAll?: boolean;
  displayAnimalsShared?: boolean;
}

const AnimalsPicker: React.FC<AnimalsPickerProps> = ({
  animaux,
  setSelected,
  selected,
  mode,
  buttonAdd = false,
  setValue,
  setDate,
  valueName,
  inModal = false,
  selectAll = false,
  displayAnimalsShared = true,
}) => {
  const { colors, fonts } = useAppTheme();

  const changeSelectedAnimals = (animalOrAll: AnimalListItem) => {
    if (animalOrAll.id === 'select_all') {
      const animal = animalOrAll;
      if (displayAnimalsShared) {
        if (selected.length === animaux.length) {
          setValue?.(valueName!, undefined);
          setSelected([]);
        } else {
          setValue?.(valueName!, animaux.map((e) => e.id));
          setSelected(animaux);
        }
      } else {
        const ownerAnimals = animaux.filter((a) => a.provenance === 'owner');
        if (selected.length === ownerAnimals.length) {
          setValue?.(valueName!, undefined);
          setSelected([]);
        } else {
          setValue?.(valueName!, ownerAnimals.map((e) => e.id));
          setSelected(ownerAnimals);
        }
      }
      return;
    }

    const animal = animalOrAll as Animal;
    const found = animaux.find((e) => e.id === animal.id);
    if (found) {
      if (mode === 'single') {
        setSelected(animaux.filter((a) => a.id === animal.id));
        if (setValue !== undefined) {
          if (animal.id !== null) setValue('id', animal.id);
          if (animal.nom !== null) setValue('nom', animal.nom);
          if (animal.espece !== null) setValue('espece', animal.espece);
          if (animal.datenaissance !== null) setValue('datenaissance', animal.datenaissance);
          if (animal.race !== null) setValue('race', animal.race);
          if (animal.taille !== null) setValue('taille', String(animal.taille));
          if (animal.poids !== null) setValue('poids', String(animal.poids));
          if (animal.sexe !== null) setValue('sexe', animal.sexe);
          if (animal.couleur !== null) setValue('couleur', animal.couleur);
          if (animal.nompere !== null) setValue('nompere', animal.nompere);
          if (animal.nommere !== null) setValue('nommere', animal.nommere);
          animal.datenaissance != null ? setDate?.(animal.datenaissance) : setDate?.(null);
        }
      }
      if (mode === 'multiple') {
        const foundSelected = selected.find((e) => e.id === animal.id);
        if (foundSelected) {
          setValue?.(valueName!, selected.filter((e) => e.id !== animal.id).map((e) => e.id));
          setSelected(selected.filter((a) => a.id !== animal.id));
        } else {
          if (selected.length === 0) {
            setValue?.(valueName!, animaux.filter((e) => e.id === animal.id).map((e) => e.id));
            setSelected(animaux.filter((a) => a.id === animal.id));
          } else {
            setValue?.(
              valueName!,
              selected.concat(animaux.filter((e) => e.id === animal.id)).map((e) => e.id),
            );
            setSelected(selected.concat(animaux.filter((a) => a.id === animal.id)));
          }
        }
      }
    }
  };

  const checkSelected = (animal: AnimalListItem): boolean => {
    if (selected.length > 0) {
      return selected.some((e) => e.id === animal.id);
    }
    return false;
  };

  const reset = () => {
    setSelected([]);
    setValue?.('id', null);
    setValue?.('nom', null);
    setValue?.('espece', null);
    setValue?.('datenaissance', null);
    setValue?.('race', null);
    setValue?.('taille', null);
    setValue?.('poids', null);
    setValue?.('sexe', null);
    setValue?.('couleur', null);
    setValue?.('nompere', null);
    setValue?.('nommere', null);
    const today = new Date();
    const jour =
      parseInt(String(today.getDate())) < 10
        ? '0' + String(today.getDate())
        : String(today.getDate());
    const mois =
      parseInt(String(today.getMonth() + 1)) < 10
        ? '0' + String(today.getMonth() + 1)
        : String(today.getMonth() + 1);
    const annee = today.getFullYear();
    setDate?.(String(jour + '/' + mois + '/' + annee));
  };

  const displayedAnimaux = (): AnimalListItem[] => {
    let animalsFiltered = animaux;
    if (!displayAnimalsShared) {
      animalsFiltered = animalsFiltered.filter((a) => a.provenance === 'owner');
    }
    if (selectAll) {
      if (animalsFiltered.length > 0) {
        return [{ id: 'select_all', nom: 'Tous', image: null }, ...animalsFiltered];
      } else {
        return [];
      }
    } else {
      return animalsFiltered;
    }
  };

  const styles = StyleSheet.create({
    containerAvatar: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      alignSelf: 'center',
      marginLeft: 5,
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
  });

  const ListComponent = inModal ? BottomSheetFlatList : FlatList;

  return (
    <ListComponent
      data={displayedAnimaux()}
      keyExtractor={(item) => item.id.toString()}
      horizontal
      nestedScrollEnabled={true}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ flexGrow: 1 }}
      ListEmptyComponent={
        <View style={{ alignItems: 'center', width: '100%' }}>
          <Text style={[styles.textFontRegular, { color: colors.default_dark }]}>
            Vous n'êtes propriétaire d'aucun animal
          </Text>
        </View>
      }
      renderItem={({ item }) => {
        const isSelected = checkSelected(item);
        const selectedIndex = selected.findIndex((e) => e.id === item.id);
        const showBadge = isSelected && selected.length > 1;

        return (
          <TouchableOpacity
            style={styles.containerAvatar}
            onPress={() => changeSelectedAnimals(item)}
            key={item.id}
          >
            <ItemAnimalPicker
              item={item}
              showBadge={showBadge}
              isSelected={isSelected}
              selectedIndex={selectedIndex}
            />
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default AnimalsPicker;
