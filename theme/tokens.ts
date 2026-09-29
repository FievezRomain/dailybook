export { alpha, palette } from './primitives';
export { componentTokens } from './componentTokens';
export { materialTokens } from './materials';
export { darkColors, eventTypeColors, lightColors } from './semantic';
export { radii, spacing, typography } from './scales';

import { componentTokens } from './componentTokens';
import { materialTokens } from './materials';
import { darkColors, lightColors } from './semantic';
import { radii, spacing, typography } from './scales';

const structural = {
  spacing,
  radii,
  typography,
  material: materialTokens,
  component: componentTokens,
} as const;

export const lightTokens = { ...lightColors, ...structural } as const;
export const darkTokens = { ...darkColors, ...structural } as const;

export type AppTokens = typeof lightTokens;
