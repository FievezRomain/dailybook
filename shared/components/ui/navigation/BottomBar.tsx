import { Pressable, Text, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import type { Material } from '../../../../theme/materials';
import { palette } from '../../../../theme/primitives';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon, type VascoIconName } from '../icons';
import { NavigationSurface } from './NavigationSurface';

export interface BottomBarItem<TId extends string = string> { id: TId; label: string; icon: VascoIconName; accessibilityLabel?: string }
export interface BottomBarProps<TId extends string = string> { items: readonly BottomBarItem<TId>[]; activeId: TId; onSelect: (id: TId) => void; material?: Material; style?: StyleProp<ViewStyle>; testID?: string }

export function BottomBar<TId extends string>({ items, activeId, onSelect, material = 'solid', style, testID }: BottomBarProps<TId>) {
  const { colors } = useAppTheme();
  return (
    <NavigationSurface material={material} style={[{ width: '100%', maxWidth: componentTokens.navigation.bottomBarWidth, alignSelf: 'center', height: componentTokens.navigation.bottomBarHeight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: radii.modal, backgroundColor: material === 'glass' ? colors.glassBackground : colors.surface, shadowColor: palette.black, shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4, elevation: 2 }, style]}>
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <Pressable key={item.id} accessibilityRole="tab" accessibilityLabel={item.accessibilityLabel ?? item.label} accessibilityState={{ selected: active }} onPress={() => onSelect(item.id)} testID={testID ? `${testID}-${item.id}` : undefined} style={({ pressed }) => ({ flex: 1, maxWidth: componentTokens.navigation.bottomItem.width, height: componentTokens.navigation.bottomItem.height, alignItems: 'center', justifyContent: 'center', gap: spacing.xs, borderRadius: radii.xl, backgroundColor: active ? colors.surfaceVariant : colors.transparent, opacity: pressed ? 0.72 : 1 })}>
            <Icon name={item.icon} size="lg" color={active ? colors.primary : colors.textSecondary} />
            <Text style={{ color: active ? colors.primary : colors.textSecondary, fontFamily: typography.fonts.medium, fontSize: typography.sizes.xs }}>{item.label}</Text>
          </Pressable>
        );
      })}
    </NavigationSurface>
  );
}
