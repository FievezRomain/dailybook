import { getMultiSelectionError, toggleMultiSelection } from '../../../shared/components/ui/patterns/multiSelectionUtils';

describe('multi selection utilities', () => {
  it('adds and removes values', () => {
    expect(toggleMultiSelection(['a'], 'b', 2)).toEqual({ values: ['a', 'b'], blocked: false });
    expect(toggleMultiSelection(['a', 'b'], 'a', 2)).toEqual({ values: ['b'], blocked: false });
  });
  it('blocks values beyond the maximum', () => {
    expect(toggleMultiSelection(['a', 'b'], 'c', 2)).toEqual({ values: ['a', 'b'], blocked: true });
  });
  it('returns accessible constraint errors', () => {
    expect(getMultiSelectionError(0, 1, 3)).toBe('Sélectionnez au moins un élément.');
    expect(getMultiSelectionError(4, 1, 3)).toBe('Sélectionnez au maximum 3 éléments.');
    expect(getMultiSelectionError(2, 1, 3)).toBeUndefined();
  });
});
