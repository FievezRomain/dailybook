/**
 * Interface IA — vendor-independent.
 * Permet de substituer le provider d'IA (OpenAI, Gemini, backend custom, etc.)
 * sans modifier les composants appelants.
 *
 * Les méthodes retournent des objets partiels — les champs absents doivent être
 * saisis manuellement par l'utilisateur.
 */
export interface IAIService {
  /**
   * Analyse un texte libre et en extrait les données d'un événement.
   * Ex: "Demain à 14h vaccin grippe pour Étoile" → { title, date, category, ... }
   */
  parseEvent(text: string): Promise<Partial<ParseEventResult>>;

  /**
   * Analyse un texte libre et en extrait les données d'une note.
   */
  parseNote(text: string): Promise<Partial<ParseNoteResult>>;

  /**
   * Analyse un texte libre et en extrait les données d'un objectif.
   */
  parseObjectif(text: string): Promise<Partial<ParseObjectifResult>>;
}

export interface ParseEventResult {
  title: string;
  description: string;
  date: string; // ISO 8601
  endDate: string; // ISO 8601
  category: string;
  location: string;
  recurrence: string;
}

export interface ParseNoteResult {
  title: string;
  content: string;
  tags: string[];
}

export interface ParseObjectifResult {
  title: string;
  description: string;
  targetDate: string; // ISO 8601
  category: string;
}
