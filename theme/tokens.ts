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
  darkPaper: '#2A1A10',
  darkWarm: '#3D2519',
  darkWarmRaised: '#4A3020',
  darkTextDisabled: '#5C4A3A',
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

export const overlays = {
  transparent: 'rgba(0,0,0,0)',
  scrimLight: 'rgba(0,0,0,0.4)',
  scrimDark: 'rgba(0,0,0,0.6)',
  heroGradientTo: 'rgba(0,0,0,0.65)',
  heroControl: 'rgba(0,0,0,0.3)',
  onImageStrong: 'rgba(255,255,255,0.9)',
  onImageMuted: 'rgba(255,255,255,0.8)',
} as const;

export const blur = {
  tabBar: tabBarBlurIntensity,
  glass: glassBlurIntensity,
} as const;

export const chartColors = {
  baie: palette.baie,
  alezan: palette.alezan,
  isabelle: palette.isabelle,
  aubere: palette.aubere,
  cerise: palette.baieCerise,
  warmDark: palette.baieBrun,
  warmDarkTo: palette.darkWarm,
  coolBalance: '#6F8F8A',
} as const;

export const eventTypeColors = {
  soins: palette.baieCerise,
  rdv: '#7C5F52',
  balade: '#8C7A4F',
  entrainement: palette.alezan,
  concours: palette.baie,
  depense: '#A66A3F',
  autre: palette.aubere,
} as const;

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
  chartBackgroundTo: palette.darkWarm,
  chartColors,

  // Overlay
  overlay: overlays.scrimLight,
  overlays,

  // Glassmorphism
  glassBackground: glassBackgroundLight,
  glassBorder: glassBorderLight,
  blur,

  // Domaines metier
  eventTypeColors,

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
  backgroundPaper: palette.darkPaper,
  surface: palette.darkSurface,
  surfaceVariant: palette.darkWarm,
  surfaceDim: palette.darkWarmRaised,

  primary: palette.alezan,
  primaryLight: palette.isabelle,
  primaryDark: palette.baie,

  textPrimary: palette.palomino,
  textSecondary: palette.aubere,
  textOnPrimary: palette.baieBrun,
  textDisabled: palette.darkTextDisabled,

  error: palette.baieCerise,
  success: palette.alezan,
  warning: palette.isabelle,

  border: palette.darkWarmRaised,
  borderFocus: palette.alezan,

  chartBackground: palette.darkPaper,
  chartBackgroundTo: '#1A0D08',
  chartColors,

  overlay: overlays.scrimDark,
  overlays,

  // Glassmorphism
  glassBackground: glassBackgroundDark,
  glassBorder: glassBorderDark,
  blur,

  // Domaines metier
  eventTypeColors,

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
