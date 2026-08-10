import { Modal, Pressable, Text } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { alpha } from '../../../../theme/primitives';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { ActionItem, type OverlayActionItem } from './ActionItem';
import { resolveOverlaySurfaceColor } from './overlayStyles';

export interface ActionMenuProps<TId extends string = string> { open: boolean; title: string; items: readonly OverlayActionItem<TId>[]; onSelect: (id: TId) => void; onClose: () => void; testID?: string }

export function ActionMenu<TId extends string>({ open, title, items, onSelect, onClose, testID }: ActionMenuProps<TId>) {
  const { colors } = useAppTheme(); const select = (id: TId) => { onClose(); onSelect(id); };
  return <Modal visible={open} transparent animationType="fade" statusBarTranslucent onRequestClose={onClose}><Pressable onPress={onClose} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, backgroundColor: colors.overlay }}><Pressable onPress={(event) => event.stopPropagation()} accessibilityRole="menu" accessibilityLabel={title} testID={testID} style={{ width: '100%', maxWidth: componentTokens.actionMenu.width, gap: spacing.xs, paddingTop: spacing.md, paddingBottom: 12, paddingHorizontal: 12, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.border, backgroundColor: resolveOverlaySurfaceColor(colors), shadowColor: alpha.black16, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 4, elevation: 4 }}><Text style={{ width: '100%', color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.lg, lineHeight: 24 }}>{title}</Text>{items.map((item) => <ActionItem key={item.id} item={item} mode="menu" onSelect={select} />)}</Pressable></Pressable></Modal>;
}
