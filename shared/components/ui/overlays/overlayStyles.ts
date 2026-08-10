import type { Material } from '../../../../theme/materials';

export interface OverlaySurfaceColors {
  surface: string;
  glassBackground: string;
}

export function resolveOverlaySurfaceColor(colors: OverlaySurfaceColors, material: Material = 'solid') {
  return material === 'glass' ? colors.glassBackground : colors.surface;
}
