import {
  FREE_ANIMAL_LIMIT,
  canCreateAnimal,
  getSubscriptionTranslationKey,
  hasUnlimitedAnimals,
  isPioneerSubscription,
  isPremiumSubscription,
} from '../../../shared/utils/subscriptionUtils';

describe('subscriptionUtils', () => {
  it('limite les comptes gratuits à trois animaux', () => {
    expect(FREE_ANIMAL_LIMIT).toBe(3);
    expect(canCreateAnimal('Free', 2)).toBe(true);
    expect(canCreateAnimal('Free', 3)).toBe(false);
    expect(canCreateAnimal(undefined, 3)).toBe(false);
  });

  it('laisse Premium et Pioneer créer des animaux sans limite', () => {
    expect(hasUnlimitedAnimals('Premium')).toBe(true);
    expect(hasUnlimitedAnimals(' PIONEER ')).toBe(true);
    expect(canCreateAnimal('Pioneer', 50)).toBe(true);
    expect(isPremiumSubscription('Pioneer')).toBe(false);
    expect(isPioneerSubscription('Pioneer')).toBe(true);
  });

  it('affiche le type de compte pionnier sans lui donner les autres droits Premium', () => {
    expect(getSubscriptionTranslationKey('Pioneer')).toBe('subscription.pioneer');
    expect(getSubscriptionTranslationKey('Free')).toBe('subscription.free');
  });
});
