import type { Animal } from '../../models/Animal';
import type { AiParseResult } from '../../services/api/AiService';
import type { EventWizardFormData } from '../../stores/useEventWizardStore';

const eventTypes = new Set(['soins', 'rdv', 'balade', 'entrainement', 'concours', 'depense', 'autre']);

export function normalizeAiEvent(result: AiParseResult, rawText: string, animals: readonly Animal[]): Partial<EventWizardFormData> {
  const validType = typeof result.eventtype === 'string' && eventTypes.has(result.eventtype) ? result.eventtype : 'autre';
  const detectedIds = animals.filter((animal) => rawText.toLocaleLowerCase('fr-FR').includes(animal.nom.toLocaleLowerCase('fr-FR'))).map((animal) => animal.id);
  return {
    eventType: validType,
    nom: result.nom,
    dateevent: result.dateevent,
    heuredebutevent: typeof result.heuredebutevent === 'string' ? result.heuredebutevent : typeof result.heuredebut === 'string' ? result.heuredebut : undefined,
    lieu: result.lieu,
    commentaire: result.commentaire,
    specialiste: result.specialiste,
    traitement: result.traitement,
    depense: result.depense,
    animaux: Array.isArray(result.animaux) && result.animaux.length ? result.animaux : detectedIds,
    aiDescription: rawText,
  };
}

export function isPremiumSubscription(subscription?: string) {
  return subscription?.trim().toLocaleLowerCase('fr-FR') === 'premium';
}
