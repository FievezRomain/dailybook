---
applyTo: "**/*.ts,**/*.tsx"
---

# Monitoring Et Logs

## Intention

Le monitoring doit aider a comprendre les incidents sans collecter trop de donnees. Il doit repondre a : quelle feature, quelle operation, quel etat, quel type d'erreur, quelle version.

## Sentry

Sentry est initialise dans `App.tsx` uniquement si `!env.IS_DEV && env.SENTRY_DSN`.

Configuration cible :
- `dsn` depuis `config/env.ts`;
- `environment` derive de la config build si disponible ;
- `release` basee sur version + build si disponible ;
- traces limitees en production ;
- pas d'event envoye en dev.

Si des champs comme `APP_ENV`, `APP_VERSION` ou `BUILD_NUMBER` sont ajoutes, mettre aussi a jour `config/env.ts`, `.env.example` et la documentation projet.

## LoggerService

Les features ne doivent pas appeler Sentry directement. Utiliser `services/logs/LoggerService.ts`.

Attendu :
- `LoggerService.log` ou methode equivalente pour warning/message ;
- `LoggerService.error` si elle existe ou a creer lors d'une prochaine refonte ;
- contexte minimal et non sensible ;
- propagation de l'erreur apres log quand React Query ou le formulaire doit la gerer.

## Contexte utilisateur

Le contexte utilisateur Sentry est gere dans `services/auth/`. Ne pas appeler `Sentry.setUser` depuis un composant ou une feature.

Donnees autorisees :
- id interne stable si disponible ;
- role principal si non sensible ;
- jamais de token ;
- email uniquement si necessaire au support et autorise par la politique produit.

## Breadcrumbs utiles

Tracer les actions qui aident vraiment au diagnostic :
- creation, edition, suppression d'un animal ;
- creation ou edition d'un evenement ;
- creation d'une note ;
- changement de role/offre visible ;
- debut et resultat d'une aide IA ;
- erreur de permission ;
- echec d'upload.

Eviter les breadcrumbs de bruit : chaque tap, chaque rendu, chaque navigation secondaire.

Format recommande :
```ts
LoggerService.breadcrumb?.('events', 'create_started', {
  eventType,
  hasAnimals: selectedAnimalIds.length > 0,
});
```

## Tags par operation

Quand une operation est tracee, utiliser des tags stables :
- `feature`: `events`, `animals`, `notes`, etc.
- `operation`: `create`, `update`, `delete`, `upload`, `parse`
- `screen`: nom de route si utile
- `app_mode`: `development`, `staging`, `production` si disponible

## PII et secrets

Interdit dans logs, Sentry context, breadcrumbs :
- token Firebase ;
- mot de passe ;
- cle API ou secret ;
- document utilisateur brut ;
- note complete ;
- contenu IA complet si personnel.

Preferer des booleens, tailles, IDs non sensibles et codes d'erreur.

## Console

`console.log`, `console.warn`, `console.error` sont reserves au debug local temporaire et doivent etre proteges par `__DEV__` ou remplaces par `LoggerService` avant merge.
