import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { deleteAnimalHistory } from '../../../services/api/AnimalsService';
import Toast from 'react-native-toast-message';
import ModalManageBodyAnimal from './ModalManageBodyAnimal';
import LoggerService from '../../../services/logs/LoggerService';
import { AppDivider } from '../../../shared/components/ui';
import ModalValidation from '../../../shared/components/modals/common/ModalValidation';
import Feather from '@expo/vector-icons/Feather';
import ModalSubMenuPhysiqueActions from './ModalSubMenuPhysiqueActions';
import { useAppTheme } from '../../../theme/useAppTheme';
import { AnimalHistoryItem } from '../types';

const PhysiqueCard = ({
  infos,
  itemType,
  handlePhysiqueChange,
  handlePhysiqueDelete,
}: {
  infos: any;
  itemType: AnimalHistoryItem;
  handlePhysiqueChange: () => void;
  handlePhysiqueDelete: () => void;
}) => {
  const { colors, fonts } = useAppTheme();
  const [modalSubMenuPhysiqueVisible, setModalSubMenuPhysiqueVisible] = useState(false);
  const [modalPhysiqueVisible, setModalPhysiqueVisible] = useState(false);
  const [currentPhysique, setCurrentPhysique] = useState(infos);
  const [modalValidationDeleteVisible, setModalValidationDeleteVisible] = useState(false);

  useEffect(() => {
    if (infos !== undefined) setCurrentPhysique(infos);
  }, [infos]);

  const onPressOptions = () => setModalSubMenuPhysiqueVisible(true);
  const handleModify = () => setModalPhysiqueVisible(true);
  const onModify = () => handlePhysiqueChange();
  const handleDelete = () => setModalValidationDeleteVisible(true);

  const confirmDelete = () => {
    deleteAnimalHistory(currentPhysique.idanimal, itemType, currentPhysique.id)
      .then(() => {
        Toast.show({ type: 'success', position: 'top', text1: "Suppression d'un objectif réussi" });
        handlePhysiqueDelete();
      })
      .catch((err: any) => {
        Toast.show({ type: 'error', position: 'top', text1: err.message });
        LoggerService.log("Erreur lors de la suppression d'un objectif : " + err.message);
      });
    setModalValidationDeleteVisible(false);
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
    container: {
      backgroundColor: colors.background,
      borderRadius: 5,
      marginBottom: 10,
      shadowColor: colors.textPrimary,
      shadowOpacity: 0.1,
      elevation: 1,
      shadowOffset: { width: 0, height: 1 },
    },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <>
      <ModalSubMenuPhysiqueActions
        modalVisible={modalSubMenuPhysiqueVisible}
        setModalVisible={setModalSubMenuPhysiqueVisible}
        handleModify={handleModify}
        handleDelete={handleDelete}
        infos={currentPhysique}
      />
      <ModalManageBodyAnimal
        actionType="modify"
        isVisible={modalPhysiqueVisible}
        setVisible={setModalPhysiqueVisible}
        onModify={onModify}
        item={itemType}
        infos={currentPhysique}
      />
      <ModalValidation
        displayedText="Êtes-vous sûr de vouloir supprimer cet élément de l'historique ?"
        onConfirm={confirmDelete}
        setVisible={setModalValidationDeleteVisible}
        visible={modalValidationDeleteVisible}
        title="Suppression d'un historique de physique"
      />
      <View key={currentPhysique.id} style={styles.container}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', borderTopStartRadius: 5, borderTopEndRadius: 5, padding: 10 }}>
            <View>
              <Text style={[{ color: colors.textPrimary }, styles.textFontBold]}>
                {currentPhysique.type !== 'quantity' || currentPhysique.unity === null
                  ? currentPhysique.value
                  : `${currentPhysique.value} ${currentPhysique.unity}`}
              </Text>
            </View>
            <TouchableOpacity onPress={onPressOptions}>
              <Entypo name="dots-three-horizontal" size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
};

export default PhysiqueCard;
