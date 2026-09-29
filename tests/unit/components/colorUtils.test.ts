import { generateDistinctChartColors } from '../../../shared/components/ui/charts/colorUtils';

describe('generateDistinctChartColors', () => {
  it('generates the requested number of stable unique colors', () => {
    const first = generateDistinctChartColors(24);
    const second = generateDistinctChartColors(24);
    expect(first).toEqual(second);
    expect(new Set(first).size).toBe(24);
  });

  it('uses the historical Vasco Lab gradient endpoints', () => {
    const generated = generateDistinctChartColors(6);
    expect(generated[0].toLowerCase()).toBe('#ce9871');
    expect(generated.at(-1)?.toLowerCase()).toBe('#694233');
  });
});
