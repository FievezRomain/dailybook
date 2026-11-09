import fs from 'node:fs';
import path from 'node:path';

const read = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, '../../..', relativePath), 'utf8');

describe('event edition and statistic detail regressions', () => {
  it('always opens animal selection after event details during edition', () => {
    const navigator = read('app/navigation/MainNavigator.tsx');
    const editDetails = navigator.slice(
      navigator.indexOf('if (route.name === "eventEditDetails")'),
      navigator.indexOf('if (route.name === "eventDuplicateOptions")'),
    );
    expect(editDetails).toContain('setRoute({ name: "eventEditAnimals", eventId: route.eventId })');
    expect(editDetails).not.toContain('eventEditOptions');
    expect(navigator).toContain('onBack={goBack}');
  });

  it('extends the statistic animal selector through the detail screen padding', () => {
    const detail = read('features/statistics/screens/StatisticDetailScreen.tsx');

    expect(detail.match(/<FullWidthAnimalSelector>/g)).toHaveLength(2);
    expect(detail).toContain('marginHorizontal: -componentTokens.screen.contentPaddingX');
    expect(detail).toContain('testID="statistic-animal-selector-full-width"');
  });

  it('pushes statistic details on a native stack and uses a real back action', () => {
    const tracking = read('features/objectifs/screens/TrackingScreen.tsx');

    expect(tracking).toContain('createNativeStackNavigator<TrackingStackParamList>()');
    expect(tracking).toContain('navigation.navigate("statistic", { type })');
    expect(tracking).toContain('gestureEnabled: true');
    expect(tracking).toContain('onBack={() => navigation.goBack()}');
    expect(tracking).not.toContain('setSelectedStatistic(undefined)');
  });

  it('uses a native global stack so every back arrow restores the previous screen instance', () => {
    const navigator = read('app/navigation/MainNavigator.tsx');

    expect(navigator).toContain('createNativeStackNavigator<MainStackParamList>()');
    expect(navigator).toContain('navigation.push("Route", { route: nextRoute })');
    expect(navigator).toContain('gestureEnabled: true');
    expect(navigator).toContain('const setRoute = navigate');
    expect(navigator).not.toContain('onBack={() => setRoute({ name: "root" })}');
  });
});
