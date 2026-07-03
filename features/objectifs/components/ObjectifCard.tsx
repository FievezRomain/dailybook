import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import CompletionBar from '../../../shared/components/common/CompletionBar';
import { Entypo } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
import { deleteObjectif, updateObjectif } from '../../../services/api/ObjectifService';
import Toast from 'react-native-toast-message';
import ModalSubMenuObjectifActions from './ModalSubMenuObjectifActions';
import ModalObjectifSubTasks from './ModalObjectifSubTasks';
import ModalObjectif from './ModalObjectif';
import LoggerService from '../../../services/logs/LoggerService';
import { getFileUrl } from '../../../services/aws/FileStorageService';
import { useAuthStore } from '../../../stores/useAuthStore';
import { Image } from 'expo-image';
import { AppDivider } from '../../../shared/components/ui';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import { useAppTheme } from '../../../theme/useAppTheme';

interface Animal {
  id: number;
  nom: string;
  image?: string;
  [key: string]: any;
}

const AnimalAvatar = ({ animal, avatarStyle, textStyle }: { animal: Animal; avatarStyle: any; textStyle: any }) => {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (animal.image) {
      getFileUrl(animal.image, 'animal', String(animal.id))
        .then((u) => setUrl(u))
        .catch(() => {});
    }
  }, [animal.image, animal.id]);
  return url ? (
    <Image style={avatarStyle} source={{ uri: url }} cachePolicy="disk" />
  ) : (
    <Text style={textStyle}>{animal.nom?.[0] ?? '?'}</Text>
  );
};

