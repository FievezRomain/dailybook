---
applyTo: "**/*.ts,**/*.tsx"
---

# Sécurité — Mobile MyDailyBook

## Stockage des données sensibles
- `expo-secure-store` pour TOUT ce qui est sensible : tokens, clés, identifiants
- `AsyncStorage` autorisé uniquement pour les préférences non sensibles (thème, langue, config UI)
- Ne JAMAIS stocker un Firebase ID token, refresh token ou clé API dans AsyncStorage
- Ne JAMAIS logger des données personnelles, tokens ou credentials — en production ET en dev, utiliser `if (__DEV__)` pour tout log contenant des données utilisateur

## Authentification
- Le Firebase ID token est injecté automatiquement par l'interceptor dans `services/api/httpClient.ts` — ne pas le dupliquer ailleurs
- Toujours passer par `AuthService.signOut()` pour déconnecter — il révoque le token côté Firebase et vide le SecureStore
- Ne jamais manipuler le token Firebase directement dans les composants ou écrans
- En cas de 401 reçu de l'API, l'interceptor httpClient déclenche automatiquement le signOut — ne pas gérer ce cas à nouveau dans les composants

## Validation des inputs
- TOUJOURS valider les données utilisateur avec un schéma Zod avant d'envoyer une requête
- Schémas Zod co-localisés avec leur formulaire dans `features/{domain}/`
- Utiliser `zodResolver` avec React Hook Form — ne jamais bypasser la validation côté client
- Valider aussi les paramètres de navigation reçus (ils peuvent être altérés)

## Permissions Expo
- Demander uniquement les permissions strictement nécessaires à la fonctionnalité en cours
- Demander au moment de l'utilisation, jamais au démarrage de l'application
- Toujours gérer le cas `denied` avec un message utilisateur clair et un chemin vers les paramètres système
- Ne jamais bloquer l'UI en attendant indéfiniment une permission

## Données sensibles dans le code source
- Aucune clé API, secret, UID ou URL S3 brute dans le code source ou les commentaires
- Les variables d'environnement sont dans `config/env.ts` via `expo-constants` — jamais de valeur de prod hardcodée
- Vérifier que `.gitignore` inclut `google-services.json`, `GoogleService-Info.plist` et `credentials/`

## Requêtes réseau
- Toutes les requêtes HTTP passent par `services/api/httpClient.ts` sans exception
- Ne pas construire d'URL manuellement avec des données utilisateur non sanitisées
- Les réponses API sont typées strictement — ne pas assigner à `any` sans conversion explicite et validée
- Les URLs signées pour les fichiers S3 sont récupérées via l'API backend — jamais construites côté client

## Navigation & données exposées
- Ne jamais passer de données sensibles (token, password, données personnelles complètes) en paramètre de navigation
- Passer uniquement des IDs ou des clés de référence dans les paramètres de navigation
