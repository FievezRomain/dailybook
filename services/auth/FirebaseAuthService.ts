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
  GoogleAuthProvider,
  OAuthProvider,
  signInWithCredential,
  onAuthStateChanged as firebaseOnAuthStateChanged,
} from 'firebase/auth';
import { Platform } from 'react-native';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Sentry from '@sentry/react-native';
import { getFirebaseAuth } from '../../firebase';
import { getGoogleSigninModule } from './googleSigninModule';
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

  async signInWithGoogle(): Promise<AuthUser> {
    const mod = getGoogleSigninModule();
    if (!mod) {
      throw new Error("Google Sign-In indisponible dans Expo Go. Utilisez un dev client ou un build EAS.");
    }
    const { GoogleSignin, statusCodes } = mod;
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const userInfo = await GoogleSignin.signIn();
      const idToken =
        (userInfo as { idToken?: string }).idToken
        ?? (userInfo as { data?: { idToken?: string } }).data?.idToken
        ?? null;
      if (!idToken) {
        throw new Error('Google sign-in: aucun idToken retourné');
      }
      const credential = GoogleAuthProvider.credential(idToken);
      const { user } = await signInWithCredential(getFirebaseAuth(), credential);
      Sentry.setUser({ id: user.uid, email: user.email ?? undefined });
      return mapToAuthUser(user);
    } catch (err: unknown) {
      const e = err as { code?: string; message?: string };
      if (e.code === statusCodes.SIGN_IN_CANCELLED) {
        throw new Error('Connexion Google annulée');
      }
      throw err;
    }
  }

  async signInWithApple(): Promise<AuthUser> {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In disponible uniquement sur iOS');
    }
    const available = await AppleAuthentication.isAvailableAsync();
    if (!available) {
      throw new Error("Apple Sign-In n'est pas disponible sur cet appareil");
    }
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    if (!credential.identityToken) {
      throw new Error('Apple sign-in: aucun identityToken retourné');
    }
    const provider = new OAuthProvider('apple.com');
    const oauthCredential = provider.credential({
      idToken: credential.identityToken,
      // Apple peut requérir le rawNonce ; absent ici car Apple SDK le hash en interne.
    });
    const { user } = await signInWithCredential(getFirebaseAuth(), oauthCredential);
    // Mise à jour du displayName si fourni au premier login (Apple ne le renvoie qu'une fois).
    if (credential.fullName?.givenName && !user.displayName) {
      const name = [credential.fullName.givenName, credential.fullName.familyName].filter(Boolean).join(' ');
      if (name) await firebaseUpdateProfile(user, { displayName: name });
    }
    Sentry.setUser({ id: user.uid, email: user.email ?? undefined });
    return mapToAuthUser(user);
  }
}

export const authService: IAuthService = new FirebaseAuthService();
