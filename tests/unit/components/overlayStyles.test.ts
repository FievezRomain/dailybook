import { resolveOverlaySurfaceColor } from '../../../shared/components/ui/overlays/overlayStyles';
import { darkColors, lightColors } from '../../../theme/semantic';

describe('overlay surface contract', () => {
  it('uses color/surface for Solid overlays in Light and Dark', () => {
    expect(resolveOverlaySurfaceColor(lightColors)).toBe(lightColors.surface);
    expect(resolveOverlaySurfaceColor(darkColors)).toBe(darkColors.surface);
  });

  it('uses the semantic glass surface only for resolved Glass overlays', () => {
    expect(resolveOverlaySurfaceColor(lightColors, 'glass')).toBe(lightColors.glassBackground);
    expect(resolveOverlaySurfaceColor(darkColors, 'glass')).toBe(darkColors.glassBackground);
  });
});
