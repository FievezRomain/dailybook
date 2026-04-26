---
applyTo: "**/*.ts,**/*.tsx"
---

# Qualité du code — Mobile MyDailyBook

## TypeScript
- Mode strict : pas de `any` sans commentaire justificatif `// eslint-disable-next-line @typescript-eslint/no-explicit-any — raison`
- Pas d'`as` (type assertion) sans vérification préalable à l'exécution
- Types explicites sur les props de composants, les retours de fonctions publiques, et les paramètres
- Pas de `!` (non-null assertion) sans garantie — préférer l'optional chaining `?.`

## Taille et cohésion des fichiers
- Composant : max ~150 lignes. Au-delà, extraire un sous-composant ou un hook
- Hook : max ~100 lignes. Au-delà, découper en hooks plus petits
- Service : max ~80 lignes. Un service = un domaine HTTP
- Fichiers de types : regrouper par domaine, éviter les fichiers fourre-tout

## Réutilisabilité
- Si une logique est dupliquée 2 fois → créer un hook ou une fonction utilitaire
- Si un composant est utilisé dans 2+ features → déplacer dans `shared/components/`
- Si un style est dupliqué → créer un token dans `theme/tokens.ts`

## Imports
- Ordre : React/RN → librairies tierces → modules internes (par profondeur décroissante) → types
- Pas d'imports relatifs profonds (../../..) — utiliser les alias configurés dans `tsconfig.json`
- Pas d'import de barrel (`index.ts`) sauf pour les exports publics d'une feature

## Nommage
- Composants : `PascalCase` — `AnimalCard`, `EventFormDrawer`
- Hooks : `camelCase` prefixé `use` — `useAnimalForm`, `useEventList`
- Services : `PascalCase` + suffix `Service` — `AnimalsService`
- Constants : `SCREAMING_SNAKE_CASE` pour les constantes globales
- Types/Interfaces : `PascalCase`, préférer `type` à `interface` sauf pour les objets extensibles

## Composants purs
- Un composant ne doit pas déclencher de side-effects directement — déléguer à un hook
- Les callbacks (`onPress`, `onChange`) sont passés en props, jamais hardcodés dans le composant
- Éviter les props drilling > 2 niveaux — utiliser un hook ou un store Zustand

## Gestion d'erreurs
- Les erreurs React Query sont gérées au niveau du hook (retour `isError`, `error`)
- Afficher un composant d'erreur explicite (pas juste `null` ou un écran blanc)
- Ne pas swallower les erreurs silencieusement avec un `catch` vide
- Les erreurs inattendues remontent via le composant `<ErrorBoundary>` de `shared/`

## Dead code
- Pas de code commenté laissé dans la codebase — utiliser git pour l'historique
- Pas de `console.log` en production — utiliser `if (__DEV__) console.log()`
- Supprimer les imports inutilisés (ESLint le détecte automatiquement)

## Synchronisation docs & config — règle obligatoire

Toute modification de code qui impacte l'un des éléments suivants **doit être accompagnée** d'une mise à jour des fichiers concernés dans le **même commit** :

| Modification | Fichiers à mettre à jour |
|-------------|--------------------------|
| Ajout / suppression d'une permission (caméra, micro, localisation, notifications…) | `app.json` (`expo.android.permissions`, `expo.ios.infoPlist`), `eas.json` si build profile impacté, `README.md` section permissions |
| Ajout / mise à jour d'une lib (`package.json`) | `README.md` section stack, `docs/` si impact architectural |
| Nouveau domaine ou nouvelle feature | `docs/architecture.md`, structure dans `README.md` |
| Nouvelle variable d'environnement | `config/env.ts`, `.env.example`, `README.md` section config |
| Nouveau flux d'authentification ou de navigation | `docs/authentication.md` ou fichier doc équivalent |
| Changement de comportement offline / synchronisation | `README.md`, doc technique associée |

### Checklist commit "breaking change config"
```
[ ] app.json mis à jour (permissions, plugins Expo)
[ ] eas.json mis à jour si profil de build impacté
[ ] README.md reflète l'état actuel
[ ] docs/ à jour si architecture ou flux modifié
[ ] .env.example à jour si nouvelle variable
```

### Règle pour Copilot
Quand tu génères du code qui :
- Utilise `expo-camera`, `expo-location`, `expo-media-library`, `expo-contacts`, `expo-notifications` ou tout module natif avec permission → **rappeler de mettre à jour `app.json`**
- Ajoute une nouvelle lib → **rappeler de mettre à jour `README.md`**
- Crée un nouveau domaine dans `features/` → **rappeler de mettre à jour `docs/architecture.md`**
