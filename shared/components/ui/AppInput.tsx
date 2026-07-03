import React, { useState } from 'react';
import { Text, TextInput, TextInputProps, TouchableOpacity, View, ViewStyle } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useAppTheme } from '../../../theme/useAppTheme';

interface AppInputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  required?: boolean;
  /** Show password toggle (for secureTextEntry fields) */
  showPasswordToggle?: boolean;
}

export default function AppInput({
  label,
  error,
  containerStyle,
  required = false,
  showPasswordToggle = false,
  secureTextEntry,
  ...rest
}: AppInputProps) {
  const { colors, fonts, tokens } = useAppTheme();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [focused, setFocused] = useState(false);

  const borderColor = error ? colors.error : focused ? colors.borderFocus : colors.border;

  return (
    <View style={[{ gap: tokens.spacing.xs }, containerStyle]}>
      {label ? (
        <Text style={{ fontFamily: fonts.medium.fontFamily, fontSize: tokens.fontSizes.sm, color: colors.textSecondary }}>
          {label}{required ? ' *' : ''}
        </Text>
      ) : null}

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          borderRadius: tokens.radii.md,
          borderWidth: tokens.borderHairline * 2,
          borderColor,
          paddingHorizontal: tokens.spacing.md,
          paddingVertical: tokens.spacing.sm + 2,
        }}
      >
        <TextInput
          {...rest}
          style={[
            {
              flex: 1,
              fontFamily: fonts.default.fontFamily,
              fontSize: tokens.fontSizes.md,
              color: colors.textPrimary,
              padding: 0,
            },
            rest.style,
          ]}
          placeholderTextColor={colors.textDisabled}
          secureTextEntry={showPasswordToggle ? !passwordVisible : secureTextEntry}
          onFocus={(e) => { setFocused(true); rest.onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); rest.onBlur?.(e); }}
        />
        {showPasswordToggle && (
          <TouchableOpacity
            onPress={() => setPasswordVisible((v) => !v)}
            accessibilityLabel={passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
          >
            <Entypo name={passwordVisible ? 'eye-with-line' : 'eye'} size={18} color={colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      {error ? (
        <Text style={{ fontFamily: fonts.default.fontFamily, fontSize: tokens.fontSizes.sm, color: colors.error }}>
          {error}
        </Text>
      ) : null}
    </View>
  );
}
