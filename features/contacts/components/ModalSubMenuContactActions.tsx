import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity } from "react-native";
import { SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { AppDivider, AppSheet } from '../../../shared/components/ui';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

interface ModalSubMenuContactActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  contact: any;
  handleModify: () => void;
  handleDelete: () => void;
}

const ModalSubMenuContactActions = ({ modalVisible, setModalVisible, contact, handleModify, handleDelete }: ModalSubMenuContactActionsProps) => {
  const { colors, fonts } = useAppTheme();
  const { t } = useTranslation('contacts');
  const { t: tc } = useTranslation('common');
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
    actionButtonContainer: { width: '90%', borderRadius: 10, backgroundColor: colors.surfaceVariant, flexDirection: 'column', justifyContent: 'space-evenly', marginBottom: 15 },
    actionButton: { padding: 20 },
    card: { justifyContent: 'space-evenly', alignItems: 'center' },
    textFontRegular: { fontFamily: fonts.default.fontFamily },
    textFontMedium: { fontFamily: fonts.bodyMedium.fontFamily },
    textFontBold: { fontFamily: fonts.bodyLarge.fontFamily },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['28%']} onDismiss={() => setModalVisible(false)}>
      <View style={styles.card}>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.textFontRegular, { color: colors.textPrimary }]}>{t('manageContact')}</Text>
          {contact !== null && (
            <Text style={[{ fontSize: 12 }, styles.textFontBold, { color: colors.textPrimary }]}>{contact.nom}</Text>
          )}
        </View>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
            <View style={styles.informationsActionButton}>
              <SimpleLineIcons name="pencil" size={20} color={colors.textPrimary} />
              <Text style={[styles.textActionButton, styles.textFontMedium, { color: colors.textPrimary }]}>{tc('edit')}</Text>
            </View>
          </TouchableOpacity>
          <AppDivider />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDelete)}>
            <View style={styles.informationsActionButton}>
              <AntDesign name="delete" size={20} color={colors.error} />
              <Text style={[styles.textActionButton, styles.textFontMedium, { color: colors.error }]}>{tc('delete')}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </AppSheet>
  );
};

export default ModalSubMenuContactActions;