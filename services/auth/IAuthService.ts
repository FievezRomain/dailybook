/**
 * Interface d'authentification — vendor-independent.
 *
 * Toutes les opérations Firebase Auth passent exclusivement par cette interface.
 * Aucun composant, hook ou écran ne doit importer depuis 'firebase/auth' directement.
 * L'implémentation concrète est FirebaseAuthService.
 */

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  emailVerified: boolean;
  photoURL: string | null;
}

export interface IAuthService {
  /**
   * Connexion email/password.
   */
  signIn(email: string, password: string): Promise<AuthUser>;

  /**
   * Inscription email/password + mise à jour du displayName.
   */
  signUp(email: string, password: string, displayName: string): Promise<AuthUser>;

  /**
   * Déconnexion.
   */
  signOut(): Promise<void>;

  /**
   * Envoie un e-mail de vérification à l'utilisateur courant.
   */
  sendEmailVerification(): Promise<void>;

  /**
   * Envoie un lien de réinitialisation de mot de passe.
   */
  sendPasswordResetEmail(email: string): Promise<void>;

  /**
   * Met à jour le displayName et/ou la photoURL.
   */
  updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void>;

  /**
   * Met à jour l'adresse e-mail.
   */
  updateEmail(newEmail: string): Promise<void>;

  /**
   * Met à jour le mot de passe.
   */
  updatePassword(newPassword: string): Promise<void>;

  /**
   * Supprime le compte utilisateur courant.
   */
  deleteCurrentUser(): Promise<void>;

  /**
   * Ré-authentifie l'utilisateur avec ses credentials (requis avant updatePassword/deleteUser).
   */
  reauthenticate(email: string, password: string): Promise<void>;

  /**
   * Retourne l'utilisateur courant ou null si non connecté.
   */
  getCurrentUser(): AuthUser | null;

  /**
   * Abonne un callback aux changements d'état d'authentification.
   * @returns Fonction d'unsubscribe à appeler au démontage.
   */
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void;

  /**
   * Retourne le token Firebase courant (pour injection dans les headers HTTP).
   */
  getIdToken(forceRefresh?: boolean): Promise<string | null>;

  /**
   * Connexion via Google (OAuth). Récupère un idToken puis échange via Firebase.
   * Nécessite la configuration `webClientId` (Google) au démarrage de l'app.
   */
  signInWithGoogle(): Promise<AuthUser>;

  /**
   * Connexion via Apple (OAuth, iOS uniquement).
   * Lève une erreur si appelé sur Android ou si Apple Sign-In est indisponible.
   */
  signInWithApple(): Promise<AuthUser>;
}
