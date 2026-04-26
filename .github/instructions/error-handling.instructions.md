---
applyTo: "**/*.ts,**/*.tsx"
---

# Gestion d'erreurs — Mobile MyDailyBook

## Contrat d'erreur — format attendu de l'API

```typescript
// types/ApiError.ts
export interface ApiErrorDetail {
  field: string;
  message: string;
}

export interface ApiError {
  code: AppErrorCode;
  message: string;
  details: ApiErrorDetail[];
}

export interface ApiErrorResponse {
  success: false;
  error: ApiError;
}
```

---

## Codes d'erreur sémantiques

```typescript
// types/AppErrorCode.ts
export enum AppErrorCode {
  UNAUTHORIZED        = "UNAUTHORIZED",
  TOKEN_EXPIRED       = "TOKEN_EXPIRED",
  FORBIDDEN           = "FORBIDDEN",
  NOT_FOUND           = "NOT_FOUND",
  CONFLICT            = "CONFLICT",
  VALIDATION_ERROR    = "VALIDATION_ERROR",
  QUOTA_EXCEEDED      = "QUOTA_EXCEEDED",
  FEATURE_UNAVAILABLE = "FEATURE_UNAVAILABLE",
  INTERNAL_ERROR      = "INTERNAL_ERROR",
  NETWORK_ERROR       = "NETWORK_ERROR",   // Erreur réseau côté client
}
```

---

## `utils/errorParser.ts` — Parser centralisé

```typescript
// utils/errorParser.ts
import axios, { AxiosError } from 'axios';
import { AppErrorCode, ApiError } from '../types';

export interface ParsedError {
  code: AppErrorCode;
  message: string;
  details: { field: string; message: string }[];
  isNetworkError: boolean;
  isAuthError: boolean;
  isQuotaError: boolean;
}

export function parseApiError(error: unknown): ParsedError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ success: false; error: ApiError }>;

    // Erreur réseau (pas de réponse)
    if (!axiosError.response) {
      return {
        code: AppErrorCode.NETWORK_ERROR,
        message: 'Impossible de rejoindre le serveur. Vérifiez votre connexion.',
        details: [],
        isNetworkError: true,
        isAuthError: false,
        isQuotaError: false,
      };
    }

    const apiError = axiosError.response.data?.error;
    if (apiError) {
      return {
        code: apiError.code,
        message: apiError.message,
        details: apiError.details ?? [],
        isNetworkError: false,
        isAuthError: apiError.code === AppErrorCode.UNAUTHORIZED || apiError.code === AppErrorCode.TOKEN_EXPIRED,
        isQuotaError: apiError.code === AppErrorCode.QUOTA_EXCEEDED,
      };
    }
  }

  return {
    code: AppErrorCode.INTERNAL_ERROR,
    message: 'Une erreur inattendue s\'est produite.',
    details: [],
    isNetworkError: false,
    isAuthError: false,
    isQuotaError: false,
  };
}
```

---

## `hooks/useErrorToast.ts` — Toast pour erreurs réseau/serveur

```typescript
// hooks/useErrorToast.ts
import { useCallback } from 'react';
import { useSnackbar } from '../shared/components/SnackbarProvider'; // ou Zustand store toast
import { ParsedError, AppErrorCode } from '../utils/errorParser';

export function useErrorToast() {
  const { show } = useSnackbar();

  const showError = useCallback((error: ParsedError, onRetry?: () => void) => {
    // Erreurs de validation → affichage inline, pas de toast
    if (error.code === AppErrorCode.VALIDATION_ERROR) return;

    // Quota → prompt upgrade, pas un toast d'erreur
    if (error.isQuotaError) {
      show({ message: error.message, action: { label: 'Voir les offres', onPress: () => { /* navigation upgrade */ } } });
      return;
    }

    show({
      message: error.message,
      action: onRetry ? { label: 'Réessayer', onPress: onRetry } : undefined,
      duration: 4000,
    });
  }, [show]);

  return { showError };
}
```

---

## Configuration React Query — retry + gestion globale

