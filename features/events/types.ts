import { Event } from '../../models/Event';

export type ActionType = 'create' | 'modify';
export type EventUpdateScope = 'occurrence' | 'following' | 'series';

export type AgendaHighlight = {
  id: string;
  date: string;
  kind: 'animal_birthday' | 'annual_reminder';
  title: string;
  animal_ids: number[];
  source_event_id?: number;
};

/** Payload envoyé au backend pour créer un événement. */
export type CreateEventPayload = {
  nom: string;
  dateevent: string;
  animaux: number[];
  eventtype: string;
  heuredebutevent?: string;
  lieu?: string;
  commentaire?: string;
  state?: string;
  idparent?: number;
  frequencetype?: string;
  frequencevalue?: string;
  notif?: string;
  optionnotif?: string;
  rappelnotification?: string;
  expotoken?: string;
  timezone?: string;
  shared_groups?: number[];
  // Balade
  heuredebutbalade?: string;
  datefinbalade?: string;
  heurefinbalade?: string;
  // Entraînement / Concours
  discipline?: string;
  note?: number;
  epreuve?: string;
  dossart?: string;
  placement?: string;
  // Rdv
  specialiste?: string;
  // Soins
  traitement?: string;
  datefinsoins?: string;
  // Dépense
  depense?: number;
  categoriedepense?: string;
};

export type UpdateEventPayload = CreateEventPayload & { id: number; update_scope?: EventUpdateScope };

/** Payload pour la mise à jour partielle d'un événement (état, commentaire, note, dépense). */
export type PatchEventPayload = {
  id?: number;
  state?: string;
  commentaire?: string;
  note?: number;
  depense?: number;
  animaux?: number[];
};

/** Props de ModalEvents — remplace l'ancien `event?: any` et `actionType: string`. */
export type ModalEventsProps = {
  isVisible: boolean;
  setVisible: (v: boolean) => void;
  actionType: ActionType;
  event?: Event;
  onModify?: () => void;
  date?: Date | string | null;
};
