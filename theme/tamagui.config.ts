import { createTamagui, createTokens, createFont } from '@tamagui/core';
import { createAnimations } from '@tamagui/animations-react-native';
import { palette, spacing, radii, fontSizes } from './tokens';

// ─── Animations ──────────────────────────────────────────────────────────────
const animations = createAnimations({
  spring: {
    type: 'spring',
    damping: 22,
    mass: 1,
    stiffness: 200,
  },
  gentle: {
    type: 'spring',
    damping: 20,
    mass: 1,
    stiffness: 120,
  },
  quick: {
    type: 'spring',
    damping: 30,
    mass: 0.8,
    stiffness: 280,
  },
  bouncy: {
    type: 'spring',
    damping: 15,
    mass: 1,
    stiffness: 180,
  },
  slow: {
    type: 'spring',
    damping: 25,
    mass: 1.2,
    stiffness: 80,
  },
} as const);

// ─── Fonts ───────────────────────────────────────────────────────────────────
const quicksandFont = createFont({
  family: 'Quicksand-Regular',
  size: {
    1: fontSizes.xs,
    2: fontSizes.sm,
    3: fontSizes.md,
    4: fontSizes.lg,
    5: fontSizes.xl,
    6: fontSizes.xxl,
    7: fontSizes.xxxl,
    true: fontSizes.md,
  },
  lineHeight: {
    1: 16,
    2: 20,
    3: 22,
    4: 26,
    5: 28,
    6: 32,
    7: 38,
    true: 22,
  },
  weight: {
    1: '300',
    2: '400',
    3: '500',
    4: '600',
    5: '700',
    true: '400',
  },
  face: {
    300: { normal: 'Quicksand-Light' },
    400: { normal: 'Quicksand-Regular' },
    500: { normal: 'Quicksand-Medium' },
    600: { normal: 'Quicksand-SemiBold' },
    700: { normal: 'Quicksand-Bold' },
  },
});

// ─── Tokens ──────────────────────────────────────────────────────────────────
const tokens = createTokens({
  color: {
    // Palette brute (préfixe $ implicite dans Tamagui)
    baie: palette.baie,
    alezan: palette.alezan,
    isabelle: palette.isabelle,
    aubere: palette.aubere,
    rouan: palette.rouan,
    baieBrun: palette.baieBrun,
    baieCerise: palette.baieCerise,
    palomino: palette.palomino,
    gris: palette.gris,
    white: palette.white,
    black: palette.black,
    darkSurface: palette.darkSurface,
    transparent: 'transparent',
  },
  space: {
    0: 0,
    0.5: 2,
    1: spacing.xs,
    2: spacing.sm,
    3: 12,
    4: spacing.md,
    5: 20,
    6: spacing.lg,
    7: 28,
    8: spacing.xl,
    10: spacing.xxl,
    true: spacing.md,
  },
  size: {
    0: 0,
    1: spacing.xs,
    2: spacing.sm,
    3: 12,
    4: spacing.md,
    5: 20,
    6: spacing.lg,
    7: 28,
    8: spacing.xl,
    10: spacing.xxl,
    true: spacing.md,
  },
  radius: {
    0: 0,
    1: radii.xs,
    2: radii.sm,
    3: radii.md,
    4: radii.lg,
    5: radii.xl,
    6: radii.modal,
    10: radii.full,
    true: radii.md,
  },
  zIndex: {
    0: 0,
    1: 10,
    2: 20,
    3: 30,
    4: 40,
    5: 50,
  },
});

// ─── Themes ──────────────────────────────────────────────────────────────────
const lightTheme = {
  background: palette.defaultLight,
  backgroundHover: palette.gris,
  backgroundPress: palette.rouan,
  backgroundFocus: palette.rouan,
  backgroundStrong: palette.white,
  backgroundTransparent: 'transparent',

  color: palette.baieBrun,
  colorHover: palette.baie,
  colorPress: palette.baieBrun,
  colorFocus: palette.baieBrun,
  colorTransparent: 'transparent',

  borderColor: palette.rouan,
  borderColorHover: palette.isabelle,
  borderColorFocus: palette.baie,
  borderColorPress: palette.baie,

  shadowColor: palette.baieBrun,
  shadowColorHover: palette.baieBrun,

  // Semantic
  primary: palette.baie,
  primaryLight: palette.alezan,
  primaryDark: palette.baieBrun,
  surface: palette.white,
  surfaceVariant: palette.gris,
  surfaceDim: palette.rouan,
  backgroundPaper: palette.palomino,
  textPrimary: palette.baieBrun,
  textSecondary: palette.aubere,
  textOnPrimary: palette.white,
  textDisabled: palette.aubere,
  error: palette.baieCerise,
  success: palette.alezan,
  warning: palette.isabelle,
};

const darkTheme = {
  background: palette.black,
  backgroundHover: '#2A1A10',
  backgroundPress: '#3D2519',
  backgroundFocus: '#3D2519',
  backgroundStrong: palette.darkSurface,
  backgroundTransparent: 'transparent',

  color: palette.palomino,
  colorHover: palette.alezan,
  colorPress: palette.palomino,
  colorFocus: palette.palomino,
  colorTransparent: 'transparent',

  borderColor: '#4A3020',
  borderColorHover: palette.baieCerise,
  borderColorFocus: palette.alezan,
  borderColorPress: palette.alezan,

  shadowColor: '#000',
  shadowColorHover: '#000',

  // Semantic
  primary: palette.alezan,
  primaryLight: palette.isabelle,
  primaryDark: palette.baie,
  surface: palette.darkSurface,
  surfaceVariant: '#3D2519',
  surfaceDim: '#4A3020',
  backgroundPaper: '#2A1A10',
  textPrimary: palette.palomino,
  textSecondary: palette.aubere,
  textOnPrimary: palette.baieBrun,
  textDisabled: '#5C4A3A',
  error: palette.baieCerise,
  success: palette.alezan,
  warning: palette.isabelle,
};

// ─── Config ──────────────────────────────────────────────────────────────────
const tamaguiConfig = createTamagui({
  animations,
  fonts: {
    heading: quicksandFont,
    body: quicksandFont,
    mono: quicksandFont,
  },
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
  // Disable web-only features for RN
  media: {},
  shorthands: {
    p: 'padding',
    px: 'paddingHorizontal',
    py: 'paddingVertical',
    pt: 'paddingTop',
    pb: 'paddingBottom',
    pl: 'paddingLeft',
    pr: 'paddingRight',
    m: 'margin',
    mx: 'marginHorizontal',
    my: 'marginVertical',
    mt: 'marginTop',
    mb: 'marginBottom',
    ml: 'marginLeft',
    mr: 'marginRight',
    f: 'flex',
    fd: 'flexDirection',
    fw: 'flexWrap',
    ai: 'alignItems',
    jc: 'justifyContent',
    bg: 'backgroundColor',
    br: 'borderRadius',
    bw: 'borderWidth',
    bc: 'borderColor',
    w: 'width',
    h: 'height',
    mw: 'maxWidth',
    mh: 'maxHeight',
  } as const,
});

export type AppConfig = typeof tamaguiConfig;

declare module 'tamagui' {
  interface TamaguiCustomConfig extends AppConfig {}
}

export default tamaguiConfig;
