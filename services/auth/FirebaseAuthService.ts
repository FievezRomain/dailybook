import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendEmailVerification as firebaseSendEmailVerification,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile as firebaseUpdateProfile,
  updateEmail as firebaseUpdateEmail,
  updatePassword as firebaseUpdatePassword,
  deleteUser as firebaseDeleteUser,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';
import * as Sentry from '@sentry/react-native';
import { getFirebaseAuth } from '../../firebase';
import type { IAuthService, AuthUser } from './IAuthService';

function mapToAuthUser(fbUser: { uid: string; email: string | null; displayName: string | null; emailVerified: boolean; photoURL: string | null }): AuthUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    emailVerified: fbUser.emailVerified,
    photoURL: fbUser.photoURL,
  };
}

/**
 * Implémentation Firebase de IAuthService.
 * Seul fichier autorisé à importer depuis 'firebase/auth'.
 * Appelle Sentry.setUser() sur signIn/signOut pour le suivi des erreurs.
 */
class FirebaseAuthService implements IAuthService {
  async signIn(email: string, password: string): Promise<AuthUser> {
    const { user } = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);
    Sentry.setUser({ id: user.uid, email: user.email ?? undefined });
    return mapToAuthUser(user);
  }

  async signUp(email: string, password: string, displayName: string): Promise<AuthUser> {
    const { user } = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
    await firebaseUpdateProfile(user, { displayName });
    await firebaseSendEmailVerification(user);
    Sentry.setUser({ id: user.uid, email: user.email ?? undefined });
    return mapToAuthUser(user);
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(getFirebaseAuth());
    Sentry.setUser(null);
  }

  async sendEmailVerification(): Promise<void> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return;
    await firebaseSendEmailVerification(user);
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    await firebaseSendPasswordResetEmail(getFirebaseAuth(), email);
  }

  async updateProfile(updates: { displayName?: string; photoURL?: string }): Promise<void> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return;
    await firebaseUpdateProfile(user, updates);
  }

  async updateEmail(newEmail: string): Promise<void> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return;
    await firebaseUpdateEmail(user, newEmail);
  }

  async updatePassword(newPassword: string): Promise<void> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return;
    await firebaseUpdatePassword(user, newPassword);
  }

  async deleteCurrentUser(): Promise<void> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return;
    await firebaseDeleteUser(user);
    Sentry.setUser(null);
  }

  async reauthenticate(email: string, password: string): Promise<void> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return;
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);
  }

  getCurrentUser(): AuthUser | null {
    const user = getFirebaseAuth().currentUser;
    return user ? mapToAuthUser(user) : null;
  }

  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return firebaseOnAuthStateChanged(getFirebaseAuth(), (user) => {
      callback(user ? mapToAuthUser(user) : null);
    });
  }

  async getIdToken(forceRefresh = false): Promise<string | null> {
    const user = getFirebaseAuth().currentUser;
    if (!user) return null;
    return user.getIdToken(forceRefresh);
  }
}

export const authService: IAuthService = new FirebaseAuthService();
