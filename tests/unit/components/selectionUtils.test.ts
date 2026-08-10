import { filterSelectionOptions, toggleSelection } from '../../../shared/components/ui/overlays/selectionUtils';

const options = [{ id: 'rio', label: 'Río' }, { id: 'nova', label: 'Nova' }];

describe('selection utilities', () => {
  it('filters labels without caring about case or accents', () => {
    expect(filterSelectionOptions(options, 'rio')).toEqual([options[0]]);
  });
  it('replaces the selection in single mode', () => {
    expect(toggleSelection(['rio'], 'nova', 'single')).toEqual(['nova']);
  });
  it('adds and removes values in multi mode', () => {
    expect(toggleSelection(['rio'], 'nova', 'multi')).toEqual(['rio', 'nova']);
    expect(toggleSelection(['rio', 'nova'], 'rio', 'multi')).toEqual(['nova']);
  });
});
