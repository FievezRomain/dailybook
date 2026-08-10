import { Pressable, Text, View } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon, type VascoIconName } from '../icons';

export interface OverlayActionItem<TId extends string = string> {
  id: TId;
  label: string;
  description?: string;
  icon?: VascoIconName;
  tone?: 'default' | 'destructive';
  showChevron?: boolean;
  disabled?: boolean;
}

export function ActionItem<TId extends string>({ item, mode, onSelect }: { item: OverlayActionItem<TId>; mode: 'menu' | 'sheet'; onSelect: (id: TId) => void }) {
  const { colors } = useAppTheme();
  const destructive = item.tone === 'destructive';
  const color = item.disabled ? colors.textDisabled : destructive ? colors.error : colors.textPrimary;
  const height = mode === 'menu' ? componentTokens.actionMenu.itemHeight : componentTokens.actionSheet.itemHeight;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={item.label} accessibilityHint={item.description} accessibilityState={{ disabled: item.disabled }} disabled={item.disabled} onPress={() => onSelect(item.id)} style={({ pressed }) => ({ width: '100%', minHeight: height, flexDirection: 'row', alignItems: 'center', gap: mode === 'sheet' ? 14 : spacing.sm, paddingHorizontal: mode === 'sheet' ? 20 : 12, paddingVertical: mode === 'sheet' ? 10 : 0, borderRadius: mode === 'menu' ? 12 : 0, backgroundColor: pressed ? colors.surfaceVariant : colors.transparent })}>
      {item.icon ? <Icon name={item.icon} size="md" color={color} /> : null}
      <View style={{ flex: 1, minWidth: 0, gap: 1 }}>
        <Text numberOfLines={1} style={{ color, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: typography.lineHeights.normal }}>{item.label}</Text>
        {item.description ? <Text numberOfLines={1} style={{ color: item.disabled ? colors.textDisabled : colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.xs }}>{item.description}</Text> : null}
      </View>
      {item.showChevron && !destructive ? <Icon name="next" size="sm" color={colors.primary} /> : null}
    </Pressable>
  );
}
