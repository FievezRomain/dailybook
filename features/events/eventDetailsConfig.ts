export interface EventDetailFieldConfig {
  key: string;
  label: string;
  placeholder: string;
  keyboardType?: 'default' | 'decimal-pad';
  kind?: 'text' | 'date' | 'time' | 'expense-category';
}

export interface EventDetailsConfig {
  title: string;
  nameLabel: string;
  namePlaceholder: string;
  nameRequired: boolean;
  fields: readonly EventDetailFieldConfig[];
}

export const eventDetailsConfigs: Record<string, EventDetailsConfig> = {
  soins: { title: 'Détails', nameLabel: 'Intitulé des soins', namePlaceholder: 'Ex. Vaccination annuelle', nameRequired: true, fields: [{ key: 'traitement', label: 'Traitement', placeholder: 'Ex. Primevac' }, { key: 'datefinsoins', label: 'Fin du traitement', placeholder: 'Choisir une date', kind: 'date' }] },
  rdv: { title: 'Rendez-vous', nameLabel: 'Intitulé du rendez-vous', namePlaceholder: 'Ex. Visite vétérinaire', nameRequired: false, fields: [{ key: 'specialiste', label: 'Spécialiste', placeholder: 'Ex. Dr Martin, vétérinaire' }, { key: 'lieu', label: 'Lieu', placeholder: 'Ex. Clinique vétérinaire' }, { key: 'depense', label: 'Dépense', placeholder: '0,00 €', keyboardType: 'decimal-pad' }] },
  balade: { title: 'Balade', nameLabel: 'Nom de la balade', namePlaceholder: 'Ex. Tour de la forêt', nameRequired: false, fields: [{ key: 'lieu', label: 'Lieu de départ', placeholder: 'Ex. Parc communal' }, { key: 'datefinbalade', label: 'Date de fin', placeholder: 'Choisir une date', kind: 'date' }, { key: 'heurefinbalade', label: 'Heure de fin', placeholder: 'Choisir une heure', kind: 'time' }] },
  entrainement: { title: 'Entraînement', nameLabel: 'Intitulé', namePlaceholder: 'Ex. Séance de dressage', nameRequired: false, fields: [{ key: 'discipline', label: 'Discipline', placeholder: 'Ex. Dressage, agility…' }, { key: 'note', label: 'Note', placeholder: 'Ex. 4', keyboardType: 'decimal-pad' }] },
  concours: { title: 'Concours', nameLabel: 'Nom du concours', namePlaceholder: 'Ex. Championnat régional', nameRequired: false, fields: [{ key: 'discipline', label: 'Discipline', placeholder: 'Ex. Agility' }, { key: 'epreuve', label: 'Épreuve', placeholder: 'Ex. Agility niveau 2' }, { key: 'dossart', label: 'Dossard', placeholder: 'Ex. 24' }, { key: 'placement', label: 'Classement', placeholder: 'Ex. 2e' }, { key: 'note', label: 'Note', placeholder: 'Ex. 4', keyboardType: 'decimal-pad' }] },
  depense: { title: 'Dépense', nameLabel: 'Intitulé de la dépense', namePlaceholder: 'Ex. Croquettes', nameRequired: false, fields: [{ key: 'depense', label: 'Montant', placeholder: '0,00 €', keyboardType: 'decimal-pad' }, { key: 'categoriedepense', label: 'Catégorie', placeholder: 'Choisir une catégorie', kind: 'expense-category' }] },
  autre: { title: 'Autre', nameLabel: 'Intitulé', namePlaceholder: 'Ex. Pesée mensuelle', nameRequired: false, fields: [{ key: 'lieu', label: 'Lieu', placeholder: 'Ex. À la maison' }] },
};

export function getEventDetailsConfig(eventType?: string) {
  return eventDetailsConfigs[eventType ?? 'autre'] ?? eventDetailsConfigs.autre;
}

export function canContinueEventDetails(eventType: string | undefined, name: string | undefined, date: string | undefined) {
  const config = getEventDetailsConfig(eventType);
  return Boolean(date && (!config.nameRequired || name?.trim()));
}
