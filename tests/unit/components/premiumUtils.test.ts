import { canUsePremiumFeature, getPremiumFeatureContent, premiumFeatures } from '../../../shared/components/ui/patterns/premiumUtils';

describe('premiumUtils', () => {
  it('centralise les quatre fonctionnalités Premium', () => {
    expect(premiumFeatures).toEqual(['statistics', 'groups', 'aiCreation', 'voiceNotes']);
  });

  it('vérifie un droit sans déduire le statut du compte', () => {
    const entitlements = { premiumFeatures: ['statistics', 'voiceNotes'] as const };
    expect(canUsePremiumFeature('statistics', entitlements)).toBe(true);
    expect(canUsePremiumFeature('groups', entitlements)).toBe(false);
  });

  it('fournit un contenu contextualisé pour chaque verrou', () => {
    expect(getPremiumFeatureContent('aiCreation')).toEqual(expect.objectContaining({ title: 'Création assistée par IA' }));
  });
});
