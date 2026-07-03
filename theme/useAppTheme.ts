import { useTheme as useTamaguiTheme } from 'tamagui';
import { darkTokens, lightTokens } from './tokens';
import { useThemeStore } from '../stores/useThemeStore';

/**
 * Unified theme hook — returns Tamagui theme values + full token set.
 * Maintains backward-compatible `colors.*` and `fonts.*` keys used in existing components.
 */
export const useAppTheme = () => {
  const tamaguiTheme = useTamaguiTheme();
  const isDark = useThemeStore((s) => s.isDark === true);
  const tokens = isDark ? darkTokens : lightTokens;

  // Backward-compatible color map for components not yet migrated to Tamagui
  const colors = {
    ...tokens,
    // Legacy Paper color keys still referenced in some components — mapped to tokens
    default_dark: tokens.primaryDark,
    quaternary: tokens.border,
    secondary: tokens.textSecondary,
    tertiary: tokens.textSecondary,
    accent: tokens.primary,
    secondaryContainer: tokens.primaryLight,
    onSurface: tokens.surfaceVariant,
    minor: tokens.backgroundPaper,
    neutral: tokens.surfaceDim,
    outline: tokens.border,
    // Legacy Paper `text` key → textPrimary
    text: tokens.textPrimary,
    // Legacy Variables.ts key (rouan-like secondary warm color)
    secondary_roux: tokens.primaryLight,
    background: tokens.background,
    primary: tokens.primary,
  } as const;

  // Backward-compatible font map
  const fonts = {
    default: { fontFamily: tokens.fonts.regular },
    medium: { fontFamily: tokens.fonts.medium },
    // Paper legacy aliases
    bodySmall: { fontFamily: tokens.fonts.light },
    bodyMedium: { fontFamily: tokens.fonts.medium },
    bodyLarge: { fontFamily: tokens.fonts.semiBold },
    labelMedium: { fontFamily: tokens.fonts.medium },
    labelLarge: { fontFamily: tokens.fonts.semiBold },
    bold: { fontFamily: tokens.fonts.bold },
    light: { fontFamily: tokens.fonts.light },
  } as const;

  return {
    tamaguiTheme,
    tokens,
    colors,
    fonts,
    isDark,
  } as const;
};
