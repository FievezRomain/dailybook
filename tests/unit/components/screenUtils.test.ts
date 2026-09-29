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
  it('lets root forms scroll above the keyboard when explicitly enabled', () => {
    const root = fs.readFileSync(path.resolve(__dirname, '../../../shared/components/ui/layout/RootScreen.tsx'), 'utf8');
    const settings = fs.readFileSync(path.resolve(__dirname, '../../../features/settings/screens/SettingsDetailScreens.tsx'), 'utf8');
    expect(root).not.toContain('keyboardAvoiding={keyboardAware}');
    expect(root).toContain('automaticallyAdjustKeyboardInsets={keyboardAware}');
    expect(settings).toContain('<RootScreen keyboardAware');
  });
  it('keeps content and selection component internals out of circular barrels', () => {
    const eventCard = fs.readFileSync(path.resolve(__dirname, '../../../shared/components/ui/content/EventCard.tsx'), 'utf8');
    const animalAvatar = fs.readFileSync(path.resolve(__dirname, '../../../shared/components/ui/selection/AnimalProvenanceAvatar.tsx'), 'utf8');
    expect(eventCard).toContain("from '../selection/Checkbox'");
    expect(eventCard).not.toContain("from '../selection'");
    expect(animalAvatar).toContain("from '../content/Avatar'");
    expect(animalAvatar).not.toContain("from '../content'");
  });
  it('uses the same large selector spacing in Tracking and Animals', () => {
    const tracking = fs.readFileSync(path.resolve(__dirname, '../../../features/objectifs/screens/TrackingScreen.tsx'), 'utf8');
    const animals = fs.readFileSync(path.resolve(__dirname, '../../../features/animals/screens/AnimalsWorkspaceScreen.tsx'), 'utf8');
    expect(tracking).toContain('paddingTop: spacing.xl');
    expect(animals).toContain('paddingTop: spacing.xl');
    expect(tracking).toContain('paddingBottom: spacing.md');
    expect(animals).toContain('paddingBottom: spacing.md');
    expect(animals).toContain('size={componentTokens.content.animalProfileAvatarSize}');
  });
  it('keeps the larger home logo close to the Vasco wordmark', () => {
    const topBar = fs.readFileSync(path.resolve(__dirname, '../../../shared/components/ui/navigation/TopBar.tsx'), 'utf8');
    expect(topBar).toContain('componentTokens.navigation.brandedTopBarLogoSize');
    expect(topBar).toContain("alignItems: 'center' }}>");
    expect(topBar).not.toContain("alignItems: 'center', gap: spacing.xs }}>");
    expect(topBar).toContain('>VASCO</Text>');
  });
  it('links help to Vasco and Co and brands the full-screen loader', () => {
    const settings = fs.readFileSync(path.resolve(__dirname, '../../../features/settings/screens/SettingsDetailScreens.tsx'), 'utf8');
    const root = fs.readFileSync(path.resolve(__dirname, '../../../app/navigation/RootNavigator.tsx'), 'utf8');
    expect(settings).toContain("https://www.vascoandco.fr/");
    expect(settings).toContain('Retrouver toutes les informations');
    expect(settings).toContain('subtitleNumberOfLines={2}');
    expect(settings).not.toContain('licences et conditions');
    expect(root).toContain('<BrandLoader size="display"');
    expect(root).toContain('from VASCO AND CO');
    expect(root).toContain("Version {Constants.expoConfig?.version ?? ''}");
    expect(root).toContain('color: colors.primary');
  });
});
