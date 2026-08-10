import type { ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';

export interface ListItemProps {
  title: string;
  subtitle?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function ListItem({ title, subtitle, leading, trailing, onPress, disabled = false, accessibilityLabel, accessibilityHint, style, testID }: ListItemProps) {
  const { colors } = useAppTheme();
  const content = (pressed: boolean) => <View style={[{ minHeight: componentTokens.content.listItemHeight, flexDirection: 'row', alignItems: 'center', gap: 12, paddingLeft: spacing.md, paddingRight: 12, borderBottomWidth: 1, borderBottomColor: colors.border, backgroundColor: pressed ? colors.surfaceVariant : colors.surface, opacity: disabled ? 0.5 : 1 }, style]}>{leading ? <View style={{ width: componentTokens.content.listLeadingSize, height: componentTokens.content.listLeadingSize, alignItems: 'center', justifyContent: 'center' }}>{leading}</View> : null}<View style={{ flex: 1, gap: 2 }}><Text numberOfLines={1} style={{ color: colors.textPrimary, fontFamily: typography.fonts.semiBold, fontSize: typography.sizes.md, lineHeight: 22, letterSpacing: 0.1 }}>{title}</Text>{subtitle ? <Text numberOfLines={1} style={{ color: colors.textSecondary, fontFamily: typography.fonts.regular, fontSize: typography.sizes.control, lineHeight: 20 }}>{subtitle}</Text> : null}</View>{trailing ?? (onPress ? <Icon name="next" size="md" color={colors.primary} /> : null)}</View>;

  if (!onPress) return content(false);
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel ?? [title, subtitle].filter(Boolean).join(', ')} accessibilityHint={accessibilityHint} accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} testID={testID}>{({ pressed }) => content(pressed)}</Pressable>;
}
