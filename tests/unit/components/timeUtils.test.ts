import { formatTimePart, wrapTimePart } from '../../../shared/components/ui/overlays/timeUtils';

describe('time utilities', () => {
  it('wraps values across bounds', () => {
    expect(wrapTimePart(23, 1, 23)).toBe(0);
    expect(wrapTimePart(0, -1, 59)).toBe(59);
  });
  it('formats values with two digits', () => {
    expect(formatTimePart(7)).toBe('07');
  });
});
