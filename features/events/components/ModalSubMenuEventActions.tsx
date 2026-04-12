import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Feather, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Event } from '../../../models/Event';

interface ModalSubMenuEventActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  event: Event;
  handleModify: () => void;
  handleDelete: () => void;
  handleDeleteAll: () => void;
  handleShare: () => void;
}

const ModalSubMenuEventActions = ({ modalVisible, setModalVisible, event, handleModify, handleDelete, handleDeleteAll, handleShare }: ModalSubMenuEventActionsProps) => {
  const { colors, fonts } = useAppTheme();

  const onAction = (e: () => void) => {
    setModalVisible(false);
    e();
  };

  const styles = StyleSheet.create({
    textActionButton: { marginLeft: 15 },
    informationsActionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButtonContainer: { width: '90%', borderRadius: 10, marginTop: 15, backgroundColor: colors.quaternary, flexDirection: 'column', justifyContent: 'space-evenly', marginBottom: 15 },
    actionButton: { padding: 15 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    disabledButton: { backgroundColor: colors.secondary, borderTopStartRadius: 5, borderTopEndRadius: 5 },
    disabledText: { color: colors.quaternary },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  });

  const isRecurring = event.eventtype === 'soins' || event.eventtype === 'balade';
  const hasParent = event.idparent !== null && event.idparent !== undefined;
  const height = (isRecurring && hasParent) ? ['35%'] : ['30%'];

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={height}>
      <View style={styles.card}>
        <Text style={[styles.textFontRegular, { color: colors.default_dark }]}>Gérer l'événement</Text>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={[styles.actionButton, styles.disabledButton]}>
            <View style={styles.informationsActionButton}>
              <Feather name="share-2" size={20} style={styles.disabledText} />
              <Text style={[styles.textActionButton, styles.disabledText, styles.textFontMedium]}>Partager (bientôt disponible)</Text>
            </View>
          </TouchableOpacity>
          <Divider style={{ height: 1 }} />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
            <View style={styles.informationsActionButton}>
              <SimpleLineIcons name="pencil" size={20} />
              <Text style={[styles.textActionButton, styles.textFontMedium]}>Modifier</Text>
            </View>
          </TouchableOpacity>
          {(!isRecurring || (isRecurring && hasParent)) && (
            <>
              <Divider style={{ height: 1 }} />
              <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDelete)}>
                <View style={styles.informationsActionButton}>
                  <AntDesign name="delete" size={20} />
                  <Text style={[styles.textActionButton, styles.textFontMedium]}>Supprimer</Text>
                </View>
              </TouchableOpacity>
            </>
          )}
          {isRecurring && (
            <>
              <Divider style={{ height: 1 }} />
              <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDeleteAll)}>
                <View style={styles.informationsActionButton}>
                  <AntDesign name="delete" size={20} />
                  <Text style={[styles.textActionButton, styles.textFontMedium]}>
                    Supprimer les {event.eventtype === 'balade' ? 'balades' : 'soins'} {event.nom !== null && event.nom !== undefined && event.nom.substring(0, 15)}{event.nom !== null && event.nom !== undefined && event.nom.length > 15 && '...'}
                  </Text>
                </View>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </ModalEditGeneric>
  );
};

export default ModalSubMenuEventActions;
