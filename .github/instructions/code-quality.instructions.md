---
applyTo: "**/*.ts,**/*.tsx"
---

# Qualite Code TypeScript

## Principes

Le code doit etre lisible sous stress. Un bug de production doit pouvoir etre localise rapidement sans deviner ou se cache la logique. Preferer des fichiers simples, des types explicites et des effets bien delimites.

## TypeScript

- `strict` reste actif.
- Eviter `any`. Si un `any` est temporairement necessaire, ajouter un commentaire expliquant pourquoi et quelle limite il protege.
- Eviter les assertions `as` quand une verification runtime peut etre faite.
- Eviter `!` sauf garantie locale evidente.
- Typer les props, les retours de hooks publics, les DTO et les params de navigation.
- Les types partages vivent dans `models/` ou `types/`; les types de domaine vivent dans `features/{domain}/types.ts`.

## Strategie progressive pour le legacy

Le code existant peut contenir du legacy. Pour toute zone touchee :
- ne pas introduire de nouvel `any` non justifie ;
- remplacer les types les plus proches quand cela ne declenche pas un refactor massif ;
- isoler les conversions `unknown -> type metier` dans un helper ou un hook ;
- ne pas corriger tout le repo dans une PR non dediee.

## Taille et cohesion

- Composant UI : viser moins de 150 lignes.
- Hook : viser moins de 120 lignes.
- Service API : rester centre sur un domaine.
- Extraire quand une fonction a deux raisons de changer.
- Eviter les composants qui melangent layout, validation, mutation, upload et feedback.

## Imports

- Utiliser les alias TypeScript (`@features`, `@shared`, `@services`, etc.) pour eviter les chemins profonds quand le fichier est deja migre.
- Ne pas importer un SDK externe dans une feature si un service adapter existe.
- Ne pas importer `services/api/*` dans un composant UI ; passer par un hook.
- Les barrels `index.ts` servent aux API publiques, pas a masquer une structure confuse.

## Side effects

- Pas de side effect dans le rendu.
- Les appels reseau passent par React Query ou par un hook dedie.
- Les subscriptions et timers doivent etre nettoyes.
- Les `catch` silencieux sont interdits sauf cas explicitement non critique et commente.
- Les logs directs sont interdits hors dev local ; utiliser `LoggerService`.

## UI et styles

- Tout nouveau style doit utiliser les tokens via `useAppTheme()` ou Tamagui.
- Pas de couleur, spacing ou font hardcode sans exception documentee.
- Les styles dupliques doivent devenir un composant shared, un token ou un helper.
- L'UI doit exposer des etats `loading`, `error`, `empty`, `data` quand elle depend du reseau.

## Debug first

Nommer les choses pour les retrouver :
- `createEventMutation` plutot que `mutation`;
- `isSavingProfile` plutot que `loading`;
- `eventDraft` plutot que `data`;
- `handleRetryGroups` plutot qu'un callback inline opaque.

Un bon changement laisse un chemin clair entre action utilisateur, mutation, erreur et feedback.
