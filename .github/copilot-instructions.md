# MyDailyBook Mobile - Instructions Generales

## Mission

MyDailyBook Mobile est une application Expo / React Native pour suivre la vie des chevaux : animaux, calendrier, soins, notes, objectifs, contacts, groupes, statistiques et aides IA discretes.

Toute contribution doit viser trois objectifs :
- une UX simple, chaleureuse et premium ;
- une architecture facile a faire evoluer ;
- un comportement facile a debugger en cas d'incident.

Les instructions de `.github/instructions/` sont la source de verite pour les agents. Si elles contredisent l'etat reel du code, corriger l'instruction ou signaler l'ecart avant de propager un mauvais pattern.

## Stack cible

- React Native + Expo + EAS Build
- TypeScript strict
- Tamagui + tokens maison dans `theme/`
- React Navigation pour le routing
- TanStack React Query dans `hooks/queries/` pour le server state
- Zustand dans `stores/` pour l'etat UI global ou les wizards locaux
- React Hook Form + Zod pour les formulaires
- Axios uniquement via `services/api/httpClient.ts`
- Firebase Auth encapsule dans `services/auth/`
- Expo SecureStore pour les secrets et tokens
- Sentry via `services/logs/LoggerService.ts`
- Maestro pour les flows E2E critiques

## Architecture de reference

```text
features/{domain}/
  components/    UI du domaine
  hooks/         logique locale, formulaires, orchestration metier
  screens/       ecrans React Navigation
  types.ts       types specifiques au domaine

hooks/queries/   hooks React Query par domaine
services/api/    appels HTTP purs
services/auth/   adapter auth
services/*/      adapters externes
stores/          etat UI global, auth, theme, wizards
shared/          composants et utilitaires transverses
theme/           tokens, theme Tamagui, hook useAppTheme
navigation/      routes, stacks, types
```

Domaines principaux : `animals`, `auth`, `contacts`, `events`, `groups`, `notes`, `notifications`, `objectifs`, `statistics`, `wishes`, `onboarding`.

## Regles fondamentales

- Un flux metier = un chemin principal. Ne pas creer deux interfaces concurrentes pour la meme action.
- Les composants affichent et emettent des callbacks ; ils ne font pas d'appels HTTP directs.
- Les screens orchestrent navigation et composition ; ils ne contiennent pas de logique metier lourde.
- Les hooks de feature gerent les formulaires, les calculs locaux et l'orchestration.
- Les hooks React Query dans `hooks/queries/` gerent cache, mutations, optimistic update et invalidation.
- Les services dans `services/api/` ne font que parler au backend.
- Toute valeur visuelle vient des tokens ou d'une exception documentee.
- Tout etat reseau expose clairement `loading`, `error`, `empty`, `data`.
- Toute erreur doit etre utile pour l'utilisateur et tracable pour l'equipe.

## UX/UI cible

L'interface doit etre moderne, calme et premium : surfaces chaudes, glass/blur quand cela aide la lecture, profondeur douce, micro-interactions courtes et iconographie metier coherente.

Eviter les effets gratuits, les visuels generiques d'IA, les emojis decoratifs, les pictogrammes de technologie et les gradients artificiels. Une fonctionnalite IA doit apparaitre comme une aide contextuelle elegante : suggestion, pre-remplissage, reformulation, resume ou analyse, jamais comme un univers visuel separe.

## Migration du legacy

Le code existant contient encore des patterns anciens. Pour chaque modification :
- ne pas ajouter de nouveau legacy ;
- corriger les ecarts proches du code touche quand c'est raisonnable ;
- eviter les grands refactors sans besoin metier clair ;
- documenter les decisions qui changent une convention.

## Anti-patterns stricts

- Appel direct a `fetch`, `axios` ou un service API depuis un composant UI.
- Import direct de SDK externe dans une feature quand un adapter existe.
- `any` sans justification ou sans plan de typage progressif.
- Couleurs, spacing ou font hardcodes dans du nouveau code UI.
- Spinner plein ecran sans issue claire, sauf bootstrap initial.
- Flux de creation/edition duplique.
- Message d'erreur technique expose a l'utilisateur.
- Secret, token ou credential dans le repo ou le workspace partage.
