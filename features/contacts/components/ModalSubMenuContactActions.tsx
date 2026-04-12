import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalSubMenuContactActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  contact: any;
  handleModify: () => void;
  handleDelete: () => void;
}

const ModalSubMenuContactActions = ({ modalVisible, setModalVisible, contact, handleModify, handleDelete }: ModalSubMenuContactActionsProps) => {
  const { colors, fonts } = useAppTheme();

  const onAction = (event: () => void) => {
    setModalVisible(false);
    event();
  };

  const styles = StyleSheet.create({
    textActionButton: { marginLeft: 15 },
    informationsActionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButtonContainer: { width: '90%', borderRadius: 10, backgroundColor: colors.quaternary, flexDirection: 'column', justifyContent: 'space-evenly', marginBottom: 15 },
    actionButton: { padding: 20 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={['25%']}>
      <View style={styles.card}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.textFontRegular, { color: colors.default_dark }]}>Gérer le contact</Text>
          {contact !== null && (
            <Text style={[{ fontSize: 12 }, styles.textFontBold, { color: colors.default_dark }]}>{contact.nom}</Text>
          )}
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

export default ModalSubMenuContactActions;
