---
applyTo: "**/*.ts,**/*.tsx"
---

# Architecture Mobile

## Intention

L'architecture doit rendre chaque fonctionnalite facile a comprendre, tester, debugger et remplacer. Le code doit raconter ou vit chaque responsabilite : UI dans les composants, orchestration dans les hooks/screens, donnees serveur dans React Query, HTTP dans les services.

## Structure feature-based

```text
features/{domain}/
  components/    composants UI du domaine
  hooks/         formulaires, logique locale, orchestration domaine
  screens/       entrees de navigation
  types.ts       types propres au domaine
```

Les hooks React Query restent volontairement a la racine dans `hooks/queries/`. Cette convention evite de disperser le server state et correspond a l'etat cible du repo.

## Responsabilites par couche

| Couche | Responsabilite | Interdit |
| --- | --- | --- |
| `screens/` | composer la page, lire les params, naviguer | logique metier lourde, HTTP direct |
| `components/` | afficher, recevoir props, emettre events | mutation, navigation globale, service direct |
| `features/*/hooks/` | formulaire, etat local, orchestration domaine | cache serveur manuel |
| `hooks/queries/` | queries, mutations, optimistic update, invalidation | UI ou navigation |
| `services/api/` | endpoints backend, DTO, transformation HTTP minimale | state React, Toast, navigation |
| `stores/` | auth, theme, UI global, wizards | donnees metier serveur |

## Regle anti-duplication de flux

Une action metier importante doit avoir un chemin principal :
- creer un evenement ;
- creer un animal ;
- modifier un profil ;
- ajouter une note ;
- inviter un membre.

Avant d'ajouter un nouvel ecran ou formulaire, verifier s'il existe deja un flux equivalent. Si oui, etendre le flux principal plutot que creer une variante. Les anciens flux doivent etre retires ou marques comme migration, jamais laisses en concurrence.

## React Query

Les fichiers `hooks/queries/use{Domain}Query.ts` ou `use{Domain}Queries.ts` exposent :
- une query de liste ou detail ;
- des mutations typees ;
- une invalidation explicite ;
- un rollback en cas d'optimistic update ;
- un feedback haptique/toast quand c'est utile.

Les composants consomment ces hooks, jamais les services API directement. Les hooks de feature peuvent appeler les mutations React Query pour encapsuler un formulaire.

## Services API

Les services dans `services/api/` :
- utilisent uniquement `httpClient`;
- retournent des types metier ou DTO clairement nommes ;
- ne declenchent pas de Toast, navigation ou Sentry directement ;
- ne connaissent pas React.

Les uploads ou appels externes peuvent avoir un adapter dedie dans `services/storage/`, `services/ai/`, `services/notifications/`, mais les features ne doivent pas importer le SDK fournisseur.

## Stores Zustand

Utiliser Zustand pour :
- auth et profil courant ;
- theme ;
- etat UI global ;
- wizards multi-etapes ;
- preferences non sensibles.

Ne pas stocker dans Zustand une liste serveur durable qui appartient a React Query. Ne persister que ce qui doit survivre au redemarrage.

## Navigation

- Les routes sont typees dans `navigation/types.ts`.
- Les params de navigation restent petits : IDs, flags, strings, payload minimal.
- Ne pas passer d'objet metier complet ou de donnees sensibles en params.
- Eviter `as any`; si necessaire pour une migration, ajouter un commentaire court et creer une dette de typage.
- La navigation vit dans les screens ou callbacks de composition, pas dans les services.

## Debuggabilite

Chaque flux important doit permettre de repondre vite a :
- quelle action utilisateur a declenche l'etat ?
- quelle query ou mutation est en cours ?
- quel payload minimal a ete envoye ?
- quelle erreur utilisateur et quelle erreur technique ont ete produites ?

Preferer des noms explicites, des etats separes et des helpers purs a une logique JSX compacte mais opaque.
