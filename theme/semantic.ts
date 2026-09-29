import { alpha, palette } from './primitives';

export const eventTypeColors = {
  soins: palette.isabelle,
  rdv: palette.baieBrun,
  balade: palette.baie,
  entrainement: palette.aubere,
  concours: palette.alezan,
  depense: palette.rouan,
  autre: palette.baieCerise,
} as const;

const shared = {
  error: palette.baieCerise,
  success: palette.alezan,
  warning: palette.isabelle,
  heroGradientTo: alpha.black65,
  heroControl: alpha.black30,
  onImageStrong: alpha.white90,
  onImageMuted: alpha.white80,
  transparent: alpha.transparent,
  eventSoins: eventTypeColors.soins,
  eventRdv: eventTypeColors.rdv,
  eventBalade: eventTypeColors.balade,
  eventEntrainement: eventTypeColors.entrainement,
  eventConcours: eventTypeColors.concours,
  eventDepense: eventTypeColors.depense,
  eventAutre: eventTypeColors.autre,
} as const;

export const lightColors = {
  ...shared,
  background: palette.defaultLight,
  backgroundPaper: palette.palomino,
  surface: palette.white,
  surfaceVariant: palette.gris,
  surfaceDim: palette.rouan,
  primary: palette.baie,
  primaryLight: palette.alezan,
  primaryDark: palette.baieBrun,
  textPrimary: palette.neutralTextPrimaryLight,
  textSecondary: palette.neutralTextSecondaryLight,
  textOnPrimary: palette.white,
  textDisabled: palette.aubere,
  border: palette.rouan,
  borderFocus: palette.baie,
  errorSurface: palette.errorSurfaceLight,
  chartBackground: palette.baieBrun,
  chartBackgroundTo: palette.darkWarm,
  glassBackground: alpha.white15,
  glassBorder: alpha.white30,
  overlay: alpha.black40,
} as const;

export const darkColors = {
  ...shared,
  background: palette.black,
  backgroundPaper: palette.darkPaper,
  surface: palette.darkSurface,
  surfaceVariant: palette.darkWarm,
  surfaceDim: palette.darkWarmRaised,
  primary: palette.alezan,
  primaryLight: palette.isabelle,
  primaryDark: palette.baie,
  textPrimary: palette.neutralTextPrimaryDark,
  textSecondary: palette.neutralTextSecondaryDark,
  textOnPrimary: palette.baieBrun,
  textDisabled: palette.darkTextDisabled,
  border: palette.darkWarmRaised,
  borderFocus: palette.alezan,
  errorSurface: palette.errorSurfaceDark,
  chartBackground: palette.darkPaper,
  chartBackgroundTo: palette.chartDarkTo,
  glassBackground: alpha.black40,
  glassBorder: alpha.white08,
  overlay: alpha.black60,
} as const;

export type VascoColors = { [Key in keyof typeof lightColors]: string };
