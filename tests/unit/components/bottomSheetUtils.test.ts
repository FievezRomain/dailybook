import { getBottomSheetCommand, getBottomSheetHeight } from '../../../shared/components/ui/overlays/bottomSheetUtils';

describe('getBottomSheetHeight', () => {
  it('matches the three Figma sizes', () => {
    expect(getBottomSheetHeight('compact')).toBe(260);
    expect(getBottomSheetHeight('medium')).toBe(420);
    expect(getBottomSheetHeight('expanded')).toBe(680);
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
