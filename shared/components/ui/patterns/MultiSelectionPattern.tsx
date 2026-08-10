import type { ReactNode } from 'react';
import { Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Checkbox } from '../selection';
import { getMultiSelectionError, toggleMultiSelection } from './multiSelectionUtils';

export interface MultiSelectionRenderProps<TItem, TId> { item: TItem; id: TId; selected: boolean; disabled: boolean; toggle: () => void }
export interface MultiSelectionPatternProps<TItem, TId> {
  label: string;
  items: readonly TItem[];
  selectedIds: readonly TId[];
  getId: (item: TItem) => TId;
  getLabel: (item: TItem) => string;
  onChange: (ids: TId[]) => void;
  renderItem?: (props: MultiSelectionRenderProps<TItem, TId>) => ReactNode;
  helperText?: string;
  error?: string;
  showConstraintError?: boolean;
  min?: number;
  max?: number;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal' | 'wrap';
  onLimitReached?: (max: number) => void;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function MultiSelectionPattern<TItem, TId>({ label, items, selectedIds, getId, getLabel, onChange, renderItem, helperText, error, showConstraintError = false, min = 0, max, disabled = false, direction = 'vertical', onLimitReached, style, testID }: MultiSelectionPatternProps<TItem, TId>) {
  const { colors } = useAppTheme();
  const validationError = error ?? (showConstraintError ? getMultiSelectionError(selectedIds.length, min, max) : undefined);
  const toggle = (id: TId) => { const result = toggleMultiSelection(selectedIds, id, max); if (result.blocked) { if (max !== undefined) onLimitReached?.(max); return; } onChange(result.values); };
  return <View accessibilityRole="summary" accessibilityLabel={`${label}, ${selectedIds.length} sélectionné${selectedIds.length > 1 ? 's' : ''}`} testID={testID} style={[{ gap: spacing.sm }, style]}><View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><Text style={{ flex: 1, color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.control, lineHeight: 20 }}>{label}</Text>{max !== undefined ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{selectedIds.length}/{max}</Text> : null}</View>{helperText ? <Text style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 18 }}>{helperText}</Text> : null}<View style={{ flexDirection: direction === 'vertical' ? 'column' : 'row', flexWrap: direction === 'wrap' ? 'wrap' : 'nowrap', gap: spacing.sm }}>{items.map((item) => { const id = getId(item); const itemLabel = getLabel(item); const selected = selectedIds.includes(id); const itemDisabled = disabled; const props = { item, id, selected, disabled: itemDisabled, toggle: () => toggle(id) }; return <View key={String(id)}>{renderItem ? renderItem(props) : <View style={{ minHeight: 44, flexDirection: 'row', alignItems: 'center', gap: spacing.sm }}><Checkbox value={selected} accessibilityLabel={itemLabel} onValueChange={props.toggle} disabled={itemDisabled} /><Text style={{ color: itemDisabled ? colors.textDisabled : colors.textPrimary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control }}>{itemLabel}</Text></View>}</View>; })}</View>{validationError ? <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ color: colors.error, fontFamily: typography.fonts.regular, fontSize: typography.sizes.sm, lineHeight: 18 }}>{validationError}</Text> : null}</View>;
}
