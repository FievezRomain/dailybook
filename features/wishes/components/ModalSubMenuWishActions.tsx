import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { Feather, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Wish } from '../../../models/Wish';

interface ModalSubMenuWishActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  wish: Wish | null;
  handleModify: () => void;
  handleDelete: () => void;
  handleShare: () => void;
  handleRedirect: () => void;
}

const ModalSubMenuWishActions = ({ modalVisible, setModalVisible, wish, handleModify, handleDelete, handleShare, handleRedirect }: ModalSubMenuWishActionsProps) => {
  const { colors, fonts } = useAppTheme();
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (modalVisible) sheetRef.current?.present();
    else sheetRef.current?.dismiss();
  }, [modalVisible]);

  const onAction = (event: () => void) => {
    setModalVisible(false);
    event();
  };

  const styles = {
    textActionButton: { marginLeft: 15 },
    informationsActionButton: { flexDirection: 'row', alignItems: 'center', marginLeft: 10 },
    actionButtonContainer: { width: '90%', borderRadius: 10, marginTop: 5, backgroundColor: colors.surfaceVariant, flexDirection: 'column', justifyContent: 'space-evenly', marginBottom: 15 },
    actionButton: { padding: 10 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    disabledButton: { backgroundColor: colors.secondary, borderTopStartRadius: 5, borderTopEndRadius: 5 },
    disabledText: { color: colors.textDisabled },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  const noUrl = wish === null || wish.url === null || wish.url === undefined;

  return (
    <AppSheet ref={sheetRef} snapPoints={['38%']} onDismiss={() => setModalVisible(false)}>
      <View style={styles.card}>
        <Text style={[styles.textFontRegular, { color: colors.textPrimary }]}>Gérer le souhait</Text>
        {wish !== null && (
          <Text style={[{ fontSize: 12 }, styles.textFontBold, { color: colors.textPrimary }]}>{wish.nom}</Text>
        )}
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={[styles.actionButton, noUrl && styles.disabledButton]} onPress={() => onAction(handleRedirect)} disabled={noUrl}>
            <View style={styles.informationsActionButton}>
              <Feather name="external-link" size={20} style={noUrl ? styles.disabledText : undefined} />
              <Text style={[styles.textActionButton, styles.textFontMedium, noUrl && styles.disabledText]}>Accéder au lien</Text>
            </View>
          </TouchableOpacity>
          <AppDivider />
          <TouchableOpacity style={[styles.actionButton, styles.disabledButton]} onPress={() => onAction(handleShare)} disabled={true}>
            <View style={styles.informationsActionButton}>
              <Feather name="share-2" size={20} style={styles.disabledText} />
              <Text style={[styles.textActionButton, styles.disabledText, styles.textFontMedium]}>Partager</Text>
            </View>
          </TouchableOpacity>
          <AppDivider />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
            <View style={styles.informationsActionButton}>
              <SimpleLineIcons name="pencil" size={20} color={colors.textPrimary} />
              <Text style={[styles.textActionButton, styles.textFontMedium, { color: colors.textPrimary }]}>Modifier</Text>
            </View>
          </TouchableOpacity>
          <AppDivider />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDelete)}>
            <View style={styles.informationsActionButton}>
              <AntDesign name="delete" size={20} color={colors.error} />
              <Text style={[styles.textActionButton, styles.textFontMedium, { color: colors.error }]}>Supprimer</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </AppSheet>
  );
};

export default ModalSubMenuWishActions;
