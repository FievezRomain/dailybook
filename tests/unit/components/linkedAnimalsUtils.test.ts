import { getLinkedAnimalsPresentation } from '../../../shared/components/ui/content/linkedAnimalsUtils';

const animals = [
  { id: '1', name: 'Milo' },
  { id: '2', name: 'Nala' },
  { id: '3', name: 'Rio' },
  { id: '4', name: 'Nova' },
];

describe('linked animals presentation', () => {
  it('lists one or two animal names', () => {
    expect(getLinkedAnimalsPresentation(animals.slice(0, 2)).label).toBe('Milo · Nala');
  });
  it('summarizes larger groups and computes the overflow', () => {
    expect(getLinkedAnimalsPresentation(animals)).toMatchObject({ visible: animals.slice(0, 2), remaining: 2, label: '4 animaux' });
  });
  it('announces every linked animal', () => {
    expect(getLinkedAnimalsPresentation(animals).accessibilityLabel).toBe('Animaux liés : Milo, Nala, Rio, Nova');
  });
});
