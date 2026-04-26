# MyDailyBook — Mobile (React Native / Expo)

## Contexte
Application mobile de journal personnel à thématique équestre. Exposée au grand public.
Application critique : sécurité, performance et UX sont des priorités non négociables.

## Stack exact
- React Native 0.81.5 + Expo SDK 54 + EAS Build
- TypeScript 5.9 (strict mode)
- Firebase 10.12 — auth client (encapsulé dans `services/auth/AuthService.ts`)
- @tanstack/react-query 5 — server state (`hooks/queries/`)
- Zustand 5 — UI state (`stores/`)
- React Native Paper 5 — UI components (thème dans `theme/`)
- React Navigation 6 — routing (`navigation/`)
- React Hook Form 7 + Zod — validation formulaires
- Axios — HTTP via `services/api/httpClient.ts` uniquement
- react-native-reanimated 4 — animations
- Expo SecureStore — stockage sécurisé

## Architecture feature-based (obligatoire)

```
features/{domain}/
├── components/    # Composants UI du domaine
├── hooks/         # Logique, state et side-effects du domaine
├── screens/       # Écrans React Navigation
└── types.ts       # Types TypeScript du domaine
```

Domaines existants : animals, auth, contacts, events, groups, notes, notifications, objectifs, statistics, wishes

## Couches applicatives

| Couche | Responsabilité | Dossier |
|--------|---------------|---------|
| Screens | Orchestration, navigation | `features/{domain}/screens/` |
| Components | Affichage pur, props typées | `features/{domain}/components/` |
| Hooks | Logique métier, state local | `features/{domain}/hooks/` |
| Queries | React Query hooks | `hooks/queries/` |
| Services | Appels HTTP | `services/api/` |
| Stores | State global UI | `stores/` |
| Tokens | Design system | `theme/tokens.ts` |

## Règles fondamentales

### Data fetching
- TOUJOURS `useQuery` / `useMutation` (@tanstack/react-query)
- JAMAIS `useEffect` + `axios` ou `fetch` directement dans un composant
- Les hooks React Query vivent dans `hooks/queries/use{Domain}Queries.ts`

### State management
- State serveur → React Query
- State UI global (auth, thème, drawers) → Zustand (`stores/`)
- State local d'un composant → `useState`
- React Context : uniquement pour des wizards multi-steps ou state très localisé

### Réseau
- UNIQUEMENT via `services/api/httpClient.ts`
- Chaque domaine a son service : `services/api/{Domain}Service.ts`
- Ne jamais appeler `axios.create()` ou `fetch()` en dehors du httpClient

### Authentification
- Encapsulée dans `services/auth/AuthService.ts` uniquement
- Les composants et screens n'importent JAMAIS `firebase/auth` directement
- Interface `IAuthService` maintenue pour la vendor independence

### Design system
- TOUJOURS via les tokens : `theme/tokens.ts` → `theme/lightTheme.ts` / `theme/darkTheme.ts`
- Utiliser le hook `useAppTheme()` pour accéder aux couleurs, fonts, spacing
- JAMAIS de couleur, font ou spacing hardcodé dans un composant ou un style

## Anti-patterns stricts

- `fetch()` ou `axios.create()` dans les composants ou features → NON
- Couleurs, polices, spacings hardcodés → NON
- `AsyncStorage` pour des données sensibles (tokens, credentials) → NON (utiliser SecureStore)
- Logique métier dans les écrans → NON (extraire dans un hook)
- `any` TypeScript sans commentaire justificatif → NON
- Import direct de `firebase/auth` hors de `services/auth/` → NON
- Nouvelle librairie sans discussion préalable → NON

## Technologies à NE PAS ajouter sans justification
Redux, MobX, Apollo, styled-components, nouvelles libs d'animation, react-native-paper alternative
