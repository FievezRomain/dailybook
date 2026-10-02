# Confidentialité Sentry mobile — US-021 administration

Premier durcissement sur branche dédiée, sans build EAS, mise à jour OTA ni envoi
d'événement réel. Firebase et les parcours utilisateur ne sont pas modifiés.

`services/logs/logContext.ts` définit la liste des valeurs de contexte autorisées.
LoggerService l'utilise pour les erreurs, avertissements et données de breadcrumbs.
Fonctionnalités/opérations/environnements utilisent des valeurs explicites ; les
codes proviennent de `AppErrorCode`. Les indicateurs restent des booléens et les
compteurs des entiers entre 0 et 10000. Les champs inconnus, noms de routes libres,
IDs, emails, URLs, contenus et objets imbriqués sont omis. Les propriétés héritées
et accesseurs ne sont pas lus. Ajouter une clé nécessite de revoir sa finalité,
ses valeurs et ses tests, pas de réintroduire un contexte libre.

## Limites restantes

Incrément suivant : les événements explicitement capturés par LoggerService ont
un processeur de portée. Les messages libres et noms d'exception non reconnus
sont remplacés par des libellés fixes ; requêtes, extras, breadcrumbs attachés,
variables locales, extraits de source et métadonnées libres des frames sont
retirés. Les types connus, fonctions, fichiers (sans query/fragment/credentials),
lignes, colonnes et identifiants de debug sont conservés pour le diagnostic.
Les libellés des breadcrumbs explicites sont filtrés avant ajout au SDK.

Neuf tests ciblés couvrent désormais contextes et événements du journaliseur.
Ce contrôle n'est pas une preuve de symbolication dans Sentry ni de filtrage natif.
Les noms de fonctions/modules et chemins de code sont considérés techniques ;
ils ne doivent pas être construits à partir de données utilisateur.

Ces filtres portent uniquement sur les captures explicites de LoggerService.
Les événements/transactions automatiques, les crashs natifs, les pièces jointes,
ainsi que le contexte utilisateur/global du SDK restent à qualifier.
`sendDefaultPii: false` n'est pas une garantie de nettoyage de ces champs.
Ne pas présenter ce premier lot comme un filtrage complet ou une absence de fuite.

L'upload des source maps est désactivé dans les profils EAS actuellement inspectés.
La recette JS/native symboliquée, les métadonnées de version et l'accès Sentry
restent à qualifier sur un candidat autorisé, sans publier en production.

## Vérification locale

```sh
npx jest --runInBand --coverage=false tests/unit/logContext.test.ts tests/unit/logEvent.test.ts tests/unit/loggerContextIntegration.test.ts
npx tsc --noEmit
```

Les tests n'appellent pas Sentry : le fournisseur est simulé à la frontière.
Les cas couvrent conservation du contexte technique, suppression des données
privées, valeurs invalides, champs hérités/accesseurs et branchement du filtre.
