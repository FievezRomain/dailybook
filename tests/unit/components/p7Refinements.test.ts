import fs from 'node:fs';
import path from 'node:path';

const read = (relativePath: string) => fs.readFileSync(path.resolve(__dirname, '../../..', relativePath), 'utf8');

describe('P7.f visual refinements', () => {
  it('keeps objective cards on the shared one-point outline', () => {
    const source = read('shared/components/ui/content/ObjectiveCard.tsx');
    expect(source).toContain('borderWidth: 1');
    expect(source).not.toContain("status === 'overdue' ? 2 : 1");
  });

  it('does not truncate wish content', () => {
    const source = read('shared/components/ui/content/WishCard.tsx');
    expect(source).toContain('<DomainTitle numberOfLines={0}>');
    expect(source).toContain('<DomainBody numberOfLines={0}>{description}</DomainBody>');
    expect(source).toContain('<DomainBody numberOfLines={0}>{priceLabel}</DomainBody>');
    expect(source).toContain('<DomainCaption numberOfLines={0}');
    expect(source).not.toContain('numberOfLines={1}');
  });

  it('aggregates every animal when the Tous filter is active', () => {
    const source = read('features/objectifs/screens/TrackingScreen.tsx');
    expect(source).toContain("statisticsAnimalSelection === 'all' ? animals.map((animal) => animal.id) : statisticsAnimalSelection");
    expect(source).toContain('animalIds={selectedAnimalIds}');
  });

  it('supports ordered multi-selection for statistics', () => {
    const tracking = read('features/objectifs/screens/TrackingScreen.tsx');
    const selector = read('shared/components/ui/selection/AnimalSelectorItem.tsx');
    expect(tracking).toContain('selectionOrder={selectionOrder}');
    expect(tracking).toContain("mode=\"multiple\"");
    expect(selector).toContain('selectionOrder?: number');
  });

  it('reuses the event animal selection pattern for objectives', () => {
    const source = read('features/objectifs/screens/ObjectiveFormSheetScreen.tsx');
    expect(source).toContain('<Checkbox');
    expect(source).toContain('<ListItem');
    expect(source).toContain('objective-add-step');
  });
});
