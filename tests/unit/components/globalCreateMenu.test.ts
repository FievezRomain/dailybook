import { globalCreateChoices, globalCreateTargets } from '../../../shared/components/ui/patterns/globalCreateMenuUtils';

describe('GlobalCreateMenu', () => {
  it('respecte le contenu et l’ordre définis dans Figma', () => {
    expect(globalCreateTargets).toEqual(['event', 'animal', 'note', 'objective', 'contact', 'wish']);
    expect(globalCreateChoices.map(({ label }) => label)).toEqual(['Événement', 'Animal', 'Note', 'Objectif', 'Contact', 'Souhait']);
  });
});
