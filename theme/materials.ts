export const materialTokens = {
  blur: { tabBar: 80, glass: 18 },
  size: {
    touchMin: 44,
    tabBarHeight: 60,
    icon: { sm: 16, md: 20, lg: 24, xl: 32, xxl: 48 },
  },
} as const;

export type Material = 'solid' | 'glass';

export const resolveMaterial = (
  requested: Material,
  reduceTransparencyEnabled: boolean,
  glassSupported: boolean,
): Material => requested === 'glass' && !reduceTransparencyEnabled && glassSupported ? 'glass' : 'solid';
