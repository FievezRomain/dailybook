import type { ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { resolveOptionCardVisual } from './optionCardStyles';

export interface OptionCardProps {
  title: string;
  subtitle: string;
  selected: boolean;
  onSelect: () => void;
  icon?: ReactNode;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function OptionCard({
  title,
  subtitle,
  selected,
  onSelect,
  icon,
  disabled = false,
  style,
  testID,
}: OptionCardProps) {
  const { colors } = useAppTheme();

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityState={{ checked: selected, disabled }}
      disabled={disabled}
      onPress={onSelect}
      testID={testID}
      style={({ pressed }) => {
        const visual = resolveOptionCardVisual(colors, selected, pressed, disabled);
        return [
          {
            minHeight: componentTokens.optionCard.height,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.md,
            paddingHorizontal: spacing.md,
            borderRadius: radii.lg,
            borderWidth: selected ? componentTokens.field.stroke.focus : componentTokens.field.stroke.default,
            borderColor: visual.borderColor,
            backgroundColor: visual.backgroundColor,
          },
          style,
        ];
      }}
    >
      {({ pressed }) => {
        const visual = resolveOptionCardVisual(colors, selected, pressed, disabled);
        return (
          <>
            {icon}
            <View style={{ flex: 1, minWidth: 0, gap: spacing.xs }}>
              <Text
                numberOfLines={1}
                style={{
                  color: visual.textColor,
                  fontFamily: typography.fonts.medium,
                  fontSize: typography.sizes.md,
                  lineHeight: typography.lineHeights.normal,
                }}
              >
                {title}
              </Text>
              <Text
                numberOfLines={2}
                style={{
                  color: visual.subtitleColor,
                  fontFamily: typography.fonts.regular,
                  fontSize: typography.sizes.xs,
                  lineHeight: typography.lineHeights.tight,
                }}
              >
                {subtitle}
              </Text>
            </View>
            <View
              style={{
                width: componentTokens.selection.visualSize,
                height: componentTokens.selection.visualSize,
                borderRadius: radii.full,
                borderWidth: componentTokens.field.stroke.focus,
                borderColor: selected ? visual.controlColor : colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {selected ? (
                <View
                  style={{
                    width: componentTokens.selection.visualSize / 2,
                    height: componentTokens.selection.visualSize / 2,
                    borderRadius: radii.full,
                    backgroundColor: visual.controlColor,
                  }}
                />
              ) : null}
            </View>
          </>
        );
      }}
    </Pressable>
  );
}
