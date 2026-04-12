import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Feather, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { Divider } from 'react-native-paper';
import ModalEditGeneric from '../../../shared/components/modals/common/ModalEditGeneric';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalSubMenuWishActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  wish: any;
  handleModify: () => void;
  handleDelete: () => void;
  handleShare: () => void;
  handleRedirect: () => void;
}

const ModalSubMenuWishActions = ({ modalVisible, setModalVisible, wish, handleModify, handleDelete, handleShare, handleRedirect }: ModalSubMenuWishActionsProps) => {
  const { colors, fonts } = useAppTheme();

  const onAction = (event: () => void) => {
    setModalVisible(false);
    event();
  };

  const styles = StyleSheet.create({
    textActionButton: { marginLeft: 15 },
    informationsActionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButtonContainer: { width: '90%', borderRadius: 10, marginTop: 5, backgroundColor: colors.quaternary, flexDirection: 'column', justifyContent: 'space-evenly', marginBottom: 15 },
    actionButton: { padding: 10 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    disabledButton: { backgroundColor: colors.secondary, borderTopStartRadius: 5, borderTopEndRadius: 5 },
    disabledText: { color: colors.quaternary },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  });

  const noUrl = wish === null || wish.url === null || wish.url === undefined;

  return (
    <ModalEditGeneric isVisible={modalVisible} setVisible={setModalVisible} arrayHeight={['30%']}>
      <View style={styles.card}>
        <Text style={[styles.textFontRegular, { color: colors.default_dark }]}>Gérer le souhait</Text>
        {wish !== null && (
          <Text style={[{ fontSize: 12 }, styles.textFontBold, { color: colors.default_dark }]}>{wish.nom}</Text>
        )}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={[styles.actionButton, noUrl && styles.disabledButton]} onPress={() => onAction(handleRedirect)} disabled={noUrl}>
            <View style={styles.informationsActionButton}>
              <Feather name="external-link" size={20} style={noUrl ? styles.disabledText : undefined} />
              <Text style={[styles.textActionButton, styles.textFontMedium, noUrl && styles.disabledText]}>Accéder au lien</Text>
            </View>
          </TouchableOpacity>
          <Divider style={{ height: 1 }} />
          <TouchableOpacity style={[styles.actionButton, styles.disabledButton]} onPress={() => onAction(handleShare)} disabled={true}>
            <View style={styles.informationsActionButton}>
              <Feather name="share-2" size={20} style={styles.disabledText} />
              <Text style={[styles.textActionButton, styles.disabledText, styles.textFontMedium]}>Partager</Text>
            </View>
          </TouchableOpacity>
          <Divider style={{ height: 1 }} />
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

export default ModalSubMenuWishActions;
