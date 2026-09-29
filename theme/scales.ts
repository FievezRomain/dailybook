export const spacing = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48 } as const;

export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  modal: 24,
  sheet: 28,
  pill: 50,
  full: 999,
} as const;

export const typography = {
  family: 'Quicksand',
  fonts: {
    light: 'Quicksand-Light',
    regular: 'Quicksand-Regular',
    medium: 'Quicksand-Medium',
    semiBold: 'Quicksand-SemiBold',
    bold: 'Quicksand-Bold',
  },
  sizes: { xs: 11, sm: 13, control: 14, md: 15, lg: 17, xl: 20, xxl: 24, xxxl: 30 },
  lineHeights: { tight: 18, normal: 22, relaxed: 26, loose: 32 },
} as const;
