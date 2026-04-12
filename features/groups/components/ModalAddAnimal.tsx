import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Divider } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View, Text, FlatList } from 'react-native';
import { useGroupForm } from '../hooks/useGroupForm';
import ItemAnimalPicker from '../../../shared/components/inputs/ItemAnimalPicker';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalAddAnimalProps {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  group?: any;
  onModify?: (data?: any) => void;
}

const ModalAddAnimal = ({ isVisible, setVisible, group = {}, onModify = undefined }: ModalAddAnimalProps) => {
  const { colors, fonts } = useAppTheme();
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  const closeModal = () => setVisible(false);

  const { initializeGroup, resetGroupValues, submitGroup, animaux, selected, setSelected, checkSelected, modalSelectAnimalsIsVisible, setModalSelectAnimalsIsVisible, members, addMember, updateMembers, removeMember, loading } = useGroupForm(setValue, onModify, closeModal);

  useEffect(() => { if (group) initializeGroup(group); }, [isVisible]);

  const changeSelectedAnimals = (animal: any) => {
    const found = animaux.find((e: any) => e.id === animal.id);
    if (found) {
      const foundSelected = selected.find((e: any) => e.id === animal.id);
      if (foundSelected) {
        setValue('animals', selected.filter((e: any) => e.id !== animal.id).map((e: any) => e.id));
        setSelected(selected.filter((a: any) => a.id !== animal.id));
      } else {
        if (selected.length === 0) {
          setValue('animals', animaux.filter((e: any) => e.id === animal.id).map((e: any) => e.id));
          setSelected(animaux.filter((a: any) => a.id === animal.id));
        } else {
          setValue('animals', selected.concat(animaux.filter((e: any) => e.id === animal.id)).map((e: any) => e.id));
          setSelected(selected.concat(animaux.filter((a: any) => a.id === animal.id)));
        }
      }
    }
  };

  const submitRegister = async (data: any) => submitGroup(data, 'addAnimal');

  const getAnimals = () => {
    if (Array.isArray(animaux) && animaux.length > 0) {
      const excludedIds = group.data?.animals?.flatMap((g: any) => g.items).map((item: any) => item.id) ?? [];
      return animaux.filter((animal: any) => animal.provenance === 'owner' && !excludedIds.includes(animal.id));
    }
    return [];
  };

  const styles = StyleSheet.create({
    form: { width: '100%', paddingBottom: 40, flex: 1 },
    containerActionsButtons: { flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'center', paddingBottom: 15, paddingTop: 5 },
    formContentContainer: { flex: 1, paddingHorizontal: 10 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={isVisible} setVisible={setVisible} arrayHeight={['90%']} scrollInside={false}>
      <View style={styles.form}>
        <View style={styles.containerActionsButtons}>
          <TouchableOpacity onPress={closeModal} style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[{ color: colors.tertiary }, styles.textFontRegular]}>Annuler</Text>
          </TouchableOpacity>
          <View style={{ width: '33.33%', alignItems: 'center' }}>
            <Text style={[styles.textFontBold, { fontSize: 16, color: colors.default_dark }]}>Groupe</Text>
          </View>
          <TouchableOpacity onPress={handleSubmit(submitRegister)} style={{ width: '33.33%', alignItems: 'center' }}>
            {loading ? <ActivityIndicator size={10} color={colors.default_dark} /> : <Text style={[{ color: colors.default_dark }, styles.textFontRegular]}>Inviter</Text>}
          </TouchableOpacity>
        </View>
        <Divider />
        <View style={styles.formContentContainer}>
          <FlatList
            data={getAnimals()}
            keyExtractor={(item) => item.id.toString()}
            numColumns={4}
            style={{ paddingVertical: 10 }}
            renderItem={({ item }) => {
              const isSelected = checkSelected(item);
              const selectedIndex = selected.findIndex((e: any) => e.id === item.id);
              const showBadge = isSelected && selected.length > 1;
              return (
                <TouchableOpacity style={{ flex: 1 }} onPress={() => changeSelectedAnimals(item)} key={item.id}>
                  <ItemAnimalPicker isSelected={isSelected} item={item} selectedIndex={selectedIndex} showBadge={showBadge} />
                </TouchableOpacity>
              );
            }}
          />
        </View>
      </View>
    </ModalEditGeneric>
  );
};

export default ModalAddAnimal;
