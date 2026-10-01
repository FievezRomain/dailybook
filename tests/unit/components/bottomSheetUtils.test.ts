import fs from 'node:fs';
import path from 'node:path';
import { getBottomSheetCommand, getBottomSheetHeight, getBottomSheetHeightWithinViewport } from '../../../shared/components/ui/overlays/bottomSheetUtils';

const read = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, '../../..', relativePath), 'utf8');

describe('getBottomSheetHeight', () => {
  it('matches the three Figma sizes', () => {
    expect(getBottomSheetHeight('compact')).toBe(260);
    expect(getBottomSheetHeight('medium')).toBe(420);
    expect(getBottomSheetHeight('expanded')).toBe(680);
  });

  it('caps expanded sheets to the visible viewport on small devices', () => {
    expect(getBottomSheetHeightWithinViewport(680, 640, 24, 16)).toBe(616);
  });

  it('keeps the requested height when it fits below the safe area', () => {
    expect(getBottomSheetHeightWithinViewport(680, 844, 47, 16)).toBe(680);
  });
});

describe('getBottomSheetCommand', () => {
  it('does not dismiss a modal that has never been presented', () => {
    expect(getBottomSheetCommand(false, false)).toBe('none');
  });

  it('presents and dismisses only on actual state transitions', () => {
    expect(getBottomSheetCommand(true, false)).toBe('present');
    expect(getBottomSheetCommand(true, true)).toBe('none');
    expect(getBottomSheetCommand(false, true)).toBe('dismiss');
  });
});

describe('bottom-sheet scroll integration', () => {
  it('uses Gorhom scrollables for the global creation menu and forms', () => {
    const menu = read('shared/components/ui/patterns/GlobalCreateMenu.tsx');
    const form = read('shared/components/ui/overlays/FormSheet.tsx');

    expect(menu).toContain('<BottomSheetScrollView');
    expect(form).toContain('<BottomSheetScrollView');
    expect(menu).not.toContain('<ScrollView');
    expect(form).not.toContain('<ScrollView');
  });
});
