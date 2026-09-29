import { useState, type ReactNode } from 'react';
import {
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';
import { componentTokens } from '../../../../theme/componentTokens';
import { radii, spacing, typography } from '../../../../theme/scales';
import { useAppTheme } from '../../../../theme/useAppTheme';
import { Field } from './Field';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  labelHidden?: boolean;
  required?: boolean;
  helperText?: string;
  errorMessage?: string;
  leading?: ReactNode;
  trailing?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
}

export function TextField({
  label,
  labelHidden = false,
  required,
  helperText,
  errorMessage,
  leading,
  trailing,
  containerStyle,
  inputContainerStyle,
  editable = true,
  onFocus,
  onBlur,
  value,
  ...inputProps
}: TextFieldProps) {
  const { colors } = useAppTheme();
  const [focused, setFocused] = useState(false);
  const disabled = !editable;
  const stroke = focused || errorMessage
    ? componentTokens.field.stroke.focus
    : componentTokens.field.stroke.default;

  return (
    <Field
      label={label}
      labelHidden={labelHidden}
      required={required}
      helperText={helperText}
      errorMessage={errorMessage}
      disabled={disabled}
      focused={focused}
      filled={Boolean(value)}
      style={containerStyle}
    >
      <View
        style={[
          {
            minHeight: componentTokens.field.height,
            flexDirection: 'row',
            alignItems: 'center',
            gap: spacing.sm,
            paddingHorizontal: spacing.md,
            borderRadius: radii.md,
            borderWidth: stroke,
            borderColor: errorMessage ? colors.error : focused ? colors.borderFocus : colors.border,
            backgroundColor: errorMessage
              ? colors.errorSurface
              : disabled
                ? colors.surfaceDim
                : colors.surface,
          },
          inputContainerStyle,
        ]}
      >
        {leading}
        <TextInput
          {...inputProps}
          value={value}
          editable={editable}
          placeholderTextColor={disabled ? colors.textDisabled : colors.textSecondary}
          accessibilityLabel={inputProps.accessibilityLabel ?? label}
          accessibilityState={{ disabled }}
          onFocus={(event) => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            onBlur?.(event);
          }}
          style={{
            flex: 1,
            minWidth: 0,
            color: disabled ? colors.textDisabled : colors.textPrimary,
            fontFamily: typography.fonts.regular,
            fontSize: typography.sizes.md,
            lineHeight: typography.lineHeights.normal,
            paddingVertical: 0,
          }}
        />
        {trailing}
      </View>
    </Field>
  );
}
