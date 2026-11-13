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

export type WalkRoutePoint = {
  latitude: number;
  longitude: number;
};

export type WalkRouteHighlight = {
  name: string;
  category: string;
  latitude: number;
  longitude: number;
};

export type WalkRouteProposal = {
  provider: string;
  resource?: string;
  name: string;
  route_type: 'loop' | 'one_way' | 'out_and_back';
  avoid_roads: boolean;
  avoid_water: boolean;
  prefer_scenic: boolean;
  destination_label?: string | null;
  highlights: WalkRouteHighlight[];
  points: WalkRoutePoint[];
  distance_meters: number;
  duration_seconds: number;
  target_distance_meters: number;
  attribution?: string | null;
  license?: string | null;
  source_url?: string | null;
  official?: boolean;
};

export type WalkRouteFilterMode = 'distance' | 'duration';
export type WalkRouteSort = 'recommended' | 'distance' | 'duration' | 'less_roads' | 'highlights';
export type WalkRouteSortOrder = 'asc' | 'desc';

export type GenerateWalkRouteProposalsInput = {
  start_latitude: number;
  start_longitude: number;
  target_distance_meters: number;
  filter_mode: WalkRouteFilterMode;
  min_distance_meters?: number;
  max_distance_meters?: number;
  min_duration_seconds?: number;
  max_duration_seconds?: number;
  sort_by: WalkRouteSort;
  sort_order: WalkRouteSortOrder;
  route_type: 'loop' | 'one_way';
  avoid_roads: boolean;
  avoid_water: boolean;
  prefer_scenic: boolean;
};

export type WalkRoutePlan = WalkRouteProposal & {
  id: number;
  event_id: number;
  owner_id: number;
  created_at?: string;
  updated_at?: string;
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
