export const FIREBASE_ERRORS: Record<string, string> = {
  'auth/invalid-email': 'Adresse e-mail invalide.',
  'auth/user-disabled': 'Ce compte a été désactivé.',
  'auth/user-not-found': 'Aucun compte trouvé avec cet e-mail.',
  'auth/wrong-password': 'Mot de passe incorrect.',
  'auth/email-already-in-use': 'Cette adresse e-mail est déjà utilisée.',
  'auth/operation-not-allowed': "L'inscription par e-mail et mot de passe est désactivée.",
  'auth/weak-password': 'Le mot de passe est trop faible.',
};

export function getFirebaseError(error: unknown): string {
  const code = (error as { code?: string } | null)?.code;
  return FIREBASE_ERRORS[code ?? ''] ?? "Une erreur inconnue s'est produite. Veuillez réessayer.";
}
