---
applyTo: "**/*.ts,**/*.tsx"
---

# Securite Mobile

## Principes

La securite doit etre simple, explicite et difficile a contourner par accident. Les features ne manipulent pas directement les secrets, tokens ou SDK sensibles.

## Secrets et identifiants publics

Secrets interdits dans le repo et dans le workspace partage :
- mot de passe ;
- cle privee ;
- keystore password ;
- token ;
- refresh token ;
- fichier de credentials service account ;
- fichier `.env` avec vraies valeurs.

Certains identifiants Firebase client peuvent etre publics par nature, mais ils doivent rester controles et documentes. Ne pas confondre "pas un secret" avec "sans risque" : les restrictions cote Firebase/Google Cloud doivent etre configurees.

## Variables d'environnement

- Les variables client Expo utilisent `EXPO_PUBLIC_*`.
- `config/env.ts` est le seul point d'entree cote app.
- Eviter les fallbacks de production hardcodes ; preferer `.env.example` + validation claire.
- Ne jamais logger la config complete.

## Stockage local

Utiliser SecureStore pour :
- tokens ;
- credentials ;
- secrets ;
- flags sensibles ;
- tout element qui donne acces a un compte ou une ressource privee.

AsyncStorage est acceptable pour :
- theme ;
- langue ;
- preferences UI ;
- cache non sensible ;
- etat d'onboarding non critique.

Si un store persiste `isAuthenticated` ou un profil utilisateur, verifier que cela ne devient pas une source d'autorisation. L'autorite reste le token/session reelle.

## Authentification

- Firebase Auth est encapsule dans `services/auth/`.
- Les features ne doivent pas importer `firebase/auth`.
- Les composants ne manipulent pas les tokens.
- Le token est injecte par `services/api/httpClient.ts`.
- Le sign out passe par le service auth et nettoie le contexte local.

## Permissions

Demander une permission au moment ou l'utilisateur lance l'action concernee, pas au demarrage.

Avant le prompt systeme :
- expliquer pourquoi la permission est utile ;
- gerer `denied` sans bloquer l'app ;
- proposer une alternative ou un lien vers les reglages si pertinent.

Toute permission ajoutee doit etre refletee dans `app.json` et documentee.

## Donnees et logs

Ne jamais logger :
- token ;
- mot de passe ;
- contenu personnel complet ;
- document brut ;
- URL signee longue ;
- payload d'auth.

Les logs techniques utilisent `LoggerService` avec contexte minimal.

## Reseau et fichiers

- HTTP uniquement via `httpClient`.
- Les URLs signees sont obtenues via l'API.
- Ne pas construire d'URL S3 manuellement dans une feature.
- Les uploads passent par un service dedie.
- Valider les fichiers avant upload : taille, type, extension, source.

## Checklist rapide

Avant merge :
- aucun secret dans `git status` ou `git diff` ;
- pas de SDK sensible importe dans une feature ;
- permissions justifiees ;
- logs sans PII ;
- stockage local adapte a la sensibilite.
