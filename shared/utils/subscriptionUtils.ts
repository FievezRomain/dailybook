export const FREE_ANIMAL_LIMIT = 3;

export type KnownSubscription = 'free' | 'premium' | 'pioneer';

export function normalizeSubscription(subscription?: string): string {
  return subscription?.trim().toLocaleLowerCase('fr-FR') ?? '';
}

export function isPremiumSubscription(subscription?: string) {
  return normalizeSubscription(subscription) === 'premium';
}

export function isPioneerSubscription(subscription?: string) {
  return normalizeSubscription(subscription) === 'pioneer';
}

export function hasUnlimitedAnimals(subscription?: string) {
  return isPremiumSubscription(subscription) || isPioneerSubscription(subscription);
}

export function canCreateAnimal(subscription: string | undefined, ownedAnimalCount: number) {
  return hasUnlimitedAnimals(subscription) || ownedAnimalCount < FREE_ANIMAL_LIMIT;
}

export function getSubscriptionTranslationKey(subscription?: string) {
  if (isPremiumSubscription(subscription)) return 'subscription.premium' as const;
  if (isPioneerSubscription(subscription)) return 'subscription.pioneer' as const;
  return 'subscription.free' as const;
}
