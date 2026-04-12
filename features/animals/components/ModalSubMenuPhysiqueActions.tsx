import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { Divider, useTheme } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';

interface ModalSubMenuPhysiqueActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  infos: any;
  handleModify: () => void;
  handleDelete: () => void;
}

const ModalSubMenuPhysiqueActions = ({ modalVisible, setModalVisible, infos, handleModify, handleDelete }: ModalSubMenuPhysiqueActionsProps) => {
  const { colors, fonts } = useTheme();

  const onAction = (event: () => void) => {
    setModalVisible(false);
    event();
  };

  const styles = StyleSheet.create({
    textActionButton: { marginLeft: 15 },
    informationsActionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButtonContainer: { width: '90%', borderRadius: 10, backgroundColor: (colors as any).quaternary, flexDirection: 'column', justifyContent: 'space-evenly', marginBottom: 15 },
    actionButton: { padding: 20 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={['25%']}>
      <View style={styles.card}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.textFontRegular, { color: (colors as any).default_dark }]}>Gérer le physique</Text>
        </View>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
            <View style={styles.informationsActionButton}>
              <SimpleLineIcons name="pencil" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>Modifier</Text>
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

export default ModalSubMenuPhysiqueActions;
