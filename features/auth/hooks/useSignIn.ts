import { useCallback, useState } from 'react';
import { signInSchema } from '../../../business/validators/auth';
import { authService } from '../../../services/auth/FirebaseAuthService';

export interface SignInErrors {
  email?: string;
  password?: string;
  form?: string;
}

const validationMessages: Record<string, string> = {
  'errors.emailInvalid': 'Adresse e-mail invalide',
  'errors.passwordRequired': 'Mot de passe requis',
};

export function useSignIn() {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<SignInErrors>({});

  const validate = useCallback((email: string, password: string) => {
    const result = signInSchema.safeParse({ email, password });
    if (result.success) {
      setErrors({});
      return result.data;
    }
    const next: SignInErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if ((field === 'email' || field === 'password') && !next[field]) next[field] = validationMessages[issue.message] ?? issue.message;
    }
    setErrors(next);
    return null;
  }, []);

  const run = useCallback(async (action: () => Promise<unknown>, fallbackMessage: string) => {
    if (loading) return false;
    setLoading(true);
    setErrors({});
    try {
      await action();
      return true;
    } catch {
      setErrors({ form: fallbackMessage });
      return false;
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const signIn = useCallback(async (email: string, password: string) => {
    const values = validate(email, password);
    if (!values) return false;
    return run(() => authService.signIn(values.email, values.password), 'E-mail ou mot de passe incorrect');
  }, [run, validate]);

  const signInWithApple = useCallback(() => run(() => authService.signInWithApple(), 'Connexion Apple impossible. Réessayez.'), [run]);
  const signInWithGoogle = useCallback(() => run(() => authService.signInWithGoogle(), 'Connexion Google impossible. Réessayez.'), [run]);

  return { loading, errors, signIn, signInWithApple, signInWithGoogle } as const;
}
