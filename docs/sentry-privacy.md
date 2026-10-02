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

Ce filtre porte uniquement sur les contextes ajoutés par LoggerService. Les
messages d'erreur, avertissements et libellés de breadcrumbs restent à traiter,
ainsi que les événements/transactions automatiques et le contexte utilisateur du
SDK. `sendDefaultPii: false` n'est pas une garantie de nettoyage de ces champs.
Ne pas présenter ce premier lot comme un filtrage complet ou une absence de fuite.

L'upload des source maps est désactivé dans les profils EAS actuellement inspectés.
La recette JS/native symboliquée, les métadonnées de version et l'accès Sentry
restent à qualifier sur un candidat autorisé, sans publier en production.

## Vérification locale

```sh
npx jest --runInBand --coverage=false tests/unit/logContext.test.ts tests/unit/loggerContextIntegration.test.ts
npx tsc --noEmit
```

Les tests n'appellent pas Sentry : le fournisseur est simulé à la frontière.
Les cas couvrent conservation du contexte technique, suppression des données
privées, valeurs invalides, champs hérités/accesseurs et branchement du filtre.
