---
applyTo: "**/*.ts,**/*.tsx"
---

# Gestion Des Erreurs

## Intention

Une erreur doit etre comprehensible pour l'utilisateur et exploitable pour l'equipe. Les erreurs techniques ne doivent pas fuiter dans l'UI, mais elles doivent rester tracables via logs, Sentry et contexte minimal.

## Sources de verite

- Parser centralise : `utils/errorParser.ts`
- Feedback utilisateur : `hooks/useErrorToast.ts` et composants d'etat partages
- Logs techniques : `services/logs/LoggerService.ts`
- Erreurs API : types dans `types/ApiError.ts` et `types/AppErrorCode.ts`

## Pattern reseau obligatoire

Toute surface qui depend d'une query ou mutation doit gerer explicitement :
- `loading` : skeleton ou etat transitoire utile ;
- `error` : message humain + retry si possible ;
- `empty` : etat vide actionnable ;
- `data` : rendu nominal.

Un spinner plein ecran sans issue est accepte uniquement pendant le bootstrap initial. Pour une liste ou un dashboard, afficher au moins la structure de l'ecran, meme si une section charge.

## React Query

Les hooks React Query doivent :
- typer les donnees de retour quand l'inference n'est pas claire ;
- invalider les query keys concernees ;
- rollback les optimistic updates ;
- ne pas retry automatiquement les mutations ;
- ne pas masquer une erreur definitive.

Les erreurs de query sont affichees dans l'ecran ou un composant d'etat. Les erreurs de mutation sont gerees dans le hook ou dans le formulaire appelant.

## Messages utilisateur

Preferer un message localise, court et humain :
- "Impossible de charger les groupes. Reessayer"
- "Votre session a expire. Reconnectez-vous"
- "Cette action n'est pas disponible avec votre offre"

Le backend peut fournir un message, mais l'app garde le droit d'utiliser un fallback UX localise pour la coherence, la traduction et la securite. Ne jamais afficher de stack trace, code HTTP brut ou payload technique.

## Validation formulaire

- Les validations client passent par Zod + React Hook Form.
- Les erreurs de champs s'affichent inline.
- Une erreur de validation ne doit pas declencher un toast global si le champ est visible.
- Les erreurs serveur avec details de champs doivent etre mappees sur le formulaire quand c'est possible.

## Logging

Utiliser `LoggerService` pour les erreurs techniques. Le contexte doit aider sans exposer de PII :
- feature ;
- operation ;
- id metier non sensible si utile ;
- etat de flux ;
- code d'erreur parse.

Ne jamais logger token, mot de passe, email complet quand ce n'est pas necessaire, document brut ou contenu personnel long.

## Erreurs auth et permission

- `401` ou session expiree : deconnexion centralisee et retour login.
- Permission refusee : expliquer pourquoi la permission est utile et proposer une sortie.
- Quota/offre : ce n'est pas une erreur technique, c'est un prompt d'upgrade contextuel.

## Regles strictes

- Pas de `catch {}` vide.
- Pas de `alert` natif pour une erreur applicative.
- Pas de retour `null` silencieux en cas d'erreur.
- Pas de retry infini.
- Pas de message technique expose a l'utilisateur.
