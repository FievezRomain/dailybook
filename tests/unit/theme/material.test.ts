import { resolveMaterial } from '../../../theme/materials';
import fs from 'node:fs';
import path from 'node:path';

describe('Vasco material fallback', () => {
  it('disables Glass by default', () => {
    const source = fs.readFileSync(path.resolve(__dirname, '../../../stores/useAppearanceStore.ts'), 'utf8');
    expect(source).toContain('glassEnabled: false');
  });

  it('keeps Glass when supported and allowed', () => {
    expect(resolveMaterial('glass', false, true)).toBe('glass');
  });

  it('falls back to Solid for Reduce Transparency', () => {
    expect(resolveMaterial('glass', true, true)).toBe('solid');
  });

  it('falls back to Solid when Glass is unavailable', () => {
    expect(resolveMaterial('glass', false, false)).toBe('solid');
  });

  it('never changes an explicitly Solid surface', () => {
    expect(resolveMaterial('solid', false, true)).toBe('solid');
  });
});
