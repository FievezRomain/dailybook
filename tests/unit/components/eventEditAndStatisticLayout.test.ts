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
    const editOptions = navigator.slice(
      navigator.indexOf('if (route.name === "eventEditOptions")'),
      navigator.indexOf('if (route.name === "eventEditAnimals")'),
    );

    expect(editDetails).toContain('setRoute({ name: "eventEditAnimals", eventId: route.eventId })');
    expect(editDetails).not.toContain('eventEditOptions');
    expect(editOptions).toContain('setRoute({ name: "eventEditAnimals", eventId: route.eventId })');
  });

  it('extends the statistic animal selector through the detail screen padding', () => {
    const detail = read('features/statistics/screens/StatisticDetailScreen.tsx');

    expect(detail.match(/<FullWidthAnimalSelector>/g)).toHaveLength(2);
    expect(detail).toContain('marginHorizontal: -componentTokens.screen.contentPaddingX');
    expect(detail).toContain('testID="statistic-animal-selector-full-width"');
  });
});
