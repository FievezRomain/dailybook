import { globalCreateChoices, globalCreateTargets } from '../../../shared/components/ui/patterns/globalCreateMenuUtils';

describe('GlobalCreateMenu', () => {
  it('respecte le contenu et l’ordre définis dans Figma', () => {
    expect(globalCreateTargets).toEqual(['event', 'animal', 'objective', 'note', 'contact', 'group', 'wish']);
    expect(globalCreateChoices.map(({ label }) => label)).toEqual(['Événement', 'Animal', 'Objectif', 'Note', 'Contact', 'Groupe', 'Souhait']);
    expect(globalCreateChoices.find(({ id }) => id === 'wish')?.icon).toBe('heart');
  });
});
