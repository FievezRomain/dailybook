import fs from 'node:fs';
import path from 'node:path';
import { getBottomSheetCommand, getBottomSheetHeight, getBottomSheetHeightWithSafeArea, getBottomSheetHeightWithinViewport } from '../../../shared/components/ui/overlays/bottomSheetUtils';

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

  it('adds space for Android three-button navigation without changing standard insets', () => {
    expect(getBottomSheetHeightWithSafeArea(286, 24, 24)).toBe(286);
    expect(getBottomSheetHeightWithSafeArea(286, 48, 24)).toBe(310);
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
    const sheet = read('shared/components/ui/overlays/BottomSheet.tsx');

    expect(menu).toContain('<BottomSheetScrollView');
    expect(form).toContain('<BottomSheetScrollView');
    expect(form).toContain('<FormSheetInputProvider>');
    expect(menu).toContain('scrollableContent');
    expect(form).toContain('scrollableContent');
    expect(sheet).toContain('scrollableContent ? <View');
    expect(menu).not.toContain('<ScrollView');
    expect(form).not.toContain('<ScrollView');
  });

  it('uses the bottom-sheet-aware input for form fields', () => {
    const field = read('shared/components/ui/forms/TextField.tsx');
    expect(field).toContain('BottomSheetTextInput');
    expect(field).toContain('useFormSheetInput');
  });

  it('keeps action-sheet padding controlled by the safe-area-aware container', () => {
    const actionSheet = read('shared/components/ui/overlays/ActionSheet.tsx');
    expect(actionSheet).not.toContain('paddingBottom: spacing.md');
  });
});
