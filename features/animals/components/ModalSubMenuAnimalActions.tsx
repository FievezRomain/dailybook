import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SimpleLineIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';

interface ModalSubMenuAnimalActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  handleModify: () => void;
  handleDelete: () => void;
  handleReportDeath: () => void;
}

const ModalSubMenuAnimalActions = ({ modalVisible, setModalVisible, handleModify, handleDelete, handleReportDeath }: ModalSubMenuAnimalActionsProps) => {
  const { colors, fonts } = useTheme();

  const onAction = (event: () => void) => {
    setModalVisible(false);
    event();
  };

  const styles = StyleSheet.create({
    textActionButton: { marginLeft: 15 },
    informationsActionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButtonContainer: { width: '90%', marginTop: 15, borderRadius: 5, backgroundColor: (colors as any).quaternary, flexDirection: 'column', justifyContent: 'space-evenly' },
    actionButton: { padding: 15 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={['30%']}>
      <View style={styles.card}>
        <Text style={[styles.textFontRegular, { color: (colors as any).default_dark }]}>Gérer les informations</Text>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
            <View style={styles.informationsActionButton}>
              <SimpleLineIcons name="pencil" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>Modifier</Text>
            </View>
          </TouchableOpacity>
          <Divider style={{ height: 1 }} />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleReportDeath)}>
            <View style={styles.informationsActionButton}>
              <MaterialCommunityIcons name="weather-night" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>Signaler le décès</Text>
            </View>
          </TouchableOpacity>
          <Divider style={{ height: 1 }} />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDelete)}>
            <View style={styles.informationsActionButton}>
              <AntDesign name="delete" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>Supprimer</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ModalEditGeneric>
  );
};

export default ModalSubMenuAnimalActions;
