/**
 * Interface de notifications — vendor-independent.
 * Permet de substituer Expo Notifications sans modifier les appelants.
 */
export interface INotificationService {
  /**
   * Enregistre l'appareil pour les notifications push.
   * @returns Le token push Expo, ou undefined si l'utilisateur a refusé la permission
   */
  registerForPush(): Promise<string | undefined>;

  /**
   * Retourne le token push Expo actuel sans redemander les permissions.
   */
  getToken(): Promise<string | undefined>;

  setBadgeCount(count: number): Promise<void>;

  addReceivedListener(listener: () => void): () => void;

  addResponseListener(listener: () => void): () => void;

  hasLastResponse(): Promise<boolean>;

  /**
   * Planifie une notification locale avec délai.
   */
  scheduleLocal(options: {
    title: string;
    body: string;
    data?: Record<string, unknown>;
    triggerSeconds: number;
  }): Promise<string>;

  /**
   * Annule toutes les notifications planifiées.
   */
  cancelAll(): Promise<void>;
}
