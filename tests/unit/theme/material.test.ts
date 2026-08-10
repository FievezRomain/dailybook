import { resolveMaterial } from '../../../theme/materials';

describe('Vasco material fallback', () => {
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
