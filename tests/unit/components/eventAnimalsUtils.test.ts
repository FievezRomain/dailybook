import { formatAnimalAge, getAnimalSelectionCta, toggleEventAnimal } from '../../../features/events/eventAnimalsUtils';

describe('event animal selection', () => {
  it('adds and removes an animal without mutating the input', () => {
    const selected = [1, 2];
    expect(toggleEventAnimal(selected, 3)).toEqual([1, 2, 3]);
    expect(toggleEventAnimal(selected, 1)).toEqual([2]);
    expect(selected).toEqual([1, 2]);
  });

  it('formats age around the birthday', () => {
    expect(formatAnimalAge('2022-08-10', new Date('2026-08-09T12:00:00'))).toBe('3 ans');
    expect(formatAnimalAge('2022-08-09', new Date('2026-08-09T12:00:00'))).toBe('4 ans');
  });

  it('pluralizes the CTA', () => {
    expect(getAnimalSelectionCta(0)).toBe('Continuer');
    expect(getAnimalSelectionCta(1)).toBe('Continuer avec 1 animal');
    expect(getAnimalSelectionCta(2)).toBe('Continuer avec 2 animaux');
  });
});
