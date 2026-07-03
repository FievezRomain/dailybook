/**
 * Sélecteur de langue inline (segmented buttons).
 * Utilise `useLanguage` (persistance SecureStore + i18n.changeLanguage).
 */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAppTheme } from '../../../theme/useAppTheme';
import { useLanguage, AppLanguage } from '../../../hooks/useLanguage';

interface LanguageSwitcherProps {
  /** Mode compact : pastilles côte à côte sans label. */
  compact?: boolean;
}

export default function LanguageSwitcher({ compact = false }: LanguageSwitcherProps) {
  const { colors, fonts, tokens } = useAppTheme();
  const { language, setLanguage, availableLanguages } = useLanguage();

  const handlePress = (code: AppLanguage) => {
    if (code !== language) void setLanguage(code);
  };

  return (
    <View style={[styles.container, { gap: tokens.spacing.xs }]}>
      {availableLanguages.map(({ code, label, flag }) => {
        const isActive = code === language;
        return (
          <TouchableOpacity
            key={code}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={label}
            onPress={() => handlePress(code)}
            style={[
              styles.pill,
              {
                backgroundColor: isActive ? colors.primary : 'transparent',
                borderColor: colors.primary,
                borderWidth: tokens.borderHairline * 2,
                paddingVertical: tokens.spacing.xs,
                paddingHorizontal: compact ? tokens.spacing.sm : tokens.spacing.md,
                borderRadius: tokens.radii.pill,
              },
            ]}
          >
            <Text
              style={{
                color: isActive ? colors.textOnPrimary : colors.primary,
                fontFamily: fonts.medium.fontFamily,
                fontSize: tokens.fontSizes.sm,
              }}
            >
              {compact ? flag : `${flag}  ${label}`}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', alignItems: 'center' },
  pill: { alignItems: 'center', justifyContent: 'center' },
});
