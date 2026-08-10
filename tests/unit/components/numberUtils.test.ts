import { clampNumber, stepNumber, valueFromPosition } from '../../../shared/components/ui/forms/numberUtils';

describe('number controls', () => {
  it('clamps stepper changes to explicit limits', () => {
    expect(stepNumber(1, -1, 1, 1, 20)).toBe(1);
    expect(stepNumber(20, 1, 1, 1, 20)).toBe(20);
    expect(stepNumber(5, 1, 2, 1, 20)).toBe(7);
  });

  it('converts and snaps a slider position', () => {
    expect(valueFromPosition(51, 100, 0, 100, 5)).toBe(50);
    expect(valueFromPosition(120, 100, 0, 100, 5)).toBe(100);
    expect(valueFromPosition(20, 0, 10, 20, 1)).toBe(10);
  });

  it('clamps arbitrary values', () => {
    expect(clampNumber(-1, 0, 10)).toBe(0);
    expect(clampNumber(11, 0, 10)).toBe(10);
  });
});
