import { normalizeProgress } from '../../../shared/components/ui/navigation/progressUtils';

describe('normalizeProgress', () => {
  it('clamps current to the available steps', () => {
    expect(normalizeProgress(0, 3)).toEqual({ current: 0, total: 3, ratio: 0 });
    expect(normalizeProgress(-2, 3)).toEqual({ current: 0, total: 3, ratio: 0 });
    expect(normalizeProgress(8, 4)).toEqual({ current: 4, total: 4, ratio: 1 });
  });
  it('protects against invalid totals and decimals', () => {
    expect(normalizeProgress(2.8, 0)).toEqual({ current: 1, total: 1, ratio: 1 });
    expect(normalizeProgress(2.8, 6.9)).toEqual({ current: 2, total: 6, ratio: 2 / 6 });
  });
});
