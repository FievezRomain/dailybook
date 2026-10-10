import { useRegistrationDraft } from '../../../features/auth/stores/useRegistrationDraft';
import { clearAccountStores } from '../../../stores/clearAccountStores';
import { useAnimalWizardStore } from '../../../stores/useAnimalWizardStore';
import { useCalendarUIStore } from '../../../stores/useCalendarUIStore';
import { useEventWizardStore } from '../../../stores/useEventWizardStore';
import { useListExplorationStore } from '../../../stores/useListExplorationStore';
import { useObjectiveWizardStore } from '../../../stores/useObjectiveWizardStore';

describe('clearAccountStores', () => {
  it('removes drafts, filters and navigation state owned by the previous account', () => {
    useAnimalWizardStore.getState().setField('nom', 'Animal privé');
    useEventWizardStore.getState().setField('commentaire', 'Commentaire privé');
    useObjectiveWizardStore.getState().setField('title', 'Objectif privé');
    useRegistrationDraft.getState().setIdentity({ firstName: 'Ancien', email: 'ancien@example.test' });
    useCalendarUIStore.getState().toggleAnimalFilter('42');
    useListExplorationStore.getState().updateEntry('notes', { scrollOffset: 120, selectedId: '8' });

    clearAccountStores();

    expect(useAnimalWizardStore.getState().formData).toEqual({});
    expect(useEventWizardStore.getState().formData).toEqual({});
    expect(useObjectiveWizardStore.getState().formData.title).toBe('');
    expect(useRegistrationDraft.getState()).toMatchObject({ firstName: '', email: '', password: '', confirmation: '' });
    expect(useCalendarUIStore.getState().activeAnimalFilters).toEqual([]);
    expect(useListExplorationStore.getState().entries).toEqual({});
  });
});
