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

export type WalkPoint = {
  latitude: number;
  longitude: number;
  recorded_at: string;
  accuracy_m: number;
  altitude_m?: number;
  speed_mps?: number;
};

export type WalkSession = {
  id: number;
  event_id: number;
  owner_id: number;
  status: 'recording' | 'finalized';
  started_at: string;
  ended_at: string | null;
  points: WalkPoint[];
  last_sequence: number;
  distance_meters: number;
  duration_seconds: number;
  moving_duration_seconds: number;
  average_speed_mps: number;
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
  /** Affichage dans le dossier médical pour les soins et rendez-vous médicaux. */
  todisplay?: boolean;
  idparent?: number;
  frequencetype?: string;
  frequencevalue?: string;
  notif?: string;
  optionnotif?: string;
  rappelnotification?: string;
  expotoken?: string;
  timezone?: string;
  shared_groups?: number[];
  documents?: string[];
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
  commentaire?: string | null;
  note?: number | null;
  depense?: number | null;
  placement?: string | null;
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
