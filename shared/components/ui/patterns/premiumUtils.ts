export const premiumFeatures = ['statistics', 'groups', 'aiCreation', 'voiceNotes'] as const;

export type PremiumFeature = (typeof premiumFeatures)[number];

export interface Entitlements {
  premiumFeatures: readonly PremiumFeature[];
}

export interface PremiumFeatureContent {
  title: string;
  description: string;
}

const premiumFeatureContent: Record<PremiumFeature, PremiumFeatureContent> = {
  statistics: {
    title: 'Statistiques',
    description: 'Analysez les mesures, activités et dépenses de vos animaux.',
  },
  groups: {
    title: 'Groupes',
    description: 'Partagez le suivi de vos animaux avec les personnes de votre choix.',
  },
  aiCreation: {
    title: 'Création assistée par IA',
    description: 'Créez plus rapidement un événement avec l’assistance de Vasco.',
  },
  voiceNotes: {
    title: 'Notes vocales',
    description: 'Enregistrez une note à la voix pour ne rien oublier.',
  },
};

export function canUsePremiumFeature(feature: PremiumFeature, entitlements: Entitlements) {
  return entitlements.premiumFeatures.includes(feature);
}

export function getPremiumFeatureContent(feature: PremiumFeature) {
  return premiumFeatureContent[feature];
}
