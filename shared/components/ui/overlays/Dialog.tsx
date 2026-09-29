import { useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { alpha } from '../../../../theme/primitives';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Button } from '../actions';
import { Icon } from '../icons';
import { getDialogIcon, type DialogType } from './dialogUtils';
import { resolveOverlaySurfaceColor } from './overlayStyles';

export interface DialogProps {
  open: boolean;
  type?: DialogType;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  loading?: boolean;
  onError?: (error: unknown) => void;
  testID?: string;
}

export function Dialog({ open, type = 'info', title, description, confirmLabel, cancelLabel = 'Annuler', onConfirm, onClose, loading = false, onError, testID }: DialogProps) {
  const { colors } = useAppTheme();
  const [submitting, setSubmitting] = useState(false);
  const busy = loading || submitting;
  const destructive = type === 'destructive';

  const confirm = async () => {
    if (busy) return;
    setSubmitting(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      onError?.(error);
    } finally {
      setSubmitting(false);
    }
  };

  const requestClose = () => { if (!busy) onClose(); };

  return (
    <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={requestClose}>
      <Pressable accessibilityRole="none" onPress={requestClose} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.overlay }}>
        <Pressable onPress={(event) => event.stopPropagation()} accessibilityRole="alert" accessibilityLabel={title} testID={testID} style={{ width: '100%', maxWidth: componentTokens.dialog.width, gap: spacing.md, alignItems: 'center', paddingTop: spacing.lg, paddingBottom: 20, paddingHorizontal: 20, borderRadius: radii.modal, borderWidth: 1, borderColor: colors.border, backgroundColor: resolveOverlaySurfaceColor(colors), shadowColor: alpha.black16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 8, elevation: 8 }}>
          <View style={{ width: componentTokens.dialog.iconSize, height: componentTokens.dialog.iconSize, borderRadius: radii.full, alignItems: 'center', justifyContent: 'center', backgroundColor: destructive ? colors.errorSurface : colors.surfaceVariant }}>
            <Icon name={getDialogIcon(type)} size="lg" color={destructive ? colors.error : colors.primary} />
          </View>
          <Text style={{ width: '100%', color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24, textAlign: 'center' }}>{title}</Text>
          <Text style={{ width: '100%', color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20, textAlign: 'center' }}>{description}</Text>
          <View style={{ width: '100%', flexDirection: 'row', gap: 12 }}>
            <Button label={cancelLabel} variant="secondary" size="medium" disabled={busy} onPress={onClose} style={{ flex: 1 }} />
            <Button label={confirmLabel ?? (destructive ? 'Supprimer' : 'Confirmer')} variant={destructive ? 'destructive' : 'primary'} size="medium" loading={busy} onPress={() => void confirm()} style={{ flex: 1 }} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
