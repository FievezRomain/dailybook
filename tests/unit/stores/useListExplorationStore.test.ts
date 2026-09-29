import { useListExplorationStore } from '../../../stores/useListExplorationStore';

describe('list exploration UI store', () => {
  beforeEach(() => useListExplorationStore.setState({ entries: {} }));
  it('merges filters, selection and scroll offset for one screen', () => {
    const store = useListExplorationStore.getState();
    store.updateEntry('contacts', { filters: { query: 'martin' } });
    store.updateEntry('contacts', { selectedId: '42', scrollOffset: 180 });
    expect(useListExplorationStore.getState().entries.contacts).toEqual({ filters: { query: 'martin' }, selectedId: '42', scrollOffset: 180 });
  });
  it('clears only the requested screen state', () => {
    const store = useListExplorationStore.getState();
    store.updateEntry('contacts', { scrollOffset: 20 });
    store.updateEntry('notes', { scrollOffset: 40 });
    useListExplorationStore.getState().clearEntry('contacts');
    expect(useListExplorationStore.getState().entries.contacts).toBeUndefined();
    expect(useListExplorationStore.getState().entries.notes.scrollOffset).toBe(40);
  });
});
