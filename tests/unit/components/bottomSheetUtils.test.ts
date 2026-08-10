import { getBottomSheetHeight } from '../../../shared/components/ui/overlays/bottomSheetUtils';

describe('getBottomSheetHeight', () => {
  it('matches the three Figma sizes', () => {
    expect(getBottomSheetHeight('compact')).toBe(260);
    expect(getBottomSheetHeight('medium')).toBe(420);
    expect(getBottomSheetHeight('expanded')).toBe(680);
  });
});
