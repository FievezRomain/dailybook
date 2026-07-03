/**
 * Design tokens — source unique de vérité pour les valeurs de style.
 * Tous les composants doivent importer depuis ce fichier via useAppTheme().
 *
 * palette  → valeurs brutes (couleurs équestres)
 * semantic → associations sémantiques (light / dark)
 */

// ---------------------------------------------------------------------------
// Palette brute — ne pas utiliser directement dans les composants
// ---------------------------------------------------------------------------
export const palette = {
  baie: '#956540',
  alezan: '#CE9871',
  isabelle: '#C9B69F',
  aubere: '#BAA89B',
  rouan: '#D3CCC9',
  baieBrun: '#694233',
  baieCerise: '#B07161',
  palomino: '#F6E6CE',
  gris: '#F4EDEB',
  defaultLight: '#F4F4F4',
  white: '#FFFFFF',
  black: '#1E1E1E',
  darkSurface: '#333333',
  transparent: 'transparent',
} as const;

// ---------------------------------------------------------------------------
// Typographie
// ---------------------------------------------------------------------------
export const fonts = {
  light: 'Quicksand-Light',
  regular: 'Quicksand-Regular',
  medium: 'Quicksand-Medium',
  semiBold: 'Quicksand-SemiBold',
  bold: 'Quicksand-Bold',
} as const;

export const fontSizes = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 30,
} as const;

export const lineHeights = {
  tight: 18,
  normal: 22,
  relaxed: 26,
  loose: 32,
} as const;

// ---------------------------------------------------------------------------
// Espacements
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// Structural constants (mode-independent)
// ---------------------------------------------------------------------------
export const borderHairline = 0.5;
export const tabBarBlurIntensity = 80;
export const glassBlurIntensity = 18;
export const glassBackgroundLight = 'rgba(255,255,255,0.15)';
export const glassBackgroundDark = 'rgba(30,20,10,0.4)';
export const glassBorderLight = 'rgba(255,255,255,0.3)';
export const glassBorderDark = 'rgba(255,255,255,0.08)';

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

// ---------------------------------------------------------------------------
// Rayons de bordure
// ---------------------------------------------------------------------------
export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  modal: 24,
  pill: 50,
  full: 999,
} as const;

// ---------------------------------------------------------------------------
// Ombres
// ---------------------------------------------------------------------------
export const shadows = {
  sm: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: palette.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// ---------------------------------------------------------------------------
// Tokens sémantiques — light mode
// ---------------------------------------------------------------------------
export const lightTokens = {
  // Couleurs de surface
  background: palette.defaultLight,
  backgroundPaper: palette.palomino,
  surface: palette.white,
  surfaceVariant: palette.gris,
  surfaceDim: palette.rouan,

  // Couleurs de marque
  primary: palette.baie,
  primaryLight: palette.alezan,
  primaryDark: palette.baieBrun,

  // Texte
  textPrimary: palette.baieBrun,
  textSecondary: palette.aubere,
  textOnPrimary: palette.white,
  textDisabled: palette.aubere,

  // Feedback
  error: palette.baieCerise,
  success: palette.alezan,
  warning: palette.isabelle,

  // Bordures
  border: palette.rouan,
  borderFocus: palette.baie,

  // Graphiques
  chartBackground: palette.baieBrun,
  chartBackgroundTo: '#3D2519',

  // Overlay
  overlay: 'rgba(0,0,0,0.4)',

  // Glassmorphism
  glassBackground: glassBackgroundLight,
  glassBorder: glassBorderLight,

  // Tokens structurels (identiques light/dark)
  fonts,
  fontSizes,
  lineHeights,
  spacing,
  radii,
  shadows,
  borderHairline,
  tabBarBlurIntensity,
  glassBlurIntensity,
} as const;

// ---------------------------------------------------------------------------
// Tokens sémantiques — dark mode
// ---------------------------------------------------------------------------
export const darkTokens = {
  background: palette.black,
  backgroundPaper: '#2A1A10',
  surface: palette.darkSurface,
  surfaceVariant: '#3D2519',
  surfaceDim: '#4A3020',

  primary: palette.alezan,
  primaryLight: palette.isabelle,
  primaryDark: palette.baie,

  textPrimary: palette.palomino,
  textSecondary: palette.aubere,
  textOnPrimary: palette.baieBrun,
  textDisabled: '#5C4A3A',

  error: palette.baieCerise,
  success: palette.alezan,
  warning: palette.isabelle,

  border: '#4A3020',
  borderFocus: palette.alezan,

  chartBackground: '#2A1A10',
  chartBackgroundTo: '#1A0D08',

  overlay: 'rgba(0,0,0,0.6)',

  // Glassmorphism
  glassBackground: glassBackgroundDark,
  glassBorder: glassBorderDark,

  fonts,
  fontSizes,
  lineHeights,
  spacing,
  radii,
  shadows,
  borderHairline,
  tabBarBlurIntensity,
  glassBlurIntensity,
} as const;

export type AppTokens = typeof lightTokens;

export const eventTypeColors = {
  soins: '#E57373',
  rdv: '#64B5F6',
  balade: '#81C784',
  entrainement: '#FFB74D',
  concours: '#CE93D8',
  depense: '#4DB6AC',
  autre: '#A1887F',
} as const;
