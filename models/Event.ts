import { EventDocument } from './EventDocument';

/** Référence à l'utilisateur créateur/réalisateur d'un événement. */
export type UserRef = {
  id: string;
  name: string;
  email: string;
};

/** Valeurs du sélecteur de type d'événement (liste UI). */
export type EventType = {
  id: string;
  title: string;
};

export type EventSharedGroup = number | string | { id: number | string; name?: string };

/** Champs communs à toutes les variantes d'événement. */
type BaseEvent = {
  id: number;
  nom: string;
  dateevent: string;
  animaux: number[];
  eventtype: string;
  heuredebutevent?: string;
  lieu?: string;
  commentaire?: string;
  state?: string;
  depense?: number;
  /** Pour un soin ou rendez-vous, indique sa présence dans le dossier médical. */
  todisplay?: boolean;
  idparent?: number;
  frequencetype?: string;
  frequencevalue?: string;
  notif?: string;
  optionnotif?: string;
  optionnotification?: string;
  rappelnotification?: string;
  documents?: EventDocument[];
  shared_groups?: EventSharedGroup[];
  created_by?: UserRef;
  made_by?: UserRef;
};

export type BaladeEvent = BaseEvent & {
  eventtype: 'balade';
  heuredebutbalade?: string;
  datefinbalade?: string;
  heurefinbalade?: string;
  note?: number;
};

export type EntrainementEvent = BaseEvent & {
  eventtype: 'entrainement';
  discipline?: string;
  note?: number;
};

export type ConcoursEvent = BaseEvent & {
  eventtype: 'concours';
  discipline?: string;
  epreuve?: string;
  dossart?: string;
  placement?: string;
  note?: number;
};

export type RdvEvent = BaseEvent & {
  eventtype: 'rdv';
  specialiste?: string;
};

export type SoinsEvent = BaseEvent & {
  eventtype: 'soins';
  traitement?: string;
  datefinsoins?: string;
};

export type DepenseEvent = BaseEvent & {
  eventtype: 'depense';
  categoriedepense?: string;
};

export type AutreEvent = BaseEvent & {
  eventtype: 'autre';
};

/** Union discriminée sur `eventtype` — préférer ce type dans les composants. */
export type Event =
  | BaladeEvent
  | EntrainementEvent
  | ConcoursEvent
  | RdvEvent
  | SoinsEvent
  | DepenseEvent
  | AutreEvent;
