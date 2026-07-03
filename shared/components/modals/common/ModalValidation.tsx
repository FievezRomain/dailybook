import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { AppButton } from '../../ui';

interface ModalValidationProps {
  visible: boolean;
  setVisible: (v: boolean) => void;
  displayedText: string;
  title?: string;
  onConfirm: () => void;
}

const ModalValidation = ({ visible, setVisible, displayedText, title, onConfirm }: ModalValidationProps) => {
  const { colors, fonts, tokens } = useAppTheme();
  const hideDialog = () => setVisible(false);

  return (
    <Modal transparent statusBarTranslucent animationType="fade" visible={visible} onRequestClose={hideDialog}>
      <View style={styles.overlay}>
        <View style={[styles.dialog, { backgroundColor: colors.background }]}>
          {title && (
            <Text style={{ color: colors.textPrimary, fontFamily: fonts.bodyLarge.fontFamily, fontSize: 17, marginBottom: 8 }}>
              {title}
            </Text>
          )}
          <Text style={{ color: colors.textPrimary, fontFamily: fonts.default.fontFamily, fontSize: 14, lineHeight: 20, marginBottom: 24 }}>
            {displayedText}
          </Text>
          <View style={styles.actions}>
            <AppButton variant="ghost" label="Annuler" onPress={hideDialog} style={styles.actionBtn} />
            <AppButton variant="destructive" label="Confirmer" onPress={() => { onConfirm(); }} style={styles.actionBtn} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  dialog: {
    width: '100%',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionBtn: {
    flex: 1,
  },
});

export default ModalValidation;
