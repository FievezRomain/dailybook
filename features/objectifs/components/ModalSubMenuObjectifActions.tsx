import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../../../theme/useAppTheme';

interface ModalSubMenuObjectifActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  handleModify: () => void;
  handleDelete: () => void;
  handleManageTasks: () => void;
}

const ModalSubMenuObjectifActions = ({ modalVisible, setModalVisible, handleModify, handleDelete, handleManageTasks }: ModalSubMenuObjectifActionsProps) => {
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
    actionButtonContainer: { width: '90%', borderRadius: 5, marginTop: 10, backgroundColor: colors.surfaceVariant, flexDirection: 'column', justifyContent: 'space-evenly' },
    actionButton: { padding: 20 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['32%']} onDismiss={() => setModalVisible(false)}>
      <View style={styles.card}>
        <Text style={[styles.textFontRegular, { color: colors.textPrimary }]}>Gérer l’objectif</Text>
        <View style={styles.actionButtonContainer}>
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

export default ModalSubMenuObjectifActions;
