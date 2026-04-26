import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';
import { getFileUrl } from '../../../services/aws/FileStorageService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { useGroupForm } from '../../groups/hooks/useGroupForm';
import { useForm } from 'react-hook-form';
import Toast from 'react-native-toast-message';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import { Image } from 'expo-image';
import { Animal } from '../../../models/Animal';
import { useAppTheme } from '../../../theme/useAppTheme';
import * as Haptics from 'expo-haptics';

const AnimalCard = ({
  animal,
  animalState,
  userRole,
  group,
}: {
  animal: any;
  animalState: string;
  userRole: string;
  group: any;
}) => {
  const { colors, fonts } = useAppTheme();
  const { handleSubmit, setValue } = useForm();
  const [modalValidationVisible, setModalValidationVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const onModify = () => {
    Toast.show({ type: 'success', position: 'top', text1: 'Modification du groupe' });
  };

  const { submitGroup, animaux, loading } = useGroupForm(setValue, onModify, () => {});

  const getGlobalCurrantAnimalByAnimalGroup = (a: any): Animal => {
    const found = animaux.find((obj) => obj.id === a.id);
    return found ?? {} as Animal;
  };

  const currentAnimal = getGlobalCurrantAnimalByAnimalGroup(animal);

  useEffect(() => {
    setValue('animaux', [currentAnimal.id]);
  }, [currentAnimal]);

  useEffect(() => {
    if (currentAnimal.image) {
      getFileUrl(currentAnimal.image!, 'animal', String(currentAnimal.id))
        .then((u) => setImageUrl(u))
        .catch(() => {});
    } else {
      setImageUrl(null);
    }
  }, [currentAnimal.image, currentAnimal.id]);

  const acceptAnimal = async (data: any) => {
    Haptics.selectionAsync().catch(() => undefined);
    data.status = 'accepted';
    data.id = group.id;
    submitGroup(data, 'respondAnimal');
  };

  const refuseAnimal = async (data: any) => {
    Haptics.selectionAsync().catch(() => undefined);
    data.status = 'declined';
    data.id = group.id;
    submitGroup(data, 'respondAnimal');
    setModalValidationVisible(false);
  };

  const getActionsPart = () => {
    if (loading) return <ActivityIndicator animating size="large" />;
    if (animalState === 'pending') {
      return (
        <>
          <TouchableOpacity style={{ marginRight: 20 }} onPress={handleSubmit(refuseAnimal)}>
            <Icon source="close" size={30} color={colors.error} />
          </TouchableOpacity>
          {userRole === 'manager' && (
            <TouchableOpacity onPress={handleSubmit(acceptAnimal)}>
              <Icon source="check" size={30} color={colors.accent} />
            </TouchableOpacity>
          )}
        </>
      );
    }
    if (animalState === 'accepted' && (userRole === 'manager' || currentAnimal.provenance === 'owner')) {
      return (
        <TouchableOpacity onPress={() => setModalValidationVisible(true)}>
          <Icon source="exit-to-app" size={30} color={colors.error} />
        </TouchableOpacity>
      );
    }
    return null;
  };

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.background,
      marginBottom: 10,
      borderRadius: 5,
      shadowColor: colors.default_dark,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
      paddingHorizontal: 10,
    },
    contentCard: {
      padding: 10,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    itemsContainer: { flexDirection: 'row', alignItems: 'center' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
    avatar: { width: 60, height: 60, borderRadius: 50, zIndex: 1, justifyContent: 'center', borderWidth: 0.1 },
    containerAvatarWithoutImage: {
      height: 65,
      width: 65,
      borderRadius: 50,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.default_dark,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
    },
    containerAvatarWithImage: {
      width: 65,
      height: 65,
      borderRadius: 50,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.default_dark,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
    },
    avatarText: { textAlign: 'center', color: colors.background, fontSize: 30 },
    informationsAnimal: { marginLeft: 10 },
    infoText: { color: colors.default_dark },
  });

  return (
    <>
      <ModalValidation
        displayedText={`Êtes-vous sûr de vouloir retirer ${animal.nom} du groupe ?`}
        title="Retrait d'un animal"
        onConfirm={handleSubmit(refuseAnimal)}
        setVisible={setModalValidationVisible}
        visible={modalValidationVisible}
      />
      <View style={styles.card}>
        <View style={styles.contentCard}>
          <View style={styles.itemsContainer}>
            {currentAnimal.image !== null ? (
              <View style={styles.containerAvatarWithImage}>
                <Image style={styles.avatar} source={{ uri: imageUrl ?? undefined }} cachePolicy="disk" />
              </View>
            ) : (
              <View style={styles.containerAvatarWithoutImage}>
                <View style={[styles.avatar, { backgroundColor: colors.quaternary }]}>
                  <Text style={[styles.avatarText, styles.textFontRegular]}>{currentAnimal.nom?.[0]}</Text>
                </View>
              </View>
            )}
            <View style={styles.informationsAnimal}>
              <Text style={[styles.textFontBold, styles.infoText]}>{currentAnimal.nom}</Text>
              <Text style={[styles.textFontRegular, styles.infoText]}>{currentAnimal.espece}</Text>
              {currentAnimal.datenaissance && (
                <Text style={[styles.textFontRegular, styles.infoText]}>{currentAnimal.datenaissance}</Text>
              )}
            </View>
          </View>
          <View style={styles.itemsContainer}>{getActionsPart()}</View>
        </View>
      </View>
    </>
  );
};

export default AnimalCard;
