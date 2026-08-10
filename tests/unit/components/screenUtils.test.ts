import { getKeyboardAvoidingBehavior, getScreenEdges } from '../../../shared/components/ui/layout/screenUtils';

describe('screen layout utilities', () => {
  it('uses padding on iOS and height elsewhere', () => {
    expect(getKeyboardAvoidingBehavior('ios')).toBe('padding');
    expect(getKeyboardAvoidingBehavior('android')).toBe('height');
  });
  it('protects top and bottom safe areas for every screen kind', () => {
    expect(getScreenEdges('base')).toEqual(['top', 'bottom']);
    expect(getScreenEdges('root')).toEqual(['top', 'bottom']);
    expect(getScreenEdges('detail')).toEqual(['top', 'bottom']);
  });
});
