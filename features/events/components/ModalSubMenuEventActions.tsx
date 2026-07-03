import { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Feather, SimpleLineIcons, AntDesign } from '@expo/vector-icons';
import { AppDivider } from '../../../shared/components/ui';
import AppSheet from '../../../shared/components/ui/AppSheet';
import { useAppTheme } from '../../../theme/useAppTheme';
import { Event } from '../../../models/Event';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation('events');
  const { t: tc } = useTranslation('common');
  const sheetRef = useRef<BottomSheetModal>(null);

  useEffect(() => {
    if (modalVisible) { sheetRef.current?.present(); } else { sheetRef.current?.dismiss(); }
  }, [modalVisible]);

  const onAction = (action: () => void) => {
    setModalVisible(false);
    action();
  };

  const styles = {
    card: { paddingHorizontal: 20, paddingBottom: 20, alignItems: 'center' as const },
    title: { fontSize: 15, color: colors.textPrimary, marginBottom: 12 },
    actionButtonContainer: { width: '100%', borderRadius: 12, backgroundColor: colors.surfaceVariant, overflow: 'hidden' as const },
    actionButton: { padding: 15, flexDirection: 'row' as const, alignItems: 'center' as const },
    iconStyle: { marginRight: 12, color: colors.textPrimary },
    disabledIcon: { marginRight: 12, color: colors.textDisabled },
    actionLabel: { fontFamily: fonts.bodyMedium.fontFamily, color: colors.textPrimary },
    disabledLabel: { fontFamily: fonts.bodyMedium.fontFamily, color: colors.textDisabled },
    destructiveLabel: { fontFamily: fonts.bodyMedium.fontFamily, color: colors.error },
    destructiveIcon: { marginRight: 12, color: colors.error },
  } as const;

  const isRecurring = event.eventtype === 'soins' || event.eventtype === 'balade';
  const hasParent = event.idparent !== null && event.idparent !== undefined;
  const snapHeight = (isRecurring && hasParent) ? '38%' : '32%';

  return (
    <AppSheet ref={sheetRef} snapPoints={[snapHeight]} onDismiss={() => setModalVisible(false)}>
      <View style={styles.card}>
        <Text style={[styles.title, { fontFamily: fonts.default.fontFamily }]}>{t('manageEvent')}</Text>
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity style={styles.actionButton} disabled>
            <Feather name="share-2" size={20} style={styles.disabledIcon} />
            <Text style={styles.disabledLabel}>{t('shareSoon')}</Text>
          </TouchableOpacity>
          <AppDivider />
          <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleModify)}>
            <SimpleLineIcons name="pencil" size={20} style={styles.iconStyle} />
            <Text style={styles.actionLabel}>{tc('edit')}</Text>
          </TouchableOpacity>
          {(!isRecurring || (isRecurring && hasParent)) && (
            <>
              <AppDivider />
              <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDelete)}>
                <AntDesign name="delete" size={20} style={styles.destructiveIcon} />
                <Text style={styles.destructiveLabel}>{tc('delete')}</Text>
              </TouchableOpacity>
            </>
          )}
          {isRecurring && (
            <>
              <AppDivider />
              <TouchableOpacity style={styles.actionButton} onPress={() => onAction(handleDeleteAll)}>
                <AntDesign name="delete" size={20} style={styles.destructiveIcon} />
                <Text style={styles.destructiveLabel}>
                  {t(event.eventtype === 'balade' ? 'deleteAllWalks' : 'deleteAllCares', { suffix: event.nom ? ` ${event.nom.substring(0, 15)}${event.nom.length > 15 ? 'é' : ''}` : '' })}
                </Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </AppSheet>
  );
};

export default ModalSubMenuEventActions;