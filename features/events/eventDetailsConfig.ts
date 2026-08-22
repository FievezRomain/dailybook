export interface EventDetailFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad';
  kind?: 'text' | 'date' | 'time' | 'expense-category' | 'rating';
}
export interface EventDetailsConfig {
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  nameRequired: boolean;
  fields: readonly EventDetailFieldConfig[];
}

const commonExpenseField: EventDetailFieldConfig = {
  key: 'depense',
  label: 'Dépense',
  placeholder: '0,00 €',
  keyboardType: 'decimal-pad',
};

export const eventDetailsConfigs: Record<string, EventDetailsConfig> = {
  soins: { title: 'Détails', nameLabel: 'Intitulé des soins', namePlaceholder: 'Cure', nameRequired: true, fields: [{ key: 'traitement', label: 'Traitement', placeholder: 'Ex. Cure de CMV' }, { key: 'datefinsoins', label: 'Fin du traitement', placeholder: 'Choisir une date', kind: 'date' }] },
  rdv: { title: 'Rendez-vous', nameLabel: 'Intitulé du rendez-vous', namePlaceholder: 'Ex. Rendez-vous vétérinaire', nameRequired: false, fields: [{ key: 'specialiste', label: 'Spécialiste', placeholder: 'Ex. Dr Martin, vétérinaire' }, { key: 'lieu', label: 'Lieu', placeholder: 'Ex. Écurie de la Pomme' }, { key: 'depense', label: 'Dépense', placeholder: '0,00 €', keyboardType: 'decimal-pad' }] },
  balade: { title: 'Balade', nameLabel: 'Nom de la balade', namePlaceholder: 'Ex. Tour de la forêt', nameRequired: false, fields: [{ key: 'lieu', label: 'Lieu de départ', placeholder: 'Ex. Parc communal' }, { key: 'datefinbalade', label: 'Date de fin', placeholder: 'Choisir une date', kind: 'date' }, { key: 'heurefinbalade', label: 'Heure de fin', placeholder: 'Choisir une heure', kind: 'time' }, { key: 'note', label: 'Note', placeholder: 'Noter la balade', kind: 'rating' }] },
  entrainement: { title: 'Entraînement', nameLabel: 'Intitulé', namePlaceholder: 'Ex. Séance de dressage', nameRequired: false, fields: [{ key: 'discipline', label: 'Discipline', placeholder: 'Ex. Dressage, agility…' }, { key: 'note', label: 'Note', placeholder: 'Noter l’entraînement', kind: 'rating' }] },
  concours: { title: 'Concours', nameLabel: 'Nom du concours', namePlaceholder: 'Ex. CSO', nameRequired: false, fields: [{ key: 'discipline', label: 'Discipline', placeholder: 'Ex. Agility' }, { key: 'epreuve', label: 'Épreuve', placeholder: 'Ex. Club 1' }, { key: 'dossart', label: 'Dossard', placeholder: 'Ex. 24' }, { key: 'placement', label: 'Classement', placeholder: 'Ex. 2e' }, { key: 'note', label: 'Note', placeholder: 'Noter le concours', kind: 'rating' }] },
  depense: { title: 'Dépense', nameLabel: 'Intitulé de la dépense', namePlaceholder: 'Ex. Croquettes', nameRequired: false, fields: [{ key: 'depense', label: 'Montant', placeholder: '0,00 €', keyboardType: 'decimal-pad' }, { key: 'categoriedepense', label: 'Catégorie', placeholder: 'Choisir une catégorie', kind: 'expense-category' }] },
  autre: { title: 'Autre', nameLabel: 'Intitulé', namePlaceholder: 'Ex. Pesée mensuelle', nameRequired: false, fields: [{ key: 'lieu', label: 'Lieu', placeholder: 'Ex. À la maison' }] },
};

export function getEventDetailsConfig(eventType?: string) {
  const config = eventDetailsConfigs[eventType ?? 'autre'] ?? eventDetailsConfigs.autre;
  if (config.fields.some((field) => field.key === 'depense')) return config;
  return { ...config, fields: [...config.fields, commonExpenseField] };
}

export type EventQuickFieldKey = 'note' | 'placement' | 'depense';

export function getEventQuickFieldKeys(eventType?: string): EventQuickFieldKey[] {
  const quickFields = new Set<EventQuickFieldKey>(['note', 'placement', 'depense']);
  return getEventDetailsConfig(eventType).fields.flatMap((field) => quickFields.has(field.key as EventQuickFieldKey) ? [field.key as EventQuickFieldKey] : []);
}

export function canContinueEventDetails(eventType: string | undefined, name: string | undefined, date: string | undefined) {
  const config = getEventDetailsConfig(eventType);
  return Boolean(date && (!config.nameRequired || name?.trim()));
}
