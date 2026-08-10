import { Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Divider } from '../content';
import { ActionItem, type OverlayActionItem } from './ActionItem';
import { VascoBottomSheet } from './BottomSheet';

export interface ActionSheetProps<TId extends string = string> { open: boolean; title: string; subtitle?: string; items: readonly OverlayActionItem<TId>[]; onSelect: (id: TId) => void; onClose: () => void; material?: Material; testID?: string }

export function ActionSheet<TId extends string>({ open, title, subtitle, items, onSelect, onClose, material = 'solid', testID }: ActionSheetProps<TId>) {
  const { colors } = useAppTheme();
  const select = (id: TId) => { onClose(); onSelect(id); };
  const header = <><View style={{ width: '100%', gap: 3, paddingTop: 14, paddingBottom: 12, paddingHorizontal: 20 }}><Text style={{ color: colors.textPrimary, fontFamily: typography.fonts.bold, fontSize: 19, lineHeight: 26 }}>{title}</Text>{subtitle ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{subtitle}</Text> : null}</View><Divider style={{ marginHorizontal: 20 }} /></>;
  return <VascoBottomSheet open={open} onClose={onClose} title={title} material={material} height={componentTokens.actionSheet.height} header={header} dismissible testID={testID} contentContainerStyle={{ gap: 0, paddingHorizontal: 0, paddingTop: 0, paddingBottom: spacing.md }}><View>{items.map((item) => <ActionItem key={item.id} item={item} mode="sheet" onSelect={select} />)}</View></VascoBottomSheet>;
}
