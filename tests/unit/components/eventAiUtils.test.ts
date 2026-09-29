import { isPremiumSubscription, normalizeAiEvent } from '../../../features/events/eventAiUtils';

const animals = [{ id: 1, nom: 'Milo', espece: 'Chien' }, { id: 2, nom: 'Nala', espece: 'Chat' }];

describe('AI event normalization', () => {
  it('maps backend fields and detects an animal name locally', () => {
    expect(normalizeAiEvent({ nom: 'Vaccin', eventtype: 'soins', heuredebut: '09:00' }, 'Vaccin de Milo mardi', animals)).toMatchObject({ eventType: 'soins', nom: 'Vaccin', heuredebutevent: '09:00', animaux: [1] });
  });

  it('falls back to the other event type', () => {
    expect(normalizeAiEvent({ eventtype: 'unknown' }, 'Quelque chose', animals).eventType).toBe('autre');
  });

  it('recognizes premium subscriptions case-insensitively', () => {
    expect(isPremiumSubscription('Premium')).toBe(true);
    expect(isPremiumSubscription('Free')).toBe(false);
  });
});
