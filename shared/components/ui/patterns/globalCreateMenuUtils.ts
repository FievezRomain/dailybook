import type { VascoIconName } from '../icons';

export const globalCreateTargets = ['event', 'animal', 'objective', 'note', 'contact', 'wish', 'group'] as const;
export type GlobalCreateTarget = (typeof globalCreateTargets)[number];

export interface GlobalCreateChoice {
  id: GlobalCreateTarget;
  label: string;
  description: string;
  icon: VascoIconName;
}

export const globalCreateChoices: readonly GlobalCreateChoice[] = [
  { id: 'event', label: 'Événement', description: 'Planifier un soin, une balade ou un rendez-vous', icon: 'event' },
  { id: 'animal', label: 'Animal', description: 'Ajouter un nouveau compagnon et son profil', icon: 'animals' },
  { id: 'objective', label: 'Objectif', description: 'Définir un suivi avec une échéance et des étapes', icon: 'objective' },
  { id: 'note', label: 'Note', description: 'Écrire rapidement ou enregistrer avec la voix', icon: 'note' },
  { id: 'contact', label: 'Contact', description: 'Enregistrer une personne et ses informations utiles', icon: 'contact' },
  { id: 'wish', label: 'Souhait', description: 'Garder une idée avec son prix éventuel', icon: 'heart' },
  { id: 'group', label: 'Groupe', description: 'Créer un espace partagé pour vos proches et animaux', icon: 'group' },
];
