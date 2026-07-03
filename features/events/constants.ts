/**
 * Listes de référence pour les formulaires d'événements (ModalEvents).
 * Extraites pour éviter la duplication et faciliter l'i18n future.
 */

export type DropdownItem = { title: string; id: string };

export const EVENT_TYPE_LIST: DropdownItem[] = [
  { title: 'Balade', id: 'balade' },
  { title: 'Entraînement', id: 'entrainement' },
  { title: 'Concours', id: 'concours' },
  { title: 'Rendez-vous', id: 'rdv' },
  { title: 'Soin', id: 'soins' },
  { title: 'Autre', id: 'autre' },
  { title: 'Dépense', id: 'depense' },
];

export const NOTIF_LIST: DropdownItem[] = [
  { title: 'Aucune notification', id: 'None' },
  { title: 'Notification le jour J', id: 'JourJ' },
  { title: 'Notification la veille', id: 'Veille' },
];

export const NOTIF_OPTIONS_LIST: DropdownItem[] = [
  { title: 'Aucune option supplémentaire', id: 'None' },
  { title: "Me rappeler l'événement dans 1 an", id: 'Annee' },
];

export const EXPENSE_CATEGORY_LIST: DropdownItem[] = [
  { title: 'Alimentation', id: 'alimentation' },
  { title: 'Équipement', id: 'equipement' },
  { title: 'Accessoire', id: 'accessoire' },
  { title: 'Service de garde / Pension', id: 'garde' },
  { title: 'Formation', id: 'formation' },
  { title: 'Assurance', id: 'assurance' },
  { title: 'Balade', id: 'balade' },
  { title: 'Entraînement', id: 'entrainement' },
  { title: 'Concours', id: 'concours' },
  { title: 'Rendez-vous', id: 'rdv' },
  { title: 'Soin', id: 'soins' },
  { title: 'Autre', id: 'autre' },
];

export const FREQUENCY_LIST: DropdownItem[] = [
  { title: 'Le jour J', id: 'tlj2' },
  { title: 'Tous les jours', id: 'tlj' },
  { title: 'Toutes les semaines', id: 'tls' },
  { title: 'Toutes les 2 semaines', id: 'tl2s' },
  { title: 'Tous les mois', id: 'tlm' },
];
