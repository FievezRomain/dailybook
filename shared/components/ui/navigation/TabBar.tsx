import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';

export interface TabBarItem<TId extends string = string> { id: TId; label: string; disabled?: boolean }
export interface TabBarProps<TId extends string = string> { items: readonly TabBarItem<TId>[]; activeId: TId; onSelect: (id: TId) => void; disabled?: boolean; fullWidthIndicator?: boolean; style?: StyleProp<ViewStyle> }

export function TabBar<TId extends string>({ items, activeId, onSelect, disabled = false, fullWidthIndicator = false, style }: TabBarProps<TId>) {
  const { colors } = useAppTheme();
  return (
    <View accessibilityRole="tablist" style={[{ height: componentTokens.navigation.tabBarHeight, flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface }, style]}>
      {items.map((item) => {
        const selected = item.id === activeId;
        const itemDisabled = disabled || item.disabled;
        return <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.label} accessibilityState={{ selected, disabled: itemDisabled }} disabled={itemDisabled} onPress={() => onSelect(item.id)} style={{ flex: 1, height: componentTokens.navigation.tabBarHeight, alignItems: 'center', justifyContent: 'center', borderBottomWidth: fullWidthIndicator ? (selected ? 2 : 1) : 0, borderBottomColor: fullWidthIndicator ? (selected ? colors.primaryDark : colors.border) : colors.transparent }}><Text style={{ color: itemDisabled ? colors.textDisabled : selected ? colors.primary : colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.control }}>{item.label}</Text>{selected && !fullWidthIndicator ? <View style={{ width: componentTokens.navigation.tabIndicator.width, height: componentTokens.navigation.tabIndicator.height, borderRadius: radii.xs, backgroundColor: itemDisabled ? colors.textDisabled : colors.primary }} /> : null}</Pressable>;
      })}
    </View>
  );
}
