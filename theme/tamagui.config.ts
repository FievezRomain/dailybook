import { createAnimations } from '@tamagui/animations-react-native';
import { createFont, createTamagui, createTokens } from '@tamagui/core';
import { darkColors, lightColors } from './semantic';
import { palette } from './primitives';
import { radii, spacing, typography } from './scales';

const animations = createAnimations({
  quick: { type: 'spring', damping: 30, mass: 0.8, stiffness: 280 },
  standard: { type: 'spring', damping: 22, mass: 1, stiffness: 200 },
  gentle: { type: 'spring', damping: 20, mass: 1, stiffness: 120 },
} as const);

const quicksand = createFont({
  family: typography.fonts.regular,
  size: { 1: 11, 2: 13, 3: 15, 4: 17, 5: 20, 6: 24, 7: 30, true: 15 },
  lineHeight: { 1: 18, 2: 18, 3: 22, 4: 26, 5: 26, 6: 32, 7: 32, true: 22 },
  weight: { 1: '300', 2: '400', 3: '500', 4: '600', 5: '700', true: '400' },
  face: {
    300: { normal: typography.fonts.light },
    400: { normal: typography.fonts.regular },
    500: { normal: typography.fonts.medium },
    600: { normal: typography.fonts.semiBold },
    700: { normal: typography.fonts.bold },
  },
});

const tokens = createTokens({
  color: { ...palette, transparent: 'transparent' },
  space: { 0: 0, 1: spacing.xs, 2: spacing.sm, 3: 12, 4: spacing.md, 5: 20, 6: spacing.lg, 7: 28, 8: spacing.xl, 10: spacing.xxl, true: spacing.md },
  size: { 0: 0, 1: spacing.xs, 2: spacing.sm, 3: 12, 4: spacing.md, 5: 20, 6: spacing.lg, 7: 28, 8: spacing.xl, 10: spacing.xxl, true: spacing.md },
  radius: { 0: 0, 1: radii.xs, 2: radii.sm, 3: radii.md, 4: radii.lg, 5: radii.xl, 6: radii.modal, 10: radii.full, true: radii.md },
  zIndex: { 0: 0, 1: 10, 2: 20, 3: 30, 4: 40, 5: 50 },
});

const config = createTamagui({
  animations,
  fonts: { body: quicksand, heading: quicksand },
  tokens,
  themes: { light: lightColors, dark: darkColors },
  media: {},
  shorthands: {
    p: 'padding', px: 'paddingHorizontal', py: 'paddingVertical',
    m: 'margin', mx: 'marginHorizontal', my: 'marginVertical',
    bg: 'backgroundColor', br: 'borderRadius', bw: 'borderWidth', bc: 'borderColor',
    w: 'width', h: 'height', f: 'flex', ai: 'alignItems', jc: 'justifyContent',
  } as const,
});

export type AppConfig = typeof config;
declare module 'tamagui' { interface TamaguiCustomConfig extends AppConfig {} }
export default config;