```typescript
// App.tsx ou providers/QueryProvider.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { parseApiError } from '../utils/errorParser';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        const parsed = parseApiError(error);
        // Ne pas retry sur les erreurs 4xx (sauf réseau)
        if (!parsed.isNetworkError && !parsed.isAuthError) return false;
        return failureCount < 2; // 2 tentatives silencieuses
      },
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
    mutations: {
      retry: 0, // Pas de retry automatique sur les mutations
    },
  },
});
```

---

## Utilisation dans les hooks de mutation — pattern complet

```typescript
// features/notes/hooks/useCreateNote.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { parseApiError } from '../../../utils/errorParser';
import { useErrorToast } from '../../../hooks/useErrorToast';

export function useCreateNote() {
  const queryClient = useQueryClient();
  const { showError } = useErrorToast();

  return useMutation({
    mutationFn: NoteService.create,

    // Optimistic update immédiat
    onMutate: async (newNote) => {
      await queryClient.cancelQueries({ queryKey: ['notes'] });
      const previous = queryClient.getQueryData(['notes']);
      queryClient.setQueryData(['notes'], (old: Note[]) => [
        { ...newNote, id: 'temp-' + Date.now(), syncing: true },
        ...(old ?? []),
      ]);
      return { previous };
    },

    onError: (error, _, context) => {
      // Rollback optimistic update
      queryClient.setQueryData(['notes'], context?.previous);
      const parsed = parseApiError(error);
      showError(parsed, () => { /* la mutation sera relancée manuellement */ });
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });
}
```

---

## Erreurs de validation de formulaire — affichage inline

```typescript
// features/animals/components/AnimalForm.tsx
import { useForm } from 'react-hook-form';
import { parseApiError } from '../../../utils/errorParser';

export function AnimalForm() {
  const { setError, formState: { errors } } = useForm<AnimalFormData>();

  const handleSubmit = async (data: AnimalFormData) => {
    try {
      await AnimalService.create(data);
    } catch (err) {
      const parsed = parseApiError(err);

      if (parsed.details.length > 0) {
        // Mapper les erreurs sur les champs du formulaire
        parsed.details.forEach(({ field, message }) => {
          setError(field as keyof AnimalFormData, { message });
        });
      }
      // Si pas de details → toast via showError
    }
  };

  return (
    <TextInput ... />
    {errors.name && <Text style={styles.fieldError}>{errors.name.message}</Text>}
  );
}
```

---

## Comportement par code d'erreur

| Code | Comportement mobile |
|------|-------------------|
| `UNAUTHORIZED` | Déconnexion + redirect vers login |
| `TOKEN_EXPIRED` | Tentative refresh silencieux, puis login si échec |
| `FORBIDDEN` | Toast "Accès non autorisé" |
| `NOT_FOUND` | Toast discret ou composant "introuvable" dans la vue |
| `VALIDATION_ERROR` | Erreurs inline sous les champs (pas de toast) |
| `QUOTA_EXCEEDED` | Bottom sheet upgrade (pas un toast d'erreur) |
| `FEATURE_UNAVAILABLE` | Prompt upgrade contextuel |
| `NETWORK_ERROR` | Toast + bouton "Réessayer" après 2 retries automatiques |
| `INTERNAL_ERROR` | Toast générique + bouton "Réessayer" |

---

## Règles absolues

- Jamais de `catch` vide — toujours parser et gérer l'erreur
- Les erreurs `VALIDATION_ERROR` vont **toujours** sur les champs inline, jamais en toast
- Les erreurs réseau/500 vont **toujours** en toast avec bouton "Réessayer" après 2 retries auto
- Le bouton "Réessayer" est visible **uniquement** après échec définitif (après les 2 retries silencieux)
- `QUOTA_EXCEEDED` n'est jamais affiché comme une erreur — c'est un prompt d'upgrade
- Les messages d'erreur exposés à l'utilisateur viennent **toujours** du champ `message` de l'API — jamais de string hardcodée sauf fallback réseau
