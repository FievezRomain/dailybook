import { canUsePremiumFeature, getPremiumFeatureContent, premiumFeatures } from '../../../shared/components/ui/patterns/premiumUtils';

describe('premiumUtils', () => {
  it('centralise les fonctionnalités Premium', () => {
    expect(premiumFeatures).toEqual(['statistics', 'groups', 'aiCreation', 'voiceNotes', 'animalLimit']);
  });

  it('vérifie un droit sans déduire le statut du compte', () => {
    const entitlements = { premiumFeatures: ['statistics', 'voiceNotes'] as const };
    expect(canUsePremiumFeature('statistics', entitlements)).toBe(true);
    expect(canUsePremiumFeature('groups', entitlements)).toBe(false);
  });

  it('fournit un contenu contextualisé pour chaque verrou', () => {
    expect(getPremiumFeatureContent('aiCreation')).toEqual(expect.objectContaining({ title: 'Création intelligente' }));
    expect(getPremiumFeatureContent('animalLimit')).toEqual(expect.objectContaining({ title: expect.stringContaining('3 animaux') }));
  });
});