const ObjectifCard = ({
  objectif,
  animaux,
  handleObjectifChange,
  handleObjectifDelete,
}: {
  objectif: any;
  animaux: Animal[];
  handleObjectifChange: (o: any) => void;
  handleObjectifDelete: (o: any) => void;
}) => {
  const { colors, fonts } = useAppTheme();
  const [modalSubMenuObjectifVisible, setModalSubMenuObjectifVisible] = useState(false);
  const [modalManageTasksVisible, setModalManageTasksVisible] = useState(false);
  const [modalObjectifVisible, setModalObjectifVisible] = useState(false);
  const [currentObjectif, setCurrentObjectif] = useState(objectif);
  const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

  useEffect(() => {
    if (objectif !== undefined) setCurrentObjectif(objectif);
  }, [objectif]);

  const onPressOptions = () => setModalSubMenuObjectifVisible(true);
  const handleManageTasks = () => setModalManageTasksVisible(true);
  const handleModify = () => setModalObjectifVisible(true);

  const onModify = (updated: any) => {
    Toast.show({ type: 'success', position: 'top', text1: "Modification d'un objectif réussi" });
    setCurrentObjectif(updated);
    handleObjectifChange(updated);
  };

  const handleDelete = () => setModalValidationDeleteVisible(true);

  const confirmDelete = () => {
    deleteObjectif(currentObjectif.id)
      .then(() => {
        Toast.show({ type: 'success', position: 'top', text1: "Suppression d'un objectif réussi" });
        handleObjectifDelete(currentObjectif);
      })
      .catch((err: any) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
        LoggerService.log("Erreur lors de la suppression d'un objectif : " + err.message);
      });
  };

  const calculPercentCompletude = (obj: any): number => {
    if (obj.sousEtapes != undefined) {
      const finished = obj.sousEtapes.filter((item: any) => item.state === true);
      return Math.floor((finished.length * 100) / obj.sousEtapes.length);
    }
    return 0;
  };

  const getAnimalById = (idAnimal: number): Animal | undefined =>
    animaux.find((a) => a.id === idAnimal);

  const handleTasksStateChange = async (etape: any) => {
    const objectifUpdated = { ...currentObjectif };
    const index = objectifUpdated.sousEtapes.findIndex((a: any) => a.id === etape.id);
    etape.state = !etape.state;
    objectifUpdated.sousEtapes[index] = etape;
    setCurrentObjectif(objectifUpdated);

    const data: any = {
      id: currentObjectif.id,
      datedebut: currentObjectif.datedebut,
      datefin: currentObjectif.datefin,
      title: currentObjectif.title,
      animaux: currentObjectif.animaux,
      temporalityobjectif: currentObjectif.temporalityobjectif,
      sousetapes: currentObjectif.sousEtapes,
    };
    updateObjectif(currentObjectif.id, data)
      .then(() => handleObjectifChange(currentObjectif))
      .catch((err: any) =>
        LoggerService.log("Erreur lors de la MAJ des téches d'un objectif : " + err.message),
      );
  };

  const getDayText = (date: string): string => {
    const dateObject = new Date(date);
    const dateText = dateObject.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
    return (dateText.charAt(0).toUpperCase() + dateText.slice(1)).slice(0, 3);
  };

  const getDateText = (date: string): string => {
    const d = new Date(date);
    return `${('0' + d.getDate()).slice(-2)}/${('0' + (d.getMonth() + 1)).slice(-2)}`;
  };

  const getYearText = (date: string): number => new Date(date).getFullYear();

  const styles = {
    headerObjectif: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    completionBarContainer: {
      marginTop: 10,
      marginBottom: 10,
      borderColor: colors.textPrimary,
      borderWidth: 0.2,
      borderRadius: 60,
      overflow: 'hidden',
    },
    objectifContainer: {
      backgroundColor: colors.background,
      borderRadius: 5,
      width: '100%',
      flexDirection: 'column',
      marginBottom: 10,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
    },
    avatarText: { color: colors.background, textAlign: 'center' },
    avatar: { width: 20, height: 20, borderRadius: 10, zIndex: 1 },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <>
      <ModalSubMenuObjectifActions
        modalVisible={modalSubMenuObjectifVisible}
        setModalVisible={setModalSubMenuObjectifVisible}
        handleModify={handleModify}
        handleDelete={handleDelete}
        handleManageTasks={handleManageTasks}
      />
      <ModalObjectifSubTasks
        isVisible={modalManageTasksVisible}
        setVisible={setModalManageTasksVisible}
        objectif={currentObjectif}
        handleTasksStateChange={onModify}
      />
      <ModalObjectif
        actionType="modify"
        isVisible={modalObjectifVisible}
        setVisible={setModalObjectifVisible}
        objectif={currentObjectif}
        onModify={onModify}
      />
      <ModalValidation
        displayedText="étes-vous sér de vouloir supprimer l'objectif ?"
        onConfirm={confirmDelete}
        setVisible={setModalValidationDeleteVisible}
        visible={modalValidationDeleteVisible}
        title="Suppression d'un objectif"
      />
      <View style={styles.objectifContainer} key={objectif.id}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopStartRadius: 5, borderTopEndRadius: 5, padding: 10 }}>
            <Text style={[{ color: colors.textPrimary }, styles.textFontBold]}>{objectif.title}</Text>
            <TouchableOpacity onPress={onPressOptions}>
              <Entypo name="dots-three-horizontal" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
        <AppDivider />
        <View style={{ flexDirection: 'row', backgroundColor: colors.background, borderBottomStartRadius: 5, borderBottomEndRadius: 5 }}>
          <View style={{ justifyContent: 'center', padding: 10, marginRight: 10, borderRightWidth: 0.3, borderColor: colors.textPrimary, alignItems: 'center' }}>
            <Text style={[{ color: colors.textPrimary }, styles.textFontRegular]}>{getDayText(objectif.datefin)}.</Text>
            <Text style={[{ fontSize: 11, color: colors.textPrimary }, styles.textFontRegular]}>{getDateText(objectif.datefin)}</Text>
            <Text style={[{ fontSize: 9, color: colors.textPrimary }, styles.textFontRegular]}>{getYearText(objectif.datefin)}</Text>
          </View>
          <View style={{ paddingVertical: 10, flexDirection: 'column', width: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'column', width: '80%' }}>
                {currentObjectif.sousEtapes !== undefined &&
                  currentObjectif.sousEtapes.map((etape: any) => (
                    <TouchableOpacity key={etape.id} style={{ marginLeft: 5 }} onPress={() => handleTasksStateChange(etape)}>
                      <View style={{ flexDirection: 'row' }}>
                        {etape.state ? (
                          <Feather name="x-square" size={25} color={colors.textPrimary} />
                        ) : (
                          <Feather name="square" size={25} color={colors.textPrimary} />
                        )}
                        <Text style={[styles.textFontRegular, { flexShrink: 1, flexWrap: 'wrap', marginLeft: 5, color: colors.textPrimary }]}>{etape.etape}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
              </View>
              <View style={{ flexDirection: 'row' }}>
                {objectif !== undefined && animaux.length !== 0 &&
                  objectif.animaux.map((eventAnimal: number) => {
                    const animal = getAnimalById(eventAnimal);
                    if (!animal) return null;
                    return (
                      <View key={animal.id} style={{ marginLeft: -3 }}>
                        <View style={{ height: 20, width: 20, backgroundColor: colors.textPrimary, borderRadius: 10, justifyContent: 'center' }}>
                          <AnimalAvatar animal={animal} avatarStyle={styles.avatar} textStyle={styles.avatarText} />
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>
            <View style={[styles.completionBarContainer, { flexDirection: 'column', marginRight: 10 }]}>
              <CompletionBar percentage={calculPercentCompletude(currentObjectif)} />
            </View>
          </View>
        </View>
      </View>
    </>
  );
};

export default ObjectifCard;
