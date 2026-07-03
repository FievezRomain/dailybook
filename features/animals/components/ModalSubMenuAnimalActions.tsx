import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { SimpleLineIcons, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import AppSheet from '../../../shared/components/ui/AppSheet';
import { AppDivider } from '../../../shared/components/ui';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useTranslation } from 'react-i18next';

interface ModalSubMenuAnimalActionsProps {
  modalVisible: boolean;
  setModalVisible: (v: boolean) => void;
  handleModify: () => void;
  handleDelete: () => void;
  handleReportDeath: () => void;
}

const ModalSubMenuAnimalActions = ({
  modalVisible,
  setModalVisible,
  handleModify,
  handleDelete,
  handleReportDeath,
}: ModalSubMenuAnimalActionsProps) => {
  const { colors, tokens } = useAppTheme();
  const { t } = useTranslation('animals');
  const { t: tc } = useTranslation('common');
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (modalVisible) {
      sheetRef.current?.present();
    } else {
      sheetRef.current?.dismiss();
    }
  }, [modalVisible]);

  const onAction = (cb: () => void) => {
    setModalVisible(false);
    cb();
  };

  const styles = {
    container: {
      paddingHorizontal: tokens.spacing.lg,
      paddingBottom: tokens.spacing.xl,
    },
    title: {
      fontFamily: tokens.fonts.semiBold,
      fontSize: tokens.fontSizes.sm,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.8,
      marginBottom: tokens.spacing.md,
    },
    row: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      paddingVertical: tokens.spacing.md,
      gap: tokens.spacing.md,
    },
    label: {
      fontFamily: tokens.fonts.medium,
      fontSize: tokens.fontSizes.md,
      color: colors.textPrimary,
    },
    labelDestructive: {
      fontFamily: tokens.fonts.medium,
      fontSize: tokens.fontSizes.md,
      color: colors.error,
    },
  } as const;

  return (
    <AppSheet ref={sheetRef} snapPoints={['38%']} onDismiss={() => setModalVisible(false)}>
      <View style={styles.container}>
        <Text style={styles.title}>{t('manageAnimal')}</Text>

        <TouchableOpacity style={styles.row} onPress={() => onAction(handleModify)}>
          <SimpleLineIcons name="pencil" size={20} color={colors.textPrimary} />
          <Text style={styles.label}>{tc('edit')}</Text>
        </TouchableOpacity>

        <AppDivider />

        <TouchableOpacity style={styles.row} onPress={() => onAction(handleReportDeath)}>
          <MaterialCommunityIcons name="weather-night" size={20} color={colors.textPrimary} />
          <Text style={styles.label}>{t('signalDeath')}</Text>
        </TouchableOpacity>

        <AppDivider />

        <TouchableOpacity style={styles.row} onPress={() => onAction(handleDelete)}>
          <AntDesign name="delete" size={20} color={colors.error} />
          <Text style={styles.labelDestructive}>{tc('delete')}</Text>
        </TouchableOpacity>
      </View>
    </AppSheet>
  );
};

export default ModalSubMenuAnimalActions;
