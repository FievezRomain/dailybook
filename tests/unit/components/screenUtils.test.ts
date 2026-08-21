import { getKeyboardAvoidingBehavior, getScreenEdges } from '../../../shared/components/ui/layout/screenUtils';
import fs from 'node:fs';
import path from 'node:path';

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
  it('keeps vertical scrolling responsive inside nested mobile layouts', () => {
    for (const file of ['RootScreen.tsx', 'DetailScreen.tsx']) {
      const source = fs.readFileSync(path.resolve(__dirname, `../../../shared/components/ui/layout/${file}`), 'utf8');
      expect(source).toContain('nestedScrollEnabled');
      expect(source).toContain('directionalLockEnabled={false}');
    }
  });
});
