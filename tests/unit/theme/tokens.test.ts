import { componentTokens } from '../../../theme/componentTokens';
import { materialTokens } from '../../../theme/materials';
import { darkColors, lightColors } from '../../../theme/semantic';
import { radii, spacing, typography } from '../../../theme/scales';

describe('Vasco design foundations', () => {
  it('uses the Figma spacing and radius scales', () => {
    expect(Object.values(spacing)).toEqual([4, 8, 16, 24, 32, 48]);
    expect(Object.values(radii)).toEqual([4, 8, 12, 16, 20, 24, 28, 50, 999]);
  });

  it('uses neutral readable text colors from the validated designs', () => {
    expect(lightColors.textPrimary).toBe('#262524');
    expect(lightColors.textSecondary).toBe('#676460');
    expect(darkColors.textPrimary).toBe('#F2F1EF');
    expect(darkColors.textSecondary).toBe('#B8B5B1');
  });

  it('keeps structural geometry identical across themes', () => {
    expect(materialTokens.size.touchMin).toBe(44);
    expect(componentTokens.button.height).toEqual({ small: 44, medium: 48, large: 56 });
    expect(componentTokens.field.height).toBe(56);
    expect(componentTokens.navigation.bottomBarHeight).toBe(72);
    expect(componentTokens.navigation.bottomBarWidth).toBe(358);
    expect(componentTokens.navigation.bottomBarMargin).toBe(16);
  });

  it('declares every bundled Quicksand font', () => {
    expect(Object.keys(typography.fonts)).toEqual(['light', 'regular', 'medium', 'semiBold', 'bold']);
  });
});
