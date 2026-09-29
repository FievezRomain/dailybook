import { getDialogIcon } from '../../../shared/components/ui/overlays/dialogUtils';

describe('getDialogIcon', () => {
  it('maps each dialog intent to a semantic icon', () => {
    expect(getDialogIcon('info')).toBe('info');
    expect(getDialogIcon('confirm')).toBe('success');
    expect(getDialogIcon('destructive')).toBe('warning');
  });
});
