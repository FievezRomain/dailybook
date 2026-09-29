import type { ReactNode } from 'react';
import { Pressable, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Icon } from '../icons';
import { Field } from './Field';

export interface SelectProps {
  label: string;
  placeholder: string;
  value?: string;
  onPress: () => void;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  disabled?: boolean;
  expanded?: boolean;
  accessibilityLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
}

export function Select({
  label,
  placeholder,
  value,
  onPress,
  required,
  helperText,
  errorMessage,
  leading,
  trailing,
  disabled = false,
  expanded = false,
  accessibilityLabel,
  style,
  testID,
}: SelectProps) {
  const { colors } = useAppTheme();
  const highlighted = expanded || Boolean(errorMessage);

  return (
    <Field
      label={label}
      required={required}
      helperText={helperText}
      errorMessage={errorMessage}
      disabled={disabled}
      focused={expanded}
      filled={Boolean(value)}
      style={style}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? `${label}, ${value ?? placeholder}`}
        accessibilityState={{ disabled, expanded }}
        disabled={disabled}
        onPress={onPress}
        testID={testID}
        style={({ pressed }) => ({
          minHeight: componentTokens.field.height,
          flexDirection: 'row',
          alignItems: 'center',
          gap: spacing.sm,
          paddingHorizontal: spacing.md,
          borderRadius: radii.md,
          borderWidth: highlighted
            ? componentTokens.field.stroke.focus
            : componentTokens.field.stroke.default,
          borderColor: errorMessage ? colors.error : expanded ? colors.borderFocus : colors.border,
          backgroundColor: errorMessage
            ? colors.errorSurface
            : disabled
              ? colors.surfaceDim
              : pressed
                ? colors.surfaceVariant
                : colors.surface,
        })}
      >
        {leading}
        <Text
          numberOfLines={1}
          style={{
            flex: 1,
            color: disabled
              ? colors.textDisabled
              : value
                ? colors.textPrimary
                : colors.textSecondary,
            fontFamily: typography.fonts.regular,
            fontSize: typography.sizes.md,
            lineHeight: typography.lineHeights.normal,
          }}
        >
          {value ?? placeholder}
        </Text>
        {trailing ?? (
          <View style={{ transform: [{ rotate: expanded ? '180deg' : '0deg' }] }}>
            <Icon
              name="expand"
              size="sm"
              color={disabled ? colors.textDisabled : errorMessage ? colors.error : colors.textSecondary}
            />
          </View>
        )}
      </Pressable>
    </Field>
  );
}
