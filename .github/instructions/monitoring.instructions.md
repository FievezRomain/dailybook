---
applyTo: "**/*.ts,**/*.tsx"
---

# Monitoring Sentry — Mobile MyDailyBook

## Initialisation enrichie

```typescript
// App.tsx
import * as Sentry from '@sentry/react-native';
import { env } from './config/env';

if (!env.IS_DEV && env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.APP_ENV,              // 'production' | 'staging'
    release: `mydailybook@${env.APP_VERSION}+${env.BUILD_NUMBER}`,
    tracesSampleRate: 0.2,                 // 20% des transactions — pas 100%
    debug: false,
    enableAutoSessionTracking: true,
    attachStacktrace: true,
    beforeSend(event) {
      // Ne pas envoyer les erreurs de dev escapées accidentellement
      if (__DEV__) return null;
      return event;
    },
  });
}

export default Sentry.wrap(App);
```

Variables d'environnement requises dans `config/env.ts` :
```typescript
APP_ENV: z.enum(['development', 'staging', 'production']),
APP_VERSION: z.string(),       // ex: "1.4.2"
BUILD_NUMBER: z.string(),      // ex: "47"
SENTRY_DSN: z.string().optional(),
```

---

## Contexte utilisateur — `setUser` obligatoire

```typescript
// services/auth/AuthService.ts
import * as Sentry from '@sentry/react-native';

class FirebaseAuthService implements IAuthService {

  async signIn(email: string, password: string): Promise<AuthResult> {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const token = await result.user.getIdTokenResult();

    // ✅ Identifier l'utilisateur dans Sentry dès la connexion
    Sentry.setUser({
      id: token.claims.internal_id as string,  // UUID interne stable
      email: result.user.email ?? undefined,
    });

    return result;
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
    // ✅ Effacer le contexte utilisateur à la déconnexion
    Sentry.setUser(null);
  }
}
```

---

## Tags sémantiques — filtrage dans Sentry Dashboard

```typescript
// Définir les tags au démarrage de session (après auth)
Sentry.setTag('app_version', env.APP_VERSION);
Sentry.setTag('platform', Platform.OS);           // 'ios' | 'android'
Sentry.setTag('environment', env.APP_ENV);

// Tags sur les opérations métier (dans les mutations React Query)
Sentry.setTag('operation', 'note.create');
Sentry.setTag('feature', 'notes');

// Tags sur les rôles (après récupération du token)
const roles = token.claims.roles as string[];
Sentry.setTag('user_role', roles[0] ?? 'free');   // rôle principal
```

---

## Breadcrumbs — reconstituer le parcours avant le crash

Ajouter des breadcrumbs sur les **actions clés** de l'utilisateur :

```typescript
// utils/monitoring.ts
import * as Sentry from '@sentry/react-native';

export function trackAction(category: string, message: string, data?: Record<string, unknown>) {
  Sentry.addBreadcrumb({
    category,
    message,
    data,
    level: 'info',
  });
}

// Utilisation dans les hooks de mutation
// features/notes/hooks/useCreateNote.ts
onMutate: async (newNote) => {
  trackAction('notes', 'Creating note', { animal_id: newNote.animal_id });
  // ...
},
onSuccess: () => {
  trackAction('notes', 'Note created successfully');
},
onError: (error) => {
  trackAction('notes', 'Note creation failed', { error: String(error) });
},
```

Actions à tracer systématiquement :
- Création / modification / suppression d'un animal
- Création / modification / suppression d'une note
- Création d'un événement
- Navigation entre écrans principaux (navigation `onFocus`)
- Appels à l'IA (début + résultat)
- Erreurs de synchronisation offline

---

## Capture d'exception enrichie — `LoggerService`

```typescript
// services/LoggerService.ts
import * as Sentry from '@sentry/react-native';

class LoggerService {
  error(message: string, error: unknown, context?: Record<string, unknown>): void {
    if (__DEV__) {
      console.error(message, error);
      return;
    }

    Sentry.withScope((scope) => {
      if (context) {
        scope.setContext('additional_context', context);
      }
      scope.setTag('logger', 'LoggerService');
      Sentry.captureException(error instanceof Error ? error : new Error(String(error)));
    });
  }

  warn(message: string, data?: Record<string, unknown>): void {
    if (__DEV__) {
      console.warn(message, data);
      return;
    }
    Sentry.captureMessage(message, { level: 'warning', extra: data });
  }
}

export const logger = new LoggerService();
```

Usage dans les services :
```typescript
// ✅ Correct
try {
  await AnimalService.create(data);
} catch (err) {
  logger.error('Failed to create animal', err, { data });
  throw err; // Propager pour que React Query gère le rollback
}

// ❌ Interdit
Sentry.captureException(err); // Appel direct sans contexte
console.error(err);           // En production, silencieux pour Sentry
```

---

## Source Maps — configuration EAS

```json
// eas.json — activer hermes source maps
{
  "build": {
    "production": {
      "env": {
        "SENTRY_ORG": "mydailybook",
        "SENTRY_PROJECT": "mydailybook-mobile"
      }
    }
  }
}
```

```javascript
// app.json / app.config.js — plugin Sentry
{
  "plugins": [
    [
      "@sentry/react-native/expo",
      {
        "organization": "mydailybook",
        "project": "mydailybook-mobile"
      }
    ]
  ]
}
```

> Rappel doc sync : ajouter `@sentry/react-native/expo` dans `app.json` plugins.

---

## Règles absolues

- `Sentry.setUser()` : appelé **uniquement** dans `services/auth/AuthService.ts` — jamais dans les composants
- `Sentry.captureException()` : **toujours** via `logger.error()` — jamais en appel direct dans les features
- `tracesSampleRate` : **maximum 0.2** en production — la valeur 1.0 génère du bruit et un coût inutile
- `release` : format `mydailybook@{version}+{buildNumber}` — permet de lier les erreurs aux déploiements
- `environment` : obligatoire pour distinguer staging et production dans le dashboard
