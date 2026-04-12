import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Icon, useTheme } from 'react-native-paper';
import { useAuthStore } from '../../../stores/useAuthStore';
import ModalManageBodyAnimal from './ModalManageBodyAnimal';
import AnimalImageCarousel from './AnimalImageCarousel';

const AnimalBody = ({ animal, onModify }: { animal: any; onModify: () => void }) => {
  const { user } = useAuthStore();
  const { colors, fonts } = useTheme();
  const [isBodyManageModalVisible, setBodyManageModalVisible] = useState(false);
  const [item, setItem] = useState<string | undefined>(undefined);

  const handleBodyUpdate = () => {
    setBodyManageModalVisible(false);
    onModify();
  };

  const openModal = (selectedItem: string) => {
    setItem(selectedItem);
    setBodyManageModalVisible(true);
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      width: '100%',
      paddingLeft: 20,
      paddingVertical: 25,
      borderRadius: 5,
      shadowColor: (colors as any).default_dark,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
      marginBottom: 20,
    },
    text: { color: (colors as any).default_dark },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textInput: { alignSelf: 'flex-start', marginBottom: 5 },
    input: {
      height: 40,
      width: '80%',
      marginBottom: 10,
      borderRadius: 5,
      paddingLeft: 15,
      backgroundColor: (colors as any).quaternary,
      color: (colors as any).default_dark,
      alignSelf: 'baseline',
    },
    iconUpdate: { height: 40, width: '20%', justifyContent: 'center', alignItems: 'center' },
    headerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
      marginLeft: 20,
    },
    title: { color: (colors as any).default_dark, fontSize: 16, marginLeft: 10 },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <>
      <ModalManageBodyAnimal
        isVisible={isBodyManageModalVisible}
        setVisible={setBodyManageModalVisible}
        animal={animal}
        onModify={handleBodyUpdate}
        item={item}
        actionType="create"
      />
      <View style={{ flexDirection: 'column' }}>
        {(user as any)?.abonnement?.libelle === 'Premium' && (
          <>
            <View style={styles.headerContainer}>
              <Icon source="camera-burst" size={25} color={(colors as any).default_dark} />
              <Text style={[styles.title, styles.textFontBold]}>Évolution physique</Text>
            </View>
            <AnimalImageCarousel animalId={animal.id} />
          </>
        )}
        <View style={styles.headerContainer}>
          <Icon source="clipboard-pulse-outline" size={25} color={(colors as any).default_dark} />
          <Text style={[styles.title, styles.textFontBold]}>Informations physique</Text>
        </View>
        <View style={{ width: '90%', alignSelf: 'center' }}>
          <View style={styles.card}>
            <View>
              <Text style={[styles.textInput, styles.textFontRegular, styles.text]}>Taille (cm) :</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[styles.input, styles.textFontRegular]}
                  placeholder="Exemple : 140"
                  placeholderTextColor={colors.secondary}
                  defaultValue={animal.taille != null ? String(animal.taille) : undefined}
                  editable={false}
                />
                <TouchableOpacity style={styles.iconUpdate} onPress={() => openModal('taille')}>
                  <Icon source="update" size={25} color={(colors as any).default_dark} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={[styles.textInput, styles.textFontRegular, styles.text]}>Poids (kg) :</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[styles.input, styles.textFontRegular]}
                  placeholder="Exemple : 400"
                  placeholderTextColor={colors.secondary}
                  defaultValue={animal.poids != null ? String(animal.poids) : undefined}
                  editable={false}
                />
                <TouchableOpacity style={styles.iconUpdate} onPress={() => openModal('poids')}>
                  <Icon source="update" size={25} color={(colors as any).default_dark} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={[styles.textInput, styles.textFontRegular, styles.text]}>Nom alimentation :</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[styles.input, styles.textFontRegular]}
                  placeholder="Exemple : Granulés X"
                  placeholderTextColor={colors.secondary}
                  defaultValue={animal.food}
                  editable={false}
                />
                <TouchableOpacity style={styles.iconUpdate} onPress={() => openModal('food')}>
                  <Icon source="update" size={25} color={(colors as any).default_dark} />
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text style={[styles.textInput, styles.textFontRegular, styles.text]}>Quantité :</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={[styles.input, styles.textFontRegular]}
                  placeholder="Exemple : 200"
                  placeholderTextColor={colors.secondary}
                  defaultValue={
                    animal.quantity != null
                      ? String(animal.quantity) + (animal.unity ? ' ' + animal.unity : '')
                      : undefined
                  }
                  editable={false}
                />
                <TouchableOpacity style={styles.iconUpdate} onPress={() => openModal('quantity')}>
                  <Icon source="update" size={25} color={(colors as any).default_dark} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default AnimalBody;
