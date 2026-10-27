import fs from 'node:fs';
import path from 'node:path';

const read = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, '../../..', relativePath), 'utf8');

describe('StatisticTile navigation affordance', () => {
  it('shows a chevron and announces the detail destination when pressable', () => {
    const tile = read('features/statistics/components/StatisticTile.tsx');

    expect(tile).toContain('accessibilityHint={onPress ?');
    expect(tile).toContain('<Icon name="next"');
    expect(tile).toContain('onPress ? <Icon');
  });
});
